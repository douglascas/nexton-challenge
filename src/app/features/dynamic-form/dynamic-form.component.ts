import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { RequestStateService } from '../../core/services/request-state.service';
import { ActiveRequest, AutosaveStatus } from '../../core/models/request.model';
import { FieldId, FormSectionConfig } from '../../core/models/schema.model';
import { DynamicFieldComponent } from './components/dynamic-field/dynamic-field.component';
import { AutosaveStatusComponent } from './components/autosave-status/autosave-status.component';
import { FormNavigationComponent } from './components/form-navigation/form-navigation.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DynamicFieldComponent,
    AutosaveStatusComponent,
    FormNavigationComponent,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  public readonly requestState = inject(RequestStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  activeRequest: ActiveRequest | null = null;
  saveStatus: AutosaveStatus = 'idle';
  currentSectionIndex = 0;
  hasValidationError = false;
  isSubmitting = false;

  private routeSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = combineLatest([
      this.route.paramMap,
      this.requestState.activeRequest$,
      this.requestState.saveStatus$,
    ]).subscribe(([params, request, status]) => {
      this.activeRequest = request;
      this.saveStatus = status;

      if (!request) {
        return;
      }

      if (request.isSubmitted) {
        this.router.navigate(['/request', request.id, 'summary']);
        return;
      }

      const stepParam = params.get('sectionIndex');
      const stepIndex = stepParam ? parseInt(stepParam, 10) : 0;

      if (isNaN(stepIndex) || stepIndex < 0 || stepIndex >= request.schema.sections.length) {
        this.router.navigate(['/request', request.id, 'section', 0]);
        return;
      }

      this.currentSectionIndex = stepIndex;
      this.requestState.setSectionIndex(stepIndex);
      this.hasValidationError = false;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  get currentSection(): FormSectionConfig | null {
    if (!this.activeRequest) return null;
    return this.activeRequest.schema.sections[this.currentSectionIndex] || null;
  }

  get currentSectionGroup(): FormGroup | null {
    if (!this.requestState.currentForm || !this.currentSection) return null;
    return this.requestState.currentForm.get(this.currentSection.id) as FormGroup;
  }

  getFieldControl(fieldId: FieldId): FormControl {
    return (this.currentSectionGroup?.get(String(fieldId)) as FormControl) || new FormControl();
  }

  get isFirstStep(): boolean {
    return this.currentSectionIndex === 0;
  }

  get isLastStep(): boolean {
    if (!this.activeRequest) return false;
    return this.currentSectionIndex === this.activeRequest.schema.sections.length - 1;
  }

  get progressPercentage(): number {
    if (!this.activeRequest) return 0;
    const total = this.activeRequest.schema.sections.length;
    return Math.round(((this.currentSectionIndex + 1) / total) * 100);
  }

  onPrevious(): void {
    if (this.currentSectionIndex > 0 && this.activeRequest) {
      this.hasValidationError = false;
      this.router.navigate(['/request', this.activeRequest.id, 'section', this.currentSectionIndex - 1]);
    }
  }

  onNext(): void {
    if (!this.activeRequest || !this.currentSectionGroup) return;

    if (this.currentSectionGroup.invalid) {
      this.currentSectionGroup.markAllAsTouched();
      this.hasValidationError = true;
      return;
    }

    this.hasValidationError = false;
    const nextIndex = this.currentSectionIndex + 1;
    this.router.navigate(['/request', this.activeRequest.id, 'section', nextIndex]);
  }

  onSubmit(): void {
    if (!this.activeRequest || !this.requestState.currentForm) return;

    if (this.requestState.currentForm.invalid) {
      this.requestState.currentForm.markAllAsTouched();
      this.hasValidationError = true;

      // Find the first section with invalid fields and navigate to it if needed
      const firstInvalidIndex = this.activeRequest.schema.sections.findIndex((section) => {
        const group = this.requestState.currentForm?.get(section.id);
        return group && group.invalid;
      });

      if (firstInvalidIndex !== -1 && firstInvalidIndex !== this.currentSectionIndex) {
        this.router.navigate(['/request', this.activeRequest.id, 'section', firstInvalidIndex]);
      }
      return;
    }

    this.isSubmitting = true;
    this.hasValidationError = false;

    this.requestState.submitActiveRequest().subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/request', res.requestId, 'summary']);
      },
      error: (err: unknown) => {
        this.isSubmitting = false;
        console.error('[DynamicForm] Submit error:', err);
        alert('Failed to submit request. Please check errors and try again.');
      },
    });
  }

  goToSection(index: number): void {
    if (!this.activeRequest) return;
    // Allow jumping only to previous sections or current
    if (index <= this.currentSectionIndex) {
      this.hasValidationError = false;
      this.router.navigate(['/request', this.activeRequest.id, 'section', index]);
    }
  }
}
