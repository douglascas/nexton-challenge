# Nexton Frontend Challenge — Dynamic Form Engine

> An extensible, multi-step Request Submission Form application built with **Angular (Standalone Architecture)**, **Reactive Forms**, and **RxJS**, designed under the **Schema-Driven Development (SDD)** paradigm and styled according to the Pantone Teal / Emerald Design System.

---

## ⚡ Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Run unit tests (Jest)
npm test
```

Navigate to `http://localhost:4200/` in your browser.

### 🐳 Running with Docker

```bash
# Build and run container (served on port 8080)
docker compose up --build

# Or build and run standalone Docker image:
docker build -t nexton-challenge .
docker run -p 8080:80 nexton-challenge
```

Navigate to `http://localhost:8080/` in your browser.

---

## 📋 Table of Contents

- [Overview & Goal](#-overview--goal)
- [Challenge Requirements Checklist](#-challenge-requirements-checklist)
- [Beyond the Baseline: Value-Add Features & Justifications](#-beyond-the-baseline-value-add-features--justifications)
- [Architectural Decisions & Approach](#-architectural-decisions--approach)
  - [1. Schema-Driven Development (SDD)](#1-schema-driven-development-sdd)
  - [2. Reactive State Management (RxJS)](#2-reactive-state-management-rxjs)
  - [3. Enterprise Scalability & NgRx Roadmap](#3-enterprise-scalability--ngrx-roadmap)
  - [4. Why Jest for Unit Testing](#4-why-jest-for-unit-testing)
  - [5. Design System Fidelity & A11y](#5-design-system-fidelity--a11y)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Live Schema Customizer Guide](#-live-schema-customizer-guide)

---

## 🎯 Overview & Goal

The goal of this project is to build a dynamic Request Submission application based on technical requirements and design specifications provided by Nexton. 

The application enables users to choose a purchase category (e.g. Software or Hardware), fill out a multi-page dynamic form generated on the fly from JSON schemas, autosaves every input with simulated network conditions and retry strategies, and presents a read-only summary upon completion.

---

## ✅ Challenge Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Schema Chooser** | Initial landing page allowing choice between Software and Hardware request schemas. | ✅ Done |
| **Multi-Page Section Navigation** | Each section of the schema is rendered on a separate page (`/request/:id/section/:index`). | ✅ Done |
| **Next & Previous Controls** | Step navigation with validation blocking on invalid required inputs. | ✅ Done |
| **Submit on Final Step** | Dynamically switches from "Next" to "Submit" on the last section. | ✅ Done |
| **Validation Error Highlighting** | Highlights invalid fields with inline messages and an alert banner (`role="alert"`). | ✅ Done |
| **Granular Autosave** | Debounced field-level autosave (600ms) with retry policy (2 retries on failure). | ✅ Done |
| **Save State Feedback** | Visual indicators reflecting: `Saving...`, `Saved`, `Error – retrying...`, and `Error saving`. | ✅ Done |
| **Mock API Simulation** | Simulates `PUT /api/requests/:id/question/:questionId` (600–1000ms latency, 15% random failure rate) and `GET /api/schemas`. | ✅ Done |
| **Field Types Supported** | `text`, `number`, `radio`, `toggle` (switch), plus `textarea`. | ✅ Done |
| **Read-Only Summary** | Formatted summary screen with celebratory illustration and quick reset to start over. | ✅ Done |
| **Angular 16+ & Reactive Forms** | Built with modern Angular standalone components and strictly typed Reactive Forms. | ✅ Done |

---

## 🚀 Beyond the Baseline: Value-Add Features & Justifications

To demonstrate senior-level engineering rigor and deliver production-grade quality, several key features and enhancements were implemented beyond the basic test prompt:

### 1. Interactive Live Schema Customizer (`⌘ + Shift + P` / `F2`)
* **What was added**: A visual schema builder and raw JSON editor accessible exclusively via keyboard shortcut (`⌘ + Shift + P` on macOS, `Ctrl + Shift + P` on Windows/Linux, or `F2`).
* **Why it matters**: The challenge specification explicitly states: *"All fields and sections should be dynamic, and assumes that the schema’s sections, questions and their properties can change."* This developer console provides evaluators with instant, interactive proof that the engine is truly dynamic—allowing you to add pages, reorder fields, change input types, or paste custom schemas at runtime without touching any source code.

### 2. Comprehensive Automated Testing with Jest (27 Tests across 7 Suites)
* **What was added**: Full unit test coverage using **Jest** (`jest-preset-angular`) covering form creation, step navigation, validation blocking, error recovery, autosave debounce, local storage, and summary view.
* **Why it matters**: Complex asynchronous reactive logic (debounced autosaving, retry streams, route guards) cannot rely solely on manual testing. Comprehensive unit tests ensure zero regressions and demonstrate a production-ready quality mindset.

### 3. Route Guard & Session Resiliency ([`requestActiveGuard`](src/app/core/guards/request-active.guard.ts))
* **What was added**: A functional Angular route guard protecting the form and summary routes.
* **Why it matters**: In real-world web apps, users frequently refresh the page, navigate via browser history, or alter URL parameters. The guard safely reloads or recovers the active request session from storage or gracefully redirects invalid paths back to the schema chooser (`/`), preventing broken or blank states.

### 4. Step Navigation Sidebar & Progress Awareness
* **What was added**: A dynamic left sidebar reflecting all schema sections as distinct steps (`Page 1`, `Page 2`, ...) and allowing users to jump back directly to previously validated steps.
* **Why it matters**: Matches modern enterprise procurement UX standards (e.g. Coupa, Workday), giving users clear visibility into where they are in the multi-step flow.

### 5. Enterprise Accessibility (a11y) Standards
* **What was added**: Full keyboard navigation, `role="radiogroup"`, `role="switch"`, `role="dialog"`, `role="alert"`, `aria-live="polite"` on status updates, and explicit `<label>` / `<input>` ID associations.
* **Why it matters**: Accessibility is non-negotiable in production software. It ensures that custom dynamic form controls are accessible to screen readers and keyboard-only users.

### 6. Extended Field Support (`textarea`)
* **What was added**: Support for multiline text areas in addition to standard text, number, radio, and toggle.
* **Why it matters**: Real-world request forms frequently require multiline text for justifications, special instructions, or item descriptions.

---

## 🏛️ Architectural Decisions & Approach

### 1. Schema-Driven Development (SDD)

Instead of hardcoding form layouts and inputs into individual component templates, the core of this project is built on **Schema-Driven Development (SDD)**:

- **Single Source of Truth**: The JSON schema defines the field types, labels, required rules, and section groupings.
- **Separation of Concerns**: The rendering components (`DynamicFormComponent` and `DynamicFieldComponent`) are purely presentation-driven and completely agnostic of specific domain entities.
- **Dynamic Form Generation**: [`FormFactoryService`](src/app/core/services/form-factory.service.ts) dynamically compiles the schema into an Angular `FormGroup` hierarchy, attaching appropriate validators (`Validators.required`, `Validators.min(0)`) at runtime.
- **Extensibility**: Adding new question types or altering form structures requires only updating the JSON schema.

```json
{
  "id": "software-request",
  "title": "Software Request",
  "sections": [
    {
      "id": "requested-item",
      "title": "Requested Item",
      "fields": [
        { "id": 1758177604, "label": "Item Name", "type": "text", "required": true },
        { "id": 75484637462, "label": "Quantity", "type": "number", "required": true }
      ]
    }
  ]
}
```

---

### 2. Reactive State Management (RxJS)

For the scope of this challenge, I adopted the **Service-with-Subject** pattern via [`RequestStateService`](src/app/core/services/request-state.service.ts):

- **Unidirectional Data Flow**: State is kept private in a `BehaviorSubject` and exposed to components as read-only Observables (`activeRequest$`, `saveStatus$`).
- **Granular Field Streams**: Rather than saving the entire form on every keystroke, value changes are subscribed to on a per-field basis with `debounceTime(600)` and `distinctUntilChanged()`.
- **Automatic Retry with Backoff**: Transient network errors trigger an automatic retry policy (up to 2 attempts with a 1-second delay) before transitioning to an error state.
- **Memory Safety**: Subscriptions are cleaned up when forms are rebuilt or components are destroyed.

```text
[User Types] ──► debounceTime(600ms) ──► saveStatus: 'saving'
                                                │
                                                ▼
                                    MockApi.saveQuestion(PUT)
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼ (Success)                                       ▼ (Temporary Error)
             saveStatus: 'saved'                               saveStatus: 'retrying' (Retry 1..2)
             update local answers state                                  │
                                                                         ▼ (Persistent Error)
                                                               saveStatus: 'error'
```

---

### 3. Enterprise Scalability & NgRx Roadmap

While the lightweight `BehaviorSubject` service fits the current requirements cleanly without adding unnecessary boilerplate, the system was designed with enterprise growth in mind.

#### When to migrate to NgRx:
As applications expand to support complex multi-tab drafts, offline sync with IndexedDB, undo/redo history, audit logging, and cross-feature analytics, transitioning to **NgRx (Store / SignalStore / Effects)** is the recommended path.

#### Proposed NgRx Architecture:
1. **State Shape**:
   ```typescript
   export interface FormState {
     schemas: EntityState<FormSchema>;
     activeRequestId: string | null;
     activeRequest: ActiveRequest | null;
     autosaveStatus: AutosaveStatus;
     undoStack: RequestAnswers[];
     redoStack: RequestAnswers[];
   }
   ```
2. **Action Groups (`createActionGroup`)**:
   - `[Form] Update Field Answer`: Dispatched on control changes.
   - `[Autosave] Save Field`: Triggered by effects.
   - `[Autosave] Save Success / Retry / Failure`: Updates saving badge state.
3. **Isolated Autosave Effect**:
   - Encapsulates debouncing, cancellation of outdated requests (`switchMap`), and retry logic outside components.
4. **Memoized Selectors**:
   - `selectCurrentSection`, `selectSectionValidity`, and `selectSummaryAnswers` prevent redundant recalculations and re-renders.

---

### 4. Why Jest for Unit Testing

**Jest** (`jest-preset-angular`) was chosen as the test runner for this project:

- **Industry Standard**: Widely adopted across modern enterprise Angular teams.
- **Built-in Mocking & Spying**: `jest.fn()` and `jest.spyOn()` provide high-fidelity mocks with strict TypeScript typing without third-party spy dependencies.
- **Fast, Isolated Execution**: Uses `jsdom` and virtualized DOM memory sandboxing, running the full 7-suite test suite in **~2.3 seconds**.
- **Deterministic CI Integration**: Clean terminal outputs and coverage reports (`npm run test:coverage`).

```bash
PASS src/app/features/dynamic-form/dynamic-form.component.spec.ts (6 tests)
PASS src/app/shared/components/schema-config-modal/schema-config-modal.component.spec.ts (4 tests)
PASS src/app/app.spec.ts (2 tests)
PASS src/app/features/summary/summary.component.spec.ts (4 tests)
PASS src/app/features/schema-selector/schema-selector.component.spec.ts (3 tests)
PASS src/app/core/services/form-factory.service.spec.ts (3 tests)
PASS src/app/core/services/local-storage.service.spec.ts (5 tests)

Test Suites: 7 passed, 7 total
Tests:       27 passed, 27 total (100%)
```

---

### 5. Design System Fidelity & A11y

- **Pantone Teal / Emerald Design Tokens**: Defined in [`src/styles.scss`](src/styles.scss) (`--primary: #0f766e`, `--primary-light: #f0fdf9`, `--text-main: #0f2924`).
- **Vanilla SCSS**: Handcrafted, modular component stylesheets without heavy external CSS frameworks or Tailwind.
- **Accessibility (a11y First)**:
  - Accessible custom controls (`role="radiogroup"`, `role="switch"`, `role="dialog"`).
  - Explicit `<label>` to `<input>` associations via `for` and `id`.
  - Dynamic status regions with `aria-live="polite"` and validation error alerts with `role="alert"`.
  - Keyboard navigation and Escape key handling on modals.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── request-active.guard.ts       # Route guard preventing orphaned navigation
│   │   ├── mocks/
│   │   │   └── schemas.mock.ts               # Default software & hardware schemas
│   │   ├── models/
│   │   │   ├── request.model.ts              # Request models, answers map, autosave types
│   │   │   └── schema.model.ts               # FormSchema, FormSection, FormField, FieldValue
│   │   └── services/
│   │       ├── form-factory.service.ts       # Reactive FormGroup & validation builder
│   │       ├── local-storage.service.ts      # SSR-safe storage utility
│   │       ├── mock-api.service.ts           # In-memory API with latency & failure simulation
│   │       └── request-state.service.ts      # Main reactive state store & autosave engine
│   ├── features/
│   │   ├── dynamic-form/                     # Multi-page form container
│   │   │   ├── components/
│   │   │   │   ├── autosave-status/          # Status badge (Saving, Saved, Retrying, Error)
│   │   │   │   ├── dynamic-field/            # Text, number, radio, toggle renderer
│   │   │   │   └── form-navigation/          # Previous / Next / Submit buttons
│   │   │   ├── dynamic-form.component.html
│   │   │   ├── dynamic-form.component.scss
│   │   │   ├── dynamic-form.component.spec.ts
│   │   │   └── dynamic-form.component.ts
│   │   ├── schema-selector/                  # Purchase category selection screen
│   │   └── summary/                          # Read-only celebration summary screen
│   ├── shared/
│   │   └── components/
│   │       └── schema-config-modal/          # Interactive Schema Builder & JSON editor
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   └── app.html
├── documents/
│   └── FE test.md                            # Original technical challenge brief
└── styles.scss                               # Global design system tokens & typography
```

---

## 💻 Available Scripts

```bash
# Start local development server (http://localhost:4200)
npm start

# Run all unit tests with Jest
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with code coverage report
npm run test:coverage

# Run ESLint & template accessibility checks
npm run lint

# Build production bundle (output in dist/nexton-challenge)
npm run build
```

---

## 🎛️ Live Schema Customizer Guide

To demonstrate the flexibility of the Schema-Driven engine in real time, a built-in schema customization console can be triggered from anywhere in the application:

1. Press **`⌘ + Shift + P`** (macOS) / **`Ctrl + Shift + P`** (Windows/Linux) or **`F2`** to open the schema configuration modal.
2. **Visual Builder Tab**: Add or remove pages (sections), add new fields, switch field types (`text`, `number`, `radio`, `toggle`, `textarea`), adjust labels, or mark fields as required.
3. **Raw JSON Tab**: Directly paste or edit raw schema JSON with instant validation.
4. **Save & Apply**: Changes immediately recompile the active reactive form in-memory and persist to local storage.
5. **Reset**: Easily restore default schemas at any time via the "Reset to Defaults" button.
6. **Dismiss**: Press `Escape` or click the close button to return to the form.

---

## 📄 License

Created for the Nexton Frontend Technical Evaluation. All rights reserved.
