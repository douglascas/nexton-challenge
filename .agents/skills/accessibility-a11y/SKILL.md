---
name: accessibility-a11y
description: >-
  Use this skill whenever designing, building, or auditing UI components, forms, custom controls,
  or modals to ensure full keyboard navigation and WCAG AA accessibility compliance.
---

# Web Accessibility (a11y) & WCAG Guidelines

This skill enforces accessibility standards across dynamic forms, custom controls, dialogs, and interactive widgets in this application.

---

## 1. Dynamic Form Fields & Label Association

Every input rendered by `DynamicFieldComponent` must be semantically linked to its label and error description:

```html
<div class="field-container">
  <label [attr.for]="'field-' + field.id" class="field-label">
    {{ field.label }}
    @if (field.required) {
      <span class="required-asterisk" aria-hidden="true">*</span>
      <span class="sr-only">(required)</span>
    }
  </label>

  <input
    [id]="'field-' + field.id"
    [type]="field.type"
    [formControl]="control"
    [attr.aria-required]="field.required ? 'true' : null"
    [attr.aria-invalid]="control.invalid && control.touched ? 'true' : 'false'"
    [attr.aria-describedby]="control.invalid && control.touched ? 'error-' + field.id : null"
  />

  @if (control.invalid && control.touched) {
    <div [id]="'error-' + field.id" class="error-message" role="alert">
      {{ getErrorMessage() }}
    </div>
  }
</div>
```

---

## 2. Accessible Custom Controls

### Toggle Switch Component
Custom toggles must use the ARIA switch pattern:
* `role="switch"`
* `[attr.aria-checked]="value ? 'true' : 'false'"`
* `tabindex="0"` for keyboard focusability.
* Listen for `keydown.space` and `keydown.enter` to toggle the value.

### Radio Pill Groups
* Wrap group in `role="radiogroup"` with `[attr.aria-label]="field.label"`.
* Each pill must have `role="radio"`, `[attr.aria-checked]="isSelected"`, and support keyboard selection.

---

## 3. Accessible Dialogs & Modals

For overlays like `SchemaConfigModalComponent`:

1. **ARIA Attributes**:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby="modal-title-id"`

2. **Keyboard Interaction**:
   - Pressing `Escape` must close the open modal.
   - Focus must be trapped inside the modal while open.
   - On close, focus must return to the triggering element.

---

## 4. Visual Contrast & Focus Outlines

- **Focus Ring**: Always support `:focus-visible` with a distinct outline (e.g., `outline: 2px solid var(--primary); outline-offset: 2px;`). Never remove focus outlines with `outline: none` without providing a visible replacement.
- **Error States**: Errors must provide textual feedback, not just a border color change.
- **Screen Reader Only Helper**: Use a `.sr-only` utility class for descriptive labels that should only be audible to screen readers.
