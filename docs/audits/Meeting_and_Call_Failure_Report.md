# Meeting & Call Failure Report

## Confirmed Failure Modes
- Calls disconnect automatically.
- Calls remain stuck on "Calling Lawyer" / waiting states.
- Calls never connect across some networks/devices.
- Users can be forced out of meetings by unrelated state changes.

## Root Cause Mapping
- Automatic disconnects are caused by unconditional `leave` emission during cleanup. Evidence: `src/components/MeetingPage.tsx:251-255`.
- "Calling Lawyer" stalls occur when the callee never processes or answers the offer in time, or when signaling writes/reads succeed without actual peer connectivity. Evidence: `src/components/MeetingPage.tsx:225-243`, `api/calls.js:19-38`.
- Never-connect scenarios are structurally expected without TURN. Evidence: `src/components/MeetingPage.tsx:193-198`.
- Users are forced out because the app mutates consultation state on ordinary navigation. `leaveConsultationView()` marks the consultation `completed` when the client backs out of chat. Evidence: `src/App.tsx:205-216`. Once completed, session access is no longer intended to stay active.
- Meeting access is granted to all lawyers regardless of consultation ownership in frontend routing logic. Evidence: `src/utils/accessControl.ts:168-170`.

## Additional Contributing Factors
- Ring accept flow does not confirm the remote caller is still present before opening the meeting page. Evidence: `src/components/ChatPage.tsx:251-256`.
- Polling intervals are short and duplicated between chat and meeting pages, but there is no server cleanup/retention strategy for `call_signals`.
- No browser permission preflight exists before showing meeting-ready states.

## Recommendations
- Only emit `leave` for explicit hang-up or confirmed tab-close intent.
- Stop auto-completing consultations when a client exits chat; complete only after an explicit consultation-ending workflow.
- Enforce consultation ownership and payment/status checks before showing either chat or meeting pages.
- Add TURN, timeouts, and failure telemetry.
