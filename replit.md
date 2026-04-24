# Workspace

## Overview

pnpm workspace monorepo using TypeScript. This project hosts the **Datastory** application — a premium client dashboard portal built by BBDO Paris agency for managing and viewing client Looker Studio dashboards.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Clerk (Replit-managed)
- **Frontend**: React + Vite + Tailwind v4

## Artifacts

- **datastory** (`/datastory/`) — Main React+Vite web app with Clerk auth
- **api-server** (`/api/`) — Express API backend

## Datastory Features

- **Authentication**: Clerk-powered login/signup with BBDO Paris branding
- **Dashboard portal**: Card grid view of client dashboards
- **Dashboard viewer**: Full-screen iframe embedding Looker Studio dashboards
- **Admin panel**: CRUD for clients and dashboards (any authenticated user is admin)
- **BBDO Brand**: Dark theme (#0D0D0D bg), BBDO red (#FF091B) accent, Commissioner/Outfit fonts, square corners

## DB Schema

- `clients` table: id, name, slug (unique), logoUrl, industry, description, active, timestamps
- `dashboards` table: id, clientId (FK→clients), title, description, lookerstudioUrl, thumbnailUrl, category, order, active, timestamps

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Important Notes

- After running codegen, manually fix `lib/api-zod/src/index.ts` to only export from `./generated/api` (not `./generated/types` — it causes duplicate export conflicts)
- Date fields from DB must be serialized to ISO strings before passing to Zod response schemas
- Clerk proxy middleware is at `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
