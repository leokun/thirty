---
name: clean-archi
description: Clean Architecture DDD patterns for @thirty/core - use cases, services, ports & adapters
license: MIT
metadata:
  author: thirty
  version: "1.0.0"
---

# Clean Architecture - DDD Patterns

Architecture rules for `@thirty/core` and how it connects to `apps/api` and `apps/web`.

## Package Dependency Rules

```
@thirty/shared  <-  @thirty/db    <-  @thirty/core  <-  @thirty/api
                <-  @thirty/web                      <-  @thirty/web (via shared only)
```

| From             | Can import                                               | Cannot import       |
|------------------|----------------------------------------------------------|---------------------|
| `@thirty/shared` | Nothing (leaf package)                                   | db, core, api, web  |
| `@thirty/db`     | `@thirty/shared`                                         | core, api, web      |
| `@thirty/core`   | `@thirty/shared`, `@thirty/db`                           | api, web            |
| `@thirty/api`    | `@thirty/core` (transitively gets shared + db)           | web                 |
| `@thirty/web`    | `@thirty/shared`                                         | db, core, api       |

Critical rule: `@thirty/core` NEVER imports from `@thirty/api` or any web framework. It depends on `@thirty/shared` (types) and `@thirty/db` (Prisma client for infrastructure adapters).

## Domain Structure

Six domains in `packages/core/src/domains/`:

```
domains/
├── scoring/        # Microbiome scoring engine (6 axes)
│   ├── constants/
│   └── services/
├── journal/        # Food logging, daily scoring orchestration
│   ├── repositories/
│   └── use-cases/
├── diversity/      # Rolling window, plant counting
│   ├── repositories/
│   ├── services/
│   └── use-cases/
├── suggestion/     # Contextual suggestions engine
│   ├── repositories/
│   ├── services/
│   └── use-cases/
├── food/           # Food search, recent foods, user-created foods
│   ├── repositories/
│   └── use-cases/
└── favorite/       # Favorite meals management
    ├── repositories/
    └── use-cases/
```

Not every domain has every folder. Only create what is needed:
- `scoring` has no repositories (pure computation)
- `journal` has no services (use cases orchestrate directly)

## Building Blocks

### Types & Interfaces

All domain types and interfaces (previously VOs and entities) live in `@thirty/shared`, not in domain folders. Import them:
```typescript
import type { MicrobiomeProfile, ComputedFoodScore } from '@thirty/shared';
import type { FoodLogEntry, DayData } from '@thirty/shared';
```

### Service (.service.ts)

Pure function(s). No side effects. No I/O. Stateless.

```typescript
// domains/scoring/services/compute-diversity-score.service.ts

import { WEEKLY_PLANT_GOAL } from '@thirty/shared';

export function computeDiversityScore(plantCount: number): number {
  if (plantCount >= WEEKLY_PLANT_GOAL) return 100;
  if (plantCount >= 20) return 60 + (plantCount - 20) * 4;
  if (plantCount >= 10) return 20 + (plantCount - 10) * 4;
  return plantCount * 2;
}
```

One file can export multiple related functions. Group by cohesion (e.g., `rolling-window.service.ts` exports `computeWindowStart`, `filterToWindow`, `flattenFoodLogs`, `countDistinct`, `uniqueFoodIds`).

### Use Case (.use-case.ts)

Orchestrates services and repositories. Use cases are classes with ports injected via the constructor. They never depend on implementations directly.

```typescript
// domains/journal/use-cases/add-food-log.use-case.ts

import type { FoodLogRepository } from '../repositories/food-log.repository.js';
import type { DailyScoreRepository } from '../repositories/daily-score.repository.js';
import type { AddFoodLogInput } from '@thirty/shared';

export class AddFoodLogUseCase {
  constructor(
    private foodLogRepo: FoodLogRepository,
    private dailyScoreRepo: DailyScoreRepository,
  ) {}

  async execute(mealId: string, input: AddFoodLogInput): Promise<void> {
    await this.foodLogRepo.addFoodLog(mealId, input);
    // recompute score...
  }
}
```

Pure service functions (`scoreDay`, `scoreFoodLog`) are preserved as internal services called by use case classes.

### Repository Interface - Port (.repository.ts)

Defines the contract. Lives in the domain. Always an interface, never a class.

```typescript
// domains/journal/repositories/food-log.repository.ts

import type { DayData, AddFoodLogInput } from '@thirty/shared';

export interface FoodLogRepository {
  getDayData(userId: string, date: string): Promise<DayData>;
  getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]>;
  addFoodLog(mealId: string, input: AddFoodLogInput): Promise<void>;
}
```

Rules:
- Methods return domain types (from `@thirty/shared`), never Prisma types
- Ports include both read and write methods as needed by use cases
- Always `Promise`-based (even if in-memory impl is sync)
- Keep the interface minimal: only methods the use cases actually need

### In-Memory Repository - Test Adapter

Lives in `packages/core/src/infrastructure/<domain>/`, organized by domain.

```typescript
// infrastructure/journal/in-memory-food-log.repository.ts

import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import type { DayData, AddFoodLogInput } from '@thirty/shared';

export class InMemoryFoodLogRepository implements FoodLogRepository {
  private days = new Map<string, DayData>();

  async getDayData(userId: string, date: string): Promise<DayData> {
    const key = `${userId}:${date}`;
    return this.days.get(key) ?? { date, meals: [] };
  }

  async getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]> {
    // filter logic
  }

  async addFoodLog(mealId: string, input: AddFoodLogInput): Promise<void> {
    // in-memory write logic
  }

  // Test helpers (not in the interface)
  seed(userId: string, days: DayData[]): void {
    for (const day of days) {
      this.days.set(`${userId}:${day.date}`, day);
    }
  }

  clear(): void {
    this.days.clear();
  }
}
```

Pattern:
- `seed(...)` and `clear()` are test helpers, not part of the port interface
- Uses `Map` for storage
- Key format: `${userId}:${discriminator}`

### Prisma Repository - Production Adapter

Lives in `packages/core/src/infrastructure/<domain>/`, organized by domain. Implements the same port using Prisma.

```typescript
// packages/core/src/infrastructure/journal/prisma-food-log.repository.ts

import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import type { DayData } from '@thirty/shared';
import { prisma } from '@thirty/db';

export class PrismaFoodLogRepository implements FoodLogRepository {
  async getDayData(userId: string, date: string): Promise<DayData> {
    const meals = await prisma.mealEntry.findMany({
      where: { userProfileId: userId, date: new Date(date) },
      include: { foodLogs: { include: { food: true } } },
    });
    return { date, meals: meals.map(toDomainMeal) };
  }
}
```

Rules:
- Prisma types NEVER leak into domain code
- Mapping from Prisma model to domain types happens here
- Import domain types from `@thirty/shared`
- Import Prisma client from `@thirty/db`

## Domain Index File Pattern

Each domain has an `index.ts` that re-exports its public API:

```typescript
// domains/scoring/index.ts

// --- Services ---
export { computeDailyScore } from './services/compute-daily-score.service.js';
export type { DailyScoreInput } from './services/compute-daily-score.service.js';

// --- Constants ---
export { PREPARATION_DEFAULTS } from './constants/preparation-defaults.js';
```

```typescript
// domains/journal/index.ts

// --- Use Cases ---
export { AddFoodLogUseCase } from './use-cases/add-food-log.use-case.js';

// --- Repositories (ports) ---
export type { FoodLogRepository } from './repositories/food-log.repository.js';
export type { DailyScoreRepository } from './repositories/daily-score.repository.js';
```

Rules:
- Types use `export type { ... }`
- Functions/classes use `export { ... }`
- Group by artifact type with section comments
- The root `src/index.ts` re-exports all domain indexes

## Cross-Domain Imports

Domains CAN import from each other within core. Dependency direction:

```
scoring   <-  journal     (journal uses scoring services)
diversity <-  journal     (journal uses diversity counting)
journal   <-  suggestion  (suggestion reads journal breakdown)
diversity <-  suggestion  (suggestion reads diversity result)
food      <-  journal     (journal references food data)
food      <-  favorite    (favorite references food data)
```

Import via relative path, not via the domain index:
```typescript
// In journal/use-cases/score-day.use-case.ts
import { computeDiversityScore } from '../../scoring/services/compute-diversity-score.service.js';
import { countDistinct } from '../../diversity/services/rolling-window.service.js';
```

## What Goes Where

| Artifact                     | Package          | Location                                              |
|------------------------------|------------------|-------------------------------------------------------|
| Types, interfaces, DTOs      | `@thirty/shared` | `packages/shared/src/`                                |
| Enums, constants             | `@thirty/shared` | `packages/shared/src/`                                |
| Zod validators               | `@thirty/shared` | `packages/shared/src/validators/`                     |
| Business logic (services)    | `@thirty/core`   | `packages/core/src/domains/<domain>/services/`        |
| Use cases (classes)          | `@thirty/core`   | `packages/core/src/domains/<domain>/use-cases/`       |
| Repository interfaces        | `@thirty/core`   | `packages/core/src/domains/<domain>/repositories/`    |
| In-memory repos              | `@thirty/core`   | `packages/core/src/infrastructure/<domain>/`          |
| Prisma repos                 | `@thirty/core`   | `packages/core/src/infrastructure/<domain>/`          |
| NestJS controllers           | `@thirty/api`    | `apps/api/src/<domain>/`                              |
| Prisma schema                | `@thirty/db`     | `packages/db/prisma/schema.prisma`                    |
| Seed data                    | `@thirty/db`     | `packages/db/seed/`                                   |
| React components             | `@thirty/web`    | `apps/web/src/`                                       |

## Adding a New Domain Concept - Checklist

1. Decide which domain (scoring, journal, diversity, suggestion, food, favorite)
2. If a new type is needed, add it to `@thirty/shared`
3. If computation is needed, create a pure service function
4. If orchestration is needed, create a use case class with injected ports
5. If persistence is needed:
   a. Define the repository interface (port) in the domain
   b. Create the in-memory implementation in `infrastructure/<domain>/`
   c. Create the Prisma implementation in `infrastructure/<domain>/`
6. Export from the domain `index.ts`
7. Export from `src/index.ts` if needed externally
8. Write colocated tests (see `testing` skill)
