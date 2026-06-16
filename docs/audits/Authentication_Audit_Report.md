# Authentication Audit Report

## Confirmed Findings
- Session persistence is enabled in Supabase client config. Evidence: `src/supabaseClient.ts:13-18`.
- Session restoration depends on a profile lookup and silently returns `null` on failure. Evidence: `src/supabaseAuth.ts:193-206`.
- Authentication is not read-only. Login and registration both call `ensureSupabaseProfile()`, which upserts `profiles`, `lawyer_profiles`, and `lawyer_directory`. Evidence: `src/supabaseAuth.ts:38-103`, `155-168`.
- Lawyer registration UI implies pending verification, but the backend immediately creates active, verified lawyer data. Evidence: `src/components/RegisterPage.tsx:190-234`, `api/auth/register.js:81-118`, `src/supabaseAuth.ts:70-100`.

## Exact Root Causes
- Role synchronization is unsafe because login rewrites the stored profile role using the user-selected login identity before verifying the existing profile. Evidence: `src/supabaseAuth.ts:165-183`.
- Lawyer profile defaults are destructive placeholders. Sign-in can overwrite specialty, description, pricing, verification status, image, languages, certifications, and availability through upsert behavior. Evidence: `src/supabaseAuth.ts:71-100`.
- The runtime registration endpoint sets `status = active` and `verification_status = verified` for lawyers, which conflicts with the UI and original trigger intent in `supabase/migrations/003_auth_profile_trigger.sql`.

## Session and Protected-Route Notes
- The SPA relies on local storage plus in-memory view state rather than route middleware. Evidence: `src/App.tsx:51-60`, `82-97`.
- Protected access can be bypassed in UI-state terms if state is manipulated locally, although many data reads still depend on Supabase access.

## Recommendations
- Stop mutating lawyer business data during sign-in.
- Make lawyer onboarding consistently pending-verification until an explicit admin approval step completes.
- Verify profile role from database first, then compare to requested identity without pre-upserting conflicting defaults.
