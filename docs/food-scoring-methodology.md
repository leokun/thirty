# Méthodologie de scoring des aliments

> Comment les profils microbiote de la base aliments sont établis

## Principes

1. **Chaque score est basé sur la littérature scientifique** — pas sur une intuition
2. **Les sources sont référencées** — champ `sources[]` dans chaque fiche aliment
3. **Les valeurs sont des approximations** — le système de facteurs permet d'ajuster sans casser la logique
4. **La granularité est volontairement limitée** — scores de 0 à 5, pas de décimales inutiles

## Échelle des scores (0-5)

| Score | Signification |
|---|---|
| 0 | Pas d'impact / non applicable |
| 1 | Impact faible / traces |
| 2 | Impact modéré |
| 3 | Bon impact |
| 4 | Très bon impact |
| 5 | Exceptionnel (top 5% de la catégorie) |

## Axes de scoring par aliment

### Fibres solubles (0-5)
Pectines, bêta-glucanes, gommes. Sources principales : avoine, pomme, agrumes, légumineuses.

### Fibres insolubles (0-5)
Cellulose, hémicellulose, lignine. Sources principales : son de blé, légumes crucifères, graines.

### Prébiotiques (0-5)
Inuline, FOS, GOS, amidon résistant. Sources principales : ail, oignon, poireau, topinambour, banane verte, légumineuses.

### Polyphénols (0-5)
Flavonoïdes, anthocyanes, catéchines, resvératrol. Sources principales : baies, thé, café, cacao, vin rouge, épices (curcuma, clou de girofle).

### Probiotiques (0-5)
Micro-organismes vivants. Uniquement pour les aliments fermentés : yaourt, kéfir, choucroute, kimchi, miso, fromages affinés au lait cru.

### Oméga-3 (0-5)
EPA/DHA (animaux) et ALA (végétaux). Sources principales : sardines, maquereau, saumon, graines de lin, noix.

### Soutien muqueux (0-5)
Collagène, glutamine, zinc. Sources principales : bouillon d'os, abats, œufs, huîtres.

## Modificateurs de préparation

Voir `@thirty/core/src/domains/scoring/constants/preparation-defaults.ts` pour les valeurs exactes.

Le principe : un facteur multiplicateur (0.0 - 2.0) appliqué au score de base, plus un bonus/malus microbiote direct.

### Exceptions (overrides)

Certains aliments fermentés méritent un override complet plutôt qu'un simple multiplicateur.
Exemple : la choucroute n'est pas "chou × facteur lactofermenté" — elle a un profil probiotique propre (Leuconostoc mesenteroides, Lactobacillus plantarum) qui justifie un override du `probioticsScore`.

## Sources de référence

- American Gut Project (McDonald et al., 2018) — diversité végétale et microbiome
- "Effects of different foods and cooking methods on the gut microbiota" (Frontiers in Microbiology, 2023)
- "Fermented Foods, Health and the Gut Microbiome" (Nutrients, 2022)
- USDA FoodData Central — valeurs nutritionnelles de base
- Open Food Facts — données complémentaires produits transformés
