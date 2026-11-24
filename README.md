# Partnero Enterprise API

Node.js + Express 5 + TypeScript backend.

## Run

```
pnpm install
cp .env.example .env
pnpm dev
```

## Structure

```
src/
  config/       env config
  lib/          errors, in-memory store, generic CRUD router
  middleware/   auth (JWT), error handling
  modules/      auth, programs, partners, referrals, commissions, payouts
  routes.ts     mounts everything under /api/v1
```

## Endpoints (`/api/v1`)

- `GET /health`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- CRUD (JWT required): `/programs`, `/partners`, `/referrals`, `/commissions`, `/payouts`

Storage is in-memory for now; swap `MemoryStore` for a database repository.
