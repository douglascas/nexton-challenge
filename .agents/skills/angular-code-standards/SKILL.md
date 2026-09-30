---
name: angular-code-standards
description: >-
  Use this skill whenever writing, refactoring, or reviewing Angular code, templates, services,
  models, or configuration to enforce modern Angular standalone architecture, strict TypeScript, and clean code standards.
---

# Angular Code Standards & Architecture Guidelines

This skill defines the technical standards, project structure conventions, and TypeScript best practices for this codebase.

---

## 1. Modern Angular Standalone Conventions

This project utilizes Angular Standalone components, modern dependency injection, and built-in template control flow:

* **Standalone Architecture**: All components, directives, and pipes must be standalone (`standalone: true`).
* **Dependency Injection**: Use functional dependency injection with `inject()` instead of bulky constructor parameter lists:
  ```typescript
  // Recommended
  private readonly router = inject(Router);
  private readonly requestState = inject(RequestStateService);
  private readonly fb = inject(NonNullableFormBuilder);
  ```
* **Modern Control Flow**: Always use `@if`, `@for`, and `@switch`. Legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) are deprecated in new code:
  ```html
  @if (isLoading()) {
    <app-spinner />
  } @else {
    @for (section of schema.sections; track section.id) {
      <section class="section-card">...</section>
    }
  }
  ```

---

## 2. Strict TypeScript & Typing Practices

* **No Implicit or Explicit `any`**: Use concrete interfaces, type aliases, or generics.
* **Date Types**: Use JavaScript `Date` objects for date models (`createdAt: Date`, `updatedAt: Date`), not ISO strings in domain models.
* **Strongly Typed Reactive Forms**: Define strict models or use `NonNullableFormBuilder` when creating reactive forms:
  ```typescript
  export type DynamicControl = FormControl<string | number | boolean | null>;
  ```
* **Immutability**: Avoid mutating state objects directly; use shallow/deep cloning (`{ ...obj }`, `structuredClone(obj)`) when updating state in services.

---

## 3. Directory and File Naming Conventions

Maintain strict layer separation:

```text
src/app/
├── core/                  # Singleton services, global guards, domain models, mocks
│   ├── guards/            # Navigation & step guards (*.guard.ts)
│   ├── mocks/             # Mock datasets and fixtures (*.mock.ts)
│   ├── models/            # Core interfaces and types (*.model.ts)
│   └── services/          # State and singleton services (*.service.ts)
├── features/              # Feature routes and page-level components
│   ├── dynamic-form/      # Multi-step dynamic form page
│   ├── schema-selector/   # Initial schema selector screen
│   └── summary/           # Submission review and reset screen
└── shared/                # Reusable UI components, modals, and pipes
    └── components/        # Presentational and utility components (*.component.ts)
```

---

## 4. Code Quality and Lint Validation

Before committing code, verify formatting, linting, and build correctness:

```bash
# Run linter
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng lint

# Run unit tests
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng test --no-watch

# Validate production build
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng build
```
