# CLAUDE.md - @thirty/core

## Overview

Pure TypeScript business logic layer. Clean architecture DDD. Zero framework dependencies.

## Architecture

4 domains in `src/domains/`:

- **scoring** - 6-axis microbiome score computation (ADR-002)
- **journal** - meal entries, food logs, daily score aggregation
- **diversity** - rolling 7-day plant count tracking
- **suggestion** - rule-based contextual suggestions (no ML)

Shared utilities in `src/domains/shared/` (e.g. `computeTrend`).

## Domain structure

Each domain follows: `entities/`, `value-objects/`, `services/`, `use-cases/`, `repositories/` (ports), `index.ts`

## File naming

- kebab-case filenames
- Suffixes: `.entity.ts`, `.vo.ts`, `.service.ts`, `.use-case.ts`, `.repository.ts`

## Ports and adapters

- Repository interfaces (ports) live in each domain's `repositories/` folder
- In-memory implementations for testing in `src/infrastructure/repositories/`
- Prisma implementations live in `apps/api` (not here)

## Dependencies

- Depends only on `@thirty/shared` (enums, constants)
- Must NOT depend on NestJS, Prisma, React, or any framework
- Business interfaces (`MicrobiomeProfile`, `PreparationModifier`, `DailyScoreBreakdown`) live here, not in shared (ADR-008)

## Testing

- Colocated test files (`*.test.ts` next to source)
- Use in-memory repository implementations for use-case tests
- Service tests are pure logic, no mocks needed
- No tests exist yet
