---
name: commitizen
description: >-
  Use this skill whenever creating, suggesting, or executing Git commits in the project.
  Ensures commit messages strictly follow the Commitizen and Conventional Commits standard,
  and guarantees all relevant modified and staged files are properly staged and included.
---

# Commitizen / Conventional Commits Workflow

This skill guides the creation of standardized commit messages following the **Conventional Commits** and **Commitizen** specifications for AI-assisted tasks in this repository.

---

## 1. Commit Message Structure

Every commit message must follow this format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Allowed Types (`<type>`):
* **`feat`**: A new feature or functionality for the user/application.
* **`fix`**: A bug fix or unexpected behavior resolution.
* **`refactor`**: Code changes that neither fix a bug nor add a feature (e.g., method extraction, moving files).
* **`style`**: Formatting and style changes (whitespace, linting, cosmetic CSS/SCSS adjustments) that do not alter logic.
* **`test`**: Adding missing tests or updating/correcting existing test suites.
* **`docs`**: Documentation-only changes (e.g., `README.md`, `FE test.md`, code comments).
* **`chore`**: Maintenance tasks, dependency bumps, tool configurations.
* **`perf`**: A code change that improves performance.
* **`build`**: Changes that affect the build system or external dependencies (e.g., `angular.json`, `package.json`, scripts).
* **`ci`**: Changes to CI/CD configuration files and pipelines.

### Common Scopes in this Project (`<scope>`):
* `schema` (dynamic form schemas and customizer)
* `forms` (form engine, section navigation, and dynamic field components)
* `summary` (submission summary page and review)
* `core` (core services, state management, local storage)
* `mocks` (mock data and API simulation)
* `ui` (global styles, design system, theme tokens)
* `tests` (Vitest/Angular unit and integration tests)

---

## 2. Rules for the `<subject>`
1. Use the imperative, present tense: "add", "fix", "refactor", "update" (not "added", "fixing", or "adds").
2. Do not capitalize the first letter (unless it is an acronym or proper noun).
3. Do not place a period (`.`) at the end.
4. Keep it concise (72 characters or fewer on the header line).

---

## 3. Commit Execution Workflow

When creating or executing an AI-assisted commit:

1. **Check Modified Files**:
   ```bash
   git status
   ```

2. **Stage All Target Files (`git add`)**:
   - Ensure all relevant modified and untracked files for the task are staged:
   ```bash
   git add <specific-files>
   # or when appropriate for all task changes:
   git add .
   ```

3. **Verify Staged Changes**:
   ```bash
   git status --short
   ```

4. **Commit with Conventional Message**:
   ```bash
   git commit -m "<type>(<scope>): <subject>"
   ```

---

## 4. Practical Examples

```bash
# New feature
git add src/app/features/summary/
git commit -m "feat(summary): update summary page with celebration header and cupcake illustration"

# Mock separation
git add src/app/core/mocks/schemas.mock.ts src/app/core/services/mock-api.service.ts
git commit -m "refactor(mocks): extract DEFAULT_SCHEMAS into standalone mock file"

# Validation bugfix
git add src/app/features/dynamic-form/
git commit -m "fix(forms): prevent navigation when section contains invalid required fields"

# Unit tests
git add src/app/features/summary/summary.component.spec.ts
git commit -m "test(summary): add unit test coverage for summary component"
```
