---
name: clean-archi
description: Clean Architecture DDD patterns for @thirty/core - entities, VOs, services, use cases, ports & adapters
license: MIT
metadata:
  author: thirty
  version: "1.0.0"
---

# Clean Architecture - DDD Patterns

Architecture rules for `@thirty/core` and how it connects to `apps/api` and `apps/web`.

## Package Dependency Rules

```
@thirty/shared  <-  @thirty/core  <-  @thirty/api
                                   <-  @thirty/web
@thirty/food-db <-  @thirty/api (seed only)
```

| From             | Can import                                               | Cannot import           |
|------------------|----------------------------------------------------------|-------------------------|
| `@thirty/shared` | Nothing (leaf package)                                   | core, api, web, food-db |
| `@thirty/core`   | `@thirty/shared`                                         | api, web, food-db       |
| `@thirty/api`    | `@thirty/shared`, `@thirty/core`, `@thirty/food-db`      | web                     |
| `@thirty/web`    | `@thirty/shared`, `@thirty/core` (types only)            | api, food-db            |

Critical rule: `@thirty/core` NEVER imports from `@thirty/api` or any framework. It is pure TypeScript with zero runtime dependencies beyond `@thirty/shared`.

## Domain Structure

Four domains in `packages/core/src/domains/`:

```
domains/
├── scoring/        # Microbiome scoring engine (6 axes)
│   ├── constants/
│   ├── services/
│   └── value-objects/
├── journal/        # Food logging, daily scoring orchestration
│   ├── entities/
│   ├── repositories/
│   ├── use-cases/
│   └── value-objects/
├── diversity/      # Rolling window, plant counting
│   ├── repositories/
│   ├── services/
│   ├── use-cases/
│   └── value-objects/
└── suggestion/     # Contextual suggestions engine
    ├── entities/
    ├── repositories/
    ├── services/
    ├── use-cases/
    └── value-objects/
```

Not every domain has every folder. Only create what is needed:
- `scoring` has no entities or repositories (pure computation)
- `journal` has no services (use cases orchestrate directly)

## Building Blocks

### Value Object (.vo.ts)

Immutable data structure. No identity, no behavior. All `readonly`.

```typescript
// domains/scoring/value-objects/computed-food-score.vo.ts

export interface ComputedFoodScore {
  readonly fiber: number;
  readonly prebiotic: number;
  readonly polyphenol: number;
  readonly probiotics: number;
  readonly omega3: number;
  readonly mucosal: number;
  readonly bonus: number;
}
```

When a VO references types from another domain, import them explicitly:
```typescript
import type { DailyScoreBreakdown } from '../../journal/value-objects/daily-score-breakdown.vo.js';
```

When a VO uses shared enums:
```typescript
import type { FoodCategory, PreparationMethod } from '@thirty/shared';
```

### Entity (.entity.ts)

Has an `id` field. Represents a domain concept with identity. Still an interface (not a class).

```typescript
// domains/journal/entities/food-log.entity.ts

import type { FoodCategory, PortionSize, PreparationMethod } from '@thirty/shared';
import type { MicrobiomeProfile } from '../../scoring/value-objects/microbiome-profile.vo.js';

export interface FoodLogEntry {
  readonly id: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize: PortionSize | null;
  readonly baseProfile: MicrobiomeProfile;
  readonly customModifier?: {
    readonly fiberFactor: number;
    readonly prebioticFactor: number;
    readonly polyphenolFactor: number;
    readonly probioticsFactor: number;
    readonly microbiomeBonus: number;
    readonly overrideProfile?: Partial<MicrobiomeProfile>;
  };
}
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

Orchestrates services and entities. Can depend on repository interfaces (ports) but never on implementations.

Synchronous use case (no I/O):
```typescript
// domains/journal/use-cases/score-food-log.use-case.ts

import type { FoodLogEntry } from '../entities/food-log.entity.js';
import type { ScoredFoodLog } from '../value-objects/scored-food-log.vo.js';
import { applyPreparationModifier } from '../../scoring/services/apply-preparation-modifier.service.js';
import { PREPARATION_DEFAULTS } from '../../scoring/constants/preparation-defaults.js';

export function scoreFoodLog(entry: FoodLogEntry): ScoredFoodLog {
  const modifier = entry.customModifier
    ? { method: entry.preparationMethod, ...entry.customModifier }
    : { method: entry.preparationMethod, ...PREPARATION_DEFAULTS[entry.preparationMethod] };

  const score = applyPreparationModifier(entry.baseProfile, modifier);

  return {
    foodLogId: entry.id,
    foodId: entry.foodId,
    foodName: entry.foodName,
    category: entry.category,
    isPlant: entry.isPlant,
    preparationMethod: entry.preparationMethod,
    score,
  };
}
```

Use case with input interface:
```typescript
export interface ScoreDayInput {
  readonly today: DayData;
  readonly rollingWindow: RollingWindowData;
  readonly previousDayScore?: number;
}

export function scoreDay(input: ScoreDayInput): DailyScoreBreakdown {
  // orchestration logic
}
```

### Repository Interface - Port (.repository.ts)

Defines the contract. Lives in the domain. Always an interface, never a class.

```typescript
// domains/journal/repositories/food-log.repository.ts

import type { DayData } from '../value-objects/day-data.vo.js';

export interface FoodLogRepository {
  getDayData(userId: string, date: string): Promise<DayData>;
  getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]>;
}
```

Rules:
- Methods return domain types (VOs, entities), never Prisma types
- Always `Promise`-based (even if in-memory impl is sync)
- Keep the interface minimal: only methods the use cases actually need

### In-Memory Repository - Test Adapter

Lives in `packages/core/src/infrastructure/repositories/`.

```typescript
// infrastructure/repositories/in-memory-food-log.repository.ts

import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import type { DayData } from '../../domains/journal/value-objects/day-data.vo.js';

export class InMemoryFoodLogRepository implements FoodLogRepository {
  private days = new Map<string, DayData>();

  async getDayData(userId: string, date: string): Promise<DayData> {
    const key = `${userId}:${date}`;
    return this.days.get(key) ?? { date, meals: [] };
  }

  async getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]> {
    // filter logic
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

Lives in `apps/api/src/`. Implements the same port using Prisma.

```typescript
// apps/api/src/repositories/prisma-food-log.repository.ts

import type { FoodLogRepository } from '@thirty/core';
import type { DayData } from '@thirty/core';
import { prisma } from '../prisma-client.js';

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
- Prisma types NEVER leak into core domain code
- Mapping from Prisma model to domain VO/entity happens here
- Import domain types from `@thirty/core`

## Domain Index File Pattern

Each domain has an `index.ts` that re-exports its public API:

```typescript
// domains/scoring/index.ts

// --- Value Objects ---
export type { ComputedFoodScore } from './value-objects/computed-food-score.vo.js';
export type { MicrobiomeProfile } from './value-objects/microbiome-profile.vo.js';

// --- Services ---
export { computeDailyScore } from './services/compute-daily-score.service.js';
export type { DailyScoreInput } from './services/compute-daily-score.service.js';

// --- Constants ---
export { PREPARATION_DEFAULTS } from './constants/preparation-defaults.js';
```

Rules:
- Types use `export type { ... }`
- Functions/classes use `export { ... }`
- Group by artifact type with section comments
- The root `src/index.ts` re-exports all domain indexes

## Cross-Domain Imports

Domains CAN import from each other within core. Dependency direction:

```
scoring  <-  journal     (journal uses scoring services)
diversity <-  journal    (journal uses diversity counting)
journal  <-  suggestion  (suggestion reads journal breakdown)
diversity <-  suggestion (suggestion reads diversity result)
```

Import via relative path, not via the domain index:
```typescript
// In journal/use-cases/score-day.use-case.ts
import { computeDiversityScore } from '../../scoring/services/compute-diversity-score.service.js';
import { countDistinct } from '../../diversity/services/rolling-window.service.js';
```

## What Goes Where

| Artifact                     | Package        | Location                                          |
|------------------------------|----------------|---------------------------------------------------|
| Shared enums/constants       | `@thirty/shared` | `packages/shared/src/index.ts`                  |
| Domain types (VOs, entities) | `@thirty/core` | `packages/core/src/domains/<domain>/`             |
| Business logic (services)    | `@thirty/core` | `packages/core/src/domains/<domain>/services/`    |
| Use cases                    | `@thirty/core` | `packages/core/src/domains/<domain>/use-cases/`   |
| Repository interfaces        | `@thirty/core` | `packages/core/src/domains/<domain>/repositories/`|
| In-memory repos              | `@thirty/core` | `packages/core/src/infrastructure/repositories/`  |
| Prisma repos                 | `@thirty/api`  | `apps/api/src/repositories/`                      |
| NestJS modules/controllers   | `@thirty/api`  | `apps/api/src/modules/`                           |
| Prisma schema                | `@thirty/api`  | `apps/api/prisma/schema.prisma`                   |
| React components             | `@thirty/web`  | `apps/web/src/`                                   |
| Food seed data               | `@thirty/food-db` | `packages/food-db/src/`                        |

## Adding a New Domain Concept - Checklist

1. Decide which domain it belongs to (scoring, journal, diversity, suggestion)
2. Create the VO/entity file with `readonly` properties
3. If computation is needed, create a pure service function
4. If orchestration is needed, create a use case
5. If persistence is needed:
   a. Define the repository interface (port) in the domain
   b. Create the in-memory implementation in `infrastructure/`
   c. Create the Prisma implementation in `apps/api/`
6. Export from the domain `index.ts`
7. Export from `src/index.ts` if needed externally
8. Write colocated tests (see `testing` skill)
