---
name: vitest-angular-testing
description: >-
  Use this skill whenever writing, modifying, debugging, or executing unit tests in this Angular application.
  Enforces Vitest conventions, reactive form test patterns, mocking strategies, and test validation commands.
---

# Vitest Angular Testing Guidelines

This skill provides comprehensive instructions for writing and executing unit tests using **Vitest** in this Angular standalone application.

---

## 1. Test Setup and Imports

Vitest is the test runner for this project. Always import test primitives directly from `vitest`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
```

> **Important**: Do NOT use Jasmine globals (`jasmine.createSpy`, `spyOn`). Always use `vi.fn()` and `vi.spyOn()`.

---

## 2. Mocking Services and Dependencies

### Pattern A: Mocking Observables with BehaviorSubject
For services that expose observable state (e.g., `RequestStateService`, `MockApiService`):

```typescript
const mockActiveRequestSubject = new BehaviorSubject<ActiveRequest | null>(mockRequestData);

const mockRequestStateService = {
  activeRequest$: mockActiveRequestSubject.asObservable(),
  activeSchema$: of(mockSchemaData),
  currentSectionIndex$: of(0),
  setActiveRequest: vi.fn(),
  updateAnswers: vi.fn(),
  saveProgress: vi.fn(),
  reset: vi.fn(),
};
```

### Pattern B: Mocking LocalStorageService
```typescript
const mockStorageService = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  has: vi.fn(),
};
```

### Pattern C: Router Mocking and Spies
```typescript
await TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [
    provideRouter([]),
    { provide: RequestStateService, useValue: mockRequestStateService },
    { provide: LocalStorageService, useValue: mockStorageService },
  ],
}).compileComponents();

const router = TestBed.inject(Router);
vi.spyOn(router, 'navigate');
```

---

## 3. Testing Standalone Components and Reactive Forms

### Testing Form Initialization and Value Changes
```typescript
it('should create reactive form controls from schema fields', () => {
  const formFactory = TestBed.inject(FormFactoryService);
  const formGroup = formFactory.createSectionForm(mockSection, {});

  expect(formGroup.contains('1758177604')).toBe(true);
  expect(formGroup.get('1758177604')?.valid).toBe(false);

  formGroup.get('1758177604')?.setValue('Slack License');
  expect(formGroup.get('1758177604')?.valid).toBe(true);
});
```

### Testing DOM Interactions and Emitted Events
```typescript
it('should disable submit button when form is invalid', () => {
  fixture.detectChanges();
  const compiled = fixture.nativeElement as HTMLElement;
  const nextButton = compiled.querySelector('button.btn-next') as HTMLButtonElement;

  expect(nextButton.disabled).toBe(true);
});
```

---

## 4. Test Execution Commands

Always run tests in non-watch mode to ensure deterministic CI/local validation:

```bash
# Run all unit tests
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng test --no-watch

# Validate build after testing
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng build
```

---

## 5. Best Practices Checklist
- [ ] Ensure `fixture.detectChanges()` is called after updating component inputs or subject streams.
- [ ] Unsubscribe from open subscriptions or complete subjects in `afterEach` if necessary.
- [ ] Check type safety on mock objects (e.g. `createdAt: new Date()` instead of strings).
- [ ] Verify that 100% of test suites pass before finishing changes.
