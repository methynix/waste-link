# Mali — frontend (Next.js App Router, TypeScript)

## Routes (App Router — folders in `app/`)
```
/                         app/page.tsx              landing
/login /register /verify  app/(auth)/...            sign in, sign up, phone OTP
/forgot-password          app/(auth)/forgot-password password reset: request email code
/reset-password           app/(auth)/reset-password  password reset: enter code + new password
/dashboard                app/dashboard/page.tsx     redirects by role
/dashboard/generator      request a pickup + your requests
/dashboard/collector      open jobs + your jobs
/dashboard/market         post listings, browse, make offers
/dashboard/wallet         balance, withdraw, transactions
```
`app/(auth)` and `app/dashboard` each have their own `layout.tsx` (auth shell / guarded dashboard shell).

## Folders
- `components/` — landing sections + `AuthProvider`, `LanguageProvider`, `LanguageToggle`,
  `InstallButton`, `ServiceWorkerRegister`; `components/ui/` (Field, Alert);
  `components/dashboard/` (DashboardNav, StatusBadge).
- `hooks/` — `useAuth`, `useLanguage`, `useInstallPrompt`, `useTx` (bilingual helper).
- `services/` — typed GraphQL: `api.ts` (client + token), `auth.ts`, `collect.ts`,
  `market.ts`, `wallet.ts`.
- `types/` — shared domain types (User, CollectionJob, Wallet, etc.).

## Auth model
Login is by **phone**. **Email is required at registration** and is used for the welcome
email and the password-reset code. Phone is still verified by SMS OTP after sign-up.
The JWT is stored in `localStorage` (`mali-token`) and sent as `Authorization: JWT <token>`.

## Connect the backend
Copy `.env.local.example` to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/
```

## Run
```
npm install
npm run dev
```
PWA install and the service worker only run over HTTPS or on localhost.
