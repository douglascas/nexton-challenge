---
name: rxjs-state-management
description: >-
  Use this skill whenever creating, modifying, or refactoring RxJS observables, reactive state services,
  subscription lifecycles, autosave debouncing, or Angular Signals integration in this application.
---

# RxJS State Management & Reactive Patterns

This skill establishes best practices for managing reactive state, handling stream subscriptions, preventing memory leaks, and optimizing event propagation using **RxJS** in this Angular application.

---

## 1. State Store Pattern with BehaviorSubject

For global and feature-level state services (such as `RequestStateService` and `MockApiService`):

* Always keep the `BehaviorSubject` **private** to prevent direct mutation from outside the service.
* Expose state to consumers exclusively as a read-only `Observable` using `.asObservable()`.
* Mutate state through explicit, well-named service methods that call `.next()`.

```typescript
@Injectable({
  providedIn: 'root',
})
export class RequestStateService {
  private readonly stateSubject = new BehaviorSubject<ActiveRequest | null>(null);
  public readonly activeRequest$: Observable<ActiveRequest | null> = this.stateSubject.asObservable();

  public updateAnswers(answers: RequestAnswers): void {
    const current = this.stateSubject.value;
    if (!current) return;

    const updated: ActiveRequest = {
      ...current,
      answers: { ...current.answers, ...answers },
      updatedAt: new Date(),
    };

    this.stateSubject.next(updated);
  }
}
```

---

## 2. Subscription Lifecycle & Preventing Memory Leaks

Never leave long-lived subscriptions unmanaged. Use one of the following patterns:

### Pattern A: `takeUntilDestroyed()` (Preferred for Angular 16+)
When creating subscriptions inside an injection context (constructor, property initializer, or via `DestroyRef`):

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ ... })
export class DynamicFormComponent {
  private readonly requestState = inject(RequestStateService);

  constructor() {
    this.requestState.activeRequest$
      .pipe(takeUntilDestroyed())
      .subscribe((req) => this.handleRequestChange(req));
  }
}
```

### Pattern B: Manual `Subscription` Unsubscribe in `ngOnDestroy`
When subscribing inside lifecycle hooks like `ngOnInit`:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.service.data$.subscribe(...);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
```

---

## 3. Efficient Autosave & Form Value Changes

To prevent excessive writes to `LocalStorageService` or unnecessary API requests when users type:

* Always use `debounceTime(300)` and `distinctUntilChanged()`.
* Ensure form changes only emit when actual value mutations occur.

```typescript
this.formGroup.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((formValues) => {
    this.requestState.updateAnswers(formValues);
  });
```

---

## 4. Angular Signals & RxJS Interoperability

When transforming RxJS streams into synchronous reactive values for templates:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ ... })
export class MyComponent {
  private readonly requestState = inject(RequestStateService);

  // Expose as a signal with a clean initial value
  public readonly activeRequest = toSignal(this.requestState.activeRequest$, { initialValue: null });
}
```
