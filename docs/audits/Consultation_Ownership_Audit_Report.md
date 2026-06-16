# Consultation Ownership Audit Report

## Confirmed Findings
- Frontend client gating checks payment state, but frontend lawyer gating is overly broad. `canAccessView()` allows any lawyer to enter `chat` and `meeting` views. Evidence: `src/utils/accessControl.ts:168-170`.
- Backend consultation status updates do verify participant membership. Evidence: `api/consultations/status.js:12-38`.
- Call signaling does not verify participant membership, consultation ownership, payment status, or consultation active state. Evidence: `api/calls.js:19-38`.
- Chat session creation and message send logic verify paid consultation only for non-lawyers, but do not verify participant identity at the runtime layer. Evidence: `api/chat.js:28-47`, `81-99`.

## Exact Access-Control Risks
- A user who knows a valid `consultationId` can interact with `api/calls.js` because the runtime handler uses the service role and trusts request body identifiers.
- Any lawyer can open a meeting-capable UI from the SPA if local app state routes them there.
- Meetings are not explicitly locked to `status = active/ongoing`; the effective gate is `paid|ongoing|in_review` or paid payment presence in `src/api.ts:57-64`.

## Recommendations
- Require authenticated user resolution on `api/calls.js` and `api/chat.js`, then compare against consultation `client_id/lawyer_id`.
- Enforce consultation state requirements server-side before chat, ring, offer, answer, candidate, and leave actions.
- Replace broad lawyer frontend access with consultation-scoped access checks.
