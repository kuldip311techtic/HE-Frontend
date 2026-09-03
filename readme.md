# Hoops Engine — Admin

Super Admin panel for the Hoops Engine platform. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui-style components.

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

The app runs at [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source with Prettier |
| `npm run test` | Run Vitest unit tests |

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL including `/api` segment (default: `http://localhost:3300/api`) |

## Routes

| Path | Description |
|------|-------------|
| `/admin/login` | Public sign-in page |
| `/admin/unauthorized` | Access denied for non-admin users |
| `/admin` | Protected dashboard (Super Admin only) |

## Auth

- Login: `POST /v1/auth/login` with email and password
- Bearer token stored in `localStorage` and attached to API requests
- Route guard allows users with `is_super_admin: true` or admin roles

## Project structure

```
src/
  components/   # UI primitives, layout, features
  hooks/        # React Query hooks
  lib/          # API client, auth, utilities
  routes/       # Route config and pages
  theme/        # Design tokens and global CSS
  types/        # TypeScript interfaces
tests/          # Vitest tests
```
