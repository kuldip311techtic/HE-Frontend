# Hoops Engine Super Admin

React + Vite frontend for the Super Admin panel.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Subscriptions Management

Route: `/super-admin/subscriptions`

API base URL is configured via `VITE_API_BASE_URL` (default: `http://localhost:3033/api`).

Subscription endpoints:

- `GET /super-admin/subscriptions`
- `POST /super-admin/subscriptions`
- `PUT /super-admin/subscriptions/{id}`
- `DELETE /super-admin/subscriptions/{id}`

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
