---
name: pantone-design-system
description: >-
  Use this skill whenever designing, styling, or refining UI components, layouts, cards, buttons,
  or forms in this application. Enforces the Pantone Teal/Emerald design system and Figma specifications.
---

# Pantone Design System & UI Guidelines

This skill outlines the design tokens, visual hierarchy, component styling rules, and layout principles for this application.

---

## 1. Color Palette & Tokens

Defined globally in `src/styles.scss`:

### Primary Brand (Pantone Teal / Emerald Green)
* `--primary`: `#1ea888` (Main brand color for buttons, active pills, indicators)
* `--primary-hover`: `#168d71` (Hover state for interactive elements)
* `--primary-light`: `#f0fdf9` (Subtle background tints for active cards/sections)
* `--primary-border`: `#a7f3d0` (Accent borders and focus outlines)
* `--primary-shadow`: `rgba(30, 168, 136, 0.25)` (Glow and elevated shadows)

### Neutral Surfaces & Typography
* `--bg-page`: `#f8fafc` (Clean, light application background)
* `--surface-card`: `#ffffff` (White container cards)
* `--border-color`: `#e2e8f0` (Standard structural dividers and borders)
* `--text-main`: `#1e293b` (Deep slate for headings, labels, and primary text)
* `--text-muted`: `#64748b` (Secondary labels and helper text)
* `--text-subtle`: `#94a3b8` (Placeholder text, unanswered status `not answered`)

### Feedback & Validation
* `--error-color`: `#ef4444` (Validation error messages and error input borders)
* `--error-bg`: `#fef2f2` (Error alert background)
* `--error-border`: `#fecaca` (Error highlight border)

---

## 2. Component Design Specifications

### 1. Schema Selector (`/`)
* Centered layout with clean pill selector cards.
* Selected schema card highlighted with emerald primary border, subtle elevation, and an active indicator badge.

### 2. Multi-Page Dynamic Form (`/request/:id/section/:index`)
* **Left Sidebar**:
  * Step items labeled `Page 1`, `Page 2`, ...
  * Active step highlighted with brand teal background (`#1ea888`) and white text.
  * Inactive steps styled with subtle neutral background (`#f1f5f9`).
* **Form Area**:
  * Individual white cards (`#ffffff`) for each field, surrounded by a clean container card.
  * Input fields with 1px border (`#e2e8f0`), transitioning to primary focus outline on click.
  * Error state: Red outline with inline error message below the field.
* **Footer Navigation**:
  * `PREVIOUS` button (neutral outline or ghost button).
  * `NEXT` / `SUBMIT` button in emerald brand color, disabled when the current section has invalid required fields.

### 3. Summary Screen (`/summary`)
* Centered celebratory card (`max-width: 580px`).
* Top illustration: `cupcake.png` (130px) with **"Awesome!"** and **"It works!"**.
* Q&A list with subtle 1px border-bottom between rows.
* Unanswered fields displayed as muted `not answered`.
* Bottom centered action button: **"Complete the flow and Reset"**.

---

## 3. SCSS Best Practices
- **Never use TailwindCSS**; write clean, modular Vanilla SCSS using variables.
- Maintain responsive breakpoints at `768px` and `600px` for mobile accessibility.
- Use smooth transitions (`transition: all 0.2s ease;`) for hover and focus micro-animations.
- Ensure accessible contrast ratios for all text on colored backgrounds.
