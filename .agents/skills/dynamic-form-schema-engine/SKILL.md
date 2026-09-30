---
name: dynamic-form-schema-engine
description: >-
  Use this skill whenever creating, modifying, extending, or debugging the dynamic form engine,
  schema models, field validation, autosave logic, or custom field types in this application.
---

# Dynamic Form & Schema Engine Architecture

This skill provides the architectural rules, data contracts, and extension procedures for the schema-driven dynamic form engine in this project.

---

## 1. Core Data Models

Located in `src/app/core/models/schema.model.ts` and `src/app/core/models/request.model.ts`:

```typescript
export type FieldType = 'text' | 'number' | 'radio' | 'toggle';
export type FieldId = number | string;

export interface FormFieldConfig {
  id: FieldId;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // for radio/select types
  default?: any;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  fields: FormFieldConfig[];
}

export interface FormSchema {
  id: string;
  title: string;
  sections: FormSectionConfig[];
}
```

---

## 2. Engine Components & Workflow

### 1. `FormFactoryService` (`src/app/core/services/form-factory.service.ts`)
* Converts `FormSectionConfig` into an Angular `FormGroup`.
* Maps `field.id` to FormControl names.
* Automatically attaches validators:
  * `Validators.required` if `field.required === true`.
  * Initial values loaded from `field.default` or active request answers.

### 2. `DynamicFieldComponent` (`src/app/features/dynamic-form/components/dynamic-field/`)
* Renders the appropriate UI control based on `field.type`:
  * `'text'`: `<input type="text" />`
  * `'number'`: `<input type="number" />`
  * `'radio'`: Radio group with pills / options
  * `'toggle'`: Switch toggle component
* Exposes standard FormControl binding via `[formControl]`.

### 3. `RequestStateService` (`src/app/core/services/request-state.service.ts`)
* Holds the `ActiveRequest` in a reactive `BehaviorSubject`.
* Handles multi-page section navigation (`currentSectionIndex`).
* Synchronizes answers automatically with `LocalStorageService`.

---

## 3. Adding a New Field Type

To introduce a new field type (e.g., `'textarea'`, `'select'`, `'date'`):

1. **Update the Type Definition**:
   In `src/app/core/models/schema.model.ts`, append the new type to `FieldType`.

2. **Update Form Factory (if custom validators are required)**:
   In `src/app/core/services/form-factory.service.ts`, add any type-specific validators (e.g., email or min/max).

3. **Update `DynamicFieldComponent` Template & Styles**:
   In `dynamic-field.component.html`, add the `@case ('new-type')` block with accessible labels and error messages.

4. **Update `schemas.mock.ts` and Customizer**:
   Add example configurations to `src/app/core/mocks/schemas.mock.ts` and test live rendering via the Schema Config Modal (`Ctrl+Shift+P` / `F2`).

5. **Update Unit Tests**:
   Add test cases in `form-factory.service.spec.ts` and `dynamic-field.component.spec.ts`.

---

## 4. Multi-Page Navigation and Section Validation Rules

- Navigation between sections must validate all fields in the **current section only**.
- If any required field in the active section is empty/invalid:
  - Mark all controls in the current section as touched (`control.markAsTouched()`).
  - Block progression to the next section or summary.
- On the final section, render `SUBMIT` instead of `NEXT`.
- Upon successful submit, navigate to `/summary` and preserve read-only state.
