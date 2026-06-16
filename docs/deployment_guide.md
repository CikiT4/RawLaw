# Deployment Guide

## Overview
YDA LAW OFFICE & Partners is deployed as a single Vercel project. The React/Vite frontend and all API routes are served from the same Vercel deployment — no separate backend server is needed.

## Architecture
- **Frontend**: Vite SPA served by Vercel
- **API Routes**: Vercel Serverless Functions in `/api/*` directory
- **Database**: Supabase (PostgreSQL + Auth + RLS + Storage)
- **SPA Routing**: Configured in `vercel.json` with rewrites to `index.html`

## 1. Database (Supabase)
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Apply all migrations from `supabase/migrations/` via the SQL Editor or CLI.
3. Enable Authentication providers:
   - Email/Password (enabled by default)
   - Google OAuth (optional — requires Google Cloud Console setup)
4. Verify RLS policies are enabled on all tables.
5. Configure Storage buckets for:
   - `consultation_documents` — uploaded case files
   - `payment_proofs` — payment proof images
   - `chat_uploads` — chat file attachments

## 2. Vercel Deployment
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the project.
3. Vercel auto-detects the Vite framework.
4. Add the following Environment Variables in Vercel project settings:

| Variable | Value | Scope |
|----------|-------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Build + Runtime |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Build + Runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Runtime only |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | Runtime only |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | Runtime only |
| `MIDTRANS_IS_PRODUCTION` | `true` for production | Runtime only |
| `GEMINI_API_KEY` | Google Gemini API key | Runtime only |

5. Click **Deploy**.

### vercel.json Configuration
The `vercel.json` file is already configured with:
- API function routes (`/api/*`)
- SPA fallback rewrites (all non-API routes → `index.html`)
- CORS headers for API routes

## 3. Post-Deployment Checks
1. **Landing Page**: Verify the homepage loads with lawyer categories, top lawyers, reviews, and statistics.
2. **Registration**: Register a new client account and verify email confirmation.
3. **Login Flow**: Test login for each role (client, lawyer, admin).
4. **Consultation Booking**: Book a consultation as a client and verify it appears in the lawyer's dashboard.
5. **Payment Flow**: Create an invoice, select a payment method, and upload proof.
6. **Admin Dashboard**: Log in as admin and verify all tabs (Overview, Lawyers, Payments, Cases, History, Clients, Categories, Reviews, Rusdi AI, Support).
7. **AI Rusdi**: Test the AI assistant with a legal question.
8. **CRUD Operations**: Test create, read, update, and delete operations from the admin dashboard.

## 4. Custom Domain (Optional)
1. In Vercel project settings, add your custom domain.
2. Configure DNS records as instructed by Vercel.
3. Enable HTTPS (automatic via Vercel).

## 5. Monitoring & Logs
- **Vercel Dashboard**: View real-time logs for serverless functions.
- **Supabase Dashboard**: Monitor database queries, auth events, and storage usage.
- **Vercel Analytics**: Enable for performance monitoring (optional).

## 6. Environment-Specific Notes
- **Development**: Uses in-memory seed data when Supabase is not connected.
- **Staging**: Point to a separate Supabase project for testing.
- **Production**: Set `MIDTRANS_IS_PRODUCTION=true` for live payment processing.

## Rollback
Vercel provides instant rollback via the Deployments page. Each deployment is immutable and can be promoted to production at any time.
