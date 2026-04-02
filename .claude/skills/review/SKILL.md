---
name: review
description: Structured code review checklist for PRs and branches - DDD, clean archi, Biome, TypeScript, tests, security
license: MIT
metadata:
  author: thirty
  version: "1.0.0"
---

# Code Review

Structured review process for Thirty. Two modes: PR review (by number) and branch review (diff against main).

## Invocation

### PR Review Mode

```
Review PR #42
```

Steps:
1. Fetch PR diff: `gh pr diff 42`
2. Fetch PR metadata: `gh pr view 42`
3. Read all changed files in full (not just the diff) for context
4. Apply the checklist below
5. Output the review

### Branch Review Mode

```
Review current branch
```

Steps:
1. Get diff: `git diff main...HEAD`
2. List commits: `git log main..HEAD --oneline`
3. Read all changed files in full
4. Apply the checklist below
5. Output the review

## Review Checklist

### 1. DDD Boundaries

| Check                    | Severity | Detail                                                                                  |
|--------------------------|----------|-----------------------------------------------------------------------------------------|
| Domain type placement    | BLOCKING | VOs in `value-objects/`, entities in `entities/`, services in `services/`, use cases in `use-cases/` |
| File suffix convention   | BLOCKING | `.vo.ts`, `.entity.ts`, `.service.ts`, `.use-case.ts`, `.repository.ts`                |
| No framework in core     | BLOCKING | `@thirty/core` must not import NestJS, Prisma, React, or any framework                 |
| Import direction         | BLOCKING | core imports only shared. api imports core+shared. web imports shared (+ core types)    |
| Repository is interface  | BLOCKING | Port in domain is `interface`, not class. Class only in infrastructure/ or apps/api/    |
| Readonly everywhere      | WARNING  | All VO/entity properties must be `readonly`. Arrays must be `readonly T[]`              |
| Domain logic purity      | WARNING  | Services are pure functions. No side effects. No I/O.                                   |

### 2. Clean Architecture Compliance

| Check                    | Severity | Detail                                                                                  |
|--------------------------|----------|-----------------------------------------------------------------------------------------|
| Use case orchestrates    | WARNING  | Use case calls services, not the other way around                                       |
| No Prisma types in core  | BLOCKING | Domain types are independent. Prisma mapping happens in apps/api/                       |
| Domain index exports     | WARNING  | New public types/functions must be exported from domain `index.ts`                      |
| Cross-domain imports     | INFO     | Verify import direction matches the dependency graph (scoring <- journal <- suggestion)  |
| Shared enum pattern      | BLOCKING | Must use `const X = {} as const; type X = ...` pattern, not TS `enum`                  |

### 3. Biome Compliance

| Check              | Severity | Detail                              |
|--------------------|----------|-------------------------------------|
| Single quotes      | WARNING  | Not double quotes                   |
| Semicolons always  | WARNING  | Every statement ends with `;`       |
| Trailing commas    | WARNING  | On all multiline structures         |
| 2-space indent     | WARNING  | Not tabs, not 4 spaces              |
| Line width <= 100  | WARNING  | No lines exceed 100 characters      |
| Import organization| INFO     | Imports should be organized          |

Shortcut: if the author ran `biome check .` before committing, these should all pass. Flag only if clearly not formatted.

### 4. TypeScript Strictness

| Check                     | Severity           | Detail                                                          |
|---------------------------|--------------------|-----------------------------------------------------------------|
| No `any`                  | BLOCKING           | Use `unknown` or a proper type instead                          |
| No `@ts-ignore`           | BLOCKING           | Use `@ts-expect-error` with explanation if truly needed         |
| No `as` type assertions   | WARNING            | Avoid unless converting from external API data                  |
| `import type` for types   | WARNING            | When only importing types, use `import type { ... }`            |
| `.js` extension in imports| BLOCKING (core/shared) | ESM requires `.js` extensions in relative imports           |
| No unused variables       | WARNING            | `noUnusedLocals` and `noUnusedParameters` are enabled           |
| Null handling             | WARNING            | Proper `null`/`undefined` handling. `noUncheckedIndexedAccess` is on |

### 5. Test Coverage

| Check                        | Severity | Detail                                                    |
|------------------------------|----------|-----------------------------------------------------------|
| New service has tests        | BLOCKING | Every new `.service.ts` needs a colocated `.test.ts`      |
| New use case has tests       | BLOCKING | Every new `.use-case.ts` needs a colocated `.test.ts`     |
| Tests use in-memory repos    | WARNING  | Core tests must not hit real databases                    |
| Test file colocated          | WARNING  | `foo.service.test.ts` sits next to `foo.service.ts`       |
| No snapshot tests in core    | INFO     | Prefer explicit assertions for domain logic               |
| Meaningful test names        | INFO     | `it('returns 100 when...')` not `it('test1')`             |

### 6. Prisma Patterns

| Check                         | Severity | Detail                                                      |
|-------------------------------|----------|-------------------------------------------------------------|
| Schema matches domain         | WARNING  | New Prisma models should align with domain entities/VOs     |
| `@@map` snake_case            | WARNING  | All models use `@@map("snake_case_table")`                  |
| Indexes present               | WARNING  | Frequently queried fields (userId+date) should have `@@index`|
| No `env()` in schema          | BLOCKING | Prisma 7 uses `prisma.config.ts` for datasource URL        |
| Generated code not committed  | BLOCKING | `src/generated/` is in `.gitignore` and `biome.json` ignore|
| Migration present             | INFO     | Schema changes should have a migration (or explicit db push)|

### 7. Security Basics

| Check                          | Severity | Detail                                                |
|--------------------------------|----------|-------------------------------------------------------|
| No secrets in code             | BLOCKING | No hardcoded API keys, passwords, connection strings  |
| No secrets in committed files  | BLOCKING | `.env` is not committed (only `.env.example`)         |
| Auth on endpoints              | WARNING  | New API endpoints should require authentication       |
| User scoping                   | WARNING  | Queries must filter by userId to prevent data leaks   |
| Input validation               | WARNING  | API inputs should be validated (NestJS pipes/DTOs)    |

## Review Output Format

Structure your review as follows:

```markdown
## Review: <PR title or branch name>

### Summary
<1-2 sentence overall assessment>

### Blocking Issues
- [ ] **[BLOCKING]** <file:line> - <description>

### Warnings
- **[WARNING]** <file:line> - <description>

### Suggestions
- **[INFO]** <file:line> - <description>

### Checklist Score
| Category              | Status              |
|-----------------------|---------------------|
| DDD Boundaries        | pass / fail / N/A   |
| Clean Archi           | pass / fail / N/A   |
| Biome Compliance      | pass / fail / N/A   |
| TypeScript Strictness | pass / fail / N/A   |
| Test Coverage         | pass / fail / N/A   |
| Prisma Patterns       | pass / fail / N/A   |
| Security              | pass / fail / N/A   |

### Verdict
**APPROVE** / **REQUEST CHANGES** / **COMMENT**

<Approve if zero blocking issues. Request changes if any blocking issues.>
```

## Severity Definitions

| Level    | Meaning                                          | Action                |
|----------|--------------------------------------------------|-----------------------|
| BLOCKING | Violates architecture invariant or security rule | Must fix before merge |
| WARNING  | Deviation from convention, potential issue        | Should fix, discuss   |
| INFO     | Improvement suggestion, stylistic                | Nice to have          |
