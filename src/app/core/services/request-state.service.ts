import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, EMPTY, Observable, of, retry, Subscription, switchMap, tap, timer } from 'rxjs';
import { ActiveRequest, AutosaveStatus } from '../models/request.model';
import { FieldId, FieldValue, FormSchema } from '../models/schema.model';
import { FormFactoryService } from './form-factory.service';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root',
})
export class RequestStateService {
  private readonly mockApi = inject(MockApiService);
  private readonly formFactory = inject(FormFactoryService);

  private activeRequestSubject = new BehaviorSubject<ActiveRequest | null>(null);
  public activeRequest$ = this.activeRequestSubject.asObservable();

  private saveStatusSubject = new BehaviorSubject<AutosaveStatus>('idle');
  public saveStatus$ = this.saveStatusSubject.asObservable();

  private autosaveSubscriptions: Subscription[] = [];
  public currentForm: FormGroup | null = null;

  /**
   * Initializes a new request based on a selected schema
   */
  startNewRequest(schemaId: string): Observable<ActiveRequest> {
    this.reset();
    return this.mockApi.createRequest(schemaId).pipe(
      tap((req) => {
        this.activeRequestSubject.next(req);
        this.buildAndBindForm(req);
      })
    );
  }

  /**
   * Loads an existing request by ID or resumes it
   */
  loadRequest(requestId: string): Observable<ActiveRequest | null> {
    const current = this.activeRequestSubject.value;

    if (current && current.id === requestId) return of(current);

    return this.mockApi.getRequest(requestId)
      .pipe(tap((req) => {
        if (req) {
          this.activeRequestSubject.next(req);
          this.buildAndBindForm(req);
        }
      }));
  }

  /**
   * Builds the FormGroup and sets up granular Autosave for every field
   */
  public buildAndBindForm(request: ActiveRequest): FormGroup {
    this.unsubscribeAutosave();

    this.currentForm = this.formFactory.createFormGroup(request.schema, request.answers);

    // Bind granular autosave for each field across all sections
    request.schema.sections.forEach((section) => {
      const sectionGroup = this.currentForm?.get(section.id) as FormGroup;
      if (!sectionGroup) return;

      section.fields.forEach((field) => {
        const control = sectionGroup.get(String(field.id));
        if (!control) return;

        const sub = control.valueChanges
          .pipe(
            debounceTime(600),
            distinctUntilChanged(),
            tap(() => this.saveStatusSubject.next('saving')),
            switchMap((val) =>
              this.mockApi.saveQuestion(request.id, field.id, val).pipe(
                retry({
                  count: 2,
                  delay: () => {
                    this.saveStatusSubject.next('retrying');
                    return timer(1000);
                  },
                }),
                catchError((err) => {
                  console.error(`[Autosave] Failed to save field ${field.id}:`, err);
                  this.saveStatusSubject.next('error');
                  return EMPTY;
                })
              )
            ),
            tap((res) => {
              if (res) {
                this.updateLocalAnswer(field.id, res.value);
                this.saveStatusSubject.next('saved');
              }
            })
          ).subscribe();

        this.autosaveSubscriptions.push(sub);
      });
    });

    return this.currentForm;
  }

  /**
   * Updates answer in in-memory state
   */
  private updateLocalAnswer(questionId: FieldId, value: FieldValue): void {
    const current = this.activeRequestSubject.value;
    if (current) {
      const updatedAnswers = { ...current.answers, [questionId]: value };
      this.activeRequestSubject.next({
        ...current,
        answers: updatedAnswers,
        updatedAt: new Date(),
      });
    }
  }

  /**
   * Sets current section step index
   */
  setSectionIndex(index: number): void {
    const current = this.activeRequestSubject.value;
    if (current && current.currentSectionIndex !== index) {
      this.activeRequestSubject.next({
        ...current,
        currentSectionIndex: index,
      });
    }
  }

  /**
   * Updates the schema of the active request in place and rebuilds form
   */
  updateActiveRequestSchema(updatedSchema: FormSchema): void {
    const current = this.activeRequestSubject.value;
    if (current && current.schemaId === updatedSchema.id) {
      const updatedReq: ActiveRequest = {
        ...current,
        schema: updatedSchema,
        updatedAt: new Date(),
      };
      this.activeRequestSubject.next(updatedReq);
      this.buildAndBindForm(updatedReq);
    }
  }

  /**
   * Submits the request
   */
  submitActiveRequest(): Observable<{ success: boolean; requestId: string }> {
    const current = this.activeRequestSubject.value;

    if (!current) throw new Error('No active request to submit');

    return this.mockApi.submitRequest(current.id).pipe(
      tap(() => {
        this.activeRequestSubject.next({
          ...current,
          isSubmitted: true,
          updatedAt: new Date(),
        });
      })
    );
  }

  /**
   * Gets the current active request value
   */
  get currentRequest(): ActiveRequest | null {
    return this.activeRequestSubject.value;
  }

  /**
   * Reset the store and unsubscribe active listeners
   */
  reset(): void {
    this.unsubscribeAutosave();
    this.currentForm = null;
    this.activeRequestSubject.next(null);
    this.saveStatusSubject.next('idle');
  }

  private unsubscribeAutosave(): void {
    this.autosaveSubscriptions.forEach((s) => s.unsubscribe());
    this.autosaveSubscriptions = [];
  }
}

