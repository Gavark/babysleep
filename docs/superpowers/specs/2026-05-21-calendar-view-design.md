# BabySleep — Vue calendrier mensuelle

**Date** : 2026-05-21
**Statut** : Design validé en brainstorming, prêt pour plan d'implémentation
**Contexte** : Première itération d'une vue temporelle longue durée pour repérer des patterns visuels dans le sommeil d'un bébé sur plusieurs semaines.

## 1. Objectif

Ajouter une vue calendrier mensuelle à BabySleep qui permet, **d'un coup d'œil**, de repérer des patterns dans le sommeil d'un bébé : régularité des horaires, jours anormalement courts ou longs, dérive progressive du coucher, semaines plus ou moins reposantes.

L'usage principal est le **scan visuel pour pattern detection** (et non la navigation ou le reporting imprimable, qui restent hors scope v1).

## 2. Décisions validées en brainstorming

| Dimension | Choix | Justification |
|---|---|---|
| Usage principal | Scan visuel / pattern detection | Densité d'info élevée par cellule, lecture rapide à l'échelle du mois |
| Design de cellule (desktop) | Timeline 24h + heatmap de fond | Donne instantanément les horaires (timeline) et la quantité (couleur) |
| Layout mobile (< 768px) | Strip vertical, 1 jour par ligne | Cellules grille trop petites en dessous de 400px ; le strip reste lisible et scrollable |
| Sémantique heatmap | % du quota total recommandé par âge | Référence objective basée sur AGE_PARAMS, marche dès le 1er jour de données |
| Navigation | Mensuelle (prev / next / today) | YAGNI : pas de vue année/semaine en v1 |

## 3. Route et placement

- **Route** : `/app/babies/[id]/calendar`
- **Navigation** : ajout d'un lien "Calendrier" dans la sous-nav baby (à côté de Today / Historique / Stats)
- **URL paramétrée** : `?month=YYYY-MM` (sans paramètre → mois courant côté serveur, fuseau du bébé)
- **Mois courant** : calculé via `todayISOInTZ(resolveTimezone(baby.timezone, user.timezone))` puis substring `0..7`

## 4. Sémantique de la cellule (jour N)

### 4.1 Segments affichés dans la timeline 24h

Pour chaque cellule du jour N, on affiche trois groupes de segments calés sur une barre horizontale représentant `00:00` → `24:00` :

1. **Fin de la nuit précédente** (segment violet à gauche)
   - De `00:00` à `wake_time` de l'entrée du jour N
   - Absent si `wake_time` est NULL
2. **Siestes du jour** (segments oranges)
   - Pour chaque paire `napX_start` / `napX_end` valide, un segment de `napX_start` à `napX_end`
   - Une paire est « valide » si les deux champs sont remplis et au format `HH:MM`
3. **Début de la nuit du jour N** (segment violet à droite)
   - De `bedtime` du jour N à `24:00`
   - Absent si `bedtime` est NULL

Les segments sont positionnés et dimensionnés en pourcentage : `left = startMin / 1440 * 100%`, `width = (endMin - startMin) / 1440 * 100%`.

### 4.2 Total affiché

`totalSleepMin` = somme des durées des trois groupes ci-dessus, en minutes. Formaté `Xh YY` via `formatDuration` existant.

### 4.3 Heatmap (couleur de fond)

`recommendedMin = (daySleepH + nightSleepH) * 60` où `daySleepH` et `nightSleepH` sont issus de `paramsForAge(ageInMonths(baby.birthDate, baby.ageOverrideMonths, dayDate))`.

`ratio = totalSleepMin / recommendedMin`.

| `ratio` | Classe CSS | Token |
|---|---|---|
| `>= 0.90` | `heat-good` | `--c-cal-heat-good` |
| `[0.70, 0.90)` | `heat-ok` | `--c-cal-heat-ok` |
| `[0.50, 0.70)` | `heat-meh` | `--c-cal-heat-meh` |
| `< 0.50` | `heat-bad` | `--c-cal-heat-bad` |
| Pas de bedtime (jour incomplet) | `heat-partial` | transparent + icône "…" |
| Aucune donnée du tout | `heat-none` | gris très clair |

Bornes inclusives à gauche, exclusives à droite (sauf `< 0.50`). Évalués dans cet ordre : `partial` d'abord (si `hasAnyData && !isComplete`), `none` ensuite (si `!hasAnyData`), puis les seuils numériques.

### 4.4 Cas particuliers

- **Jour incomplet** (au moins une donnée mais pas de `bedtime`) : on neutralise la heatmap (`heat-partial`, fond transparent) pour ne pas afficher un faux "rouge" sur une journée non terminée. Petite icône "…" en haut à droite.
- **Jour entièrement vide** (`hasAnyData = false`) : `heat-none`, juste le numéro du jour, cellule cliquable pour créer une entrée.
- **Aujourd'hui** : bordure `2px solid var(--c-primary)` ajoutée par-dessus.
- **Jours d'un autre mois** (padding début/fin de grille) : grisés, non cliquables, pas de données chargées.

## 5. Layouts

### 5.1 Desktop (viewport ≥ 768px)

- Grille CSS `grid-template-columns: repeat(7, 1fr)`, 5 ou 6 rangées selon le mois
- Semaine commençant **lundi** (cohérent avec convention française)
- Header de jours : Lun · Mar · Mer · Jeu · Ven · Sam · Dim
- Cellule : min-height 90px, padding 8px, border-radius 8px

### 5.2 Mobile (viewport < 768px)

- Strip vertical : `display: flex; flex-direction: column; gap: 4px`
- Une ligne par jour : `[numéro + abbr jour] [timeline timeline] [total]`
- Seuls les jours **du mois courant** sont affichés (pas de padding début/fin)
- La ligne reste cliquable et garde toutes les infos (timeline + heatmap + total)

### 5.3 Composant `DayCell`

Composant feuille réutilisé par les deux layouts. Reçoit `DayMetrics` en props, rend timeline + heatmap + numéro. Le mode (grille vs strip) est passé en prop pour ajuster la disposition interne (numéro à part vs intégré dans la ligne).

## 6. Interactions

| Action | Comportement |
|---|---|
| Clic sur cellule du mois courant (avec ou sans données) | Navigation vers `/app/babies/[id]/day/YYYY-MM-DD` |
| Clic sur cellule d'un autre mois (padding) | Aucun (non cliquable) |
| Hover desktop | Tooltip natif (`title=`) : `"13 mai 2026 — Lever 07:00 · 4 siestes · Coucher 19:21 · Total 14h28 (96% du quota)"` |
| Flèche `‹` | `month -= 1`, mise à jour URL `?month=YYYY-MM` |
| Flèche `›` | `month += 1`, mise à jour URL |
| Bouton `Aujourd'hui` | Retour au mois courant, mise à jour URL |
| Clavier `←` / `→` | Équivalents flèches |
| Clavier `Home` | Équivalent "Aujourd'hui" |
| Swipe horizontal sur mobile | Gauche → mois suivant, droite → mois précédent |

## 7. Accessibilité

- Structure HTML : `<table>` sémantique avec `<thead><tr><th scope="col">` pour les jours de semaine en mode grille ; `<ul>` pour le strip mobile
- Chaque cellule : `<a href="/app/babies/[id]/day/YYYY-MM-DD">` avec `aria-label` complet, p.ex. `"Mardi 13 mai 2026 — 14h28 de sommeil, 96 pourcent du quota recommandé"`
- L'information heatmap est **redondée** dans `aria-label` (pas uniquement véhiculée par la couleur)
- Contrast ratio des 4 couleurs heatmap ≥ 4.5:1 avec le texte par-dessus (vérifié manuellement à l'implémentation, tokens définis pour respecter ce contrainte)
- `prefers-reduced-motion: reduce` : pas de transitions de couleur sur les segments, pas d'animation de swipe (transition instantanée)
- Focus visible sur les cellules cliquables (outline natif conservé)

## 8. Légende

Footer compact en bas de la page, affiche :

- Mini-légende couleurs heatmap : 4 carrés (good / ok / meh / bad) avec les seuils %
- Mini-légende segments : carré orange = "Sieste", carré violet = "Nuit"
- Texte d'âge & quota : "Âge à la date du mois : 6 mois — Quota recommandé : 14h (3h siestes + 11h nuit)"

L'âge est calculé pour la **fin** du mois affiché si différente d'aujourd'hui ; sinon pour aujourd'hui. Si l'âge change au cours du mois affiché (rare mais possible aux frontières des tranches), on prend l'âge à la date médiane.

## 9. Architecture technique

### 9.1 Nouveaux fichiers

| Fichier | Responsabilité |
|---|---|
| `src/routes/app/babies/[id]/calendar/+page.server.ts` | Load : résoudre `month` depuis URL, calculer le range de la grille (premier au dernier jour affichés, incluant le padding), appeler `listEntriesInRange`, résoudre timezone |
| `src/routes/app/babies/[id]/calendar/+page.svelte` | Page wrapper : header navigation, légende, choix layout selon viewport |
| `src/lib/components/calendar/CalendarGrid.svelte` | Layout desktop (grille 7 cols) |
| `src/lib/components/calendar/CalendarStrip.svelte` | Layout mobile (strip vertical) |
| `src/lib/components/calendar/DayCell.svelte` | Cellule individuelle, mode `grid` ou `strip` |
| `src/lib/calendar.ts` | Fonctions pures : `buildMonthGrid`, `computeDayMetrics`, `heatmapClass`, `buildTimelineSegments` |
| `src/lib/calendar.test.ts` | Tests unitaires des fonctions pures |
| `src/routes/app/babies/[id]/calendar/calendar.spec.ts` | Tests d'intégration de la page |

### 9.2 Fonctions clés dans `src/lib/calendar.ts`

```ts
import type { SleepEntry, Baby } from '$lib/server/db/schema';

export type TimelineSegment = {
  kind: 'nap' | 'night';
  startMin: number;  // 0..1440
  endMin: number;    // 0..1440
};

export type HeatLevel = 'good' | 'ok' | 'meh' | 'bad' | 'partial' | 'none';

export type DayMetrics = {
  date: string;                  // YYYY-MM-DD
  inMonth: boolean;              // false pour les jours de padding
  isToday: boolean;
  hasAnyData: boolean;
  isComplete: boolean;           // bedtime saisi
  totalSleepMin: number;
  recommendedMin: number;
  ratio: number;                 // 0..N (peut dépasser 1)
  heatLevel: HeatLevel;
  segments: TimelineSegment[];
  // Champs pour aria-label et tooltip
  wakeTime: string | null;
  bedtime: string | null;
  napCount: number;
};

// Génère 35 ou 42 dates couvrant le mois (avec padding pour aligner sur lundi)
export function buildMonthGrid(year: number, month1to12: number, todayISO: string): {
  date: string;
  inMonth: boolean;
}[];

// Calcule les métriques d'un jour à partir de son entrée et de la suivante (pour la nuit)
export function computeDayMetrics(
  date: string,
  entryToday: SleepEntry | undefined,
  baby: Pick<Baby, 'birthDate' | 'ageOverrideMonths'>,
  todayISO: string
): DayMetrics;

export function heatmapClass(level: HeatLevel): string;

export function buildTimelineSegments(entry: SleepEntry | undefined): TimelineSegment[];
```

**Note de simplification** : la signature de `computeDayMetrics` n'a finalement **pas besoin** d'`entryTomorrow`. La nuit du jour N (segment droit `bedtime → 24:00`) appartient au jour N. Le segment gauche du jour N+1 (`00:00 → wake_time`) appartient au jour N+1. Cette répartition est cohérente et chaque cellule se calcule à partir de sa seule entrée.

### 9.3 Tests unitaires (`src/lib/calendar.test.ts`)

Cas à couvrir :

- `buildMonthGrid`
  - Février 2026 (28 jours, commence un dimanche → padding important au début)
  - Mai 2026 (31 jours, commence un vendredi)
  - Marquage `inMonth = false` pour les jours de padding
  - Bonne identification de `todayISO` quand inclus
- `computeDayMetrics`
  - Journée complète (wake + 3 siestes + bedtime) → `isComplete = true`, segments × 5, heat correcte
  - Journée sans bedtime → `isComplete = false`, `heatLevel = 'partial'`
  - Journée vide → `hasAnyData = false`, `heatLevel = 'none'`
  - Journée avec 1 paire de sieste invalide (start sans end) → ignorée des segments
  - Calcul d'âge correct quand `ageOverrideMonths` est positionné
- `buildTimelineSegments`
  - Segments triés par `startMin`
  - Positions correctes (proportions)
  - Bedtime aux limites (23:59) → segment court non nul
- `heatmapClass`
  - Seuils 0.90, 0.70, 0.50
  - `partial` et `none` mappés correctement

### 9.4 Tests d'intégration (`calendar.spec.ts`)

- Load page avec `?month=2026-05` → response contient les entrées d'un range étendu
- Load page sans `?month` → utilise le mois courant côté serveur
- 404 si baby n'appartient pas à l'utilisateur
- 303 redirect vers `/login` si non authentifié
- `?month=invalid` → tombe sur le mois courant (validation defensive)

## 10. Ajustement requis sur `/day/[date]`

`src/routes/app/babies/[id]/day/[date]/+page.server.ts` retourne actuellement `404` si l'entrée n'existe pas. À ajuster :

- Si l'entrée n'existe pas, retourner `{ entry: null, baby, date }` au lieu de 404
- `+page.svelte` : si `entry` est null, formulaire vide pré-rempli avec la date, le bouton "Supprimer" est caché, le bouton "Sauvegarder" crée une nouvelle entrée via `upsertEntry`
- Tester que les deux flux (édition d'une entrée existante et création depuis le calendrier) fonctionnent

## 11. Tokens CSS ajoutés (`src/lib/styles/tokens.css`)

Light mode :

| Token | Valeur | Usage |
|---|---|---|
| `--c-cal-heat-good` | `#DFEDE2` | Vert clair — ratio ≥ 90% |
| `--c-cal-heat-ok` | `#FBF5E4` | Jaune crème — ratio 70-90% |
| `--c-cal-heat-meh` | `#F6E1D6` | Orange clair — ratio 50-70% |
| `--c-cal-heat-bad` | `#F0CFC1` | Orange foncé — ratio < 50% |
| `--c-cal-heat-none` | `#F4ECE0` | Gris crème — aucune donnée |
| `--c-cal-seg-nap` | `--c-accent-honey` (alias) | Segment sieste |
| `--c-cal-seg-night` | `#7A6FA9` | Segment nuit (violet doux) |

Dark mode (overrides) :

| Token | Valeur |
|---|---|
| `--c-cal-heat-good` | `#2B4234` |
| `--c-cal-heat-ok` | `#3D3826` |
| `--c-cal-heat-meh` | `#4A352A` |
| `--c-cal-heat-bad` | `#5A2E22` |
| `--c-cal-heat-none` | `#2A2117` (= `--c-bg-card`) |
| `--c-cal-seg-night` | `#9A8FCC` |

## 12. Critères d'acceptation

- [ ] Page accessible à `/app/babies/[id]/calendar` affiche le mois en cours par défaut (fuseau bébé)
- [ ] La grille desktop (7 cols) s'affiche correctement pour un mois de 28, 30 et 31 jours
- [ ] Le strip vertical s'affiche sur viewport `< 768px`
- [ ] Chaque cellule affiche la timeline 24h correcte et le total en `Xh YY`
- [ ] La heatmap colore les jours selon les seuils définis (0.90 / 0.70 / 0.50)
- [ ] Les jours incomplets (sans bedtime) sont neutres (pas de heatmap "rouge" trompeur) avec icône "…"
- [ ] Aujourd'hui est marqué par une bordure colorée
- [ ] Clic sur une cellule pleine ouvre l'édition de la journée
- [ ] Clic sur une cellule vide (mois en cours ou passé) permet de créer une entrée
- [ ] Navigation `‹` / `›` change de mois et met à jour l'URL `?month=YYYY-MM`
- [ ] Bouton `Aujourd'hui` ramène au mois courant
- [ ] Hover desktop affiche un tooltip avec lever/coucher/total/%
- [ ] `aria-label` complet sur chaque cellule (lecture lecteur d'écran ne dépend pas de la couleur)
- [ ] Tests unitaires `calendar.test.ts` au vert (≥ 12 cas)
- [ ] Tests d'intégration `calendar.spec.ts` au vert
- [ ] Lighthouse mobile : pas de régression notable sur Performance

## 13. Hors scope v1 (notés pour itérations futures)

- Vue annuelle / heatmap "GitHub-style"
- Export PDF / image
- Comparaison côte-à-côte de 2 semaines
- Annotations / tags (malade, vacances, crèche)
- Filtrage / mise en évidence de patterns spécifiques (ex. "marque tous les jours avec coucher après 20h")
- Sélection multiple de cellules pour comparer
- Choix de fond heatmap alternatif (vs moyenne perso 30 jours)
