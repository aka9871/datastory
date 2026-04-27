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
- **Auth**: Custom JWT auth (bcrypt passwords, JWT tokens stored in localStorage)
- **Frontend**: React + Vite + Tailwind v4

## Artifacts

- **datastory** (`/datastory/`) — Main React+Vite web app
- **api-server** (`/api/`) — Express API backend (port 8080)

## Datastory Features

- **Authentication**: Custom email/password login, JWT sessions, no Clerk
- **Roles**: admin (full access), brand_admin (scoped to their company), viewer (read dashboards only)
- **Dashboard portal**: Card grid of assigned Looker Studio dashboards
- **Dashboard viewer**: Full-screen iframe embedding Looker Studio dashboards
- **Admin panel**: CRUD for companies, franchises, users, dashboards
- **BBDO Brand**: Dark theme (#0D0D0D bg), BBDO red (#FF091B) accent, blue (#1863DC), Commissioner/Outfit fonts, 0px border radius

## DB Schema (Drizzle, PostgreSQL)

Table names are quoted mixed-case: `"Company"`, `"Franchise"`, `"Dashboard"`, `"User"`, `"DashboardFranchise"`, `"DashboardUser"`.

Drizzle exports: `companyTable`, `franchiseTable`, `dashboardTable`, `userTable`, `dashboardFranchiseTable`, `dashboardUserTable`.

- `Company`: id, name, slug, logoUrl, industry, createdAt, updatedAt
- `Franchise`: id, name, createdAt, updatedAt  
- `Dashboard`: id, name, companyId (FK→Company), lookerUrl, createdAt, updatedAt
- `User`: id, firstname, lastname, email, password (bcrypt), role (admin|brand_admin|viewer), companyId, franchiseId, isActive, createdAt, updatedAt
- `DashboardUser`: dashboardId, userId (junction table — user-specific dashboard access)
- `DashboardFranchise`: dashboardId, franchiseId (junction table — franchise-level dashboard access)

## Admin Credentials

- Email: `ali.khedji@omc.com`
- Password: `Datastory2026!`
- Role: admin (global, no company)

## API Routes

All routes mounted under `/api`:
- `POST /api/auth/login` — login, returns JWT
- `GET /api/auth/me` — get current user (requires auth)
- `POST /api/auth/logout` — clear cookie
- `GET /api/companies` — list companies
- `GET /api/franchises` — list franchises
- `GET /api/dashboards` — list dashboards (filtered by role)
- `GET /api/users` — list users (filtered by role)
- `POST /api/users` — create user (admin/brand_admin)
- `PATCH /api/users/:id` — update user
- `DELETE /api/users/:id` — delete user

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run seed` — seed the database with initial data
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Important Notes

- After running codegen, manually fix `lib/api-zod/src/index.ts` to only export from `./generated/api` (not `./generated/types` — it causes duplicate export conflicts)
- Date fields from DB must be serialized to ISO strings before passing to Zod response schemas
- JWT_SECRET is set as a shared environment variable (128-char hex string)
- JWT token stored in localStorage as `datastory_token`, also set as httpOnly cookie
- Frontend auth context: `artifacts/datastory/src/hooks/useAuth.tsx`
- API auth middleware: `artifacts/api-server/src/middlewares/authMiddleware.ts`
