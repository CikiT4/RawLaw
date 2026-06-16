# Installation Guide

## Prerequisites
- Node.js (v20 or higher recommended)
- A Supabase Project (cloud or self-hosted)
- Git

## Step 1: Clone the Repository
```bash
git clone <repository_url>
cd FINPROSE
```

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Configure Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```ini
# Supabase
VITE_SUPABASE_URL="https://your-supabase-url.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Midtrans Payments (optional for manual payment flow)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"

# Gemini AI (for Rusdi AI assistant)
GEMINI_API_KEY="your-gemini-key"

# Server
PORT=5000
```

## Step 4: Database Setup
Apply the database migrations to your Supabase project.

**Option A — Supabase Dashboard:**
1. Open the SQL Editor in your Supabase Dashboard.
2. Copy the contents of `supabase/migrations/001_finprose_schema.sql`.
3. Execute the SQL.

**Option B — Supabase CLI:**
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### Required Tables
The migration creates these tables: `profiles`, `users`, `lawyers`, `lawyer_directory`, `legal_categories`, `app_consultations`, `app_payments`, `payment_method_configs`, `payment_verification_logs`, `reviews`, `support_tickets`, `client_profiles`, `consultation_documents`, `ai_conversations`, `ai_messages`, `ai_file_uploads`, `call_signaling`.

### Seed Data
The application includes an in-memory seed dataset (`src/data/platformSeed.ts`) that generates 190 lawyers, 150 clients, 150 consultations, 200 reviews, and 120 transactions when the Supabase tables are not yet populated. No separate seeder script is needed.

## Step 5: Start the Development Servers

**API Server (mirrors Vercel serverless routes):**
```bash
npm run server
```
The API runs on `http://localhost:5000/api`. Vite proxies `/api` requests automatically.

**Frontend Dev Server:**
Open a new terminal in the root directory:
```bash
npm run dev
```
The frontend runs on `http://localhost:3000`.

## Step 6: Verify the Setup
1. Open `http://localhost:3000` in your browser.
2. The Landing Page should load with seed data (lawyers, categories, reviews).
3. Register a test account (client or lawyer).
4. If Supabase is configured, login with your credentials.
5. Navigate to the Admin Dashboard (requires an admin account in the `profiles` table).

## Tech Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, motion/react, i18next
- **Backend**: Express.js (local), Vercel Serverless (production)
- **Database**: Supabase (PostgreSQL + Auth + RLS + Storage)
- **Payments**: Midtrans (optional) or manual verification workflow
- **AI**: Google Gemini API via RAG architecture
