# Payment Audit Report

## Confirmed Findings
- Payment creation and invoice retrieval enforce authenticated identity and consultation ownership. Evidence: `api/payments.js:171-190`, `244-266`.
- Payment proof upload auto-verifies the payment immediately on client upload. Evidence: `api/payments.js:322-333`.
- Lawyer/admin verification endpoint also exists and supports approval/rejection. Evidence: `api/payments/verify.js:112-175`.

## Exact Root Causes / Risks
- The client upload path bypasses the stated manual-verification workflow by setting payment status to `paid` immediately after proof upload. Evidence: `api/payments.js:322-333`.
- Consultation unlock is tied directly to that auto-verification, so chat and meetings can open without lawyer/admin review.
- `totalAmount` excludes `platformFee` in computation even though `platform_fee` is populated. Evidence: `api/payments.js:193-208`.
- Public payment-proof storage increases exposure of sensitive artifacts. Evidence: `supabase/migrations/026_unified_production_fix.sql:247-259`.

## Workflow Consistency Findings
- The repository contains both manual-verification schema and automatic verification logic, which conflict operationally.
- Consultation activation is correctly triggered after approval in both auto and manual flows, but the presence of both flows makes auditing difficult.

## Recommendations
- Choose one payment verification model for production. If manual review is required, remove auto-verify-on-upload.
- Reconcile invoice totals with `platform_fee`.
- Keep payment proofs private and gate access through signed URLs or authenticated download handlers.
