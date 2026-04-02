# CLAUDE.md - Thirty

## Project

Thirty is a gut microbiome-focused food tracker, built as a mobile-first PWA.
The core goal is to help users reach 30 different plant foods per rolling week,
while scoring their entire diet (including non-plant foods) on microbiome impact.

## Tech Stack

- **Language**: TypeScript 6.0 (native ESM, strict by default)
- **Runtime**: Node.js 24 LTS
- **Frontend**: React 19.2 + Vite 8 + Tailwind 4.2 + TanStack (Query, Router, Form, Table, Virtual)
- **Backend**: NestJS 11 (migration to 12 ESM planned Q3 2026)
- **Database**: PostgreSQL 17 via Prisma 7 (driver adapter `PrismaPg`)
- **Auth**: Better Auth (`@thallesp/nestjs-better-auth`)
- **Monorepo**: pnpm 11 (local via Corepack) + Turborepo 2.9
- **Linting**: Biome 2.4
- **Tests**: Vitest + React Testing Library
- **Infra**: Coolify v4 on Hetzner VPS CX22

## Monorepo Architecture

```
apps/web        -> React PWA mobile-first
apps/api        -> NestJS API (pure HTTP adapter)
packages/shared -> Types, interfaces, DTOs, validators Zod, enums, constants (@thirty/shared)
packages/db     -> Prisma schema, client, migrations, seed data (@thirty/db)
packages/core   -> Business logic, use cases, ports, Prisma adapters (@thirty/core)
```

## Conventions

- **ESM everywhere** except the NestJS app (CJS in v11, ESM in v12)
- **Biome** for formatting and linting (no ESLint/Prettier)
- **Prisma 7**: schema and client in `@thirty/db` (`packages/db/src/generated/prisma`), driver adapter `PrismaPg` required
- **ADRs** in `docs/adr/` - every technical decision is documented
- **Core**: clean architecture DDD per domain (scoring, journal, diversity, suggestion, food, favorite). Use cases, pure ports, and Prisma adapters in `@thirty/core`. In-memory repos for testing. Business types/interfaces (`MicrobiomeProfile`, `PreparationModifier`, `DailyScoreBreakdown`) live in `@thirty/shared` (ADR-009).
- **Scoring**: explicit business rules, no ML (ADR-002). The scoring engine lives in `@thirty/core/domains/scoring`, pure TS, testable in isolation.
- **Tests**: colocated (`*.test.ts` next to the source file). Strict unit scope: a use-case test mocks repositories via in-memory implementations, a service test only tests its pure logic.
- **Food database**: manually curated (300-500 foods), quality > quantity (ADR-003)
- **Commits**: always follow the gitmoji conventions from the `/standards` skill before committing. Format: `<gitmoji> [<domain>] <imperative summary>`

## Business Domain

### Microbiome Scoring (6 axes, score out of 100)
1. Plant diversity (25%) - 30 plants / rolling week counter
2. Prebiotic fibers (20%) - inulin, FOS, GOS, resistant starch
3. Fermented foods (20%) - plant AND animal-based
4. Polyphenols (10%) - berries, tea, coffee, cocoa
5. Mucosal support (15%) - omega-3, collagen, zinc
6. Preparation method (10%) - bonus for lacto-fermented/raw, penalty for fried

### Preparation Method
The same food has a different score depending on preparation (ADR-005).
System: base_score x preparation_factor + bonus, with optional override for fermented foods.

### Rolling Week
D-6 to D (not calendar-based). No Monday reset (ADR-004).

## Documentation

- Full PRD: `docs/prd.md`
- ADRs: `docs/adr/adr_001.md` through `adr_008.md`
- Prisma schema: `packages/db/prisma/schema.prisma`
