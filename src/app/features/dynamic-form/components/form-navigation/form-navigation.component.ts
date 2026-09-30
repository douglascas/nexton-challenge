import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-navigation.component.html',
  styleUrl: './form-navigation.component.scss',
})
export class FormNavigationComponent {
  @Input() isFirstStep = false;
  @Input() isLastStep = false;
  @Input() isSubmitting = false;

  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  onPrevious(): void {
    if (!this.isFirstStep) {
      this.previous.emit();
    }
  }

  onNext(): void {
    if (!this.isLastStep) {
      this.next.emit();
    }
  }

  onSubmit(): void {
    if (this.isLastStep && !this.isSubmitting) {
      this.submitForm.emit();
    }
  }
}
