import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormFieldConfig, FormSchema } from '../models/schema.model';
import { RequestAnswers } from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class FormFactoryService {
  private readonly fb = inject(FormBuilder);

  /**
   * Builds the complete reactive FormGroup for a given schema and initial answers.
   * Creates a root FormGroup where controls are keyed by `section.id`,
   * or a flat map of sections containing field controls keyed by `field.id`.
   */
  createFormGroup(schema: FormSchema, initialAnswers: RequestAnswers = {}): FormGroup {
    const rootGroup: Record<string, FormGroup> = {};

    schema.sections.forEach((section) => {
      const sectionGroup: Record<string, FormControl> = {};

      section.fields.forEach((field) => {
        const initialValue =
          initialAnswers[field.id] !== undefined
            ? initialAnswers[field.id]
            : field.default !== undefined
            ? field.default
            : field.type === 'toggle'
            ? false
            : '';

        const validators = this.getValidatorsForField(field);
        sectionGroup[String(field.id)] = new FormControl(initialValue, validators);
      });

      rootGroup[section.id] = this.fb.group(sectionGroup);
    });

    return this.fb.group(rootGroup);
  }

  /**
   * Generates validators based on field configuration
   */
  private getValidatorsForField(field: FormFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      if (field.type === 'toggle') {
        // Toggle is usually boolean; if required, must not be null/undefined
        validators.push(Validators.required);
      } else {
        validators.push(Validators.required);
      }
    }

    if (field.type === 'number') {
      // Numbers cannot be negative in quantities, etc.
      validators.push(Validators.min(0));
    }

    return validators;
  }
}
