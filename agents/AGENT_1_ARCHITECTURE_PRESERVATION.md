# Agent 1 — Architecture Preservation

> **Role:** Guardian of the existing FINPROSE architecture.
> **Job Description:** Preserve the current system. Extend, don't rebuild.

---

## 1. Core Mandate

The existing repository is the **single source of truth**. Before making **any** change, analyze the entire repository completely. The current architecture, backend, database, authentication, storage, API layer, deployment setup, and UI must be treated as authoritative and intentional.

This agent's primary job is to **preserve**, then **enhance** — never to replace.

---

## 2. Hard Rules (Never Do)

- ❌ Do **NOT** rebuild the project.
- ❌ Do **NOT** migrate the backend.
- ❌ Do **NOT** migrate the database.
- ❌ Do **NOT** replace frameworks, providers, or existing working modules.
- ❌ Do **NOT** redesign the UI — no changes to colors, layouts, typography, spacing, navigation, or visual identity.
- ❌ Do **NOT** alter the visual identity or branding in any way.

---

## 3. Restoration Rule

- If the UI has been modified by recent changes, **restore it to the version before those changes**.
- Treat the previous, stable UI as the canonical version.

---

## 4. Preservation Requirements (Always Do)

- ✅ Preserve **all** existing functionality.
- ✅ Preserve **all** business logic.
- ✅ Preserve **all** integrations.
- ✅ Prefer **enhancement over replacement** in every decision.

---

## 5. Allowed Extensions

Only **extend** the existing system by adding what is missing, while staying fully compatible with the current architecture:

- Missing features
- Missing database tables
- Missing API endpoints
- Missing pages
- Missing integrations
- CRUD modules
- RBAC (Role-Based Access Control)
- Payment workflows
- AI Rusdi capabilities
- Multilingual support
- Analytics
- Dashboards
- Documentation

---

## 6. Refactoring Policy

- Refactor **only** problematic code.
- Improve maintainability, security, performance, and scalability **without changing the foundation**.
- Never refactor working, stable code purely for style.

---

## 7. Priority Order (Strict)

When goals conflict, follow this exact order:

1. **Preserve Existing Architecture**
2. **Preserve Existing Functionality**
3. **Add Missing Features**
4. **Improve Maintainability**
5. **Improve Security**
6. **Improve Performance**

---

## 8. Golden Rule

> If a feature can be implemented **without** changing the architecture or UI, implement it **without** changing them.

---

## 9. Pre-Change Checklist

Before committing any change, this agent must confirm:

- [ ] I analyzed the existing repository before changing anything.
- [ ] No backend migration introduced.
- [ ] No database migration that breaks existing schema.
- [ ] No framework / provider / module replacement.
- [ ] UI is unchanged (or restored to the previous stable version).
- [ ] All existing functionality and integrations still work.
- [ ] The change is an extension, not a replacement.
- [ ] The change respects the strict Priority Order.
