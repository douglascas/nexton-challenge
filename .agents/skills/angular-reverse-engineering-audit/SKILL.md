---
name: angular-reverse-engineering-audit
description: >-
  Use this skill whenever performing reverse engineering, deep architectural analysis, or comprehensive
  code reviews on Angular codebases to evaluate, modernize, and refactor code against the latest Angular standards.
---

# Angular Reverse Engineering & Modern Code Audit

This skill provides an exhaustive, step-by-step methodology for reverse-engineering, inspecting, diagnosing, and modernizing Angular applications according to modern Angular (v17 - v22+) best practices.

---

## 1. Reverse Engineering Methodology

When analyzing unfamiliar or legacy code in the application, execute these four stages systematically:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. TOPOGRAPHY & DISCOVERY                                   │
│    Map entry points, routes, service graphs & data flows   │
├─────────────────────────────────────────────────────────────┤
│ 2. REVERSE ENGINEERING & DECONSTRUCTION                     │
│    Extract contracts, component lifecycles & state models   │
├─────────────────────────────────────────────────────────────┤
│ 3. GAP ANALYSIS & SCORECARD AUDIT                           │
│    Evaluate against Modern Angular Standards (Checklist)    │
├─────────────────────────────────────────────────────────────┤
│ 4. INCREMENTAL REMEDIATION & VERIFICATION                   │
│    Refactor, modernize, validate with Vitest & Lint         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stage-by-Stage Execution Guide

### Stage 1: Topography & Discovery
1. **Entry Point & Providers**:
   - Inspect `src/main.ts` and `src/app/app.config.ts`.
   - Confirm providers (`provideRouter`, `provideHttpClient`, etc.).
2. **Routing Graph**:
   - Trace `src/app/app.routes.ts` for route definitions, guards, and lazy-loading patterns.
3. **State & Service Tree**:
   - Map singleton services in `src/app/core/services/` and their interaction with storage (`LocalStorageService`) and APIs (`MockApiService`).

### Stage 2: Reverse Engineering Component Architecture
1. **Data Ingestion**: Trace how data enters the component (Inputs, Router parameters, Observable subscriptions, Signals).
2. **State Management**: Identify whether state is local, shared via services, or derived with computed values.
3. **Event & Output Propagation**: Trace user actions (button clicks, form changes, shortcuts) down to service state changes.
4. **Lifecycle Hooks**: Audit `ngOnInit`, `ngOnDestroy`, `ngAfterViewInit` for unhandled side-effects or memory leaks.

---

## 3. Modern Angular Standards Audit Checklist

Evaluate every analyzed component, service, and template against this 10-point scorecard:

| # | Domain | Modern Standard Requirement | Anti-Pattern / Smell to Flag |
|---|---|---|---|
| **1** | **Standalone Architecture** | `standalone: true` on all components, pipes, and directives. | Usage of legacy `NgModule` declarations. |
| **2** | **Dependency Injection** | Functional `inject(Service)` syntax in injection contexts. | Long, verbose constructor parameter lists. |
| **3** | **Template Control Flow** | Built-in `@if`, `@for (...; track ...)`, `@switch` syntax. | Legacy `*ngIf`, `*ngFor`, `*ngSwitch` directives. |
| **4** | **Reactivity & Stream Safety** | `takeUntilDestroyed()`, `toSignal()`, explicit unsubscribes. | Naked subscriptions causing memory leaks. |
| **5** | **State Management** | Immutable updates, encapsulated `BehaviorSubject` stores. | Direct mutation of service subject values or public writable subjects. |
| **6** | **Reactive Forms** | Strongly-typed `FormGroup` / `FormControl`, dynamic factory. | Untyped forms, template-driven forms without validation guarantees. |
| **7** | **TypeScript Strictness** | Strict types (`strict: true`), zero implicit/explicit `any`. | `any` casts, untyped API responses, loose equality. |
| **8** | **Design System & Tokens** | CSS variables, SCSS encapsulation, responsive breakpoints. | Hardcoded arbitrary colors, duplicated CSS rules. |
| **9** | **Accessibility (a11y)** | Semantic HTML, ARIA attributes, keyboard navigation. | Non-interactive elements with click handlers, missing labels. |
| **10** | **Testability** | Unit tests in Vitest with `vi.fn()`/`vi.spyOn()`, high coverage. | Untested business logic, tests relying on Jasmine globals. |

---

## 4. Reverse Engineering Diagnostic Matrix

When diagnosing common architectural bottlenecks:

### A. Memory Leaks in RxJS Streams
* **Symptom**: State persists or duplicate events fire after navigating away and returning to a page.
* **Audit**: Check if `.subscribe()` calls in components lack `takeUntilDestroyed()` or `Subscription.unsubscribe()`.
* **Fix**: Apply `takeUntilDestroyed()` or bind streams directly in templates with signals/async pipes.

### B. Excessive Re-renders or Storage Thrashing
* **Symptom**: `localStorage` or API calls trigger on every single keystroke.
* **Audit**: Check `formGroup.valueChanges` subscriptions.
* **Fix**: Introduce `debounceTime(300)` and `distinctUntilChanged()`.

### C. Validation & Navigation State Desync
* **Symptom**: Users can skip required steps or cannot proceed when fields are valid.
* **Audit**: Check section index boundaries and validation scoping in `FormFactoryService`.
* **Fix**: Validate only controls belonging to the active section index before allowing navigation.

---

## 5. Remediation & Verification Protocol

When refactoring code identified during the audit:

1. **Establish Baseline**:
   ```bash
   export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng test --no-watch
   ```
2. **Perform Targeted Refactoring**:
   - Modernize syntax incrementally (e.g., convert `*ngIf` to `@if`, replace constructor injection with `inject()`).
   - Preserve existing public API contracts and behaviors.
3. **Verify Integrity**:
   ```bash
   export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng lint
   export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng test --no-watch
   export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH && npx ng build
   ```
4. **Commit Following Commitizen**:
   ```bash
   git add <modified-files>
   git commit -m "refactor(<scope>): <concise description of modernization>"
   ```
