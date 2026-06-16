# Repository Architecture Report

## Scope
- Audit date: 2026-06-16
- Source of truth: current repository state in `F:\FINPROSE`
- Validation methods: static code review, migration review, git history review, `npm.cmd run build`, `npm.cmd run lint`

## Current Architecture
- Frontend: React + Vite SPA with view-state routing in `src/App.tsx`.
- Auth/data client: Supabase JS in `src/supabaseClient.ts` and `src/supabaseAuth.ts`.
- Runtime API: lightweight Node handlers under `api/` using service-role REST helpers in `api/_runtime.js`.
- Database model: mixed legacy/runtime compatibility layer using `app_*` resources alongside normalized `users/lawyers/consultations/transactions` resources introduced by `supabase/migrations/017_rusdi_and_toliver_schema_v2.sql`.

## Confirmed Architectural Findings
- The repository currently depends on a dual-schema compatibility strategy instead of a single stable schema. Evidence: `src/api.ts`, `api/_runtime.js`, `supabase/migrations/017_rusdi_and_toliver_schema_v2.sql`, `024_manual_payment_system.sql`, `026_unified_production_fix.sql`.
- Meeting, chat, payment, and AI flows are not consistently enforced through authenticated runtime endpoints. Some paths validate bearer tokens, while others accept client-supplied identifiers and write with the service role. Evidence: `api/consultations/status.js` versus `api/calls.js` and `api/chat.js`.
- The frontend uses local view state rather than URL-driven protected routes. This simplifies the demo flow but weakens deep-link resilience, session restoration behavior, and forensic traceability for meeting transitions. Evidence: `src/App.tsx:79-428`.

## Exact Root Causes Behind Instability
- Schema drift is an architectural root cause. The codebase supports both legacy physical tables and normalized v2 tables/views, so behavior depends on which migration path a Supabase project actually applied.
- Service-role runtime handlers bypass RLS by design and therefore must perform explicit authorization. Several do not.
- Auth bootstrap code mutates profile and lawyer records on login and registration, making authentication a write-heavy path instead of a read-mostly path.

## Production Recommendations
- Freeze the target production schema and remove mixed-path fallbacks after a one-time migration audit.
- Require bearer-token identity checks on every runtime endpoint that reads or writes consultation-scoped data.
- Move profile/lawyer bootstrap into controlled server-side provisioning and stop rewriting business data during sign-in.
- Add observability for call signaling, consultation transitions, payment status transitions, and AI persistence failures.

## Verification Notes
- `npm.cmd run build` passed.
- `npm.cmd run lint` passed.
- No end-to-end browser/device matrix could be executed from this environment, so runtime compatibility findings outside build/type safety remain code-audit based.
