---
name: constitution
description: >-
  Supreme architectural governance and quality compass for this project. Enforces non-negotiable engineering
  principles, decision hierarchies, definition-of-done quality gates, and AI pair programming rules.
---

# Project Constitution & Governance Laws

This document serves as the supreme governance framework and non-negotiable law for all development, refactoring, and AI-assisted pair programming in this repository.

---

## 1. The 7 Non-Negotiable Constitutional Laws

1. **Law of Build & Test Integrity (Zero-Broken-Window Policy)**:
   - No code shall be merged, finalized, or committed if `npx ng test --no-watch` fails or `npx ng build` produces compilation errors.
   - Every bugfix and new feature must be accompanied by corresponding unit tests.

2. **Law of Modern Angular Purity**:
   - 100% Standalone architecture. No `NgModule` declarations.
   - Functional dependency injection (`inject()`) over constructor injection.
   - Native template control flow (`@if`, `@for`, `@switch`). No legacy structural directives (`*ngIf`, `*ngFor`).

3. **Law of Type Strictness & Safety**:
   - Zero tolerance for explicit or implicit `any`.
   - All models, form controls, service responses, and component inputs/outputs must be strictly typed.
   - Domain dates must use standard `Date` instances.

4. **Law of Unidirectional Reactive State**:
   - State flows down via read-only Observables or Signals; actions flow up through explicit service methods.
   - Never mutate internal service `BehaviorSubject` objects directly from components.
   - Every long-lived subscription must be guarded against memory leaks via `takeUntilDestroyed()`.

5. **Law of Design System & Token Fidelity**:
   - All styling must use the Pantone Teal / Emerald design system tokens defined in `src/styles.scss`.
   - Never use TailwindCSS or arbitrary hardcoded hex colors when design tokens exist.
   - Keep styles encapsulated in component SCSS files.

6. **Law of Accessibility (a11y First)**:
   - Dynamic form controls, custom switches, radio groups, and dialogs must provide keyboard navigation and ARIA attributes (`aria-required`, `aria-invalid`, `role="switch"`, `role="dialog"`).

7. **Law of Clean Version Control**:
   - All commits must strictly comply with Commitizen / Conventional Commits (`<type>(<scope>): <subject>`).
   - Every relevant modified and untracked file must be properly staged (`git add`) prior to commit.

---

## 2. Architectural Decision Hierarchy

When facing trade-offs during development, resolve conflicts in this priority order:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Correctness & Test Integrity (Working software)          │
│    ▲                                                        │
│ 2. Security, Data Persistence & Privacy                     │
│    ▲                                                        │
│ 3. User Experience & Design System Fidelity                 │
│    ▲                                                        │
│ 4. Maintainability & Code Cleanliness (KISS / DRY / SOLID)  │
│    ▲                                                        │
│ 5. Performance Optimization                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Definition of Done (DoD) Quality Gate

Before considering any task completed, verify all criteria:

- [ ] **Implementation**: Requirements fulfilled according to the specifications.
- [ ] **Type Safety**: TypeScript compiles with zero errors or warnings under strict mode.
- [ ] **State & Persistence**: Changes persist properly to `LocalStorageService` (if applicable) with debounced updates.
- [ ] **Accessibility & Design**: Component adheres to Pantone Teal styling and keyboard navigation.
- [ ] **Unit Tests**: All Vitest test suites pass (`npx ng test --no-watch`).
- [ ] **Production Build**: Production bundle builds successfully (`npx ng build`).
- [ ] **Version Control**: Staged and committed following Commitizen conventions.

---

## 4. Skill Interoperability Map

The Constitution delegates specialized domains to dedicated skills:

* **Testing & Mocks** ➔ `vitest-angular-testing`
* **Dynamic Forms & Schemas** ➔ `dynamic-form-schema-engine`
* **UI Tokens & Styling** ➔ `pantone-design-system`
* **Streams & State** ➔ `rxjs-state-management`
* **Accessibility** ➔ `accessibility-a11y`
* **Coding Conventions** ➔ `angular-code-standards`
* **Reverse Engineering & Audits** ➔ `angular-reverse-engineering-audit`
* **Git Versioning** ➔ `commitizen`
