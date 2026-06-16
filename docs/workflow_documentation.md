# Workflow Documentation

## 1. User Registration Workflow
1. User submits registration form on the frontend (Landing Page or Login Page).
2. Frontend calls `POST /api/register` with full name, email, password, and role (client or lawyer).
3. Serverless handler creates the user in Supabase Auth using the `SUPABASE_SERVICE_ROLE_KEY`.
4. A database trigger (`on_auth_user_created`) automatically creates an entry in the `profiles` table.
5. If the user is a `lawyer`, they are placed in a `pending` verification state.
6. User is redirected to the appropriate dashboard after login.

## 2. Lawyer Verification Workflow
1. Lawyer registers and completes their profile (specialty, experience, consultation price).
2. Admin logs into the Admin Dashboard and navigates to the "Lawyers" tab.
3. Admin sees a list of pending lawyers with their verification status.
4. Admin clicks "Verify" (green button) to approve or "Reject" (red button) to deny.
5. The frontend calls `PATCH /api/admin` with `action: verify-lawyer` or `action: reject-lawyer`.
6. Backend updates `verification_status` to `verified`/`rejected` and `status` to `active`/`suspended`.
7. Verified lawyers appear in the public directory and can accept consultations.
8. Admin can also delete a lawyer account using the trash button (`action: delete-lawyer`).

## 3. Consultation Booking & Payment Workflow
1. Client browses the Landing Page, selects a lawyer category, and picks a lawyer.
2. Client selects consultation type (online/offline) and a timeslot, then clicks "Book".
3. Frontend inserts a new `app_consultations` record in Supabase with status `pending`.
4. Client proceeds to payment. Frontend calls `POST /api/payments` with `action: create-invoice`.
5. Backend generates an invoice number and creates an `app_payments` record.
6. Client selects a payment method (bank transfer, e-wallet, QRIS) and uploads proof of payment.
7. Frontend calls `POST /api/payments` with `action: upload-proof`.
8. Payment enters `waiting_verification` status.
9. Admin reviews the proof in the "Payments" tab and approves or rejects.
10. Upon approval, the payment status becomes `paid` and the consultation status becomes `paid`.

## 4. Real-time Consultation Workflow
1. At the scheduled time, Client and Lawyer enter the `MeetingPage` or `ChatPage`.
2. WebRTC call signaling is handled securely via the `call_signaling` table in Supabase.
3. Messages and file uploads are stored in `messages` and `consultation_documents`.
4. Upon completion, the lawyer marks the consultation as `completed`.
5. Client is prompted to leave a review via the reviews flow.

## 5. AI Rusdi Integration
1. Client accesses the Rusdi AI widget from any authenticated page.
2. Client can ask legal questions or upload documents for analysis.
3. If Client uploads a document, it is saved to Supabase Storage, and the reference is passed to `/api/rusdi/case-analysis`.
4. The backend fetches the document, extracts text, and passes it to the Gemini API using RAG logic.
5. Gemini returns legal analysis and recommends specific lawyer specializations based on the issue.
6. Client can use lawyer recommendations to start a consultation booking.

## 6. Admin CRUD Workflows

### User Management
- Admin navigates to "Clients" tab in the Admin Dashboard.
- Can activate, block, or delete client accounts.
- Delete uses `PATCH /api/admin` with `action: delete-user`.

### Category Management
- Admin navigates to "Categories" tab.
- Can create new categories with name and description via the "Tambah" button.
- Can view lawyer count and consultation count per category.
- Can delete categories using the trash button.

### Consultation Management
- Admin navigates to "Cases" tab for active consultations or "History" tab for archived ones.
- Can view case details via the Detail button.
- Can delete consultations using the trash button.
- Cases are filterable by status: pending, paid, ongoing, in_review, expired.

### Review Management
- Admin navigates to "Reviews" tab.
- Can view all client reviews with ratings and comments.
- Can delete inappropriate reviews using the trash button.

### Transaction Management
- Admin navigates to "Payments" tab.
- Can approve/reject payments waiting for verification.
- Can manually mark payments as paid or rejected.
- Can archive terminal-state transactions (rejected, failed, expired).

### Support Ticket Management
- Admin navigates to "Support" tab.
- Can view open tickets with user details.
- Can reply to tickets (appends response and resolves).
- Can update ticket status (open, resolved, closed).

## 7. Client Dashboard Workflow
1. Client logs in and sees Active Consultations, Consultation History, and Recommended Lawyers.
2. Can view Payment History showing recent transactions.
3. Can access Uploaded Documents from the vault.
4. Can start AI Conversations with Rusdi AI.
5. Can book new consultations or continue existing ones.

## 8. Lawyer Dashboard Workflow
1. Lawyer logs in and sees Total Consultations, Active Cases, Monthly Revenue, Upcoming Appointments, and Average Rating.
2. Can accept or reject incoming consultation requests.
3. Can communicate with clients via chat or video call.
4. Can mark consultations as completed when finished.
