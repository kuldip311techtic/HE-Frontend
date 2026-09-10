# Hoops Engine — Admin

Super Admin panel for the Hoops Engine platform (React + Vite + TypeScript).

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:3300/api`) |
| `VITE_DEV_ADMIN_BYPASS` | Seeds a mock Super Admin session without a backend. Defaults to enabled in `npm run dev`; set to `false` to require real login locally |

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test` — Vitest unit tests
- `npm run typecheck` — TypeScript check

## Routes

- `/` — redirects to dashboard (authenticated admin) or login
- `/admin/login` — Super Admin sign in
- `/admin/dashboard` — platform metrics overview
- `/admin/organizations` — manage organizations
- `/admin/users` — manage coaches and players
- `/admin/subscriptions` — manage subscription plans
- `/admin/support-requests` — support request inbox
- `/admin/unauthorized` — forbidden for non-admin roles
