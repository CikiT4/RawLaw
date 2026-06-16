# Database Documentation

## Architecture
YDA LAW OFFICE & Partners uses Supabase (PostgreSQL) as its primary relational database. Row Level Security (RLS) is strictly enforced across all tables to ensure data privacy. All tables use UUID primary keys linked to `auth.users` where applicable.

## Core Tables

### 1. `profiles`
Stores extended user data. Created automatically via trigger when a Supabase Auth user is created.
- `id` (UUID, PK) — Maps to auth.users.id
- `full_name` (text) — Display name
- `email` (text) — User email
- `phone` (text, nullable) — Phone number
- `role` (text) — `admin`, `lawyer`, or `client`
- `status` (text) — `active`, `blocked`, `suspended`
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 2. `users`
Application-level user status tracking.
- `id` (UUID, PK, FK to profiles)
- `status` (text) — `active`, `suspended`, `blocked`
- `created_at`, `updated_at`

### 3. `lawyer_directory` (View / Table mapping)
Stores lawyer-specific public data for the directory.
- `user_id` (UUID, PK, FK to profiles)
- `name` (text) — Lawyer display name
- `specialty` (text) — Legal specialization
- `experience_years` (int) — Years of practice
- `consultation_price` (int) — Fee in IDR
- `verification_status` (text) — `pending`, `verified`, `rejected`, `suspended`
- `rating` (numeric) — Average rating from reviews

### 4. `lawyers`
Lawyer verification and profile data.
- `id` (UUID, PK, FK to profiles)
- `verification_status` (text)
- `specialty`, `experience_years`, `consultation_price`
- `created_at`, `updated_at`

### 5. `legal_categories`
Legal practice categories available on the platform.
- `id` (UUID, PK)
- `name` (text) — Category name (e.g., "Hukum Pidana", "Hukum Perdata")
- `description` (text, nullable) — Brief description
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 6. `app_consultations`
Tracks the lifecycle of a legal case between a Client and a Lawyer.
- `id` (UUID, PK)
- `client_id` (UUID, FK to profiles)
- `lawyer_id` (UUID, FK to lawyer_directory)
- `consultation_type` (text) — `online`, `offline`, `video`
- `scheduled_day` (text, nullable) — Scheduled day
- `scheduled_time` (text, nullable) — Scheduled time slot
- `status` (text) — `pending`, `paid`, `ongoing`, `in_review`, `completed`, `cancelled`, `expired`
- `price` (int) — Consultation fee in IDR
- `notes` (text, nullable) — Additional notes
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 7. `app_payments`
Tracks payment transactions for consultations.
- `id` (UUID, PK)
- `consultation_id` (UUID, FK to app_consultations)
- `client_id` (UUID, FK to profiles)
- `amount` (int) — Base amount
- `admin_fee` (int) — Admin processing fee
- `tax_amount` (int) — Tax component
- `platform_fee` (int) — Platform fee
- `total_amount` (int) — Final total
- `method` (text) — Payment method (bank_transfer, e_wallet, qris)
- `payment_sub_method` (text, nullable) — Specific bank/wallet
- `provider` (text, nullable) — Payment provider
- `status` (text) — `pending`, `waiting_verification`, `paid`, `failed`, `rejected`, `expired`, `refunded`
- `invoice_number` (text) — Generated invoice ID
- `payment_reference` (text, nullable)
- `payment_proof_url` (text, nullable) — URL to uploaded proof
- `proof_uploaded_at` (timestamptz, nullable)
- `due_date` (timestamptz, nullable)
- `external_reference` (text, nullable)
- `paid_at` (timestamptz, nullable)
- `verified_by` (UUID, nullable) — Admin who verified
- `verified_at` (timestamptz, nullable)
- `rejection_reason` (text, nullable)
- `created_at` (timestamptz)

### 8. `payment_method_configs`
Configuration for available payment methods.
- `id` (UUID, PK)
- `display_name` (text) — e.g., "Bank Transfer BCA"
- `account_name` (text) — Account holder name
- `account_number` (text) — Account number
- `phone_number` (text, nullable) — For e-wallet methods
- `method` (text) — bank_transfer, e_wallet, qris
- `is_active` (boolean)
- `sort_order` (int)
- `created_at`, `updated_at`

### 9. `payment_verification_logs`
Audit trail for payment verification actions.
- `id` (UUID, PK)
- `transaction_id` (UUID, FK to app_payments)
- `actor_id` (UUID, FK to profiles)
- `actor_role` (text) — `admin`, `lawyer`
- `action` (text) — `override_approved`, `override_rejected`
- `notes` (text, nullable)
- `created_at` (timestamptz)

### 10. `reviews`
Client reviews for lawyers upon consultation completion.
- `id` (UUID, PK)
- `consultation_id` (UUID, FK to app_consultations)
- `client_id` (UUID, FK to profiles)
- `lawyer_id` (UUID, FK to lawyer_directory)
- `rating` (int) — 1 to 5
- `comment` (text)
- `created_at` (timestamptz)

### 11. `support_tickets`
Client support requests.
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `subject` (text)
- `message` (text) — Includes admin replies appended
- `status` (text) — `open`, `resolved`, `closed`
- `priority` (text) — `low`, `medium`, `high`
- `created_at`, `updated_at`

### 12. `client_profiles`
Extended client-specific data.
- `id` (UUID, PK, FK to profiles)
- `address` (text, nullable)
- `date_of_birth` (date, nullable)
- `emergency_contact` (text, nullable)

### 13. `consultation_documents`
Files uploaded during consultations.
- `id` (UUID, PK)
- `consultation_id` (UUID, FK to app_consultations)
- `uploader_id` (UUID, FK to profiles)
- `file_name` (text)
- `file_url` (text) — Supabase Storage URL
- `mime_type` (text)
- `file_size` (int)
- `created_at` (timestamptz)

### 14. AI Subsystem (`ai_conversations`, `ai_messages`, `ai_file_uploads`)
Manages the memory and context for AI Rusdi.
- `ai_conversations` — Chat sessions linked to a Client
  - `id` (UUID, PK), `user_id` (UUID, FK), `title`, `created_at`, `updated_at`
- `ai_messages` — Individual messages within a conversation
  - `id` (UUID, PK), `conversation_id` (UUID, FK), `role` (user/assistant), `content`, `created_at`
- `ai_file_uploads` — Documents uploaded for RAG analysis
  - `id` (UUID, PK), `conversation_id` (UUID, FK), `file_url`, `extracted_text`, `created_at`

### 15. `call_signaling`
WebRTC signaling data for video/voice calls.
- `id` (UUID, PK)
- `consultation_id` (UUID, FK to app_consultations)
- `caller_id` (UUID, FK to profiles)
- `callee_id` (UUID, FK to profiles)
- `offer_sdp`, `answer_sdp` (text, nullable)
- `status` (text) — `initiated`, `accepted`, `rejected`, `ended`
- `created_at`, `updated_at`

## Security (RLS)
- **Clients** can only read/write their own consultations, payments, documents, and AI chats.
- **Lawyers** can only read/write consultations assigned to them and their own profile data.
- **Admins** bypass RLS policies or have explicit full-access policies.
- All tables have RLS enabled by default.
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and is only used server-side (never exposed to the client).

## Views
- `admin_pending_lawyers` — Joins `lawyers`, `profiles` for pending verification queue.
- `admin_clients` — Joins `profiles` filtered to role=client for admin management.
