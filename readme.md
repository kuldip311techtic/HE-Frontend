# Hoops Engine — Admin Panel

Production-ready React admin panel for Organization Admin and Super Admin roles.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server (http://localhost:3033)
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format source with Prettier |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
  main.tsx              # App entry point
  App.tsx               # Routing and layout shell
  routes/               # Route modules and guards
  pages/                # Page components
  components/
    ui/                 # shadcn/ui primitives
    layout/             # Admin layout shell
    shared/             # Reusable composites
  hooks/                # React hooks (auth, etc.)
  lib/
    api/                # API client and services
    auth/               # Auth storage and roles
  theme/                # Design tokens
  types/                # TypeScript types
tests/                  # Unit tests
```

## Admin Access

Navigate to `/admin`. Unauthenticated users are redirected to `/unauthorized`. Use **Continue as Demo Admin** to enter with an Organization Admin role for local development.

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3300/api` |

## Tech Stack

- React 18 + TypeScript + Vite
- React Router v6
- TanStack Query
- shadcn/ui (Radix + Tailwind CSS)
- Sonner (toast notifications)
- Axios (API client with auth interceptor)
