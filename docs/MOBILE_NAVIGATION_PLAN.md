# Mobile Navigation Plan

## 1. Executive Summary
This document outlines how the state-based and URL-based navigation used in the FINPROSE web application will be translated to a native mobile navigation paradigm using `React Navigation` in Expo.

## 2. Navigation Architecture

### 2.1. Root Navigator (Stack)
The top-level navigator will control the authentication flow and modals that overlay the entire screen (like Video Calls).

```
RootStack
├── Splash
├── AuthStack (Login, Register)
├── MainTabNavigator (Authenticated users)
└── Modals (Video Consultation Room, Payment Webview, Rusdi AI Fullscreen)
```

### 2.2. Main Tab Navigator
For mobile, the persistent sidebar used on the web will be replaced by a Bottom Tab Navigator. The tabs will vary dynamically based on the user's Role (RBAC).

**Client Tabs:**
1. **Home:** Landing Page equivalent + Dashboard.
2. **Consult:** Find Lawyers & Categories.
3. **History:** Past cases and transactions.
4. **Messages:** Active chat sessions and Rusdi AI widget.
5. **Profile:** Settings, Language, Logout.

**Lawyer Tabs:**
1. **Dashboard:** Upcoming appointments, stats.
2. **Cases:** Active cases and history.
3. **Payments:** Payment verifications and earnings.
4. **Profile:** Settings.

**Admin Tabs:**
1. **Dashboard:** Core stats.
2. **Users:** User management list.
3. **Lawyers:** Lawyer verifications.
4. **Settings:** Platform configuration.

## 3. Deep Linking Strategy
Using Expo's linking configuration, we will map standard URLs (e.g., `finprose://consultation/123`) to allow push notifications to route users directly to specific chat rooms or payment verification screens.

## 4. Hardware Integrations
- **Android Back Button:** Will be handled natively to pop the navigation stack. If at the root of a tab, it will prompt to exit the app.
- **Swipe Gestures:** iOS swipe-to-go-back will be enabled on all stack screens.
