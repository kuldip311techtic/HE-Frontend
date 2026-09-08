# Hoops Engine — Admin

Super Admin panel for the Hoops Engine platform. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui-style components at the **repository root** (no `backend/`, `frontend/`, or `mobile/` wrapper folder).

## Prerequisites

- Node.js 18+
- npm
- Backend API running at `http://localhost:3300/api` (or configure via env)

## Setup

```bash
cp .env.example .env
npm install
```

## Development

```bash
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173). In dev, `VITE_API_BASE_URL=/api` routes API calls through the Vite proxy to `http://localhost:3300`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source with Prettier |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL including `/api` segment. Use `/api` in dev (Vite proxy) or an absolute URL such as `http://localhost:3300/api` for production builds. |

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/admin` |
| `/admin/login` | Public sign-in page |
| `/admin/unauthorized` | Access denied for non-admin users |
| `/admin` | Protected dashboard (Super Admin only) |

## Auth

- Login: `POST /api/v1/auth/login` (ticket alias: `POST /api/super-admin/login`) with email and password
- Bearer token stored in `localStorage` (`hoops_admin_token`, `hoops_admin_user`) and attached to API requests via axios interceptor
- `AdminRouteGuard` allows users with `is_super_admin: true` or `admin` / `super_admin` roles; others redirect to `/admin/unauthorized`

## Project structure

```
package.json
vite.config.ts
tsconfig.json
index.html
.env.example
public/
src/
  main.tsx
  App.tsx
  routes/
    AppRoutes.tsx
    pages/
  components/
    ui/
    layout/
    features/
    shared/
  hooks/
  lib/
    api/
    auth/
    navigation/
    utils/
    validation/
  theme/
  types/
  assets/
tests/
```
