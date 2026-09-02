# Hoops Engine — Admin Panel

Production-ready React admin panel for Organization Admin and Super Admin roles.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

The dev server runs at `http://localhost:3033`. Admin routes are under `/admin`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest unit tests |

## Project structure

```
src/
  components/
    auth/         RoleGate
    layout/       AdminLayout, Sidebar, Header
    ui/           shadcn/ui primitives + shared composites
  context/        AuthProvider
  hooks/          useAuth, useOrganizationProfile
  lib/
    api/          client, services, getApiErrorMessage
    auth/         token storage
  pages/admin/    Dashboard, Login, Unauthorized
  routes/         admin routing shell
  theme/          design tokens + global CSS
  types/          auth, API types
tests/            unit tests
```

## Authentication

- Protected routes use `RoleGate` — only `organization_admin`, `super_admin`, and `admin` roles are allowed.
- Non-admin users are redirected to `/admin/unauthorized`.
- API client attaches Bearer token from localStorage via request interceptor.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3300/api` | Backend API base URL |

## Demo sign-in

Use the login page at `/admin/login`. Select **Organization Admin** or **Super Admin** role to access the panel. Coach/Player roles are rejected.
