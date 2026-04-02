# Architecture Decision Records

Les ADRs documentent les décisions techniques prises pour Thirty.
Chaque décision est argumentée avec les options évaluées, la décision prise, et ses conséquences.

| ADR | Décision | Statut |
|---|---|---|
| [001](./adr_001.md) | PostgreSQL vs MongoDB | ✅ Accepté |
| [002](./adr_002.md) | Scoring par règles métier vs ML | ✅ Accepté |
| [003](./adr_003.md) | Base aliments curatée (300) vs API externe (50 000) | ✅ Accepté |
| [004](./adr_004.md) | Semaine glissante vs semaine calendaire | ✅ Accepté |
| [005](./adr_005.md) | Mode de préparation comme multiplicateur de score | ✅ Accepté |
| [006](./adr_006.md) | Better Auth vs Passport.js | ✅ Accepté |
| [007](./adr_007.md) | Coolify sur VPS Hetzner vs Fly.io vs VPS nu | ✅ Accepté |
| [008](./adr_008.md) | @thirty/core — clean architecture DDD par domaine | ✅ Accepté |
| [009](./adr_009.md) | Types dans shared, adapters dans core, package @thirty/db | ✅ Accepté |

## Format

Chaque ADR suit la structure :
1. **Contexte** — pourquoi cette décision est nécessaire
2. **Options évaluées** — avec pour/contre honnêtes
3. **Décision** — le choix fait et sa justification
4. **Conséquences** — ce que ça implique concrètement
