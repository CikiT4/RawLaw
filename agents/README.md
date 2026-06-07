# YDA LAW OFFICE & Partners — Agents

This folder contains the job descriptions (jobdesc) for each specialized agent working on the YDA LAW OFFICE & Partners platform. Each agent has its own file and a focused responsibility. All agents share one overarching principle: **preserve the existing architecture and UI; extend, don't rebuild.**

---

## Agent Roster

| #   | Agent                                    | File                                                                             | Responsibility                                                                                  |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Architecture Preservation                | [`AGENT_1_ARCHITECTURE_PRESERVATION.md`](./AGENT_1_ARCHITECTURE_PRESERVATION.md) | Guard the existing architecture, backend, database, and integrations. Extend without replacing. |
| 2   | Frontend & UI Integration Engineer       | [`AGENT_2_FRONTEND_UI_INTEGRATION.md`](./AGENT_2_FRONTEND_UI_INTEGRATION.md)     | Restore & preserve the original UI, i18next multilingual support, connect modules to live data. |
| 3   | AI Rusdi, QA & Critical Bug Fix Engineer | [`AGENT_3_RUSDI_QA_BUGFIX.md`](./AGENT_3_RUSDI_QA_BUGFIX.md)                     | Finalize Rusdi AI, run full QA, and resolve the critical "Failed to Fetch" payment bug.         |

---

## Shared Principles

1. **Preserve first.** The existing repository, architecture, and UI are the source of truth.
2. **Extend, don't rebuild.** Add missing features without replacing working modules.
3. **No UI redesign.** Keep colors, typography, spacing, layouts, and navigation intact.
4. **Resolve bugs before new features.** No temporary fixes — root-cause everything.
5. **Strict priority order.** Each agent follows its defined priority order when goals conflict.

---

## How to Use

When starting a task, assign it to the relevant agent and follow that agent's:

- Hard Rules (what to never do)
- Allowed Changes / Scope
- Priority Order
- Pre-Change / Pre-Completion Checklist
