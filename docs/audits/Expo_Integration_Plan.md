# Expo Integration Plan

## Reusable Assets Today
- Business rules in `src/api.ts` can be partially reused after transport cleanup.
- AI orchestration logic in `src/services/*` and `src/ai/services/*` is conceptually reusable.
- Access-control rules in `src/utils/accessControl.ts` can be ported as policy helpers.

## Web-Only Areas To Isolate
- `MeetingPage.tsx` depends on DOM video refs and browser WebRTC media APIs.
- Local storage access is used directly across auth and AI persistence.
- SPA view-state routing in `src/App.tsx` is not mobile-navigation friendly.

## Recommended Mobile Reuse Strategy
- Extract a platform-neutral domain layer for auth, consultations, payments, AI, and signaling contracts.
- Keep Supabase project, payment model, consultation model, and AI backends unchanged.
- Introduce transport adapters for web and mobile.
- Replace browser WebRTC implementation with React Native / Expo-compatible media and signaling layers.

## Blocking Issues Before Expo
- Signaling must be authenticated and TURN-enabled first.
- Auth bootstrap must stop overwriting lawyer data.
- The canonical schema path must be frozen before mobile clients are added.
