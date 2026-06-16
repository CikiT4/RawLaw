# WebRTC Mobile Compatibility Report

## 1. Executive Summary
The FINPROSE platform uses WebRTC for real-time video and voice consultations between clients and lawyers. While modern web browsers have native implementations of the `getUserMedia` API, React Native requires bridging libraries to access the device's camera and microphone streams.

## 2. Library Selection
To maintain exactly the same signaling logic (via Supabase Realtime or custom sockets), we will use `react-native-webrtc`.
- **Why?** It exposes the standard WebRTC API (`RTCPeerConnection`, `MediaStream`, `RTCIceCandidate`) to React Native, meaning the existing Javascript signaling logic requires zero changes.

## 3. UI Component Adjustments
On the web, remote streams are attached to an HTML `<video>` element using a `ref`:
```javascript
videoRef.current.srcObject = stream;
```

In React Native Expo, this must be conditionally swapped to use `<RTCView>`:
```javascript
import { RTCView } from 'react-native-webrtc';
// Mobile Implementation
<RTCView streamURL={stream.toURL()} style={styles.video} objectFit="cover" />
```

## 4. Permissions Lifecycle
Mobile OSs (iOS/Android) require explicit permission dialogues.
We must update `app.json` (Expo config) to include:
- `NSCameraUsageDescription`: "FINPROSE requires camera access for virtual legal consultations."
- `NSMicrophoneUsageDescription`: "FINPROSE requires microphone access for voice and video consultations."

The consultation workflow must be updated to check these permissions gracefully before mounting the WebRTC room.

## 5. Background and Lifecycle Limitations
- **iOS:** Video streams generally pause when the app goes into the background unless specific background audio modes are enabled. We must implement listeners for AppState changes to temporarily disable the camera feed to prevent crashes.
- **Android:** Foreground services may be required if a call needs to persist while the user opens another app. For this phase, we will enforce that the consultation screen must remain in the foreground.
