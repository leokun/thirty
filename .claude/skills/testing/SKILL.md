---
name: testing
description: Testing patterns for core (unit), api (NestJS/Vitest), and web (RTL/Vitest) layers
license: MIT
metadata:
  author: thirty
  version: "1.0.0"
---

# Testing Patterns

Testing conventions for Thirty's three layers. All tests use Vitest.

## General Rules

| Rule                | Detail                                           |
|---------------------|--------------------------------------------------|
| Runner              | Vitest (all packages)                            |
| File naming         | `<source-file>.test.ts` colocated next to source |
| Assertions          | `expect` from Vitest (no Chai, no Jest globals)  |
| Run all tests       | `pnpm test` (via Turborepo)                      |
| Run package tests   | `cd packages/core && pnpm test`                  |
| Watch mode          | `vitest` (default in dev)                        |

## Layer 1: Core - Pure Unit Tests

Tests for `@thirty/core` are pure, fast, and have zero I/O.

### File Placement

```
domains/scoring/services/
├── compute-diversity-score.service.ts
└── compute-diversity-score.service.test.ts
```

### Service Test Pattern

Services are pure functions. Test them directly with input/output.

```typescript
// compute-diversity-score.service.test.ts

import { describe, it, expect } from 'vitest';
import { computeDiversityScore } from './compute-diversity-score.service.js';

describe('computeDiversityScore', () => {
  it('returns 100 when plant count reaches the weekly goal', () => {
    expect(computeDiversityScore(30)).toBe(100);
  });

  it('returns 100 when plant count exceeds the weekly goal', () => {
    expect(computeDiversityScore(35)).toBe(100);
  });

  it('scales linearly 60-100 for 20-29 plants', () => {
    expect(computeDiversityScore(20)).toBe(60);
    expect(computeDiversityScore(25)).toBe(80);
  });

  it('scales linearly 20-60 for 10-19 plants', () => {
    expect(computeDiversityScore(10)).toBe(20);
    expect(computeDiversityScore(15)).toBe(40);
  });

  it('returns 0 for no plants', () => {
    expect(computeDiversityScore(0)).toBe(0);
  });
});
```

### Use Case Test Pattern (Sync)

Sync use cases take domain objects as input, return domain objects.

```typescript
// score-food-log.use-case.test.ts

import { describe, it, expect } from 'vitest';
import { scoreFoodLog } from './score-food-log.use-case.js';
import { createFoodLogEntry } from '../../../test-utils/fixtures.js';

describe('scoreFoodLog', () => {
  it('applies default preparation modifier when no custom modifier', () => {
    const entry = createFoodLogEntry({ preparationMethod: 'STEAMED' });
    const result = scoreFoodLog(entry);

    expect(result.foodLogId).toBe(entry.id);
    expect(result.score.fiber).toBeGreaterThan(0);
    expect(result.score.bonus).toBe(0);
  });

  it('applies custom modifier when present', () => {
    const entry = createFoodLogEntry({
      customModifier: {
        fiberFactor: 1.2,
        prebioticFactor: 1.0,
        polyphenolFactor: 1.0,
        probioticsFactor: 0,
        microbiomeBonus: 2,
      },
    });
    const result = scoreFoodLog(entry);

    expect(result.score.bonus).toBe(2);
  });
});
```

### Use Case Test Pattern (With Repository)

When a use case depends on a repository, use the in-memory implementation.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFoodLogRepository } from '../../../infrastructure/repositories/in-memory-food-log.repository.js';

describe('getWeeklyReport', () => {
  let repo: InMemoryFoodLogRepository;

  beforeEach(() => {
    repo = new InMemoryFoodLogRepository();
  });

  it('returns empty report for user with no data', async () => {
    const result = await repo.getDayData('user-1', '2026-04-01');
    expect(result.meals).toHaveLength(0);
  });

  it('returns seeded data within rolling window', async () => {
    repo.seed('user-1', [
      { date: '2026-03-28', meals: [] },
      { date: '2026-03-30', meals: [] },
    ]);
    const result = await repo.getRollingWindowData('user-1', '2026-04-01');
    expect(result).toHaveLength(2);
  });
});
```

### Test Fixtures

Create factory functions for complex domain objects. Place in `packages/core/src/test-utils/fixtures.ts` if shared across domains:

```typescript
// test-utils/fixtures.ts

import type { FoodLogEntry } from '../domains/journal/entities/food-log.entity.js';
import type { MicrobiomeProfile } from '../domains/scoring/value-objects/microbiome-profile.vo.js';

export function createBaseProfile(overrides?: Partial<MicrobiomeProfile>): MicrobiomeProfile {
  return {
    solubleFiberScore: 0,
    insolubleFiberScore: 0,
    prebioticScore: 0,
    polyphenolScore: 0,
    isFermented: false,
    probioticsScore: 0,
    omega3Score: 0,
    mucosalSupportScore: 0,
    ...overrides,
  };
}

export function createFoodLogEntry(overrides?: Partial<FoodLogEntry>): FoodLogEntry {
  return {
    id: 'test-log-1',
    foodId: 'test-food-1',
    foodName: 'Test Food',
    category: 'VEGETABLE',
    isPlant: true,
    preparationMethod: 'RAW',
    portionSize: null,
    baseProfile: createBaseProfile(),
    ...overrides,
  };
}
```

### What to Test in Core

| Artifact       | Test focus                                             |
|----------------|--------------------------------------------------------|
| Service        | Pure I/O: given input X, expect output Y               |
| Use case       | Orchestration: correct delegation, correct aggregation |
| In-memory repo | Seeding, retrieval, edge cases (empty, missing keys)   |

What NOT to test in core:
- Prisma queries (api layer)
- NestJS DI wiring (api layer)
- UI rendering (web layer)

## Layer 2: API - NestJS Integration Tests

Tests for `apps/api`. Test NestJS modules, controllers, and Prisma repositories.

### File Placement

```
apps/api/src/modules/journal/
├── journal.controller.ts
├── journal.controller.test.ts
├── journal.module.ts
└── journal.service.ts
```

### Controller Test Pattern

Use NestJS `Test.createTestingModule` with Vitest:

```typescript
// journal.controller.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { JournalController } from './journal.controller.js';
import { JournalService } from './journal.service.js';

describe('JournalController', () => {
  let controller: JournalController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [JournalController],
      providers: [
        {
          provide: JournalService,
          useValue: {
            getDayScore: vi.fn().mockResolvedValue({ totalScore: 72 }),
          },
        },
      ],
    }).compile();

    controller = module.get(JournalController);
  });

  it('returns daily score', async () => {
    const result = await controller.getDayScore('user-1', '2026-04-01');
    expect(result.totalScore).toBe(72);
  });
});
```

### Prisma Repository Test Pattern

For integration tests that hit the database:

```typescript
// prisma-food-log.repository.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../prisma-client.js';
import { PrismaFoodLogRepository } from './prisma-food-log.repository.js';

describe('PrismaFoodLogRepository', () => {
  const repo = new PrismaFoodLogRepository();

  beforeAll(async () => {
    await prisma.food.create({ data: { /* ... */ } });
  });

  afterAll(async () => {
    await prisma.foodLog.deleteMany();
    await prisma.mealEntry.deleteMany();
    await prisma.$disconnect();
  });

  it('returns DayData mapped from Prisma models', async () => {
    const result = await repo.getDayData('test-user', '2026-04-01');
    expect(result.date).toBe('2026-04-01');
    expect(result.meals).toBeDefined();
  });
});
```

## Layer 3: Web - React Component Tests

Tests for `apps/web`. Use React Testing Library (RTL) with Vitest.

### File Placement

```
apps/web/src/components/
├── ScoreCard.tsx
└── ScoreCard.test.tsx
```

### Component Test Pattern

```typescript
// ScoreCard.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreCard } from './ScoreCard.js';

describe('ScoreCard', () => {
  it('displays the total score', () => {
    render(<ScoreCard totalScore={72} trend="IMPROVING" />);
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('shows improving trend indicator', () => {
    render(<ScoreCard totalScore={72} trend="IMPROVING" />);
    expect(screen.getByLabelText('improving')).toBeInTheDocument();
  });
});
```

### Hook Test Pattern (TanStack Query)

```typescript
// useDailyScore.test.tsx

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDailyScore } from './useDailyScore.js';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useDailyScore', () => {
  it('fetches and returns the daily score', async () => {
    const { result } = renderHook(() => useDailyScore('2026-04-01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalScore).toBeDefined();
  });
});
```

### User Interaction Test Pattern

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FoodSearchInput } from './FoodSearchInput.js';

describe('FoodSearchInput', () => {
  it('calls onSelect when a food is picked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FoodSearchInput onSelect={onSelect} />);

    await user.type(screen.getByRole('searchbox'), 'brocoli');
    await user.click(screen.getByText('Brocoli'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ foodName: 'Brocoli' }),
    );
  });
});
```

## Test Naming Convention

Use descriptive `it` strings that read as sentences:

```typescript
// Good
it('returns 100 when plant count reaches the weekly goal', () => {});
it('applies custom modifier when present', () => {});
it('filters out inactive rules', () => {});

// Bad
it('test1', () => {});
it('should work', () => {});
it('computeDiversityScore', () => {});
```

Group with `describe` blocks matching the function or component name.

## Test Coverage Guidelines

| Layer | Target | Priority                                        |
|-------|--------|-------------------------------------------------|
| Core  | High   | Every service function, every use case           |
| API   | Medium | Controllers (happy path + error), Prisma repos   |
| Web   | Medium | Interactive components, hooks with logic          |

Not required to test:
- Simple type re-exports
- Domain index files
- Prisma generated code
- Pure layout components with no logic
