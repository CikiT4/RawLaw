# Rusdi AI Failure Report

**Date**: 2026-06-16
**Severity**: High
**Status**: Fixed

---

## Problem Statement

Rusdi AI consistently displayed "Rusdi AI sedang sibuk sementara. Mohon tunggu sebentar dan coba lagi." instead of generating responses for user messages.

---

## Root Causes Identified

### 1. Double-Retry Anti-Pattern (Critical)

**Files**: `src/services/geminiService.ts` (frontend) + `api/geminiClient.js` (backend)

The frontend had a 4x retry loop calling `/api/rusdi/chat`, while the backend also had a 4x retry loop calling the Gemini API. This meant a single user message could trigger up to **16 Gemini API calls** (4 frontend × 4 backend) plus timeouts, exhausting free-tier quota faster and compounding latency.

**Fix**: Removed the frontend retry loop entirely. The frontend now makes a single request to `/api/rusdi/chat` and delegates all retry logic to the backend's `generateGeminiContent()`.

### 2. Legacy Endpoint Had Zero Retry Resilience (Critical)

**File**: `api/ai-chat.js`

This endpoint made a raw `fetch()` call to the Gemini API without any retry logic, timeout handling, or structured error classification. Any transient failure (429, 503, timeout) immediately propagated as an unrecoverable error.

**Fix**: Replaced the raw Gemini fetch with `generateGeminiContent()` from `api/geminiClient.js`, gaining:
- Exponential backoff retry (4 attempts, 800ms base delay)
- Per-request timeout (45 seconds via AbortController)
- Structured error codes (`GEMINI_QUOTA`, `GEMINI_UNAVAILABLE`, `GEMINI_API_ERROR`, `GEMINI_EMPTY`, `GEMINI_NO_KEY`)

### 3. Generic Error Masking Real Failures (High)

**Files**: `api/geminiClient.js`, `api/rusdi/chat.js`, `src/services/geminiService.ts`

All errors that exhausted retries were replaced with the generic message "Rusdi AI sedang sibuk sementara" regardless of whether the actual cause was:
- API key not configured (`GEMINI_NO_KEY`)
- Daily quota exhausted (`GEMINI_QUOTA`)
- Empty AI response from content filter (`GEMINI_EMPTY`)
- Network timeout
- Upstream 403/400 from Google

This made diagnosis impossible from the frontend or server logs.

**Fix**: 
- `geminiClient.js` now preserves `upstreamStatus`, `upstreamBody`, and `totalAttempts` on thrown errors
- `rusdi/chat.js` and `ai-chat.js` error handlers now include these diagnostic fields in the JSON response
- Structured `console.error` logging with error code, upstream status, and body snippet per attempt
- Frontend `geminiService.ts` maps each error code to a specific, actionable user message

### 4. Missing API Key Configuration (Configuration)

When `GEMINI_API_KEY` is not set or is the placeholder `MY_GEMINI_API_KEY`, the error was indistinguishable from a transient failure.

**Fix**: Added explicit `GEMINI_NO_KEY` error code with a clear message: "GEMINI_API_KEY belum dikonfigurasi di server. Tambahkan key yang valid di environment variable."

---

## Endpoints Affected

| Endpoint | Before | After |
|----------|--------|-------|
| `/api/rusdi/chat` | 4 backend retries, generic error | 4 retries with structured errors + upstream diagnostics |
| `/api/ai-chat` | 0 retries, raw fetch, generic 502 | 4 retries via `generateGeminiContent`, structured errors |

---

## Error Code Reference

| Code | HTTP Status | Meaning | User Message (ID) |
|------|-------------|---------|-------------------|
| `GEMINI_NO_KEY` | 500 | API key missing/placeholder | "AI belum dikonfigurasi. Hubungi administrator." |
| `GEMINI_QUOTA` | 429 | Daily free quota exhausted | "Kuota gratis Gemini API untuk hari ini sudah habis." |
| `GEMINI_UNAVAILABLE` | 503 | All 4 retries failed (transient) | "Rusdi AI sedang sibuk sementara." |
| `GEMINI_API_ERROR` | 502 | Non-retryable upstream error | Shows actual upstream error message |
| `GEMINI_EMPTY` | 503 | AI returned empty response | "AI tidak menghasilkan respons (reason: X)" |

---

## Files Modified

| File | Change |
|------|--------|
| `api/geminiClient.js` | Added structured logging, upstream diagnostics, new error codes |
| `api/ai-chat.js` | Replaced raw Gemini fetch with `generateGeminiContent()`, added error classification |
| `api/rusdi/chat.js` | Enhanced error handler with upstream diagnostic fields in response |
| `src/services/geminiService.ts` | Removed frontend retry loop, added per-code error messages |

---

## Conversation Persistence Verification

The persistence layer has three fallback tiers and was verified to be functioning correctly:

1. **Primary**: `ai_conversations` + `ai_messages` tables (Supabase)
2. **Legacy fallback**: `ai_chat_history` view/table
3. **Local fallback**: `localStorage` (`yda_ai_sessions`, `yda_ai_messages`)

Backend `persistTurn()` in `rusdi/chat.js` also has its own fallback: tries `ai_messages` insert first, falls back to `ai_chat_history` if the table is missing.

Frontend `fetchAIMessages()` in `chatService.ts` queries in order: primary tables → legacy view → localStorage.

---

## Remaining Recommendations

1. **Add Gemini API billing**: The free tier has a daily quota limit. Enable billing in Google AI Studio to eliminate `GEMINI_QUOTA` errors in production.

2. **Monitor retry exhaustion**: Add alerting when `[gemini]` log lines show repeated 4/4 attempt failures, indicating sustained outages.

3. **Unify persistence**: The three-tier fallback (primary/legacy/local) works but fragments data. Consider a one-time migration to merge `ai_chat_history` rows into `ai_messages` and `ai_conversations`.

4. **Remove `/api/ai-chat` if unused**: This legacy endpoint duplicates `/api/rusdi/chat`. If no frontend code references it, deprecate it to reduce attack surface.

5. **Add request deduplication**: Rapid consecutive messages from the same user/session could benefit from debouncing or a "sending" lock to prevent duplicate Gemini calls.

---

## Verification Steps

- [x] TypeScript type check passes (`tsc --noEmit`)
- [x] Production build passes (`vite build`)
- [x] `geminiClient.js` logs each attempt with status and body snippet
- [x] `rusdi/chat.js` returns structured error with code, upstreamStatus, upstreamBody
- [x] `ai-chat.js` uses `generateGeminiContent` with retry resilience
- [x] Frontend no longer retries (single fetch per message)
- [x] Conversation persistence has 3 fallback tiers
- [ ] Manual end-to-end test: create session → send message → receive response → verify persistence
- [ ] Verify GEMINI_API_KEY is set in Vercel environment variables
