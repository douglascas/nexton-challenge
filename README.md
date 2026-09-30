# Nexton Frontend Challenge — Dynamic Form Engine

> An extensible, multi-step Request Submission Form application built with **Angular (Standalone Architecture)**, **Reactive Forms**, and **RxJS**, engineered under the **Spec-Driven Development (SDD)** methodology (guided by requirements specs and AI Agent governance) and powered by a runtime **Schema-Driven Form Engine** styled according to the Pantone Teal / Emerald Design System.

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
  - [1. Spec-Driven Development (SDD) & Agent Governance](#1-spec-driven-development-sdd--agent-governance)
  - [2. Schema-Driven UI & Dynamic Form Engine](#2-schema-driven-ui--dynamic-form-engine)
  - [3. Reactive State Management (RxJS)](#3-reactive-state-management-rxjs)
  - [4. Enterprise Scalability & NgRx Roadmap](#4-enterprise-scalability--ngrx-roadmap)
  - [5. Why Jest for Unit Testing](#5-why-jest-for-unit-testing)
  - [6. Design System Fidelity & A11y](#6-design-system-fidelity--a11y)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [CI/CD & GitHub Actions Pipeline](#-cicd--github-actions-pipeline)
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

## 🚀 Beyond the Baseline: Professional Engineering & Best Practices

In a mature enterprise development environment, software delivery involves far more than merely fulfilling the minimum functional requirements of a brief. Real-world applications demand **testability**, **session resilience**, **accessibility compliance**, **reproducible deployments**, and **continuous integration gates**.

To reflect how modern high-performance engineering teams operate, several features and infrastructural components were added beyond the prompt in [`FE test.md`](documents/FE%20test.md):

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Enterprise Development Lifecycle Pillars                        │
├───────────────────────┬───────────────────────┬───────────────────┬────────────────────┤
│ 🧪 Quality Assurance  │ 🛡️ Resilience & UX   │ 🏗️ Extensibility  │ 🚢 DevOps & CI/CD  │
│ • 100% Jest Test Pass │ • Route Guard Session │ • Live Customizer │ • Docker Container │
│ • 27 Tests / 7 Suites │ • WCAG AA A11y        │ • Textarea Input  │ • Git Flow CI/CD   │
│ • ESLint Strict Rules │ • Step Navigation Nav │ • Schema Defaults │ • Commitizen Log   │
└───────────────────────┴───────────────────────┴───────────────────┴────────────────────┘
```

### 1. Developer Experience & Dynamic Extensibility
* **Interactive Live Schema Customizer (`⌘ + Shift + P` / `F2`)**:
  * *What was added*: A visual schema builder and raw JSON editor accessible via keyboard shortcut.
  * *Professional Justification*: The test brief explicitly states that schemas and question properties can change at any time. Rather than relying on static code changes to prove this, this developer console provides evaluators with instant, interactive proof that the engine is truly dynamic—allowing you to add pages, reorder fields, change input types, or paste custom schemas at runtime without touching any source code.
* **Extended Field Support (`textarea`)**:
  * *What was added*: Full support for multiline text areas in addition to text, number, radio, and toggle.
  * *Professional Justification*: Real-world procurement forms frequently require multiline text for justifications, special instructions, or item descriptions. Implementing this demonstrates the open-closed extensibility of the form engine.

### 2. Quality Assurance & Automated Testing
* **Comprehensive Automated Test Harness with Jest (27 Tests across 7 Suites)**:
  * *What was added*: Complete test coverage using **Jest** (`jest-preset-angular`) covering reactive form creation, step navigation, validation blocking, error recovery, autosave debouncing, local storage, and summary review.
  * *Professional Justification*: Complex asynchronous reactive logic (debounced autosaving, retry streams, route guards) cannot rely on manual QA alone. Comprehensive automated unit tests ensure zero regressions and represent non-negotiable enterprise quality standards.

### 3. Application Resilience & Enterprise UX
* **Route Guard & Session Resiliency ([`requestActiveGuard`](src/app/core/guards/request-active.guard.ts))**:
  * *What was added*: A functional Angular route guard protecting the form and summary routes.
  * *Professional Justification*: In real-world web apps, users frequently refresh the page, navigate via browser history, or alter URL parameters. The guard safely reloads or recovers the active request session from storage or gracefully redirects invalid paths back to the schema chooser (`/`), preventing broken or blank states.
* **Step Navigation Sidebar & Progress Awareness**:
  * *What was added*: A dynamic left sidebar reflecting all schema sections as distinct steps (`Page 1`, `Page 2`, ...) and allowing users to jump back directly to previously validated steps.
  * *Professional Justification*: Matches modern enterprise procurement UX standards (e.g. Coupa, Workday), giving users clear visibility into where they are in the multi-step flow.
* **Enterprise Accessibility (WCAG AA Compliance)**:
  * *What was added*: Full keyboard navigation, `role="radiogroup"`, `role="switch"`, `role="dialog"`, `role="alert"`, `aria-live="polite"` on status updates, and explicit `<label>` / `<input>` ID associations.
  * *Professional Justification*: Accessibility is mandatory in enterprise software. It ensures that custom dynamic form controls are fully operable by screen readers and keyboard-only users.

### 4. DevOps, Containerization & CI/CD Governance
* **Production Containerization ([`Dockerfile`](Dockerfile) & [`docker-compose.yml`](docker-compose.yml))**:
  * *What was added*: Multi-stage Docker build with Node 22 and an optimized Nginx Alpine runtime featuring SPA fallback routing, Gzip compression, and asset caching headers.
  * *Professional Justification*: Eliminates the "works on my machine" problem, allowing any reviewer or deployment environment to run the production application with a single command (`docker compose up --build`).
* **Automated GitHub Actions CI & Strict Git Flow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))**:
  * *What was added*: Automated CI workflow executing parallel quality checks (Unit Tests, Production Build, ESLint) and enforcing strict branch protection policies (`feature/*` ➔ `develop` ➔ `main`).
  * *Professional Justification*: Establishes standard continuous integration governance, ensuring that code merged into the `develop` or `main` branches is always green, tested, and releasable.
* **Standardized Commitizen / Conventional Commits**:
  * *What was added*: Strict semantic commit history (`feat:`, `fix:`, `build:`, `docs:`, `ci:`).
  * *Professional Justification*: Ensures an auditable, clean commit history that integrates seamlessly with automated changelog generation and semantic release tooling.

---

## 🏛️ Architectural Decisions & Approach

### 1. Spec-Driven Development (SDD) & Agent Governance

This project was built following the **Spec-Driven Development (SDD)** engineering methodology:

#### 🎯 Strategic Alignment with Nexton's Purpose & Culture
[Nexton](https://www.linkedin.com/company/nexton/) specializes in connecting top-tier LATAM tech talent with high-growth US/global engineering teams, championing **senior-level autonomy, architectural rigor, proactive problem solving, and modern engineering best practices**.

In high-performance distributed environments, quality cannot be an afterthought or left to ad-hoc interpretations. The decision to take the initiative and structure this entire project under **Spec-Driven Development (SDD)** directly reflects Nexton's core ethos:
- **Predictable & Auditable Delivery**: Requirements from [`documents/FE test.md`](documents/FE%20test.md) were treated as formal engineering contracts, translating every business rule into concrete, measurable validation gates.
- **Proactive Senior Craftsmanship**: Going beyond minimal ticket fulfillment by establishing automated quality guardrails, enterprise error recovery, full test coverage, and reproducible containerization.

#### 🛡️ AI Agent Governance & Specialized Quality Skills
To enforce non-negotiable architectural standards throughout the implementation, specialized agent skills were defined under [`.agents/skills/`](.agents/skills/) to act as automated compliance guardrails:
- [`constitution`](.agents/skills/constitution/SKILL.md): Supreme architectural governance, decision hierarchy, and definition-of-done quality gates.
- [`angular-code-standards`](.agents/skills/angular-code-standards/SKILL.md): Enforces standalone components, modern control flow (`@if`, `@for`), and strict TypeScript.
- [`rxjs-state-management`](.agents/skills/rxjs-state-management/SKILL.md): Enforces declarative streams, debounced autosave pipelines, and subscription hygiene.
- [`vitest-angular-testing`](.agents/skills/vitest-angular-testing/SKILL.md) & Jest harness: Enforces 100% test pass rates and reactive form test patterns.
- [`pantone-design-system`](.agents/skills/pantone-design-system/SKILL.md): Enforces Pantone Teal/Emerald tokens and Figma spec fidelity.
- [`accessibility-a11y`](.agents/skills/accessibility-a11y/SKILL.md): Enforces keyboard navigation and WCAG AA compliance.
- [`commitizen`](.agents/skills/commitizen/SKILL.md): Enforces Conventional Commits across the Git history.

---

### 2. Schema-Driven UI & Dynamic Form Engine

While **Spec-Driven Development** governed the engineering *methodology*, the UI itself was built using the **Schema-Driven UI** *architectural pattern*:

- **Runtime Dynamic Interpretation**: Instead of hardcoding static form layouts and inputs into individual component templates, the core form engine renders completely on the fly from JSON schemas.
- **Separation of Concerns**: The rendering components (`DynamicFormComponent` and `DynamicFieldComponent`) are purely presentation-driven and completely agnostic of specific domain entities.
- **Dynamic Form Generation**: [`FormFactoryService`](src/app/core/services/form-factory.service.ts) dynamically compiles the schema into an Angular `FormGroup` hierarchy, attaching appropriate validators (`Validators.required`, `Validators.min(0)`) at runtime.
- **Extensibility**: Adding new question types, reordering fields, or modifying sections requires updating only the JSON schema without altering component templates or rebuilding application bundles.

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

### 3. Reactive State Management (RxJS)

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

### 4. Enterprise Scalability & NgRx Roadmap

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

### 5. Why Jest for Unit Testing

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

### 6. Design System Fidelity & A11y

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

## 🔄 CI/CD & GitHub Actions Pipeline

A Continuous Integration (CI) pipeline is configured via GitHub Actions in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) to automatically validate code quality, test suites, build artifacts, and enforce Git Flow branch protection on every Pull Request.

### 🛡️ Pipeline Stages & Jobs:

```text
               ┌──► 🛡️ 1. Branch Policy       ──► Enforces PRs into 'main' come exclusively from 'develop'
[Pull Request] ┼──► 🧪 2. Unit Tests (Jest)   ──► Runs all 27 unit tests across 7 test suites
               ├──► 📦 3. Production Build     ──► Validates Angular production bundle generation
               └──► 🔍 4. Lint & A11y          ──► ESLint & Angular template accessibility checks
```

1. **`🛡️ Branch Flow Policy`**: Validates the source and target branches. Direct Pull Requests into `main` from feature branches are rejected; merges into production must come exclusively from `develop`.
2. **`🧪 Unit Tests (Jest)`**: Runs all unit tests with `--ci --maxWorkers=2` ensuring zero test regressions.
3. **`📦 Production Build`**: Compiles the application via `@angular/build:application` with production budgets and strict AOT optimization.
4. **`🔍 Lint & Accessibility`**: Checks TypeScript standards and ARIA/accessibility rules.

> [!NOTE]
> **GitHub Actions Account Status**: In the repository's GitHub Actions tab, runners may display: *"The job was not started because your account is locked due to a billing issue."*. This is an account-level GitHub spending limit restriction on the personal account. The complete workflow definition ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), configuration, and local CLI validations (`npm test`, `npm run lint`, `npm run build`) are 100% complete, functional, and verified.

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
