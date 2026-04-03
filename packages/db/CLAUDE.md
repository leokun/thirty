# CLAUDE.md - @thirty/db

## Overview

Centralized database package: Prisma schema, generated client, PrismaPg connection, migrations, and seed data. Absorbs the former `@thirty/food-db` package and `apps/api/prisma/`.

## Key paths

- `prisma/schema.prisma` - database schema
- `prisma.config.ts` - Prisma 7 datasource config (must be at package root)
- `src/client.ts` - PrismaPg connection singleton
- `src/generated/prisma/` - generated Prisma client (not in node_modules)
- `src/index.ts` - re-exports prisma client + generated types
- `seed/` - food database seed data + validation

## Seed data (`seed/`)

- `types.ts` - FoodDefinition interface
- `validate.ts` - Zod validation (scores 0-5, preparations, months)
- `data/` - food files by category (vegetables, fruits, legumes, grains, nuts-seeds, herbs-spices, dairy, cheese, fish, eggs, fermented-condiments, beverages)
- `seed.ts` - upsert foods + preparation modifiers + dev user

## Dependencies

- `@prisma/client`, `@prisma/adapter-pg` - Prisma 7 with PrismaPg driver adapter
- `@thirty/shared` - enums, types
- `zod` - seed data validation

## Scripts

- `db:generate` - prisma generate
- `db:push` - prisma db push
- `db:migrate` - prisma migrate dev
- `db:seed` - tsx seed/seed.ts

## Conventions

- Generated client output in `src/generated/prisma/` (excluded from linting and type-checking)
- FK to Better Auth user tables use raw `userId` (no `@relation`)
- FK to app-managed tables use `userProfileId` with `@relation` to `UserProfile`
- ESM native (`"type": "module"`)
