# WebRTC Audit Report

## Confirmed Implementation
- Call UI and peer lifecycle live in `src/components/MeetingPage.tsx:83-262`.
- Ringing state is driven from `src/components/ChatPage.tsx:52-85` and `153-186`.
- Signaling transport is polling through `fetchCallSignals()` and `sendCallSignal()` in `src/api.ts:1168-1185`, backed by `api/calls.js`.

## Exact Root Causes
- The implementation is STUN-only. `RTCPeerConnection` is configured with public STUN servers only and no TURN relay. Evidence: `src/components/MeetingPage.tsx:193-198`. This will fail for symmetric NAT, restrictive enterprise networks, many mobile carriers, and some Safari/iOS paths.
- Signaling has no authenticated participant validation at the runtime layer. `api/calls.js:19-38` trusts `consultationId` and `senderId` from the request body and writes with the service role.
- Signaling uses polling only, not Supabase Realtime. Evidence: `src/components/MeetingPage.tsx:228-236`, `src/components/ChatPage.tsx:56-79`. This adds latency, race exposure, and stale state windows.
- `signalSinceRef` and `callSignalSinceRef` are never advanced after fetches. Evidence: `src/components/MeetingPage.tsx:58,228-233`; `src/components/ChatPage.tsx:43,56-76`. The code keeps re-fetching the full trailing window and relies only on in-memory de-duplication.
- Offer creation is client-only. Evidence: `src/components/MeetingPage.tsx:238-243`. If both sides enter the meeting page from inconsistent flows, the lawyer never initiates renegotiation and can remain stuck waiting.
- Cleanup emits `leave` unconditionally on component unmount. Evidence: `src/components/MeetingPage.tsx:251-260`. Any navigation away from the meeting page signals the remote peer to end, even if the unmount was caused by an unrelated UI/state transition.

## Browser and Device Impact
- Chrome and Edge: likely to work only on favorable NAT paths because STUN-only can succeed on simple home networks.
- Firefox: more sensitive to timing/order around ICE and autoplay; polling-only signaling increases race risk.
- Safari macOS and iOS: highest risk due to stricter media permission prompts, autoplay behavior, and weaker tolerance for non-relayed peer paths.
- Android/iOS mobile browsers: higher disconnect risk under network handoff, backgrounding, and permission interruption because there is no reconnection or ICE restart strategy.

## Missing Production Requirements
- TURN credentials and relay fallback.
- ICE restart logic.
- Connection timeout and retry policy.
- `oniceconnectionstatechange`, `onnegotiationneeded`, `onicegatheringstatechange`, and richer failure telemetry.
- Realtime channel support or server-side event fanout.

## Production Recommendations
- Add TURN and make relay available for all production calls.
- Authenticate signaling requests server-side and verify consultation ownership plus consultation/payment state before read/write.
- Advance polling cursors or replace polling with Realtime.
- Distinguish intentional hang-up from component unmount or navigation side effects.
