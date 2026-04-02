# CLAUDE.md - @thirty/api

## Overview

NestJS 11 REST API - pure HTTP adapter. CJS module system (NestJS 11 requires CJS). ESM migration planned with NestJS 12 (Q3 2026).

## Role

Controllers import use cases and Prisma repositories from `@thirty/core`, DTOs from `@thirty/shared`. No business logic, no Prisma access, no adapter implementations here.

## Stack

- **Framework**: NestJS 11
- **Auth**: Better Auth via `@thallesp/nestjs-better-auth` (not yet implemented - see ADR-006)
- **Dependencies**: `@thirty/core` (use cases + Prisma adapters), `@thirty/shared` (DTOs, types)

## Key paths

- `src/main.ts` - bootstrap (port, CORS, ValidationPipe)
- `src/app.module.ts` - root module
- `src/common/current-user.decorator.ts` - @CurrentUser() placeholder (hardcoded userId)
- `src/food/food.controller.ts` - food search, recent foods
- `src/journal/journal.controller.ts` - meals, food logs, quick-add
- `src/score/score.controller.ts` - daily score, weekly diversity
- `src/favorite/favorite.controller.ts` - favorites CRUD

## Conventions

- Controllers instantiate use cases with Prisma repos from `@thirty/core/infrastructure`
- DTOs imported from `@thirty/shared` (no local .dto.ts files)
- FK conventions: raw `userId` for Better Auth tables, `userProfileId` with `@relation` for app tables
- No db:* scripts here (managed by `@thirty/db`)

## Scripts

- `dev` - nest start --watch
- `build` - nest build
- `lint` - biome check .
- `check` - tsc --noEmit
- `test` - vitest
