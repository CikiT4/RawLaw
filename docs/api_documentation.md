# API Documentation

## Overview
The YDA LAW OFFICE & Partners platform uses a hybrid API architecture:
1. **Supabase REST API / PostgREST**: Direct CRUD from the frontend (consultations, documents, profiles) with RLS.
2. **Vercel Serverless `/api/*`** (production): Payments, Rusdi AI, admin, chat, calls, reviews.
3. **`server.js` Express** (local dev): Mirrors all Vercel handlers on port 5000; proxied by Vite `/api`.

## API Endpoints
Base URL: `/api` (same-origin in prod; `http://localhost:5000/api` in dev)

### 1. Authentication & Registration
- **`POST /api/register`**
  - **Description**: Registers a new user with Supabase Auth and creates their profile securely.
  - **Body**: `{ "fullName": "string", "email": "string", "password": "string", "role": "client|lawyer" }`
  - **Response**: `{ "user": { "id": "uuid", "email": "string" }, "role": "string", "status": "string" }`

### 2. Payments & Transactions (Manual Verification)
- **`GET /api/payments`**
  - **Description**: Lists active payment method configs (bank transfer, e-wallet, QRIS).
  - **Response**: Array of `payment_method_configs` rows.

- **`POST /api/payments`**
  - **Actions**: `create-invoice`, `select-method`, `get-invoice`, `upload-proof`
  - **Description**: Manual payment workflow with auto-verification on proof upload.
  - **Body (create-invoice)**: `{ "action": "create-invoice", "consultationId": "uuid", "amount": int }`
  - **Body (upload-proof)**: `{ "action": "upload-proof", "paymentId": "uuid", "fileName": "string", "mimeType": "string", "fileBase64": "string" }`

- **`PATCH /api/payments/verify`**
  - **Description**: Lawyer/admin manual approve or reject payment.
  - **Body**: `{ "paymentId": "uuid", "decision": "approve|reject|override_approve|override_reject" }`

### 3. Consultations & Cases
- **`POST /api/consultations/status`**
  - **Description**: Securely updates the status of a consultation.
  - **Body**: `{ "consultationId": "uuid", "actorId": "uuid", "status": "string", "note": "string" }`

- **`GET /api/lawyer/consultations?lawyerId={uuid}`**
  - **Description**: Retrieves consultations assigned to a specific lawyer.

### 4. Admin Operations
- **`GET /api/admin?resource={resource}`**
  - **Description**: Fetches admin data. Requires Bearer token of an active admin.
  - **Resources**:
    - `pending-lawyers` — Lawyers awaiting verification
    - `transactions` — All payment transactions with joined profile/consultation data
    - `payment-methods` — Payment method configurations
    - `verification-logs` — Payment verification audit logs
    - `clients` — Client accounts
    - `support-tickets` — Support tickets with user profiles
    - `consultations` — All consultations with joined data
    - `reviews` — Client reviews

- **`PATCH /api/admin`**
  - **Description**: Performs administrative actions. Requires Bearer token of an active admin.
  - **Actions**:

  | Action | Body | Description |
  |--------|------|-------------|
  | `verify-lawyer` | `{ "lawyerUserId": "uuid" }` | Approve lawyer verification |
  | `reject-lawyer` | `{ "lawyerUserId": "uuid" }` | Reject lawyer verification |
  | `delete-lawyer` | `{ "lawyerUserId": "uuid" }` | Delete lawyer and profile |
  | `update-client-status` | `{ "clientId": "uuid", "status": "string" }` | Update client account status |
  | `delete-user` | `{ "userId": "uuid" }` | Delete user profile |
  | `update-support-ticket` | `{ "ticketId": "uuid", "status": "string" }` | Update support ticket status |
  | `reply-support-ticket` | `{ "ticketId": "uuid", "response": "string" }` | Reply and resolve a ticket |
  | `update-payment-status` | `{ "paymentId": "uuid", "status": "string", "notes": "string" }` | Override payment status |
  | `update-payment-method` | `{ "configId": "uuid", "displayName": "string", ... }` | Update payment method config |
  | `create-category` | `{ "name": "string", "description": "string" }` | Create legal category |
  | `update-category` | `{ "categoryId": "uuid", "name": "string", "description": "string" }` | Update legal category |
  | `delete-category` | `{ "categoryId": "uuid" }` | Delete legal category |
  | `delete-consultation` | `{ "consultationId": "uuid" }` | Delete consultation record |
  | `delete-review` | `{ "reviewId": "uuid" }` | Delete client review |
  | `archive-transaction` | `{ "transactionId": "uuid" }` | Archive a terminal-state transaction |

### 5. AI Assistant "Rusdi"
- **`POST /api/rusdi/chat`**
  - **Description**: General AI chat using conversation memory.
  - **Body**: `{ "conversationId": "uuid", "message": "string" }`
  - **Response**: `{ "reply": "string", "conversationId": "uuid" }`

- **`POST /api/rusdi/case-analysis`**
  - **Description**: Analyzes uploaded case documents using RAG.
  - **Body**: `{ "conversationId": "uuid", "documentText": "string" }`

- **`POST /api/rusdi/lawyer-recommendation`**
  - **Description**: Recommends lawyers based on case context.
  - **Body**: `{ "conversationId": "uuid", "caseDescription": "string" }`

### 6. Calls & Meetings
- **`POST /api/calls`**
  - **Description**: WebRTC signaling and call management.
  - **Actions**: `initiate`, `accept`, `reject`, `end`

### 7. Reviews
- **`POST /api/reviews`**
  - **Description**: Submit a client review for a completed consultation.
  - **Body**: `{ "consultationId": "uuid", "rating": int, "comment": "string" }`

## Authentication
All admin endpoints require a `Bearer` token in the `Authorization` header. The token is the Supabase Auth JWT of a user with `role=admin` and `status=active` in the `profiles` table.

## Error Responses
All endpoints return JSON errors in the format:
```json
{ "error": "Human-readable error message in Indonesian" }
```

HTTP status codes:
- `200` — Success
- `400` — Invalid request or action
- `403` — Authentication or authorization failure
- `405` — Method not allowed
- `502` — Upstream service failure
