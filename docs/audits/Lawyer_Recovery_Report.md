# Lawyer Recovery Report

## Confirmed Recovery-Relevant Evidence
- `supabase/migrations/002_runtime_supabase_only.sql` seeds four hard-coded lawyers and uses `on conflict (id) do update`, which can overwrite those records if the same IDs exist.
- `supabase/migrations/013_auto_verify_lawyers.sql` inserts or updates `lawyer_directory` from `profiles` and `lawyer_profiles`, filling defaults such as `Belum diisi`, generic descriptions, default availability, and placeholder certifications.
- `src/supabaseAuth.ts:70-100` and `api/auth/register.js:89-118` also upsert placeholder lawyer records and force `verified` status.
- `supabase/migrations/017_rusdi_and_toliver_schema_v2.sql` explicitly drops lawyer-related tables and then seeds 100 synthetic lawyers.

## Most Likely Root Causes Of Lawyer Data Loss
- Live data was overwritten by compatibility upserts that treat placeholder fields as authoritative.
- Data was replaced or obscured by migration 017 if it was ever run against a populated environment.
- Seed and dummy scripts introduced synthetic lawyer datasets that can visually replace or drown out original production lawyers.

## Git History Finding
- The current repository has only two recent commits available locally, so git history cannot recover pre-migration real lawyer data from this clone alone.

## Recovery Options
- Best source: Supabase backups / point-in-time restore from before migration 017 or before the first destructive upsert run.
- Second-best: query historical `profiles`, `lawyer_profiles`, `lawyer_directory`, and `lawyers` snapshots if backups exist in Supabase.
- Third-best: inspect deployment artifacts, exported SQL dumps, or prior environments.
- Low-confidence fallback: reconstruct minimal profiles from surviving consultations, reviews, payments, and uploaded profile photos.

## Recommendation
- Do not run any further lawyer auto-upserts in production until the canonical lawyer dataset is restored and a non-destructive sync strategy is defined.
