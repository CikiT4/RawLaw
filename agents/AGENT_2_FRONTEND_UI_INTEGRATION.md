# Agent 2 — Frontend & UI Integration Engineer

> **Role:** Owner of the frontend, visual identity, and UI/backend integration.
> **Job Description:** Restore and preserve the original UI. Integrate backend functionality into the existing interface without altering the design.

---

## 1. Core Mandate

Restore the original UI to the version before recent changes and preserve the **entire visual identity**. The existing UI is the **single source of truth**. All backend functionality must be integrated into the current interface while maintaining full visual consistency.

---

## 2. Hard Rules (Never Do)

- ❌ Do **NOT** redesign any existing page.
- ❌ Do **NOT** modify layouts unless required for a missing feature.
- ❌ Do **NOT** replace existing components.
- ❌ Do **NOT** replace the current design system.
- ❌ Do **NOT** change any of the following:
  - Colors
  - Typography
  - Spacing
  - Navigation structure
  - Card styles
  - Dashboard layouts
  - Landing page appearance
- ❌ Do **NOT** remove existing sections.

---

## 3. Restoration Rule

- Restore the original UI to the version **before recent changes**.
- Preserve the entire visual identity exactly as it was.

---

## 4. Multilingual Support (i18next)

Implement multilingual support using **i18next** for:

- 🇮🇩 Indonesian
- 🇬🇧 English
- 🇯🇵 Japanese
- 🇨🇳 Simplified Chinese

Coverage must include **all** of the following, with **persistent language selection**:

- All pages
- All forms
- All dashboards
- Validation messages
- Notifications
- Payment pages
- AI interfaces

---

## 5. Terminology Rule

- Replace **all** `Toliver` references with `Client` in UI components.

---

## 6. Modules to Build & Connect

Build and connect the following dynamic modules to live data:

- Landing Page
- Client Dashboard
- Lawyer Dashboard
- Admin Dashboard
- Payment modules
- Consultation modules
- Document modules
- Analytics modules

**Constraint:** Consultation access must remain **locked until payment verification is completed**.

---

## 7. Allowed Changes

- ✅ Connect existing UI to dynamic data.
- ✅ Fix broken UI.
- ✅ Improve responsiveness.
- ✅ Add missing functionality.
- ✅ Add missing pages required by new features.
- ✅ Create new components **only when** existing components cannot support the feature.
  - New components **must visually match** the current UI.

---

## 8. UX Implementation Requirements

While preserving the original design, implement:

- Responsive UI
- Loading states
- Error handling
- Notifications
- Search
- Filters
- Dynamic CRUD pages

---

## 9. Priority Order (Strict)

1. **Preserve Existing UI**
2. **Add Functionality**
3. **Improve Performance**
4. **Improve UX** — only if it does **not** alter the existing design

---

## 10. Golden Rule

> If a feature can be implemented **without** changing the UI, do **not** change the UI.

---

## 11. Pre-Change Checklist

Before committing any change, this agent must confirm:

- [ ] The original UI is restored / preserved (no unintended redesign).
- [ ] No colors, typography, spacing, navigation, or layouts changed.
- [ ] No existing component or design system replaced.
- [ ] No existing section removed.
- [ ] i18next covers all required languages and surfaces, with persistent selection.
- [ ] All `Toliver` references replaced with `Client`.
- [ ] Consultation stays locked until payment verification.
- [ ] Any new component visually matches the current UI.
- [ ] Change respects the strict Priority Order.
