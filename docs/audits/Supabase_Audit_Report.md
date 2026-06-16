# Supabase Audit Report

## Schema State
- The repo contains multiple schema eras: early legacy tables (`profiles`, `lawyer_profiles`, `consultations`, `payments`), runtime compatibility tables (`lawyer_directory`, `app_consultations`, `app_payments`, `app_chat_sessions`, `app_messages`), and normalized v2 tables/views (`users`, `lawyers`, `consultations`, `transactions`) from migration 017.

## Confirmed Supabase Risks
- Migration `017_rusdi_and_toliver_schema_v2.sql` drops core tables, views, triggers, and types before recreating a new model. This is a data-destructive migration if applied to a live environment without backup/transform steps.
- Later migrations reintroduce compatibility views and production patches, meaning final runtime behavior depends on migration order and environment history, not just current code.
- Service-role runtime endpoints bypass RLS entirely. RLS therefore does not protect runtime handlers unless those handlers perform their own authorization checks.

## RLS Findings
- `call_signals` RLS exists, but is ineffective for `api/calls.js` because the runtime uses the service role.
- `app_chat_sessions` and `app_messages` RLS exists, but `api/chat.js` also bypasses it with the service role.
- `payment_verification_logs` policies change materially across `024`, `025`, and `026`, indicating production drift was already being patched after the fact.

## Storage Findings
- `legal-documents`, `profile-photos`, and `payment-proofs` buckets are defined in migrations.
- `payment-proofs` is made public in `026_unified_production_fix.sql:247-259`, which is acceptable for demo simplicity but weak for sensitive payment artifacts.

## Environment Findings
- `.env.example` requires both `VITE_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY`.
- If service-role configuration is wrong, runtime APIs fail broadly because nearly all server endpoints depend on `supabaseRest()`.

## Recommendations
- Establish one canonical schema path and snapshot the live database before any further migration work.
- Move sensitive consultation/chat/call operations away from generic service-role REST passthroughs.
- Audit storage public/private exposure for payment proofs and profile media.
