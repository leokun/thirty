# CLAUDE.md - @thirty/core

## Overview

Business logic layer: use cases, pure services, repository ports, and infrastructure adapters (Prisma + in-memory). Clean architecture DDD. Depends on `@thirty/shared` (types) and `@thirty/db` (Prisma client).

## Architecture

6 domains in `src/domains/`:

- **scoring** - 6-axis microbiome score computation (ADR-002)
- **journal** - meal entries, food logs, daily score aggregation
- **diversity** - rolling 7-day plant count tracking
- **suggestion** - rule-based contextual suggestions (no ML)
- **food** - food search, recent foods, user-created foods
- **favorite** - favorite meals management

Shared utilities in `src/domains/shared/` (e.g. `computeTrend`).

## Domain structure

Each domain follows: `repositories/` (ports), `use-cases/` (orchestration classes), `services/` (pure logic), `index.ts`

Types and interfaces live in `@thirty/shared`, not in domain folders.

## Use cases

Use cases are **classes with injected repository ports** that orchestrate reads, pure logic, and writes:

```typescript
class ScoreDayUseCase {
  constructor(private foodLogRepo: FoodLogRepository, private dailyScoreRepo: DailyScoreRepository) {}
  async execute(userId: string, date: string): Promise<DailyScoreBreakdown> { ... }
}
```

Pure service functions (`scoreDay`, `scoreFoodLog`, `computeWeeklyDiversity`) are preserved as internal services called by use case classes.

## File naming

- kebab-case filenames
- Suffixes: `.service.ts`, `.use-case.ts`, `.repository.ts`

## Ports and adapters

- Repository interfaces (ports) live in each domain's `repositories/` folder
- **Prisma adapters** live in `src/infrastructure/` organized by domain
- **In-memory adapters** live alongside Prisma adapters for testing

### Infrastructure organization (by domain)

```
src/infrastructure/
  journal/
    prisma-food-log.repository.ts
    prisma-meal.repository.ts
    prisma-daily-score.repository.ts
    in-memory-food-log.repository.ts
    in-memory-meal.repository.ts
    in-memory-daily-score.repository.ts
  food/
    prisma-food.repository.ts
    in-memory-food.repository.ts
  favorite/
    prisma-favorite.repository.ts
    in-memory-favorite.repository.ts
  diversity/
    in-memory-diversity.repository.ts
  suggestion/
    in-memory-suggestion.repository.ts
```

## Dependencies

- `@thirty/shared` - types, interfaces, enums, constants
- `@thirty/db` - Prisma client for infrastructure adapters
- Must NOT depend on NestJS, React, or any web framework

## Testing

- Colocated test files (`*.test.ts` next to source)
- Use in-memory repository implementations for use-case tests
- Service tests are pure logic, no mocks needed
