# CLAUDE.md - @thirty/api

## Overview

NestJS 11 REST API. CJS module system (no `"type"` field in package.json - NestJS 11 requires CJS). ESM migration planned with NestJS 12 (Q3 2026).

## Stack

- **Framework**: NestJS 11
- **ORM**: Prisma 7 with driver adapter `PrismaPg`
- **Auth**: Better Auth via `@thallesp/nestjs-better-auth` (not yet implemented - see ADR-006)
- **Dependencies**: `@thirty/core` (business logic), `@thirty/shared` (enums, constants)

## Key paths

- `prisma/schema.prisma` - database schema
- `prisma/prisma.config.ts` - Prisma 7 datasource config (replaces `url` in schema)
- `src/generated/prisma/` - generated Prisma client (not in node_modules)
- `src/prisma-client.ts` - Prisma client singleton

## Conventions

- Prisma client is generated into `src/generated/prisma` (excluded from linting and type-checking)
- Prisma adapter implementations for `@thirty/core` repository ports live here (not in core)
- FK to Better Auth user tables use raw `userId` (no `@relation`) since Better Auth manages its own tables
- FK to app-managed tables use `userProfileId` with `@relation` to `UserProfile`

## Scripts

- `dev` - nest start --watch
- `build` - nest build
- `db:generate` - prisma generate
- `db:push` - prisma db push
- `db:migrate` - prisma migrate dev
- `db:seed` - tsx prisma/seed.ts
- `lint` - biome check .
- `check` - tsc --noEmit
- `test` - vitest
