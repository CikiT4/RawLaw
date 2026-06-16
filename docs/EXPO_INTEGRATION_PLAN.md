# Expo Integration Plan

## 1. Executive Summary
This document outlines the strategic roadmap for integrating React Native Expo into the FINPROSE web application repository. The plan ensures that the mobile expansion shares 100% of the underlying business logic, APIs, and aesthetic design of the web application.

## 2. Monorepo Setup Strategy
To support both the existing Vite/React web application and the new React Native Expo mobile application without duplicating code, the repository will be transitioned into a monorepo structure using package manager workspaces (e.g., Yarn Workspaces or NPM Workspaces).

### Proposed Directory Structure
```
FINPROSE/
├── apps/
│   ├── web/               # Existing Vite React application
│   └── mobile/            # New Expo React Native application
├── packages/
│   ├── shared-core/       # Business logic, Supabase config, Types, Constants
│   ├── ui-components/     # Headless or NativeWind-shared UI components
│   └── eslint-config/     # Shared linting rules
├── package.json           # Workspace root
└── turbo.json             # (Optional) Turborepo build orchestration
```

## 3. Expo Initialization & Configuration

### 3.1. Initialization
- **Command:** `npx create-expo-app apps/mobile`
- **Template:** Blank template with TypeScript.

### 3.2. NativeWind Integration
To preserve the exact CSS-based visual identity without manual translation to `StyleSheet`:
- Install `nativewind` and its peer dependencies.
- Configure `tailwind.config.js` in `apps/mobile` to share tokens with `apps/web`.
- Use the Babel plugin `nativewind/babel`.

### 3.3. Build Profiles (EAS)
- Configure `eas.json` for Expo Application Services.
- Set up profiles for Development (Expo Go / Dev Client), Preview (TestFlight/Internal App Sharing), and Production (App Store/Play Store).

## 4. Feature Porting Strategy

### 4.1. Authentication (Supabase)
- Migrate `supabaseAuth.ts` into `packages/shared-core`.
- Update the Supabase client initialization to use `AsyncStorage` for mobile token persistence, while retaining `localStorage` for web.

### 4.2. File Uploads
- Web uses `<input type="file">`.
- Mobile will implement `expo-document-picker` and `expo-image-picker` to select files natively, converting them to Base64 or FormData blocks matching the web's Supabase upload expectations.

### 4.3. Payments
- Embed existing payment flows (Midtrans/Xendit/QRIS) using `react-native-webview` or deep linking out to local banking applications.

## 5. Development Workflow
1. **Local Dev:** `npm run dev` at the root will start both the Vite dev server and the Expo Metro bundler.
2. **Shared Logic Edits:** Modifying code in `packages/shared-core` will trigger hot-reloads on both web and mobile simultaneously.
3. **Continuous Integration:** Build pipelines will be updated to run web and mobile type checks independently.
