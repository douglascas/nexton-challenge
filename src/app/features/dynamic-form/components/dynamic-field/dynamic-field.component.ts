import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '../../../../core/models/schema.model';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss',
})
export class DynamicFieldComponent {
  @Input({ required: true }) field!: FormFieldConfig;
  @Input({ required: true }) control!: FormControl;

  get isInvalid(): boolean {
    return this.control && this.control.invalid && (this.control.touched || this.control.dirty);
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    if (this.control.errors['required']) {
      return `${this.field.label} is required`;
    }
    if (this.control.errors['min']) {
      return `${this.field.label} must be 0 or greater`;
    }
    return 'Invalid field value';
  }

  onToggleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.control.setValue(input.checked);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }
}
