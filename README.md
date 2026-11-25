# Partnero Enterprise API

Node.js + Express 5 + TypeScript backend with PostgreSQL via Prisma.

## Run

```
pnpm install
cp .env.example .env   # set DATABASE_URL
pnpm prisma migrate dev --name init
pnpm dev
```

## Structure

```
prisma/schema.prisma  database models
src/
  config/       env config
  lib/          errors, prisma client, generic CRUD router
  middleware/   auth (JWT), error handling
  modules/      auth, programs, partners, referrals, commissions, payouts
  routes.ts     mounts everything under /api/v1
```

## Endpoints (`/api/v1`)

- `GET /health`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- CRUD (JWT required): `/programs`, `/partners`, `/referrals`, `/commissions`, `/payouts`
