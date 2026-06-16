# Shared Module Architecture Plan

## 1. Executive Summary
This document details the strategy for extracting business logic, APIs, and state management out of the React Web specific domain into a framework-agnostic shared module. This ensures maximum code reuse between the React Web app and the React Native Expo mobile app.

## 2. Directory Restructuring
We will introduce a `packages/shared-core` directory containing:

```
packages/shared-core/
├── api/             # API layer, REST/RPC endpoints
├── auth/            # Supabase auth wrapper logic
├── services/        # AI logic, business aggregations
├── types/           # TypeScript interfaces (Lawyer, Client, etc.)
├── constants/       # Enums, static lists, default settings
└── utils/           # Formatting, mathematical helpers, validators
```

## 3. Migration Details

### 3.1 API (`api.ts` -> `packages/shared-core/api`)
The existing `api.ts` contains Supabase queries. These queries are environment-agnostic. 
- Move `api.ts` directly.
- Ensure Supabase Client instantiation accepts an injected storage adapter (so Web uses `localStorage` and Mobile uses `AsyncStorage`).

### 3.2 Authentication (`supabaseAuth.ts` -> `packages/shared-core/auth`)
- The RBAC logic (Admin vs Client vs Lawyer) remains strictly unchanged.
- The `getStoredUser` functionality will be abstracted to an interface `IStorage` to handle the synchronous vs asynchronous nature of React Native's `AsyncStorage`.

### 3.3 Services (`src/services` -> `packages/shared-core/services`)
- Move `platformData.ts` and AI services.
- `geminiService.ts`: HTTP requests to the AI backend are fully compatible across platforms.

## 4. UI Component Sharing
While React Native cannot render `<div>`, we can use **NativeWind** to share the style definitions.
Instead of sharing components directly initially (which requires universal libraries like Tamagui or React Native Web), we will keep UI logic separate but strictly duplicate the Tailwind strings to ensure 100% visual parity.

## 5. Dependency Management
- All shared core logic must have zero dependencies on `react-dom` or mobile-specific native libraries.
- The `package.json` for `shared-core` will only include cross-platform libraries like `axios`, `date-fns`, `zod`, and `@supabase/supabase-js`.
