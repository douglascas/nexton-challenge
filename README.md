# Nexton Frontend Challenge — Dynamic Form Engine

> An extensible, multi-step Request Submission application built with **Angular (Standalone Architecture)**, **Reactive Forms**, and **RxJS**. Engineered following the **Spec-Driven Development (SDD)** methodology (guided by requirements specifications and AI Agent governance) and powered by a runtime **Schema-Driven Dynamic Form Engine** styled with the Pantone Teal / Emerald Design System.

---

## Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm start

# 3. Run unit tests (Jest)
npm test
```

Navigate to `http://localhost:4200/` in your browser.

### Running with Docker

```bash
# Build and run container with Docker Compose (served on port 8080)
docker compose up --build

# Or build and run standalone Docker image:
docker build -t nexton-challenge .
docker run -p 8080:80 nexton-challenge
```

Navigate to `http://localhost:8080/` in your browser.

---

## Table of Contents

- [Overview & Goal](#overview--goal)
- [Challenge Requirements Checklist](#challenge-requirements-checklist)
- [Beyond the Baseline: Engineering Highlights](#beyond-the-baseline-engineering-highlights)
- [Architectural Decisions & Approach](#architectural-decisions--approach)
  - [1. Spec-Driven Development & Agent Governance](#1-spec-driven-development--agent-governance)
  - [2. Schema-Driven UI & Dynamic Form Engine](#2-schema-driven-ui--dynamic-form-engine)
  - [3. Reactive State Management & Autosave Engine](#3-reactive-state-management--autosave-engine)
  - [4. Enterprise Scalability & NgRx Roadmap](#4-enterprise-scalability--ngrx-roadmap)
  - [5. Why Jest for Unit Testing](#5-why-jest-for-unit-testing)
  - [6. Design System Fidelity & Accessibility](#6-design-system-fidelity--accessibility)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [CI/CD & GitHub Actions Pipeline](#cicd--github-actions-pipeline)
- [Live Schema Customizer Guide](#live-schema-customizer-guide)
- [License](#license)

---

## Overview & Goal

The goal of this project is to build a dynamic Request Submission application based on technical requirements and design specifications provided by Nexton.

The application allows users to choose a purchase category (such as Software or Hardware), navigate a multi-page form generated on the fly from JSON schemas, automatically save answers with simulated latency and retry handling, and review a read-only summary upon completion.

---

## Challenge Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Schema Chooser** | Landing view allowing users to select between Software and Hardware request schemas. | Done |
| **Multi-Page Section Navigation** | Each section in the schema renders on an isolated page (`/request/:id/section/:index`). | Done |
| **Next & Previous Controls** | Step-by-step navigation with validation blocking on invalid required inputs. | Done |
| **Submit on Final Step** | Dynamically changes the "Next" button to "Submit" on the last section. | Done |
| **Validation Error Highlighting** | Displays inline field errors and an alert banner (`role="alert"`). | Done |
| **Granular Autosave** | Debounced field-level autosave (600ms) with retry policy (2 retries on temporary failure). | Done |
| **Save State Feedback** | Real-time status indicators: `Saving...`, `Saved`, `Error – retrying...`, and `Error saving`. | Done |
| **Mock API Simulation** | Simulates `PUT /api/requests/:id/question/:questionId` (latency + 15% random failure) and `GET /api/schemas`. | Done |
| **Supported Field Types** | `text`, `number`, `radio`, `toggle` (switch), plus `textarea`. | Done |
| **Read-Only Summary** | Formatted summary screen with celebration illustration and a flow reset action. | Done |
| **Angular & Reactive Forms** | Modern standalone components with strictly typed Reactive Forms. | Done |

---

## Beyond the Baseline: Engineering Highlights

In a real-world software product, delivering value means more than writing minimal code to pass a prompt. It requires thinking about stability, developer tooling, automated quality gates, accessibility, and smooth user flows.

To reflect this standard, several features and infrastructural foundations were added beyond the original brief in [`documents/FE test.md`](documents/FE%20test.md):

### 1. Developer Tooling & Dynamic Verification
* **Live Schema Customizer (`⌘ + Shift + P` / `Ctrl + Shift + P` / `F2`)**:
  * *What it does*: An interactive modal with a visual builder and raw JSON editor.
  * *Why it was added*: The brief states that form schemas and questions can change at any time. Instead of relying on static explanations, this tool gives reviewers immediate hands-on proof that the engine is 100% dynamic. You can add sections, create fields, toggle required rules, or paste custom schemas at runtime without touching source code.
* **Multiline Textarea Support**:
  * *What it does*: Adds multiline text support alongside text, number, radio, and toggle.
  * *Why it was added*: Procurement requests often require detailed justification notes. It also validates that adding new field types follows open-closed architecture.

### 2. Automated Testing with Jest
* **Complete Test Harness (27 Tests across 7 Suites)**:
  * *What it does*: Comprehensive unit tests covering form creation, step transitions, validation guards, error handling, debounced autosave, local storage, and summary review.
  * *Why it was added*: Reactive streams and retry policies are prone to subtle regressions. Automated tests provide high confidence and fast execution (~2.3s).

### 3. Session Resilience & Enterprise UX
* **Route Guard & Session Recovery ([`requestActiveGuard`](src/app/core/guards/request-active.guard.ts))**:
  * *What it does*: Protects form routes from broken states when users refresh, use browser back/forward buttons, or edit URLs directly.
  * *Why it was added*: Recovers active drafts seamlessly from local storage or redirects invalid routes to the schema chooser.
* **Step Navigation Sidebar**:
  * *What it does*: Visualizes overall progress and lets users jump back to previously completed steps.
  * *Why it was added*: Aligns with enterprise procurement UX standards (like Coupa or Workday).
* **Accessibility (WCAG AA Compliance)**:
  * *What it does*: Full keyboard support, ARIA attributes (`role="radiogroup"`, `role="switch"`, `aria-live="polite"`), and explicit label bindings.
  * *Why it was added*: Guarantees that dynamic form controls are accessible to screen readers and keyboard users.

### 4. Containerization & CI/CD Governance
* **Production Containerization ([`Dockerfile`](Dockerfile) & [`docker-compose.yml`](docker-compose.yml))**:
  * *What it does*: Multi-stage Docker setup serving the built Angular SPA via Nginx Alpine with SPA fallback routing and Gzip compression.
  * *Why it was added*: Ensures zero environment discrepancies and allows anyone to run the production app with a single command.
* **GitHub Actions CI Pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))**:
  * *What it does*: Automated pull request validation running Jest tests, production build, and lint checks in parallel.
  * *Why it was added*: Guarantees that code merged into `develop` or `main` is always tested and buildable.
* **Commitizen / Conventional Commits**:
  * *What it does*: Enforces semantic commit messages (`feat:`, `fix:`, `build:`, `docs:`, `ci:`).
  * *Why it was added*: Keeps a clean, structured git history ready for automated changelogs.

---

## Architectural Decisions & Approach

### 1. Spec-Driven Development & Agent Governance

This challenge was approached using the **Spec-Driven Development (SDD)** methodology:

#### Alignment with Nexton's Engineering Culture
[Nexton](https://www.linkedin.com/company/nexton/) focuses on connecting senior LATAM software talent with global technology companies. In distributed high-performance teams, success relies heavily on **autonomy, architectural clarity, proactive engineering, and well-defined contracts**.

Adopting Spec-Driven Development for this project was an intentional choice to reflect that mindset:
- **Requirements as Contracts**: The specification in [`documents/FE test.md`](documents/FE%20test.md) served as the foundational source of truth, ensuring each requirement mapped to clean, verifiable acceptance criteria.
- **AI Agent Governance & Specialized Skills**: Domain-specific skills under [`.agents/skills/`](.agents/skills/) were set up as automated architectural guardrails:
  - [`constitution`](.agents/skills/constitution/SKILL.md): Core architectural principles and definition-of-done quality gates.
  - [`angular-code-standards`](.agents/skills/angular-code-standards/SKILL.md): Standalone architecture, `@if`/`@for` control flow, and strict TypeScript.
  - [`rxjs-state-management`](.agents/skills/rxjs-state-management/SKILL.md): Reactive streams, debounced autosave, and memory cleanup.
  - [`vitest-angular-testing`](.agents/skills/vitest-angular-testing/SKILL.md) & Jest harness: Unit test coverage and mocking conventions.
  - [`pantone-design-system`](.agents/skills/pantone-design-system/SKILL.md): Pantone Teal/Emerald design tokens and layout consistency.
  - [`accessibility-a11y`](.agents/skills/accessibility-a11y/SKILL.md): Keyboard navigation and screen reader semantics.
  - [`commitizen`](.agents/skills/commitizen/SKILL.md): Conventional Commit standards.

---

### 2. Schema-Driven UI & Dynamic Form Engine

While **Spec-Driven Development** defined how the project was planned and governed, the frontend itself uses a **Schema-Driven UI** architectural pattern:

- **Runtime Interpretation**: No inputs or steps are hardcoded in component templates. The form builds itself dynamically from JSON schemas.
- **Separation of Concerns**: Rendering components (`DynamicFormComponent`, `DynamicFieldComponent`) are purely presentation-driven.
- **Dynamic Compilation**: [`FormFactoryService`](src/app/core/services/form-factory.service.ts) builds Angular `FormGroup` hierarchies and attaches validators (`Validators.required`, `Validators.min(0)`) on the fly.
- **Extensibility**: Adding new fields or changing section orders requires modifying only JSON data.

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

### 3. Reactive State Management & Autosave Engine

State is handled through the **Service-with-Subject** pattern in [`RequestStateService`](src/app/core/services/request-state.service.ts):

- **Unidirectional Data Flow**: State is held in a private `BehaviorSubject` and exposed through read-only Observables (`activeRequest$`, `saveStatus$`).
- **Granular Autosave**: Values are listened to on a per-field basis with `debounceTime(600)` and `distinctUntilChanged()` to avoid excessive network requests.
- **Automatic Retry**: Temporary failures trigger up to 2 retry attempts with a 1-second delay before marking the field as errored.
- **Resource Hygiene**: Subscriptions are cleaned up when steps transition or components destroy.

```text
[User Input] ──► debounceTime(600ms) ──► status: 'saving'
                                                │
                                                ▼
                                     MockApi.saveQuestion(PUT)
                                                │
                        ┌───────────────────────┴───────────────────────┐
                        ▼ (Success)                                     ▼ (Temporary Error)
              status: 'saved'                                 status: 'retrying' (1..2)
              update local state                                        │
                                                                        ▼ (Persistent Error)
                                                              status: 'error'
```

---

### 4. Enterprise Scalability & NgRx Roadmap

For the scope of this challenge, `BehaviorSubject` provides clean reactivity without boilerplate. For a larger enterprise application, migrating to **NgRx** is the recommended trajectory:

#### When to migrate to NgRx:
When the application grows to include complex multi-tab drafts, offline sync with IndexedDB, undo/redo stacks, audit trails, and multi-team feature modules.

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
   - `[Form] Update Field Answer`: Dispatched on user input.
   - `[Autosave] Save Field`: Triggered by effects.
   - `[Autosave] Save Success / Retry / Failure`: Updates saving badge state.
3. **Isolated Autosave Effect**:
   - Encapsulates debouncing, request cancellation (`switchMap`), and retry logic outside components.
4. **Memoized Selectors**:
   - `selectCurrentSection`, `selectSectionValidity`, and `selectSummaryAnswers` optimize change detection.

---

### 5. Why Jest for Unit Testing

**Jest** (`jest-preset-angular`) was chosen as the test runner:

- **Industry Standard**: Widely used in modern enterprise Angular ecosystems.
- **Built-in Mocking & Spying**: `jest.fn()` and `jest.spyOn()` offer clean mock definitions without extra tooling.
- **Fast Execution**: Uses `jsdom` for virtualized memory execution, completing all 7 suites in **~2.3 seconds**.
- **Deterministic CI Output**: Clean terminal reporting and coverage generation (`npm run test:coverage`).

```text
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

### 6. Design System Fidelity & Accessibility

- **Pantone Teal / Emerald Tokens**: Defined in [`src/styles.scss`](src/styles.scss) (`--primary: #0f766e`, `--primary-light: #f0fdf9`, `--text-main: #0f2924`).
- **Clean Modular SCSS**: Component-scoped SCSS without heavy third-party CSS utility bloat.
- **Accessibility (WCAG AA)**:
  - Accessible custom controls (`role="radiogroup"`, `role="switch"`, `role="dialog"`).
  - Explicit `<label>` to `<input>` associations via `for` and `id`.
  - Live status notifications using `aria-live="polite"` and validation error alerts with `role="alert"`.
  - Keyboard navigation and Escape key dismissal on modals.

---

## Project Structure

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

## Available Scripts

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

## CI/CD & GitHub Actions Pipeline

A Continuous Integration (CI) pipeline is configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) to validate code quality, test suites, and build artifacts on every pull request.

### Pipeline Stages & Checks

```text
               ┌──► Branch Policy       ──► Enforces PRs into 'main' come exclusively from 'develop'
[Pull Request] ┼──► Unit Tests (Jest)   ──► Runs 27 unit tests across 7 test suites
               ├──► Production Build     ──► Validates production bundle compilation
               └──► Lint & Accessibility ──► ESLint & Angular template checks
```

1. **Branch Policy**: Validates source and target branches. Direct PRs into `main` from feature branches are rejected; merges into production must come from `develop`.
2. **Unit Tests (Jest)**: Executes unit tests with `--ci --maxWorkers=2`.
3. **Production Build**: Compiles via `@angular/build:application` with strict AOT optimization.
4. **Lint & Accessibility**: Checks TypeScript rules and accessibility guidelines.

> [!NOTE]
> **GitHub Actions Account Status**: In the repository's GitHub Actions tab, runners may display: *"The job was not started because your account is locked due to a billing issue."*. This is an account-level GitHub spending limit restriction on the personal account. The complete workflow definition ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), configuration, and local CLI validations (`npm test`, `npm run lint`, `npm run build`) are 100% complete, functional, and verified.

---

## Live Schema Customizer Guide

To demonstrate the runtime flexibility of the Schema-Driven engine:

1. Press **`⌘ + Shift + P`** (macOS) / **`Ctrl + Shift + P`** (Windows/Linux) or **`F2`** to open the schema configuration modal.
2. **Visual Builder Tab**: Add or remove pages (sections), add new fields, switch field types (`text`, `number`, `radio`, `toggle`, `textarea`), adjust labels, or mark fields as required.
3. **Raw JSON Tab**: Directly paste or edit raw schema JSON with instant validation.
4. **Save & Apply**: Changes immediately recompile the active reactive form in-memory and persist to local storage.
5. **Reset**: Restore original default schemas at any time via the "Reset to Defaults" button.
6. **Dismiss**: Press `Escape` or click the close button to return to the form.

---

## License

Created for the Nexton Frontend Technical Evaluation. All rights reserved.
