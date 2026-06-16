# Bug Fix Report

## Status
- No application code was changed in this audit pass.
- Only audit documentation was generated.

## Critical Bugs Confirmed
- Service-role signaling endpoint lacks participant/state validation.
- Meeting cleanup emits `leave` on every unmount.
- STUN-only WebRTC prevents reliable connection across many real networks.
- Client exit from chat marks consultations `completed`.
- Lawyer login/registration paths can overwrite lawyer data with placeholder defaults.
- Payment proof upload auto-verifies payments despite the repository also modeling manual verification.

## Production-Ready Fix Order
1. Lock down runtime authorization for `calls`, `chat`, and consultation-scoped operations.
2. Fix consultation completion and meeting unmount behavior.
3. Add TURN and WebRTC lifecycle hardening.
4. Remove destructive auth-time lawyer upserts.
5. Reconcile payment verification workflow.
6. Freeze the live Supabase schema path and migrate to one canonical model.
