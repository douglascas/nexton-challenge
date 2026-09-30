import { inject, Injectable } from '@angular/core';
import { Observable, delay, of, throwError, switchMap, timer, BehaviorSubject } from 'rxjs';
import { FormSchema, FieldId, FieldValue } from '../models/schema.model';
import { RequestAnswers, ActiveRequest } from '../models/request.model';
import { LocalStorageService } from './local-storage.service';
import { DEFAULT_SCHEMAS } from '../mocks/schemas.mock';

export { DEFAULT_SCHEMAS };

const STORAGE_SCHEMAS_KEY = 'custom_form_schemas';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private readonly storage = inject(LocalStorageService);
  private requestsMap = new Map<string, ActiveRequest>();
  private schemasSubject = new BehaviorSubject<FormSchema[]>(this.loadInitialSchemas());
  public schemas$: Observable<FormSchema[]> = this.schemasSubject.asObservable();

  private loadInitialSchemas(): FormSchema[] {
    const saved = this.storage?.getItem<FormSchema[]>(STORAGE_SCHEMAS_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return JSON.parse(JSON.stringify(DEFAULT_SCHEMAS));
  }

  private saveSchemasToStorage(schemas: FormSchema[]): void {
    this.storage.setItem(STORAGE_SCHEMAS_KEY, schemas);
    this.schemasSubject.next(schemas);
  }

  /**
   * Updates a single schema definition
   */
  updateSchema(updatedSchema: FormSchema): void {
    const current = this.schemasSubject.value;
    const index = current.findIndex((s) => s.id === updatedSchema.id);
    let newSchemas: FormSchema[];

    if (index >= 0) {
      newSchemas = [...current];
      newSchemas[index] = updatedSchema;
    } else newSchemas = [...current, updatedSchema];

    this.saveSchemasToStorage(newSchemas);
  }

  /**
   * Updates all schemas at once
   */
  updateAllSchemas(schemas: FormSchema[]): void {
    this.saveSchemasToStorage(schemas);
  }

  /**
   * Resets schemas to original defaults
   */
  resetSchemasToDefault(): void {
    this.storage.removeItem(STORAGE_SCHEMAS_KEY);
    this.schemasSubject.next(JSON.parse(JSON.stringify(DEFAULT_SCHEMAS)));
  }

  get currentSchemas(): FormSchema[] {
    return this.schemasSubject.value;
  }

  /**
   * Simulates GET /api/schemas
   */
  getSchemas(): Observable<FormSchema[]> {
    return of(this.schemasSubject.value).pipe(delay(200));
  }

  /**
   * Get a schema by ID
   */
  getSchemaById(id: string): Observable<FormSchema | null> {
    const schema = this.schemasSubject.value.find((s) => s.id === id) || null;
    return of(schema).pipe(delay(100));
  }

  /**
   * Simulates PUT /api/requests/:id/question/:questionId
   * - Latency: 600-1000ms
   * - Random failures: 15% to exercise retry paths
   */
  saveQuestion(
    requestId: string,
    questionId: FieldId,
    value: FieldValue
  ): Observable<{ success: boolean; questionId: FieldId; value: FieldValue; savedAt: string }> {
    const latency = Math.floor(Math.random() * 401) + 600; // 600ms - 1000ms
    const shouldFail = Math.random() < 0.15; // 15% random failure

    return timer(latency).pipe(
      switchMap(() => {
        if (shouldFail) return throwError(() => new Error(`[MockAPI] Temporary network error on PUT question ${questionId}`));

        // Store value in memory
        const request = this.requestsMap.get(requestId);
        if (request) {
          request.answers[questionId] = value;
          request.updatedAt = new Date();
        }

        return of({
          success: true,
          questionId,
          value,
          savedAt: new Date().toISOString(),
        });
      })
    );
  }

  /**
   * Simulates POST /api/requests (Init new request)
   */
  createRequest(schemaId: string): Observable<ActiveRequest> {
    const schema = this.currentSchemas.find((s) => s.id === schemaId);

    if (!schema) return throwError(() => new Error(`Schema ${schemaId} not found`));

    const requestId = `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const initialAnswers: RequestAnswers = {};

    // Populate default values from schema
    schema.sections.forEach((sec) => {
      sec.fields.forEach((f) => {
        if (f.default !== undefined) initialAnswers[f.id] = f.default;
        else if (f.type === 'toggle') initialAnswers[f.id] = false;
        else initialAnswers[f.id] = '';
      });
    });

    const activeRequest: ActiveRequest = {
      id: requestId,
      schemaId: schema.id,
      schema,
      answers: initialAnswers,
      currentSectionIndex: 0,
      isSubmitted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.requestsMap.set(requestId, activeRequest);
    return of(activeRequest).pipe(delay(150));
  }

  /**
   * Simulates GET /api/requests/:id
   */
  getRequest(requestId: string): Observable<ActiveRequest | null> {
    const req = this.requestsMap.get(requestId) || null;
    return of(req).pipe(delay(100));
  }

  /**
   * Simulates POST /api/requests/:id/submit
   */
  submitRequest(requestId: string): Observable<{ success: boolean; requestId: string }> {
    const req = this.requestsMap.get(requestId);
    if (req) {
      req.isSubmitted = true;
      req.updatedAt = new Date();
    }
    return of({ success: true, requestId }).pipe(delay(500));
  }
}
