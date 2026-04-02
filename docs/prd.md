# Thirty — Product Requirements Document

> Tracker alimentaire centré microbiote intestinal
> Version 0.2 — Draft PRD

---

## 1. Vision produit

Les apps de tracking alimentaire existantes (MyFitnessPal, Yazio, Cronometer) se concentrent sur les calories et les macronutriments. Aucune ne se focalise sur l'impact de l'alimentation sur le microbiote intestinal — un axe de santé majeur validé par la recherche scientifique récente.

**Thirty** est une PWA mobile-first qui permet de logger ses repas et d'obtenir un scoring orienté microbiote : diversité alimentaire globale, apport en fibres prébiotiques, consommation d'aliments fermentés, contributions des protéines animales et produits laitiers, et impact du mode de préparation.

**L'objectif phare** : atteindre **30 aliments végétaux différents par semaine glissante** — le seuil identifié par l'American Gut Project comme corrélé à une diversité microbienne supérieure. Mais le scoring va au-delà des plantes : fromages affinés, yaourts, poissons gras, bouillons, et autres aliments non-végétaux contribuent aussi activement à la santé du microbiote et sont intégrés au score global.

---

## 2. Fondements scientifiques

### 2.1 Le "30 plants rule"

L'étude American Gut Project (McDonald et al., 2018) a montré que les participants consommant 30+ types de plantes par semaine avaient une diversité microbienne intestinale significativement plus élevée que ceux en consommant moins de 10. Cette diversité est associée à une meilleure résilience immunitaire, un risque réduit de maladies chroniques, et même une réduction des gènes de résistance aux antibiotiques dans le microbiote.

**Ce qui compte comme "plante"** : fruits, légumes, légumineuses, céréales complètes, noix, graines, herbes aromatiques, épices. Les variétés colorées d'un même légume comptent séparément (poivron rouge ≠ poivron vert).

### 2.2 Impact du mode de préparation

La recherche montre que le mode de préparation modifie significativement l'impact d'un aliment sur le microbiote :

| Mode de préparation | Impact microbiote | Mécanisme |
|---|---|---|
| **Cru** | Préserve les fibres intactes et les enzymes vivantes | Fibres solubles/insolubles non dégradées, polyphénols intacts |
| **Cuit vapeur / bouilli** | Rend certaines fibres plus accessibles, détruit d'autres composés | Gélatinisation de l'amidon, libération de certains nutriments |
| **Fermenté / Lactofermenté** | Apport direct de micro-organismes vivants (jusqu'à 10⁸ CFU/g) | Colonisation transitoire ou permanente du microbiote, production d'acides organiques |
| **Frit** | Favorise certaines bactéries potentiellement pathogènes (Lachnoclostridium, Enterobacteriaceae) | Produits de Maillard, acrylamide, altération des graisses |
| **Rôti / Grillé** | Impact intermédiaire, dépend de la température et du temps | Caramélisation, dégradation partielle des fibres |
| **Germé / Trempé** | Augmente la biodisponibilité des nutriments, réduit les anti-nutriments | Activation enzymatique, dégradation de l'acide phytique |

**Implication produit** : un même aliment (ex: chou) aura un score microbiote différent selon qu'il est consommé cru (salade de chou), cuit (soupe), ou lactofermenté (choucroute). C'est un différenciateur clé de Thirty.

### 2.3 Contributions non-végétales au microbiote

Le microbiote ne se nourrit pas que de fibres végétales. Plusieurs catégories d'aliments d'origine animale ou transformés ont un impact documenté :

| Catégorie | Exemples | Impact microbiote | Mécanisme |
|---|---|---|---|
| **Produits laitiers fermentés** | Yaourt, kéfir laitier, lait ribot | Apport direct de probiotiques (Lactobacillus, Bifidobacterium) | Colonisation transitoire, production d'acide lactique |
| **Fromages affinés** | Comté, roquefort, camembert, gouda | Micro-organismes vivants + peptides bioactifs | Diversité microbienne du fromage survit partiellement au transit gastrique |
| **Poissons gras** | Sardines, maquereau, saumon, hareng | Oméga-3 anti-inflammatoires, modulation de l'environnement intestinal | Réduction de l'inflammation muqueuse, favorise Lactobacillus et Bifidobacterium |
| **Bouillons d'os** | Bouillon de poule, fond de veau | Collagène, glutamine, glycine | Nourrissent la muqueuse intestinale (intégrité de la barrière) |
| **Abats et viandes** | Foie, viandes rouges (modération) | Zinc, fer héminique, B12 | Co-facteurs enzymatiques pour le métabolisme microbien ; excès favorise certains pathobiontes |
| **Œufs** | Œuf entier | Choline, protéines complètes | Interaction choline → TMAO via le microbiote (dose-dépendant) |
| **Produits fermentés non-laitiers** | Miso, sauce soja traditionnelle, nuoc-mam | Micro-organismes + peptides issus de la fermentation | Souches fongiques et bactériennes spécifiques (Aspergillus, Tetragenococcus) |

**Implication produit** : le score microbiote global de Thirty intègre TOUS les aliments, pas seulement les plantes. Le compteur "30 plantes / semaine" est un widget dédié (objectif phare validé par la recherche), mais le score quotidien reflète l'ensemble de l'alimentation.

### 2.4 Axes de scoring

Le scoring s'appuie sur 6 axes complémentaires :

1. **Diversité végétale** — nombre d'aliments végétaux distincts sur 7 jours glissants (objectif : 30)
2. **Fibres prébiotiques** — inuline, FOS, GOS, amidon résistant, bêta-glucanes
3. **Aliments fermentés** — fréquence et variété, qu'ils soient végétaux OU animaux (yaourt, kéfir, choucroute, kimchi, miso, comté…)
4. **Polyphénols** — apport estimé via les aliments colorés, thé, café, cacao, baies
5. **Soutien muqueux** — contributions des protéines animales de qualité (oméga-3, collagène, zinc, glutamine)
6. **Mode de préparation** — bonus/malus selon le mode (lactofermenté > fermenté > cru > vapeur > bouilli > rôti > frit)

---

## 3. Utilisateurs cibles

### Persona principal : "Le curieux santé"

- 25-45 ans, sensibilisé à l'alimentation saine
- A entendu parler du microbiote via des podcasts, Netflix ("Hack Your Health"), ou des livres (Giulia Enders, Tim Spector)
- Pas expert en nutrition — veut des indicateurs simples et actionnables
- Utilise son smartphone comme outil principal
- Frustré par les apps qui comptent les calories ("je ne veux pas peser mes aliments")

### Persona secondaire : "Le pratiquant fermentation"

- Fait ses propres fermentations (kéfir, kombucha, lacto-fermentation)
- Veut tracker l'impact de ses pratiques sur sa diversité alimentaire
- Veut un outil qui comprend la différence entre un chou cru et une choucroute maison

---

## 4. Features MVP

### F1 — Journal alimentaire simplifié

**Objectif** : logger un repas en moins de 30 secondes.

**Fonctionnement** :
- L'utilisateur sélectionne un moment (petit-déjeuner, déjeuner, dîner, collation)
- Il recherche un aliment dans la base de données (recherche texte, fuzzy matching)
- Il sélectionne le **mode de préparation** parmi une liste contextuelle (cru, cuit vapeur, bouilli, rôti, grillé, frit, fermenté, lactofermenté, germé, trempé, séché)
- Pas de grammage obligatoire — on log la présence d'un aliment, pas la quantité exacte. Option de portion (petite/moyenne/grande) pour affiner le scoring fibres/polyphénols
- Possibilité d'ajouter un aliment libre (non présent dans la base) avec un tag catégorie

**UX critique** : la friction doit être minimale. Si c'est plus long que 30 secondes par repas, le taux de rétention s'effondre.

**Considérations techniques** :
- Recherche full-text avec tolérance aux fautes (fuzzy)
- Historique des aliments récents de l'utilisateur pour saisie rapide
- Repas favoris / templates ("mon petit-déjeuner habituel")

### F2 — Base de données aliments scorée microbiote

**Objectif** : une base curatée de 300-500 aliments avec un profil microbiote complet.

**Structure d'un aliment** :

```
Aliment {
  id
  nom (fr)
  nom (en)
  catégorie (légume, fruit, légumineuse, céréale, noix/graine, herbe/épice, 
             produit_laitier, fromage, viande, poisson, oeuf, condiment_fermenté, autre)
  est_végétal (boolean — compte pour le "30 plants")
  
  profil_microbiote {
    // Axe fibres & prébiotiques (surtout végétaux)
    fibres_solubles (0-5)
    fibres_insolubles (0-5)
    prébiotiques_score (0-5)      // inuline, FOS, GOS, amidon résistant
    
    // Axe polyphénols (surtout végétaux, mais aussi thé, café, vin, cacao)
    polyphénols_score (0-5)
    
    // Axe fermentation (végétaux ET animaux)
    est_fermenté (boolean)
    probiotiques_score (0-5)      // densité et diversité de micro-organismes vivants
    
    // Axe soutien muqueux (surtout animaux)
    omega3_score (0-5)            // poissons gras, certaines graines
    mucosal_support_score (0-5)   // collagène, glutamine, zinc (bouillons, abats, œufs)
    
    // Modificateurs par mode de préparation
    modificateurs_préparation {
      cru: { facteur_fibres, facteur_prébiotiques, facteur_polyphénols, facteur_probiotiques, bonus_microbiote }
      cuit_vapeur: { ... }
      bouilli: { ... }
      fermenté: { ... }
      lactofermenté: { ... }
      frit: { ... }
      rôti: { ... }
      germé: { ... }
      affiné: { ... }           // spécifique aux fromages
      fumé: { ... }             // spécifique aux poissons/viandes
    }
  }
  
  tags []           // ex: "riche en inuline", "source d'oméga-3", "probiotique naturel"
  saison []         // ex: ["sept", "oct", "nov"] pour les courges
  synonymes []      // ex: ["courgette", "zucchini"]
}
```

**Stratégie de curation** :
- Phase 1 (MVP) : 300 aliments courants, scorés manuellement à partir de la littérature scientifique
- Phase 2 : enrichissement communautaire avec modération
- Phase 3 : intégration API externe (Open Food Facts) pour les produits transformés

**Décision d'architecture importante** : on ne veut PAS une base de 50 000 aliments mal tagués. La valeur est dans la qualité du scoring microbiote, pas dans la quantité.

### F3 — Score microbiote global & widget 30 plantes

**Objectif** : donner un feedback immédiat et motivant sur l'ensemble de l'alimentation.

#### 3a. Widget "30 plantes" (semaine glissante)

Un indicateur dédié, visible mais **pas le score principal** :

- Compteur : **X / 30 plantes cette semaine**
- Semaine glissante (J-7 à J) — pas une semaine calendaire
- Visualisation : jauge circulaire ou barre de progression
- Couleurs : rouge (< 10), orange (10-19), jaune (20-29), vert (30+)
- Liste détaillée des plantes comptées avec le jour de consommation
- Les herbes et épices comptent (persil, thym, cumin…) — conformément à l'étude American Gut

#### 3b. Score microbiote quotidien (score global)

Score composite sur 100, calculé à partir de **toute l'alimentation** :

| Axe | Poids | Sources principales | Calcul |
|---|---|---|---|
| Diversité végétale (semaine) | 25% | Fruits, légumes, légumineuses, céréales, noix, graines, herbes, épices | Progression vers 30, bonus au-delà |
| Fibres prébiotiques (jour) | 20% | Légumes, légumineuses, céréales complètes | Somme des scores fibres des aliments loggés |
| Aliments fermentés (jour) | 20% | Yaourt, kéfir, choucroute, kimchi, miso, comté, roquefort… | Présence + variété (végétaux ET animaux) |
| Polyphénols (jour) | 10% | Baies, thé, café, cacao, vin rouge, épices | Somme des scores polyphénols |
| Soutien muqueux (jour) | 15% | Poissons gras, bouillons, œufs, abats, fromages affinés | Score oméga-3 + mucosal support |
| Mode de préparation (jour) | 10% | Tous les aliments | Bonus lactofermenté/fermenté/cru, malus frit |

**Affichage** : score du jour + tendance sur 7 jours (sparkline)

**Principe clé** : le scoring est basé sur des **règles métier explicites**, pas sur du ML opaque. L'utilisateur peut comprendre pourquoi son score monte ou descend.

### F4 — Suggestions contextuelles

**Objectif** : guider sans être intrusif.

**Types de suggestions** (règles métier, pas IA générative) :

- **Diversité végétale** : "Tu es à 22/30 plantes cette semaine. Essaie d'ajouter des lentilles ou du poireau pour varier."
- **Fermentés** : "Ça fait 5 jours sans aliment fermenté. Un peu de yaourt, de choucroute ou de comté ?"
- **Préparation** : "Tu as mangé beaucoup de légumes cuits cette semaine. Essaie une salade de crudités pour varier les apports en fibres."
- **Saisonnalité** : "C'est la saison des courges — butternut, potimarron et pâtisson comptent chacun comme une plante différente."
- **Polyphénols** : "Ta consommation de polyphénols est basse cette semaine. Les myrtilles, le thé vert ou le chocolat noir (>70%) sont de bonnes sources."
- **Soutien muqueux** : "Tu n'as pas mangé de poisson gras cette semaine. Sardines, maquereau ou saumon sont d'excellentes sources d'oméga-3 pour ton microbiote."
- **Fromages** : "Tu manges souvent du fromage industriel. Essaie un fromage affiné au lait cru (comté, roquefort) — il contient des micro-organismes vivants."

**Règles de déclenchement** : chaque suggestion a une condition précise et un cooldown (pas de spam).

---

## 5. Ce qui est hors scope MVP

- Scan de code-barres
- Suivi des symptômes digestifs (V2 — corrélation symptômes/alimentation)
- Analyse de selles / intégration avec des kits de test microbiome
- IA générative pour les suggestions
- Plan de repas personnalisé
- Aspect social / communautaire
- Intégration wearables
- Grammage précis des aliments
- CONTRIBUTING.md / contribution externe

---

## 6. Architecture technique

### Stack

> **Politique de versions** : on utilise les dernières versions stables de tous les packages. Le projet démarre en avril 2026, on part sur ce qui est frais.

| Couche | Choix | Version (avril 2026) | Justification |
|---|---|---|---|
| **Langage** | TypeScript | 6.0.x | Dernière release JS-based, prépare la migration vers TS 7 (Go-based). Nouveaux defaults stricts, ESM natif, support Temporal |
| **Runtime** | Node.js | 24.x LTS | Requis par pnpm 11 (min 22), type stripping natif, dernière LTS |
| **Frontend** | React + Vite + TailwindCSS | React 19.2.x, Vite 8.0.x, Tailwind 4.2.x | React 19 (Server Components, hooks `use`), Vite 8 (Rolldown, plus d'esbuild), Tailwind 4 (CSS-first, plugin Vite natif) |
| **Frontend libs** | TanStack (Query, Router, Form, Table, Virtual) | latest | Écosystème cohérent, type-safe, couvre data fetching → routing → formulaires |
| **PWA** | Workbox (service worker) + manifest | latest | Offline-first pour le journal, installable |
| **Backend** | NestJS | 11.x → 12 dès la beta (Q3 2026) | Clean Architecture, TS, migration ESM en v12. Packages purs (`@thirty/core`, `@thirty/food-db`) en ESM dès le jour 1 |
| **Base de données** | PostgreSQL | 17.x | Données relationnelles, requêtes analytiques natives (ADR-001) |
| **ORM** | Prisma | 7.4.x | Rust-free, ESM, driver adapters, type-safe (ADR-001) |
| **Auth** | Better Auth (`@thallesp/nestjs-better-auth`) | latest | Self-hosted, solution complète, données chez soi (ADR-006) |
| **Infra MVP** | Coolify sur VPS Hetzner (CX22) | Coolify v4 | Self-hosted PaaS, ~4-6€/mois, push-to-deploy, SSL auto |
| **Monorepo** | pnpm + Turborepo | pnpm 11.x (beta → stable), Turbo 2.9.x | pnpm 11 installé localement via Corepack (`packageManager` field). Les projets JBS restent sur pnpm 10. ESM natif, config dans `pnpm-workspace.yaml` |
| **CI/CD** | GitHub Actions → Coolify webhook | — | Push to main → build → deploy automatique |
| **Linting** | Biome | 2.4.x | Plugins GritQL, domains (React auto-détecté), multi-file analysis, import organizer |
| **Tests** | Vitest + React Testing Library | latest | Rapide, compatible Vite 8, API Jest-like |

### TanStack — usage par lib

Principe : utiliser au maximum l'écosystème TanStack selon les besoins, pour bénéficier de la cohérence API et du typage de bout en bout.

| Lib | Usage dans Thirty | Justification |
|---|---|---|
| **TanStack Query** | Fetching/cache des aliments, scores, journal. Optimistic updates au log d'un aliment (le score se recalcule côté client avant la réponse serveur). Invalidation ciblée après mutation. | Élimine tout le boilerplate de data fetching, gère le cache, le stale-while-revalidate, et le retry |
| **TanStack Router** | Routing type-safe de la PWA. Search params typés pour les filtres (vue historique, recherche aliments). Prefetch des données via intégration Query. | Routing moderne file-based ou code-based, type-safety sur les params et search params |
| **TanStack Form** | Formulaire de saisie de repas (sélection aliment + préparation + portion), formulaire de profil utilisateur | Validation type-safe, gestion d'état formulaire sans re-renders inutiles |
| **TanStack Table** | Vue historique des repas, liste de la base aliments (tri, filtre, pagination) | Headless — on contrôle le rendu avec Tailwind, pas de style imposé |
| **TanStack Virtual** | Liste de résultats de recherche d'aliments (300-500 items potentiels), scroll performant dans le journal hebdo | Virtualisation du DOM pour les longues listes, critique sur mobile |
| **TanStack Query DevTools** | Panel de debug en dev : état du cache, queries actives, mutations en cours, stale/fresh/fetching | Indispensable pour débugger le cache et les optimistic updates |
| **TanStack Router DevTools** | Inspection des routes, params, search params, état de navigation | Debug du routing type-safe, vérification des prefetch |

### Monorepo structure

```
thirty/
├── apps/
│   ├── web/          # React PWA (mobile-first)
│   └── api/          # NestJS API
├── packages/
│   ├── shared/       # Enums, constantes, DTOs techniques
│   ├── core/         # Logique métier, clean archi DDD (scoring, journal, diversity, suggestion)
│   └── food-db/      # Base de données aliments (seed data, parsers, validateurs)
├── docs/
│   ├── prd.md        # Ce document
│   ├── adr/          # Architecture Decision Records
│   └── diagrams/     # C4, domain model
├── turbo.json
├── pnpm-workspace.yaml
└── README.md
```

### ADRs à rédiger

- **ADR-001** : PostgreSQL vs MongoDB — pourquoi du relationnel ici ✅
- **ADR-002** : Scoring par règles métier vs ML — transparence et explicabilité ✅
- **ADR-003** : Base aliments curatée (300) vs API externe (50 000) — qualité vs quantité ✅
- **ADR-004** : Semaine glissante vs semaine calendaire — UX et motivation ✅
- **ADR-005** : Mode de préparation comme multiplicateur de score — modélisation domain ✅
- **ADR-006** : Better Auth vs Passport.js — pragmatisme et souveraineté des données ✅
- **ADR-007** : Coolify sur VPS Hetzner vs Fly.io vs VPS nu — coût/contrôle/DX ✅
- **ADR-008** : Fusion de @thirty/scoring dans @thirty/core, clean architecture DDD par domaine ✅

---

## 7. Domain model (première esquisse)

```
User
  ├── has many → MealEntry (date, moment: breakfast|lunch|dinner|snack)
  │                 ├── has many → FoodLog
  │                 │                 ├── references → Food
  │                 │                 ├── preparation_method (raw|steamed|boiled|roasted|fried|fermented|lactofermented|sprouted|soaked|dried|aged|smoked)
  │                 │                 └── portion_size (small|medium|large) [optional]
  │                 └── computed → meal_microbiome_score
  │
  ├── computed → DailyScore (date, score, breakdown par axe)
  │                 ├── diversity_score (végétaux uniquement)
  │                 ├── fiber_prebiotic_score
  │                 ├── fermented_score (végétaux + animaux)
  │                 ├── polyphenol_score
  │                 ├── mucosal_support_score (oméga-3, collagène, zinc…)
  │                 └── preparation_score
  │
  └── computed → WeeklyDiversity
                    ├── rolling_7_days_plant_count (widget "30 plantes")
                    ├── unique_plants_list
                    ├── rolling_7_days_total_unique_foods (diversité globale)
                    └── trend (improving|stable|declining)

Food
  ├── name_fr, name_en
  ├── category (légume|fruit|légumineuse|céréale|noix_graine|herbe_épice|
  │              produit_laitier|fromage|viande|poisson|oeuf|condiment_fermenté|autre)
  ├── is_plant (boolean)
  ├── microbiome_profile
  │     ├── soluble_fiber_score (0-5)
  │     ├── insoluble_fiber_score (0-5)
  │     ├── prebiotic_score (0-5)
  │     ├── polyphenol_score (0-5)
  │     ├── is_fermented (boolean)
  │     ├── probiotics_score (0-5)
  │     ├── omega3_score (0-5)
  │     └── mucosal_support_score (0-5)
  ├── preparation_modifiers[]
  │     ├── method
  │     ├── fiber_factor (0.0 - 2.0)
  │     ├── prebiotic_factor (0.0 - 2.0)
  │     ├── polyphenol_factor (0.0 - 2.0)
  │     ├── probiotics_factor (0.0 - 2.0)
  │     └── microbiome_bonus (-2 to +5)
  ├── season_months[]
  ├── synonyms[]
  └── tags[]

Suggestion
  ├── type (diversity|fermented|preparation|seasonal|polyphenol|mucosal_support|cheese)
  ├── condition (règle de déclenchement)
  ├── message_template
  ├── cooldown_hours
  └── priority
```

---

## 8. Scoring engine — logique détaillée

### Calcul du score diversité (semaine glissante)

```
plants_count = COUNT(DISTINCT food.id)
  WHERE food.is_plant = true
  AND food_log.date BETWEEN (today - 6 days) AND today

diversity_score =
  IF plants_count >= 30 THEN 100
  IF plants_count >= 20 THEN 60 + (plants_count - 20) * 4    // 60-100
  IF plants_count >= 10 THEN 20 + (plants_count - 10) * 4    // 20-60
  ELSE plants_count * 2                                        // 0-20
```

### Calcul du score quotidien

```
daily_score = (
  diversity_component * 0.25 +
  fiber_prebiotic_component * 0.20 +
  fermented_component * 0.20 +
  polyphenol_component * 0.10 +
  mucosal_support_component * 0.15 +
  preparation_component * 0.10
)
```

Chaque composante est normalisée sur 100.

Le `mucosal_support_component` agrège les scores oméga-3 et soutien muqueux des aliments loggés (poissons gras, bouillons, œufs, abats, fromages affinés).

### Modificateurs de préparation (exemples)

```
RAW:            { fiber: 1.0,  prebiotic: 1.0,  polyphenol: 1.0,  probiotics: 0,    bonus: +1 }
STEAMED:        { fiber: 0.9,  prebiotic: 0.85, polyphenol: 0.8,  probiotics: 0,    bonus: 0 }
BOILED:         { fiber: 0.7,  prebiotic: 0.7,  polyphenol: 0.6,  probiotics: 0,    bonus: 0 }
ROASTED:        { fiber: 0.8,  prebiotic: 0.75, polyphenol: 0.7,  probiotics: 0,    bonus: 0 }
FRIED:          { fiber: 0.6,  prebiotic: 0.5,  polyphenol: 0.4,  probiotics: 0,    bonus: -2 }
FERMENTED:      { fiber: 0.8,  prebiotic: 1.2,  polyphenol: 1.1,  probiotics: 1.3,  bonus: +3 }
LACTOFERMENTED: { fiber: 0.8,  prebiotic: 1.3,  polyphenol: 1.2,  probiotics: 1.5,  bonus: +4 }
SPROUTED:       { fiber: 1.1,  prebiotic: 1.2,  polyphenol: 1.0,  probiotics: 0,    bonus: +2 }
SOAKED:         { fiber: 1.0,  prebiotic: 1.1,  polyphenol: 0.9,  probiotics: 0,    bonus: +1 }
DRIED:          { fiber: 1.2,  prebiotic: 0.9,  polyphenol: 0.8,  probiotics: 0,    bonus: 0 }
AGED:           { fiber: 0,    prebiotic: 0,    polyphenol: 0,    probiotics: 1.4,  bonus: +3 }  // fromages affinés
SMOKED:         { fiber: 0.7,  prebiotic: 0.6,  polyphenol: 0.5,  probiotics: 0,    bonus: -1 }  // poissons/viandes fumés
```

> **Note** : ces valeurs sont des approximations raisonnées basées sur la littérature. Elles seront affinées itérativement. Le système de facteurs permet d'ajuster sans changer la logique de scoring.

---

## 9. Métriques de succès MVP

| Métrique | Cible | Méthode de mesure |
|---|---|---|
| Rétention J7 | > 40% | % d'utilisateurs qui loggent au moins 1 repas au jour 7 |
| Temps de saisie moyen par repas | < 30 secondes | Analytics côté client |
| Aliments loggés / jour / utilisateur actif | > 5 | Agrégat base de données |
| Score diversité moyen des utilisateurs actifs (semaine 4) | > 20/30 | Agrégat scoring |
| NPS | > 40 | Survey in-app |

---

## 10. Roadmap post-MVP

| Phase | Feature | Valeur |
|---|---|---|
| **V1.1** | Suivi de symptômes digestifs + corrélations | "Quand je mange X frit, j'ai des ballonnements le lendemain" |
| **V1.2** | Mode hors-ligne complet (PWA offline) | Usage en situation sans réseau |
| **V1.3** | Intégration Open Food Facts | Élargir la base via scan code-barres |
| **V2.0** | Historique long terme + tendances mensuelles | Visualiser sa progression sur 3-6 mois |
| **V2.1** | Recettes pro-microbiote | Suggestions de recettes basées sur les aliments manquants |
| **V3.0** | Intégration tests microbiome (uBiome, Nahibu…) | Corréler le scoring avec des résultats réels |

---

## 11. Risques et mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Friction de saisie trop élevée → abandon | Critique | UX obsessionnelle sur la vitesse : récents, favoris, templates, fuzzy search |
| Scoring perçu comme arbitraire | Élevé | Transparence totale : chaque score est décomposable, les règles sont visibles |
| Base aliments trop limitée | Moyen | Prioriser les 300 aliments les plus courants en France, permettre l'ajout libre |
| Claims santé → responsabilité légale | Moyen | Disclaimers clairs : "outil informatif, pas un avis médical". Scoring basé sur des études publiées, sourcées |
| Complexité du mode de préparation | Moyen | Mode de préparation optionnel avec un défaut intelligent (ex: "cuit" par défaut pour les légumes chauds) |
