# YDA LAW OFFICE & Partners

**Digital Legal Consultation Platform** — Connecting clients with verified lawyers through AI-powered case analysis, real-time consultation, and secure payment workflows.

> Think of it as "Halodoc for Legal Services" — clients discover lawyers, book consultations, pay securely, consult via chat/video/phone, manage legal documents, and track case progress. The AI assistant **Rusdi** provides free initial case analysis and lawyer recommendations powered by RAG and Google Gemini.

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vite.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Authorization & RBAC](#authorization--rbac)
- [Client Workflow](#client-workflow)
- [Lawyer Workflow](#lawyer-workflow)
- [Admin Workflow](#admin-workflow)
- [Rusdi AI Workflow](#rusdi-ai-workflow)
- [Payment Workflow](#payment-workflow)
- [Consultation Workflow](#consultation-workflow)
- [Video Call Workflow](#video-call-workflow)
- [File Upload Workflow](#file-upload-workflow)
- [Notification Workflow](#notification-workflow)
- [API Documentation](#api-documentation)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Supabase Setup](#supabase-setup)
- [Build & Deployment](#build--deployment)
- [Production Configuration](#production-configuration)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)
- [Known Issues](#known-issues)
- [Contribution Guide](#contribution-guide)
- [License](#license)

---

## Project Overview

### What is YDA LAW OFFICE & Partners?

YDA LAW OFFICE & Partners is a full-stack digital legal consultation platform designed for the Indonesian legal market. It bridges the gap between clients seeking legal assistance and verified lawyers offering consultation services across 10 legal specializations.

### Purpose

- Democratize access to legal consultation through technology
- Provide AI-powered initial case analysis before engaging a lawyer
- Enable secure, transparent booking and payment workflows
- Support remote consultation via chat, video call, and phone
- Maintain audit trails and document management for legal cases

### Target Users

| Role | Description |
|------|-------------|
| **Client (Klien)** | Individuals or businesses seeking legal assistance. Browse lawyers, use Rusdi AI for free case analysis, book and pay for consultations. |
| **Lawyer (Advokat)** | Verified legal professionals offering consultation services. Manage schedules, accept consultations, communicate with clients, and track earnings. |
| **Admin** | Platform operators managing lawyer verification, payment verification, user accounts, and platform configuration. |

### Legal Consultation Specializations

Criminal Lawyer, Civil Lawyer, Family Lawyer, Labor Lawyer, Tax Lawyer, Corporate Lawyer, Cyber Crime Lawyer, Intellectual Property Lawyer, Land Dispute Lawyer, Immigration Lawyer.

---

## Features

### Core Features

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Lawyer Discovery** | Browse, filter, and view verified lawyer profiles with ratings, reviews, pricing, and availability | Public |
| **Rusdi AI Assistant** | AI-powered legal case analysis, brainstorming, lawyer recommendations via RAG + Gemini | Authenticated (Free) |
| **Consultation Booking** | Book consultations by type (chat/video/phone), schedule, and case notes | Authenticated |
| **Manual Payment System** | Bank transfer, e-wallet, QRIS payment with proof upload and admin/lawyer verification | Authenticated |
| **Real-time Chat** | Consultation chat between client and lawyer with file sharing | Paid Consultation |
| **Video/Voice Calls** | WebRTC-based video and voice calls during active consultations | Paid Consultation |
| **Document Vault** | Secure storage for legal documents, consultation attachments | Authenticated |
| **Review System** | Client reviews with ratings (1-5) and tags after consultation completion | Post-consultation |
| **Multi-language UI** | Indonesian, English, Japanese, Chinese (i18next) | Global |
| **Role-based Dashboards** | Separate dashboards for Client, Lawyer, and Admin | Authenticated |
| **Profile Management** | Avatar upload, profile editing, lawyer professional settings | Authenticated |
| **Case History** | Track all consultation history, statuses, and associated documents | Authenticated |
| **Support Tickets** | Client support system with admin reply capability | Authenticated |

### AI Features (Rusdi)

| Feature | Description |
|---------|-------------|
| **Case Analysis** | Analyzes legal problems using structured format (summary, legal field, basis, steps, risks) |
| **Lawyer Recommendation** | Recommends up to 3 matching lawyers based on case analysis |
| **Knowledge Base RAG** | Retrieves relevant legal information from Indonesian legal knowledge base |
| **File Analysis** | Accepts document uploads for context-aware legal analysis |
| **Conversation History** | Persists and retrieves past AI conversations |
| **Multi-language AI** | Responds in Indonesian, English, Japanese, or Chinese |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI framework |
| Vite | 6.2 | Build tool & dev server |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 4.1 | Utility-first styling |
| Motion (Framer Motion) | 12.23 | Animations |
| Lucide React | 0.546 | Icon library |
| i18next | 26.3 | Internationalization (id/en/ja/zh) |
| react-i18next | 17.0 | React i18n bindings |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.21 | Local API server |
| Node.js | 22.x | Runtime |
| Supabase JS | 2.105 | Database client & auth |
| Google GenAI | 1.29 | Gemini AI integration |
| pg (PostgreSQL) | 8.20 | Direct DB access (optional) |
| dotenv | 17.2 | Environment management |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Supabase | PostgreSQL database, Auth, Storage, RLS |
| Vercel | Frontend hosting & serverless API |
| Google Gemini 2.5 Flash | AI inference (Rusdi AI) |

### Mobile (In Development)

| Technology | Purpose |
|------------|---------|
| Expo (React Native) | Cross-platform mobile app |
| NativeWind | Tailwind CSS for React Native |

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Web Browser<br/>(React SPA)"]
        Mobile["Mobile App<br/>(Expo/RN)"]
    end

    subgraph Frontend["Frontend (Vite)"]
        App["React 19 App"]
        i18n["i18next (id/en/ja/zh)"]
        Auth["Supabase Auth Client"]
        API["API Client Layer"]
        WebRTC["WebRTC Signaling"]
        RusdiUI["Rusdi AI Chat UI"]
    end

    subgraph API["API Layer"]
        Vercel["Vercel Serverless<br/>/api/*"]
        Express["Express Server<br/>(local dev :5000)"]
    end

    subgraph Services["Service Layer"]
        Payment["Payment Service"]
        RusdiAPI["Rusdi AI API"]
        ChatAPI["Chat API"]
        CallAPI["Call Signaling API"]
        AdminAPI["Admin API"]
        RegisterAPI["Registration API"]
        ReviewAPI["Review API"]
    end

    subgraph AI["AI Engine"]
        Gemini["Google Gemini<br/>2.5 Flash"]
        RAG["RAG Pipeline<br/>knowledge_base"]
        Embeddings["Document Chunking<br/>& Embeddings"]
    end

    subgraph Database["Supabase"]
        PG["PostgreSQL"]
        Storage["Supabase Storage"]
        AuthSB["Supabase Auth"]
        RLS["Row Level Security"]
        Views["Compatibility Views"]
    end

    subgraph StorageBuckets["Storage Buckets"]
        LegalDocs["legal-documents"]
        ProfilePhotos["profile-photos"]
        PaymentProofs["payment-proofs"]
    end

    Browser --> App
    Mobile --> App
    App --> i18n
    App --> Auth
    App --> API
    App --> WebRTC
    App --> RusdiUI
    API --> Vercel
    API --> Express
    Vercel --> Services
    Express --> Services
    Payment --> PG
    ChatAPI --> PG
    CallAPI --> PG
    AdminAPI --> PG
    RegisterAPI --> AuthSB
    ReviewAPI --> PG
    RusdiAPI --> Gemini
    RusdiAPI --> RAG
    RAG --> PG
    Embeddings --> PG
    PG --> RLS
    PG --> Views
    Storage --> StorageBuckets
    Auth --> AuthSB
```

---

## Folder Structure

```
FINPROSE/
├── api/                          # Vercel serverless API handlers
│   ├── _runtime.js              # Shared runtime utilities (Supabase REST, helpers)
│   ├── admin.js                 # Admin operations (CRUD users, payments, categories)
│   ├── ai-chat.js               # Legacy AI chat endpoint
│   ├── ai-case-analysis.js      # AI case analysis
│   ├── ai-lawyer-recommendation.js  # AI lawyer recommendation
│   ├── auth/
│   │   └── register.js          # Auth registration
│   ├── calls.js                 # WebRTC call signaling
│   ├── chat.js                  # Consultation chat (sessions & messages)
│   ├── consultations/
│   │   └── status.js            # Consultation status updates
│   ├── geminiClient.js          # Gemini API client wrapper
│   ├── health.js                # Health check endpoint
│   ├── lawyer/
│   │   └── consultations.js     # Lawyer consultation management
│   ├── paymentConfig.js         # Payment method configuration
│   ├── payments.js              # Payment invoice creation & proof upload
│   ├── payments/
│   │   ├── invoices.js          # Invoice retrieval
│   │   └── verify.js            # Payment verification (approve/reject)
│   ├── register.js              # User registration
│   ├── reviews.js               # Review submission & management
│   └── rusdi/
│       ├── chat.js              # Rusdi AI chat (Gemini + RAG)
│       ├── case-analysis.js     # AI case analysis via Rusdi
│       └── lawyer-recommendation.js  # AI lawyer recommendation via Rusdi
├── apps/
│   └── mobile/                  # Expo React Native mobile app (in development)
├── backend/                     # Optional Go backend
│   ├── main.go
│   └── go.sum
├── data/
│   └── knowledge-base/          # CSV datasets for Rusdi RAG pipeline
├── dist/                        # Production build output
├── docs/                        # Documentation & reports
├── agents/                      # AI agent job descriptions
├── public/                      # Static assets (images, SVGs)
├── scripts/
│   ├── seed-platform-data.mjs   # Platform seed data
│   └── dev/                     # Dev utilities (seed, test, setup)
├── src/                         # React SPA source
│   ├── ai/
│   │   ├── prompts/
│   │   │   └── systemPrompt.ts  # Rusdi system prompt template
│   │   └── services/
│   │       ├── ChatService.ts   # AI chat orchestration
│   │       ├── FileAnalyzer.ts  # Document analysis
│   │       ├── MemoryService.ts # Conversation memory
│   │       ├── RecommendationService.ts  # Lawyer recommendation
│   │       ├── RetrievalService.ts       # RAG retrieval
│   │       └── VectorStore.ts   # Vector embedding store
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIChat.tsx       # AI chat interface
│   │   │   ├── AIChatHistory.tsx # Chat history sidebar
│   │   │   ├── AIInput.tsx      # Message input with file upload
│   │   │   ├── AIMessage.tsx    # Message bubble component
│   │   │   ├── AIWidget.tsx     # Floating AI widget
│   │   │   └── RusdiWidget.tsx  # Rusdi floating chat widget
│   │   ├── AdminDashboard.tsx   # Admin panel (verify lawyers, payments, users)
│   │   ├── BookingPage.tsx      # Consultation booking (type, schedule, notes)
│   │   ├── CaseHistoryPage.tsx  # Client case history
│   │   ├── ChatPage.tsx         # Consultation chat room
│   │   ├── ClientDashboard.tsx  # Client main dashboard
│   │   ├── DocumentVaultPage.tsx # Document management
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── GlobalLanguageSwitcher.tsx # Language switcher (4 languages)
│   │   ├── HelpPage.tsx
│   │   ├── LandingPage.tsx      # Public landing page
│   │   ├── LawyerDashboard.tsx  # Lawyer dashboard
│   │   ├── LawyerDetail.tsx     # Lawyer profile detail page
│   │   ├── LawyerList.tsx       # Lawyer directory listing
│   │   ├── LawyerProfileSettingsPage.tsx # Lawyer profile settings
│   │   ├── LoginPage.tsx        # Login page
│   │   ├── MeetingPage.tsx      # WebRTC video/voice call
│   │   ├── OTPVerificationPage.tsx
│   │   ├── PaymentPage.tsx      # Payment flow (method, proof, invoice)
│   │   ├── ProfileSettingsPage.tsx # Client profile settings
│   │   ├── RegisterPage.tsx     # Registration page
│   │   └── ReviewPage.tsx       # Post-consultation review
│   ├── data/
│   │   └── platformSeed.ts      # Demo seed data
│   ├── locales/
│   │   ├── id/translation.json  # Indonesian
│   │   ├── en/translation.json  # English
│   │   ├── ja/translation.json  # Japanese
│   │   └── zh/translation.json  # Chinese
│   ├── pages/
│   │   └── RusdiPage.tsx        # Full-page Rusdi AI chat
│   ├── services/
│   │   ├── caseAnalyzer.ts      # Case analysis service
│   │   ├── chatService.ts       # Chat service
│   │   ├── geminiService.ts     # Gemini API client
│   │   ├── lawyerRecommendation.ts # Lawyer recommendation service
│   │   └── platformData.ts      # Platform data service
│   ├── utils/
│   │   ├── accessControl.ts     # View & feature access control
│   │   ├── monitoring.ts        # Error monitoring
│   │   └── promptBuilder.ts     # AI prompt construction
│   ├── api.ts                   # Central API client (all HTTP calls)
│   ├── App.tsx                  # Main app component (view router)
│   ├── constants.ts             # Brand name, categories, languages
│   ├── i18n.ts                  # i18next configuration
│   ├── index.css                # Global styles (Tailwind)
│   ├── main.tsx                 # React entry point
│   ├── supabaseAuth.ts          # Auth utilities (sign up/in/out)
│   ├── supabaseClient.ts        # Supabase client initialization
│   └── types.ts                 # TypeScript type definitions
├── supabase/
│   └── migrations/              # 28 SQL migration files (001-028)
├── server.js                    # Local Express API server
├── vite.config.ts               # Vite configuration
├── vercel.json                  # Vercel deployment config
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## Database Design

### Entity-Relationship Diagram

```mermaid
erDiagram
    auth_users ||--|| users : "maps to"
    users ||--|| profiles : "has"
    users ||--o| lawyers : "is (if lawyer)"
    users ||--o{ consultations : "books (as client)"
    lawyers ||--o{ consultations : "handles"
    categories ||--o{ lawyer_specializations : "groups"
    lawyers ||--o{ lawyer_specializations : "specializes in"
    lawyers ||--o{ lawyer_availability : "available at"
    consultations ||--o{ consultation_documents : "has documents"
    consultations ||--o| appointments : "scheduled as"
    consultations ||--o{ reviews : "receives"
    consultations ||--o{ transactions : "paid via"
    users ||--o{ transactions : "pays"
    transactions ||--o{ payment_verification_logs : "audit trail"
    payment_method_configs }o--|| transactions : "configures"
    users ||--o{ notifications : "receives"
    users ||--o{ ai_conversations : "owns"
    ai_conversations ||--o{ ai_messages : "contains"
    ai_conversations ||--o{ ai_file_uploads : "uploads"
    ai_file_uploads ||--o| ai_file_analysis : "analyzed by"
    ai_conversations ||--o{ ai_document_chunks : "chunked docs"
    ai_document_chunks ||--o{ ai_embeddings : "embeddings"
    users ||--o{ audit_logs : "performs"
    users ||--o{ reports : "generates"
    files ||--o{ lawyer_documents : "linked"
    files ||--o{ client_documents : "linked"
    files ||--o{ profile_media : "avatar"
    files ||--o{ transaction_attachments : "proof"
    knowledge_base }o--|| ai_document_chunks : "RAG source"
    consultations ||--o{ app_chat_sessions : "has chat"
    app_chat_sessions ||--o{ app_messages : "messages"
    consultations ||--o{ call_signals : "signaling"
    consultations ||--o{ consultation_status_logs : "status history"
    support_tickets }o--|| users : "filed by"
    legal_categories ||--o{ consultations : "categorizes"

    users {
        uuid id PK
        text email UK
        app_role role "toliver|lawyer|admin"
        account_status status "active|pending_verification|suspended|blocked"
        timestamptz created_at
        timestamptz updated_at
    }

    profiles {
        uuid id PK,FK
        text full_name
        text email
        text phone
        text role
        text status
        text avatar_url
        text bio
        text address
        text identity_number
        date date_of_birth
        text emergency_contact
    }

    lawyers {
        uuid id PK,FK
        text bio
        int experience_years
        int consultation_fee
        numeric rating "3,2"
        int review_count
        boolean is_online
        verification_status verification_status
    }

    categories {
        uuid id PK
        text name UK
        text description
        text icon_url
    }

    lawyer_specializations {
        uuid lawyer_id PK,FK
        uuid category_id PK,FK
    }

    lawyer_availability {
        uuid id PK
        uuid lawyer_id FK
        text day
        time start_time
        time end_time
    }

    consultations {
        uuid id PK
        uuid client_id FK "toliver_id"
        uuid lawyer_id FK
        uuid category_id FK
        text consultation_type "chat|video|voice"
        text meeting_mode "virtual|in_person"
        date scheduled_date
        time scheduled_time
        int duration_minutes
        text status "pending|paid|ongoing|in_review|completed|cancelled|expired"
        int price
        text notes
    }

    transactions {
        uuid id PK
        uuid consultation_id FK
        uuid client_id FK "toliver_id"
        int amount
        int admin_fee
        int tax_amount
        int platform_fee
        int total_amount
        text method "bank_transfer|ewallet|qris"
        text payment_sub_method
        text provider
        text status "pending|waiting_payment|waiting_verification|paid|rejected|expired|refunded"
        text invoice_number
        text payment_reference
        text payment_proof_url
        uuid verified_by FK
        timestamptz paid_at
        timestamptz due_date
    }

    reviews {
        uuid id PK
        uuid consultation_id FK
        uuid client_id FK "toliver_id"
        uuid lawyer_id FK
        int rating "1-5"
        text comment
        jsonb tags
    }

    ai_conversations {
        uuid id PK
        uuid user_id FK
        text title
        boolean is_archived
        timestamptz created_at
        timestamptz updated_at
    }

    ai_messages {
        uuid id PK
        uuid conversation_id FK
        text role "user|assistant"
        text content
        timestamptz created_at
    }

    ai_file_uploads {
        uuid id PK
        uuid conversation_id FK
        uuid user_id FK
        text name
        text file_url
        text file_type
        text extracted_text
        jsonb analysis_results
        text analysis_status
    }

    app_chat_sessions {
        uuid id PK
        uuid consultation_id FK
        uuid client_id FK
        uuid lawyer_id FK
        text status "active|completed"
    }

    app_messages {
        uuid id PK
        uuid chat_session_id FK
        uuid sender_id FK
        text sender_role
        text content
        text attachment_url
        text message_type "text|file|image|voice"
    }

    call_signals {
        uuid id PK
        uuid consultation_id FK
        uuid sender_id FK
        text sender_role
        text signal_type "ring|offer|answer|candidate|leave"
        jsonb payload
    }

    files {
        uuid id PK
        text original_name
        text stored_name
        text mime_type
        bigint file_size
        text storage_path
        text public_url
        uuid uploaded_by FK
        text entity_type
        uuid entity_id
        text status
    }

    knowledge_base {
        uuid id PK
        text category
        text content
        tsvector fts_content "generated"
    }

    payment_method_configs {
        uuid id PK
        text method_type "bank_transfer|ewallet|qris"
        text provider_code
        text display_name
        text account_name
        text account_number
        boolean is_active
    }

    payment_verification_logs {
        uuid id PK
        uuid transaction_id FK
        uuid actor_id FK
        text actor_role "lawyer|admin|client|system"
        text action "approved|rejected|proof_submitted|auto_verified"
        text notes
    }

    support_tickets {
        uuid id PK
        uuid user_id FK
        text subject
        text message
        text status "open|resolved|closed"
        text priority "normal|high|urgent"
    }

    consultation_status_logs {
        uuid id PK
        uuid consultation_id FK
        uuid actor_id FK
        consultation_status old_status
        consultation_status new_status
        text note
    }
```

### Core Tables (17 Normalized)

| # | Table | Purpose | Key Columns |
|---|-------|---------|-------------|
| 1 | `users` | User accounts (linked to Supabase Auth) | `id`, `email`, `role`, `status` |
| 2 | `profiles` | User profile data | `full_name`, `phone`, `avatar_url`, `bio` |
| 3 | `lawyers` | Lawyer professional data | `experience_years`, `consultation_fee`, `rating`, `verification_status` |
| 4 | `categories` | Legal specialization categories | `name`, `description` |
| 5 | `lawyer_specializations` | Many-to-many lawyer ↔ category | `lawyer_id`, `category_id` |
| 6 | `lawyer_availability` | Weekly availability schedule | `lawyer_id`, `day`, `start_time`, `end_time` |
| 7 | `consultations` | Consultation lifecycle | `client_id`, `lawyer_id`, `status`, `price` |
| 8 | `consultation_documents` | Consultation-related documents | `consultation_id`, `file_url`, `visibility` |
| 9 | `appointments` | Scheduled appointments | `consultation_id`, `scheduled_date`, `status` |
| 10 | `reviews` | Client reviews for lawyers | `lawyer_id`, `rating`, `comment`, `tags` |
| 11 | `transactions` | Payment records | `consultation_id`, `total_amount`, `status`, `payment_proof_url` |
| 12 | `notifications` | In-app notifications | `user_id`, `title`, `message`, `is_read` |
| 13 | `ai_conversations` | Rusdi AI conversation sessions | `user_id`, `title`, `is_archived` |
| 14 | `ai_messages` | AI conversation messages | `conversation_id`, `role`, `content` |
| 15 | `ai_file_uploads` | Files uploaded to Rusdi AI | `conversation_id`, `name`, `extracted_text` |
| 16 | `audit_logs` | System audit trail | `actor_id`, `action`, `entity`, `details` |
| 17 | `reports` | Operational reports | `title`, `type`, `summary_data` |

### Extended Tables (Migrations 018-028)

| Table | Purpose |
|-------|---------|
| `knowledge_base` | RAG dataset for Rusdi AI with full-text search |
| `files` | Centralized file management |
| `lawyer_documents` | Lawyer verification documents |
| `client_documents` | Client identity documents |
| `transaction_attachments` | Payment proof attachments |
| `payment_method_configs` | Bank/e-wallet/QRIS configurations |
| `payment_verification_logs` | Payment verification audit trail |
| `app_chat_sessions` | Real-time consultation chat sessions |
| `app_messages` | Chat messages with attachments |
| `call_signals` | WebRTC signaling data |
| `consultation_status_logs` | Consultation status change history |
| `support_tickets` | Client support tickets |
| `ai_document_chunks` | Document chunks for RAG pipeline |
| `ai_embeddings` | Vector embeddings for semantic search |
| `ai_analysis_history` | AI analysis history |
| `ai_file_analysis` | File analysis results |
| `profile_media` | Profile photos/media |

### Compatibility Views

| View | Source | Purpose |
|------|--------|---------|
| `lawyer_directory` | `lawyers` + `profiles` + `lawyer_specializations` | Public lawyer listing with computed fields |
| `app_consultations` | `consultations` | Maps `toliver_id` → `client_id` for frontend |
| `app_payments` | `transactions` | Unified payment view for frontend |
| `admin_pending_lawyers` | `lawyers` + `profiles` + `users` | Admin lawyer verification queue |
| `admin_clients` | `users` + `profiles` | Admin client management |
| `ai_chat_history` | `ai_messages` + `ai_conversations` | Legacy AI chat history interface |

### Enums

| Enum | Values |
|------|--------|
| `app_role` | `toliver` (client), `lawyer`, `admin` |
| `account_status` | `active`, `pending_verification`, `suspended`, `blocked` |
| `verification_status` | `pending`, `verified`, `rejected`, `suspended` |
| `consultation_status` | `pending`, `paid`, `ongoing`, `in_review`, `completed`, `cancelled`, `expired` |
| `payment_status` | `pending`, `waiting_payment`, `waiting_verification`, `paid`, `rejected`, `expired`, `refunded` |

### Supabase Storage Buckets

| Bucket | Public | Size Limit | Allowed Types |
|--------|--------|------------|---------------|
| `legal-documents` | No | 20 MB | PDF, DOC, DOCX, PNG, JPEG, MP3 |
| `profile-photos` | Yes | — | JPEG, PNG, WEBP |
| `payment-proofs` | Yes | — | PNG, JPG, JPEG, PDF |

### RLS Policies

All tables have Row Level Security enabled. Key policies:

| Policy | Description |
|--------|-------------|
| `public.is_admin()` | Helper function to check admin role |
| Profile owner access | Users can read/write their own profiles |
| Verified lawyers public read | Anyone can read verified lawyer profiles |
| Consultation participant access | Only client/lawyer participants + admin |
| Payment client/admin access | Only paying client or admin |
| Document owner access | Owner or consultation participants |
| Chat session participant access | Only chat participants |
| AI conversation owner access | Only the conversation owner |
| Admin full access | Admins have full access to all tables |

### Triggers & Functions

| Function/Trigger | Purpose |
|-----------------|---------|
| `handle_new_auth_user()` | Auto-creates user, profile, and lawyer records on auth.users insert |
| `sync_profiles_role_status()` | Syncs role/status from users to profiles |
| `handle_insert_ai_chat_history()` | Instead-of insert trigger for ai_chat_history view |
| `handle_delete_ai_chat_history()` | Instead-of delete trigger for ai_chat_history view |
| `search_knowledge()` | RPC for full-text search on knowledge_base |
| `search_ai_document_chunks()` | RPC for RAG document chunk search |

### Indexes

Key indexes for performance:

| Index | Table | Columns |
|-------|-------|---------|
| `idx_ai_conversations_user` | `ai_conversations` | `user_id, updated_at DESC` |
| `idx_ai_messages_conversation` | `ai_messages` | `conversation_id, created_at ASC` |
| `idx_ai_chat_history_user` | `ai_chat_history` | `user_id, timestamp DESC` |
| `idx_app_payments_consultation` | `app_payments` | `consultation_id, created_at DESC` |
| `idx_transactions_status` | `transactions` | `status, created_at DESC` |
| `idx_reviews_lawyer` | `reviews` | `lawyer_id, created_at DESC` |
| `call_signals_consultation_created_idx` | `call_signals` | `consultation_id, created_at` |
| `knowledge_base_fts_idx` | `knowledge_base` | GIN on `fts_content` |

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant SPA as React SPA
    participant Auth as Supabase Auth
    participant DB as PostgreSQL
    participant LS as localStorage

    Note over U,LS: Registration Flow
    U->>SPA: Fill registration form (name, email, password, role)
    SPA->>Auth: signUp(email, password, metadata: {full_name, role})
    Auth->>DB: INSERT auth.users
    DB->>DB: Trigger: handle_new_auth_user()
    DB->>DB: INSERT users + profiles (+ lawyers if role=lawyer)
    Auth-->>SPA: Session + access_token
    SPA->>DB: UPSERT profiles (ensureSupabaseProfile)
    SPA->>LS: Store token + user data

    Note over U,LS: Login Flow
    U->>SPA: Enter email, password, select role
    SPA->>Auth: signInWithPassword(email, password)
    Auth-->>SPA: Session + access_token
    SPA->>DB: SELECT profiles WHERE id = user.id
    DB-->>SPA: Profile (role, status, avatar_url)
    SPA->>SPA: Verify role matches login selection
    SPA->>SPA: Check account status (active/blocked/suspended)
    SPA->>LS: Store token + user data
    SPA->>U: Redirect to role dashboard

    Note over U,LS: Session Restore
    U->>SPA: Page load
    SPA->>Auth: getSession()
    Auth-->>SPA: Existing session
    SPA->>DB: SELECT profiles WHERE id = user.id
    SPA->>LS: Restore token + user data
    SPA->>U: Redirect to role dashboard

    Note over U,LS: Logout
    U->>SPA: Click logout
    SPA->>Auth: signOut()
    SPA->>LS: Remove token + user data
    SPA->>U: Redirect to landing page
```

### Authentication Methods

| Method | Endpoint | Description |
|--------|----------|-------------|
| Email/Password Sign Up | Supabase Auth | Creates auth.users, triggers profile creation |
| Email/Password Sign In | Supabase Auth | Returns session with JWT access token |
| Session Restore | Supabase Auth | Auto-restores session on page load |
| OTP Verification | Supabase Auth | Email-based OTP for password recovery |

### Session Management

- **Token Storage**: `localStorage` with key `YDA LAW OFFICE & Partners_token`
- **User Data**: `localStorage` with key `YDA LAW OFFICE & Partners_user`
- **Session Persistence**: Supabase Auth with `persistSession: true` and `autoRefreshToken: true`
- **Token Type**: Bearer token (JWT) passed via `Authorization` header to API

---

## Authorization & RBAC

### Role-Based Access Control

```mermaid
graph LR
    subgraph Roles
        Client["Client (toliver)"]
        Lawyer["Lawyer"]
        Admin["Admin"]
    end

    subgraph "Client Permissions"
        C1["Rusdi AI (free)"]
        C2["Lawyer Search"]
        C3["Case Analysis"]
        C4["Book Consultation"]
        C5["Payment"]
        C6["Chat (paid)"]
        C7["Video Call (paid)"]
        C8["Documents (paid)"]
        C9["Reviews"]
        C10["Profile Settings"]
        C11["Case History"]
        C12["Support Tickets"]
    end

    subgraph "Lawyer Permissions"
        L1["Lawyer Dashboard"]
        L2["Manage Consultations"]
        L3["Chat with Clients"]
        L4["Video Calls"]
        L5["Profile Settings"]
        L6["View Earnings"]
        L7["Verify Payments"]
    end

    subgraph "Admin Permissions"
        A1["Verify Lawyers"]
        A2["Manage Users"]
        A3["Verify Payments"]
        A4["Manage Categories"]
        A5["Payment Config"]
        A6["Support Tickets"]
        A7["Audit Logs"]
        A8["Delete Records"]
    end

    Client --> C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9 & C10 & C11 & C12
    Lawyer --> L1 & L2 & L3 & L4 & L5 & L6 & L7
    Admin --> A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8
```

### Access Control Levels

| Level | Description | Features |
|-------|-------------|----------|
| **Public** | No authentication required | Landing page, lawyer listing, lawyer detail |
| **Authenticated (Free)** | Login required, no payment | Rusdi AI, case analysis, lawyer search, booking, help, profile, case history |
| **Paid Consultation** | Payment verified | Lawyer chat, video/voice call, document exchange, review |
| **Lawyer** | Verified lawyer role | Lawyer dashboard, manage consultations, chat, calls, profile |
| **Admin** | Admin role | Full platform management access |

### View Access Control

The `canAccessView()` function in `src/utils/accessControl.ts` enforces navigation-level access control:

- **Public views**: `landing`, `login`, `register`, `forgot-password`, `otp`, `lawyer-list`, `lawyer-detail`
- **Auth-required views**: `booking`, `payment`, `chat`, `meeting`, `*-dash`, `profile-settings`, `case-history`, `document-vault`, `review`, `rusdi-chat`, `help`
- **Paid-gated features**: `lawyer-chat`, `meeting-room`, `consultation-documents`, `consultation-review`
- **Lawyer override**: Lawyers can access `chat` and `meeting` without payment check

---

## Client Workflow

```mermaid
flowchart TD
    A[Landing Page] --> B{Authenticated?}
    B -->|No| C[Login / Register]
    B -->|Yes| D[Client Dashboard]
    C --> D

    D --> E{Choose Action}
    E --> F[Rusdi AI - Free]
    E --> G[Browse Lawyers]
    E --> H[Case History]
    E --> I[Document Vault]
    E --> J[Help & Support]
    E --> K[Profile Settings]

    F --> F1[Ask Legal Questions]
    F1 --> F2[AI Case Analysis]
    F2 --> F3[Lawyer Recommendations]
    F3 --> G

    G --> G1[Filter by Specialty]
    G1 --> G2[View Lawyer Detail]
    G2 --> G3[Select Consultation Type]
    G3 --> G4[Choose Schedule]
    G4 --> G5[Add Case Notes]
    G5 --> G6[Create Invoice]

    G6 --> P[Payment Flow]
    P --> P1[Select Payment Method]
    P1 --> P2[Bank Transfer / E-Wallet / QRIS]
    P2 --> P3[Upload Payment Proof]
    P3 --> P4[Wait for Verification]
    P4 --> P5{Verified?}
    P5 -->|Yes| S[Active Consultation]
    P5 -->|No / Rejected| P1

    S --> S1[Chat with Lawyer]
    S --> S2[Video/Voice Call]
    S --> S3[Share Documents]
    S1 --> S4[Consultation Complete]
    S2 --> S4
    S3 --> S4
    S4 --> R[Submit Review]
    R --> D
```

| Step | Activity |
|------|----------|
| 1 | Register/Login with role Client via Supabase Auth |
| 2 | Complete profile (name, phone, photo) |
| 3 | Use **Rusdi AI** for initial legal case analysis (free, optional) |
| 4 | Browse lawyers by specialty, price, rating, availability |
| 5 | Select consultation type (chat/video/phone), schedule, and case notes |
| 6 | Select payment method and receive invoice |
| 7 | Upload payment proof (bank transfer receipt / e-wallet screenshot) |
| 8 | Wait for admin/lawyer payment verification |
| 9 | Enter consultation: chat, video call, or phone call with lawyer |
| 10 | Receive legal opinion, submit review, access document vault |

---

## Lawyer Workflow

```mermaid
flowchart TD
    A[Register as Lawyer] --> B[Complete Professional Profile]
    B --> C[Upload Verification Documents]
    C --> D[Status: Pending Verification]
    D --> E{Admin Decision}
    E -->|Rejected| B
    E -->|Approved| F[Profile in Public Directory]

    F --> G[Lawyer Dashboard]
    G --> H{Incoming Actions}
    H --> I[New Consultation Request]
    H --> J[Payment Verification]
    H --> K[Profile Management]

    I --> I1[Review Client Case Summary]
    I1 --> I2[Accept Consultation]
    I2 --> I3[Active Consultation Session]
    I3 --> I4[Chat / Video / Phone]
    I4 --> I5[Send Legal Opinion]
    I5 --> I6[Mark as Complete]
    I6 --> I7[Receive Client Review]

    J --> J1[Review Payment Proof]
    J1 --> J2{Approve / Reject}
    J2 -->|Approve| J3[Activate Consultation]
    J2 -->|Reject| J4[Request Re-upload]

    K --> K1[Update Specialty]
    K --> K2[Set Availability Schedule]
    K --> K3[Update Consultation Price]
    K --> K4[Upload Certifications]
```

| Step | Activity |
|------|----------|
| 1 | Register with role Lawyer, complete professional profile |
| 2 | Upload ID, practice license, certificates, profile photo |
| 3 | Wait for admin verification (`verification_status: pending`) |
| 4 | Once verified, profile appears in public directory |
| 5 | Set specialization, consultation price, availability schedule |
| 6 | Receive notification for new bookings |
| 7 | Review client case summary and documents before session |
| 8 | Verify payment proofs submitted by clients |
| 9 | Conduct consultation via chat/video/phone |
| 10 | Send legal notes/opinions, mark consultation complete, monitor earnings |

---

## Admin Workflow

```mermaid
flowchart TD
    A[Admin Login] --> B[Admin Dashboard]
    B --> C{Management Area}

    C --> D[Lawyer Verification]
    D --> D1[Review Pending Lawyers]
    D1 --> D2{Approve / Reject / Suspend}
    D2 --> D3[Update verification_status]

    C --> E[Payment Management]
    E --> E1[Review Payment Proofs]
    E1 --> E2{Approve / Reject}
    E2 --> E3[Update payment status]
    E2 --> E4[Log verification action]

    C --> F[User Management]
    F --> F1[View All Clients]
    F --> F2[Block / Suspend Accounts]
    F --> F3[Delete User Accounts]

    C --> G[Consultation Oversight]
    G --> G1[View All Consultations]
    G --> G2[Delete Consultations]

    C --> H[Platform Configuration]
    H --> H1[Payment Method Config]
    H --> H2[Legal Categories CRUD]
    H --> H3[Support Ticket Management]

    C --> I[Monitoring]
    I --> I1[Transaction Reports]
    I --> I2[Audit Logs]
    I --> I3[Review Management]
```

| Step | Activity |
|------|----------|
| 1 | Login with Admin role credentials |
| 2 | Verify new lawyer applications (approve/reject/suspend) |
| 3 | Monitor active consultations and transaction statuses |
| 4 | Verify or reject manual payment proofs |
| 5 | Manage payment method configurations (bank, e-wallet, QRIS) |
| 6 | Manage legal categories (CRUD) |
| 7 | Handle support tickets (reply, resolve) |
| 8 | Manage user accounts (block, suspend, delete) |
| 9 | Access audit logs and operational reports |

---

## Rusdi AI Workflow

```mermaid
sequenceDiagram
    participant U as Client
    participant UI as Rusdi Chat UI
    participant API as /api/rusdi/chat
    participant KB as Knowledge Base (RAG)
    participant LD as Lawyer Directory
    participant Gemini as Google Gemini 2.5 Flash
    participant DB as PostgreSQL

    U->>UI: Type legal question / upload document
    UI->>API: POST {message, sessionId, language, inlineData?}
    API->>API: Authenticate user (Bearer token)
    API->>DB: Load conversation history (last 15 messages)
    API->>KB: search_knowledge(message) via RPC
    KB-->>API: Relevant legal passages
    API->>LD: SELECT verified lawyers
    LD-->>API: Lawyer listings with specialties
    API->>API: Build system prompt (RAG context + lawyer list + language)
    API->>Gemini: POST contents + systemInstruction
    Gemini-->>API: AI response (structured analysis)
    API->>DB: Persist conversation turn (ai_conversations + ai_messages)
    API-->>UI: {response, sessionId, persisted}
    UI->>U: Display structured AI response
```

### Rusdi AI Architecture

1. **Input**: User message (text or text + file attachment)
2. **Authentication**: Validates Supabase Bearer token
3. **History Loading**: Retrieves last 15 messages from `ai_messages` or `ai_chat_history`
4. **RAG Retrieval**: Searches `knowledge_base` table via `search_knowledge()` RPC using PostgreSQL full-text search
5. **Lawyer Context**: Loads verified lawyers from `lawyer_directory` view
6. **Prompt Construction**: Builds system prompt with:
   - Legal knowledge context from RAG
   - Available lawyer list with specialties, ratings, prices
   - Language-specific instruction (id/en/ja/zh)
   - Structured response format for case analysis
7. **Gemini Inference**: Calls Google Gemini 2.5 Flash API with conversation history + system instruction
8. **Persistence**: Saves user message + AI response to `ai_conversations` / `ai_messages`
9. **Response**: Returns structured analysis to the client

### Rusdi Response Format (for case analysis)

```
Ringkasan Masalah: [Case facts]
Bidang Hukum Terkait: [Legal field]
Kemungkinan Dasar Hukum: [Legal basis]
Langkah yang Dapat Dipertimbangkan: [Recommended steps]
Risiko yang Perlu Diperhatikan: [Potential risks]
Rekomendasi: [Follow-up advice + lawyer recommendation]
```

---

## Payment Workflow

```mermaid
flowchart TD
    A[Client books consultation] --> B[Create Invoice]
    B --> C[Invoice generated with reference]
    C --> D[Client selects payment method]
    D --> E{Method}
    E --> F[Bank Transfer]
    E --> G[E-Wallet]
    E --> H[QRIS]

    F --> I[Display bank details + amount]
    G --> J[Display wallet number + amount]
    H --> K[Display QRIS code + amount]

    I --> L[Client transfers funds]
    J --> L
    K --> L

    L --> M[Upload payment proof]
    M --> N[Store proof in Supabase Storage]
    N --> O[Status: waiting_verification]
    O --> P{Admin/Lawyer Review}

    P -->|Approve| Q[Status: paid]
    P -->|Reject| R[Status: rejected + reason]
    R --> M

    Q --> S[Consultation status → paid]
    S --> T[Client can access chat/meeting]

    subgraph Invoice Calculation
        calc["Total = Base Price + Admin Fee (Rp 5,000) + Tax (11%) + Platform Fee (10%)"]
    end
```

### Payment Methods

| Type | Providers | Details |
|------|-----------|---------|
| **Bank Transfer** | BCA, BNI, BRI, Mandiri | Account name, account number, payment reference |
| **E-Wallet** | GoPay, OVO, DANA, ShopeePay | Phone number, account name, payment reference |
| **QRIS** | QRIS Demo | QR code display, amount, reference |

### Payment Status Flow

```
pending → waiting_payment → waiting_verification → paid
                                               → rejected → waiting_payment (retry)
                                               → expired
```

### Invoice Structure

- **Invoice Number**: Auto-generated (e.g., `INV-20240601-XXXXX`)
- **Payment Reference**: Unique reference for tracking
- **Due Date**: Configurable expiration
- **Breakdown**: Consultation fee + admin fee (Rp 5,000) + tax (11%) + platform fee (10%)

---

## Consultation Workflow

```mermaid
stateDiagram-v2
    [*] --> pending: Client books
    pending --> paid: Payment verified
    paid --> ongoing: Session starts
    ongoing --> in_review: Lawyer submits opinion
    in_review --> completed: Client reviews
    completed --> [*]

    pending --> cancelled: Client cancels
    pending --> expired: Payment timeout
    paid --> cancelled: Admin action
    ongoing --> completed: Session ends

    note right of pending
        Invoice created,
        waiting for payment
    end note

    note right of paid
        Payment verified,
        consultation unlocked
    end note

    note right of ongoing
        Chat/Video/Phone
        active session
    end note

    note right of completed
        Review submitted,
        case archived
    end note
```

### Consultation Types

| Type | Description | Implementation |
|------|-------------|----------------|
| `chat` | Text-based consultation | Real-time messaging via `app_chat_sessions` + `app_messages` |
| `video` | Video call consultation | WebRTC signaling via `call_signals` table |
| `voice` / `phone` | Voice-only call | WebRTC voice mode via `call_signals` table |
| `document_review` | Document review only | Document upload + async chat |

### Chat Implementation

- **Sessions**: One `app_chat_sessions` record per consultation
- **Messages**: `app_messages` with `sender_id`, `sender_role`, `content`, `attachment_url`, `message_type`
- **Polling**: Client polls for new messages (no WebSocket in current architecture)
- **File Sharing**: Attachments via Supabase Storage

---

## Video Call Workflow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as /api/calls
    participant DB as call_signals
    participant L as Lawyer
    participant WebRTC as WebRTC P2P

    Note over C,WebRTC: Call Initiation
    C->>API: POST signal_type=ring
    API->>DB: INSERT call_signal
    L->>API: GET signals since=timestamp
    API-->>L: Ring signal received
    L->>L: Show incoming call UI

    Note over C,WebRTC: WebRTC Handshake
    C->>API: POST signal_type=offer {sdp}
    API->>DB: INSERT offer signal
    L->>API: GET signals
    API-->>L: SDP Offer
    L->>API: POST signal_type=answer {sdp}
    API->>DB: INSERT answer signal
    C->>API: GET signals
    API-->>C: SDP Answer

    Note over C,WebRTC: ICE Exchange
    C->>API: POST signal_type=candidate {ice}
    API->>DB: INSERT ICE candidate
    L->>API: GET signals
    L->>API: POST signal_type=candidate {ice}
    C->>API: GET signals

    Note over C,WebRTC: P2P Connection
    WebRTC->>WebRTC: Direct media stream established

    Note over C,WebRTC: Call End
    C->>API: POST signal_type=leave
    API->>DB: INSERT leave signal
    L->>API: GET signals
    L->>L: End call UI
```

### Call Signaling

- **Transport**: Polling-based signaling via `call_signals` table
- **Signal Types**: `ring`, `offer`, `answer`, `candidate`, `leave`
- **Payload**: JSONB field carrying SDP or ICE candidate data
- **Access Control**: Only consultation participants can read/write signals
- **Prerequisite**: Consultation must have `paid`, `ongoing`, or `in_review` status

---

## File Upload Workflow

```mermaid
flowchart TD
    subgraph "Legal Documents"
        A1[Client uploads document] --> A2[Supabase Storage: legal-documents]
        A2 --> A3[Path: userId/timestamp-filename]
        A3 --> A4[INSERT into documents table]
        A4 --> A5[Visibility: private or shared]
    end

    subgraph "Payment Proofs"
        B1[Client uploads proof] --> B2[Base64 encode]
        B2 --> B3[POST /api/payments upload-proof]
        B3 --> B4[Supabase Storage: payment-proofs]
        B4 --> B5[Path: userId/paymentId/timestamp-filename]
        B5 --> B6[UPDATE app_payments.payment_proof_url]
    end

    subgraph "Profile Photos"
        C1[User uploads photo] --> C2[Validate: JPG/PNG/WEBP, max 3MB]
        C2 --> C3[Supabase Storage: profile-photos]
        C3 --> C4[Path: userId/avatar-timestamp.ext]
        C4 --> C5[UPDATE profiles.avatar_url]
        C5 --> C6[If lawyer: UPDATE lawyer_directory.image]
    end

    subgraph "AI File Uploads"
        D1[Client uploads to Rusdi] --> D2[Inline base64 in chat]
        D2 --> D3[Gemini processes inline data]
        D3 --> D4[INSERT ai_file_uploads]
    end
```

---

## Notification Workflow

```mermaid
flowchart LR
    subgraph Triggers
        T1[New Invoice Created]
        T2[Payment Proof Uploaded]
        T3[Payment Verified]
        T4[New Consultation]
        T5[Consultation Status Change]
    end

    subgraph "Notification System"
        N[INSERT notifications]
    end

    subgraph Recipients
        R1[Lawyer]
        R2[Client]
        R3[Admin]
    end

    T1 --> N --> R1
    T2 --> N --> R1
    T2 --> N --> R3
    T3 --> N --> R2
    T4 --> N --> R1
    T5 --> N --> R2
    T5 --> N --> R1
```

---

## API Documentation

### Base URL

| Environment | URL |
|-------------|-----|
| Production (Vercel) | `https://<domain>/api` |
| Local Development | `http://localhost:5000/api` |

### Authentication

All authenticated endpoints require a `Bearer` token in the `Authorization` header:
```
Authorization: Bearer <supabase_access_token>
```

### Endpoints

#### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Server health check |

**Response**: `{ status: "ok", timestamp, uptime }`

---

#### Registration

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | No | Register new account |
| `POST` | `/api/auth/register` | No | Register (auth path) |

**Request Body**:
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "client" | "lawyer"
}
```

**Response**:
```json
{
  "user": { "id": "uuid", "email": "string" },
  "role": "client" | "lawyer",
  "status": "active"
}
```

---

#### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/payments` | No | List active payment methods |
| `GET` | `/api/payments?methodType=bank_transfer` | No | Filter by method type |
| `POST` | `/api/payments` | Yes | Create invoice / select method / upload proof |
| `POST` | `/api/payments/invoices` | Yes | Get invoice details |
| `PATCH` | `/api/payments/verify` | Yes | Verify payment (approve/reject) |
| `GET` | `/api/payments/verify?status=pending` | Yes | List pending verifications |

**Create Invoice** (`action: "create-invoice"`):
```json
{
  "action": "create-invoice",
  "consultationId": "uuid",
  "amount": 150000,
  "method": "bank_transfer",
  "subMethod": "bca"
}
```

**Upload Proof** (`action: "upload-proof"`):
```json
{
  "action": "upload-proof",
  "paymentId": "uuid",
  "fileName": "receipt.png",
  "mimeType": "image/png",
  "fileBase64": "base64..."
}
```

**Verify Payment**:
```json
{
  "paymentId": "uuid",
  "decision": "approve" | "reject" | "override_approve" | "override_reject",
  "notes": "string"
}
```

---

#### Consultations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/lawyer/consultations?lawyerId=uuid` | Yes | List lawyer's consultations |
| `PATCH` | `/api/consultations/status` | Yes | Update consultation status |

**Update Status**:
```json
{
  "consultationId": "uuid",
  "actorId": "uuid",
  "status": "ongoing" | "completed" | "cancelled",
  "note": "string"
}
```

---

#### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/chat` | Yes | Create session or send message |
| `GET` | `/api/chat?sessionId=uuid` | Yes | Get chat messages |

**Create Session**:
```json
{
  "consultationId": "uuid",
  "clientId": "uuid",
  "lawyerId": "uuid",
  "senderRole": "client"
}
```

**Send Message**:
```json
{
  "action": "send-message",
  "chatSessionId": "uuid",
  "senderId": "uuid",
  "senderRole": "client",
  "content": "Hello, I need help with...",
  "messageType": "text"
}
```

---

#### Video Calls

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/calls?consultationId=uuid&since=timestamp` | Yes | Get call signals |
| `POST` | `/api/calls` | Yes | Send call signal |

**Send Signal**:
```json
{
  "consultationId": "uuid",
  "senderId": "uuid",
  "senderRole": "client" | "lawyer",
  "signalType": "ring" | "offer" | "answer" | "candidate" | "leave",
  "payload": {}
}
```

---

#### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reviews` | Yes | Submit review |

**Request Body**:
```json
{
  "consultationId": "uuid",
  "clientId": "uuid",
  "lawyerId": "uuid",
  "rating": 5,
  "comment": "Very helpful...",
  "tags": ["professional", "responsive"]
}
```

---

#### Rusdi AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/rusdi/chat` | Yes | Chat with Rusdi AI |
| `POST` | `/api/rusdi/case-analysis` | Yes | AI case analysis |
| `POST` | `/api/rusdi/lawyer-recommendation` | Yes | AI lawyer recommendation |

**Chat Request**:
```json
{
  "message": "Saya punya masalah sengketa tanah...",
  "sessionId": "uuid",
  "conversationId": "uuid",
  "language": "id",
  "inlineData": {
    "data": "base64...",
    "mimeType": "application/pdf",
    "name": "dokumen.pdf"
  }
}
```

**Response**:
```json
{
  "response": "Ringkasan Masalah: ...\nBidang Hukum Terkait: ...",
  "sessionId": "uuid",
  "conversationId": "uuid",
  "persisted": true
}
```

---

#### Admin

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/admin?resource=pending-lawyers` | Yes | Admin | List pending lawyer verifications |
| `GET` | `/api/admin?resource=transactions` | Yes | Admin | List all transactions |
| `GET` | `/api/admin?resource=clients` | Yes | Admin | List all clients |
| `GET` | `/api/admin?resource=support-tickets` | Yes | Admin | List support tickets |
| `GET` | `/api/admin?resource=consultations` | Yes | Admin | List all consultations |
| `GET` | `/api/admin?resource=payment-methods` | Yes | Admin | List payment method configs |
| `GET` | `/api/admin?resource=reviews` | Yes | Admin | List all reviews |
| `PATCH` | `/api/admin` | Yes | Admin | Execute admin actions |

**Admin Actions** (PATCH):

| Action | Body |
|--------|------|
| `verify-lawyer` | `{ lawyerUserId }` |
| `reject-lawyer` | `{ lawyerUserId }` |
| `update-client-status` | `{ clientId, status: "active"\|"blocked"\|"suspended" }` |
| `update-support-ticket` | `{ ticketId, status }` |
| `reply-support-ticket` | `{ ticketId, response }` |
| `update-payment-status` | `{ paymentId, status, notes }` |
| `update-payment-method` | `{ configId, displayName, accountName, accountNumber, phoneNumber, isActive }` |
| `delete-user` | `{ userId }` |
| `delete-lawyer` | `{ lawyerUserId }` |
| `create-category` | `{ name, description }` |
| `update-category` | `{ categoryId, name, description }` |
| `delete-category` | `{ categoryId }` |
| `delete-consultation` | `{ consultationId }` |
| `delete-review` | `{ reviewId }` |
| `archive-transaction` | `{ transactionId }` |

---

## Installation Guide

### Prerequisites

- **Node.js** >= 22.x
- **npm** >= 10.x
- **Supabase** project (free tier or higher)
- **Google Gemini API Key** (for Rusdi AI)
- **Git**

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/CikiT4/RawLaw.git
cd RawLaw

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your credentials (see Environment Variables below)

# 5. Run database migrations in Supabase SQL Editor
#    (see Supabase Setup section)

# 6. Start development servers
npm run dev:all
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini AI (for Rusdi)
GEMINI_API_KEY=your-gemini-api-key

# API Configuration
API_PORT=5000
VITE_API_BASE_URL=/api

# Optional: Database direct connection (for scripts)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for Rusdi AI |
| `API_PORT` | No | Local API server port (default: 5000) |
| `VITE_API_BASE_URL` | No | API base URL (default: `/api`) |
| `DATABASE_URL` | No | Direct PostgreSQL connection (for seed scripts) |

---

## Local Development

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start frontend (Vite :3000) + API (Express :5000) concurrently |
| `npm run dev` | Frontend only (Vite on port 3000) |
| `npm run server` | API only (Express on port 5000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run seed` | Seed platform demo data |
| `npm run seed:dummy` | Seed dummy test data |
| `npm run knowledge:upload` | Upload RAG knowledge base CSVs to Supabase |
| `npm run test:login` | Smoke test Supabase login |
| `npm run test:db` | Test database connection |
| `npm run clean` | Remove `dist/` build output |

### Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Local API | http://localhost:5000/api/health |
| API Root | http://localhost:5000/api |

### Architecture Notes

- **Frontend**: Vite dev server on port 3000 with proxy to local API
- **API**: Express server on port 5000 mirrors Vercel serverless routes
- **Route Mounting**: `server.js` dynamically imports handlers from `api/` directory
- **Supabase Client**: Initialized in `src/supabaseClient.ts` using Vite env vars

---

## Supabase Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Migrations

Open the **SQL Editor** in your Supabase dashboard and run migrations in order:

| Migration | File | Purpose |
|-----------|------|---------|
| 001 | `001_finprose_schema.sql` | Core schema (tables, RLS, policies) |
| 002 | `002_runtime_supabase_only.sql` | Runtime Supabase configuration |
| 003 | `003_auth_profile_trigger.sql` | Auth trigger for profile creation |
| 004 | `004_runtime_role_operations.sql` | Runtime role operations |
| 005 | `005_operational_features.sql` | Chat, messages, reviews, support, storage |
| 006-008 | Various | Lawyer WhatsApp fields (added/removed) |
| 009 | `009_case_bound_documents.sql` | Case-bound document management |
| 010-011 | Various | Runtime chat/reviews fixes |
| 012 | `012_call_signaling.sql` | WebRTC call signaling table |
| 013-015 | Various | Auto-verify lawyers, hide seed lawyers, ring signal |
| 016 | `016_ai_chat_history.sql` | AI chat history table |
| 017 | `017_rusdi_and_toliver_schema_v2.sql` | Full schema restructure (17 tables) |
| 018 | `018_knowledge_base.sql` | Knowledge base table + FTS |
| 019 | `019_ai_chat_history.sql` | AI chat history extensions |
| 020 | `020_platform_profile_extensions.sql` | Profile extensions |
| 021 | `021_file_management_and_rusdi_rag.sql` | File management + RAG pipeline |
| 022 | `022_ai_conversation_archive.sql` | AI conversation archiving |
| 023 | `023_client_column_normalization.sql` | Column normalization |
| 024 | `024_manual_payment_system.sql` | Manual payment workflow |
| 025 | `025_production_stabilization.sql` | Production stabilization |
| 026 | `026_unified_production_fix.sql` | Unified production fixes |
| 027 | `027_yda_branding_payment_configs.sql` | YDA branding update |
| 028 | `028_extend_payment_status_enum.sql` | Extended payment status enum |

### 3. Create Storage Buckets

The migrations create these automatically. If not, create manually:
- `legal-documents` (private, 20MB limit)
- `profile-photos` (public)
- `payment-proofs` (public)

### 4. Seed Data (Optional)

```bash
npm run seed              # Platform demo data
npm run seed:dummy        # Dummy test data
npm run knowledge:upload  # Upload RAG knowledge base
```

---

## Build & Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory with optimized static assets.

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`

### Vercel Configuration

`vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!api/.*).*)", "destination": "/index.html" }
  ]
}
```

- Frontend serves as SPA from `dist/`
- API routes under `/api/*` are served as Vercel serverless functions
- All non-API routes redirect to `index.html` for client-side routing

---

## Production Configuration

### Checklist

- [ ] All environment variables configured in Vercel
- [ ] Supabase project in production mode
- [ ] All migrations applied to production database
- [ ] Storage buckets created with correct policies
- [ ] Knowledge base data uploaded
- [ ] Payment method configs seeded
- [ ] Gemini API key configured
- [ ] CORS configured if needed
- [ ] Admin account created and verified

### Performance Considerations

- Frontend is statically built and served via Vercel CDN
- API routes run as serverless functions (cold start applies)
- Database queries use indexes for common access patterns
- Full-text search on `knowledge_base` uses GIN index
- Supabase RLS policies enforce security at the database level

---

## Testing Guide

### Manual Testing

| Command | Description |
|---------|-------------|
| `npm run test:login` | Smoke test Supabase authentication |
| `npm run test:db` | Test direct database connection |

### Testing Workflows

1. **Registration**: Create client and lawyer accounts, verify OTP
2. **Login**: Test all three roles (client, lawyer, admin)
3. **Rusdi AI**: Ask legal questions, verify RAG context, test file upload
4. **Booking**: Book consultation with different types and schedules
5. **Payment**: Create invoice, select method, upload proof, verify/reject
6. **Chat**: Open consultation chat, send messages, share files
7. **Video Call**: Initiate call, test signaling, verify P2P connection
8. **Reviews**: Submit review after consultation, verify rating update
9. **Admin**: Verify lawyers, manage users, verify payments

### Type Checking

```bash
npm run lint  # TypeScript compilation check
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <pid> /F
```

### Supabase Not Configured

Error: `Supabase belum dikonfigurasi`

**Solution**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`.

### Gemini API Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `GEMINI_NO_KEY` | No API key configured | Set `GEMINI_API_KEY` in `.env` |
| `GEMINI_QUOTA` | API quota exceeded | Wait or upgrade Gemini plan |
| `GEMINI_UNAVAILABLE` | Service temporarily down | Retry after a moment |

### Database Schema Mismatch

Error: `relation does not exist` or `column does not exist`

**Solution**: Run all migrations in order via Supabase SQL Editor.

### Payment 403 Errors

Error: `Akses ditolak` or `Konsultasi bukan milik user ini`

**Solution**: Ensure the client is authenticated and owns the consultation.

### Role Mismatch on Login

Error: `Role login tidak cocok dengan akun ini`

**Solution**: Login with the correct role that matches the account's database role.

---

## Known Issues

1. **Legacy Role Name**: Database uses `toliver` for client role. The UI maps this to "client" transparently.
2. **Dual Schema Paths**: The database supports both `app_consultations`/`app_payments` (views) and direct `consultations`/`transactions` tables. The API layer handles both paths.
3. **Polling-based Chat**: Chat and call signaling use polling, not WebSockets. This is intentional for Supabase compatibility.
4. **Admin Hardcoded Email**: The admin role is determined by email match (`rawlaw@gmail.com`) as a fallback in the auth flow.
5. **Mobile App**: The Expo mobile app under `apps/mobile/` is in development and not yet feature-complete.

---

## Contribution Guide

### Development Workflow

1. Create a feature branch from `main`
2. Make changes and test locally with `npm run dev:all`
3. Run `npm run lint` to check TypeScript
4. Commit with descriptive messages
5. Push and create a Pull Request

### Code Style

- **TypeScript** for all source files in `src/`
- **JavaScript (ESM)** for API handlers in `api/`
- **Tailwind CSS** for styling
- **i18next** for all user-facing strings

### Adding API Endpoints

1. Create handler in `api/` with `export default async function handler(req, res)`
2. Register route in `server.js` routes array
3. Add frontend API function in `src/api.ts`

### Adding Database Tables

1. Create a new migration file: `supabase/migrations/NNN_description.sql`
2. Include `CREATE TABLE`, RLS policies, and indexes
3. Test migration in Supabase SQL Editor
4. Update compatibility views if needed

### Migration Guidelines

- All migrations must be **idempotent** (use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`)
- Always enable RLS on new tables
- Use `NOTIFY pgrst, 'reload schema'` at the end of migrations
- Include both `SELECT` and write policies for RLS

---

## License

This project is proprietary software. All rights reserved by **YDA LAW OFFICE & Partners**.

---

<div align="center">

**YDA LAW OFFICE & Partners** — *Digital Legal Consultation Platform*

Built with React, Supabase, and Google Gemini AI

[GitHub Repository](https://github.com/CikiT4/RawLaw)

</div>
