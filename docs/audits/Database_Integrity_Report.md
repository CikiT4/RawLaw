# Database Integrity Report

## Confirmed Integrity Risks
- Mixed legacy and normalized schemas create high risk of orphaned or logically inconsistent records because the application can target views, physical tables, or fallback alternatives depending on environment state.
- `call_signals` has no lifecycle retention or archival strategy; the table is append-only.
- Chat, payment, and consultation logs depend on compatibility views in some schema paths, which can hide underlying relationship issues.

## Concrete Risk Areas
- `app_consultations` may be a physical table in older schema paths or a compatibility view over `consultations` in v2 paths.
- `app_payments` may be a physical table or a view over `transactions`.
- `lawyer_directory` may be a physical table or a view over `lawyers` + `profiles`.

## Orphan/Data Drift Vectors
- Migration 017 drops and recreates tables, which can sever historical foreign-key continuity unless a controlled data migration preceded it.
- Auth/bootstrap upserts can repopulate placeholder lawyer rows after schema migrations, creating semantically invalid but referentially valid records.
- `014_hide_seed_lawyers.sql` suspends hard-coded seed IDs only if matching profiles do not exist; if profiles do exist, seeded lawyers can remain active and be mistaken for real records.

## What Could Not Be Fully Verified Here
- Live orphan counts, broken FK counts, and missing bucket objects require a connected production Supabase inspection.
- The repo contains audit scripts for live runtime checks, but they require environment credentials and a reachable Supabase project.

## Recommendations
- Run live FK/orphan audits against production before any cleanup.
- Inventory whether `lawyer_directory`, `app_consultations`, and `app_payments` are tables or views in the live project.
- Add retention/cleanup for `call_signals` and chat artifacts.
