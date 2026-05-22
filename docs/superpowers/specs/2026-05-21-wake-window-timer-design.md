# BabySleep — Timer fenêtre d'éveil

**Date** : 2026-05-21
**Statut** : Design validé en brainstorming, prêt pour plan d'implémentation
**Contexte** : Itération sur la page Today pour donner un retour en temps réel sur le temps écoulé depuis le dernier événement d'éveil et le temps restant avant la prochaine sieste suggérée.

## 1. Objectif

Ajouter une card live sur `/app/babies/[id]/today` qui affiche, en temps réel :

- Combien de temps bébé est éveillé depuis son dernier événement (réveil matinal ou fin de sieste)
- Combien de temps reste-t-il dans la fenêtre d'éveil recommandée pour son âge
- Deux boutons d'action rapide ("Démarrer sieste maintenant" / "Terminer sieste maintenant") qui pré-remplissent et auto-soumettent le formulaire

L'usage cible est **le parent qui ouvre la page sur son téléphone toute la journée** : il veut savoir à tout instant si la fenêtre approche de sa fin, sans relire les heures saisies dans le formulaire.

## 2. Décisions validées en brainstorming

| Dimension | Choix | Justification |
|---|---|---|
| Comportement pendant sieste en cours | Mode "En sieste depuis X" (couleur honey) | Aide à caler la fin de sieste, garde la card utile |
| Fenêtre d'éveil dépassée | Compteur principal continue à monter, sous-label devient rouge "Fenêtre dépassée de X" | Information sans urgence visuelle excessive |
| Placement | Card sticky en haut de la page Today, sous les méta-infos | Toujours visible pendant la saisie du formulaire en dessous |
| Quick actions | Démarrer + Terminer sieste avec auto-submit | Workflow zéro friction, prépare le terrain pour les futurs PWA shortcuts |
| Après bedtime saisi | Mode "Couché à HH:MM · bonne nuit" (couleur nuit violette) | Indication d'état final, plus de countdown bruyant le soir |

## 3. États du timer (machine à états)

Le timer affiche **un seul état à la fois**, déterminé par les valeurs courantes des `$state` du formulaire. La priorité de détection est explicite :

1. **`bedtime`** valide (HH:MM) → état `bedtime`
2. Une paire `naps[i].start` valide + `naps[i].end` vide → état `napping` (avec `napIdx = i`)
3. `wakeTime` valide → état `awake`
4. Sinon → état `empty`

### 3.1 État `empty`

- **Condition** : `wakeTime` est `''` (et donc tous les autres champs aussi normalement)
- **Affichage** : "Saisis l'heure de réveil pour démarrer le suivi"
- **Couleur** : `--c-text-muted`
- **Boutons** : aucun

### 3.2 État `awake`

- **Condition** : `wakeTime` valide, aucune sieste en cours, `bedtime` non saisi
- **Point d'origine du compteur** = `max(wakeTime, tous les napX_end valides)` — c'est le dernier moment où bébé a commencé à être éveillé
- **Affichage** :
  - Label : "Éveillé depuis"
  - Compteur principal : `Xh YYmin` (format `formatDuration`)
  - Sous-label : "Prochaine sieste dans Zmin (à HH:MM)" OU "Fenêtre dépassée de Wmin"
- **Couleurs** : compteur en `--c-primary` (terracotta). Sous-label en `--c-text-muted` quand dans la fenêtre, en `--c-danger` quand dépassée.
- **Bouton** : "Démarrer sieste maintenant" (visible). Disabled si les 4 créneaux de sieste sont déjà saisis.

### 3.3 État `napping`

- **Condition** : il existe un `napX_start` valide sans `napX_end` correspondant
- **Point d'origine** = `napX_start` en cours
- **Affichage** :
  - Label : "En sieste depuis"
  - Compteur principal : `Xh YYmin`
  - Sous-label : "Sieste {N}" (numéro 1-4)
- **Couleur** : `--c-accent-honey`
- **Bouton** : "Terminer sieste maintenant" (visible)

### 3.4 État `bedtime`

- **Condition** : `bedtime` valide (au format HH:MM)
- **Affichage** : "Couché à {bedtime} · bonne nuit 🌙"
- **Couleur** : `--c-cal-seg-night` (violet)
- **Bouton** : aucun

## 4. Placement et comportement visuel

**Position** : nouvelle card insérée dans `+page.svelte` après le bandeau `<h1>` + `page-meta` + `tz-info`, et **avant** le `<form>`.

**CSS** :

```css
position: sticky;
top: 0;
z-index: 10;
background: var(--c-bg-card);
box-shadow: var(--shadow-md);
border-radius: var(--r-lg);
padding: var(--s-3) var(--s-4);
margin-bottom: var(--s-3);
```

**Refresh** :
- `setInterval` côté client à 30 000 ms (30 secondes)
- Chaque tick : `now = new Date()` → tous les `$derived` qui consomment `now` se recalculent automatiquement
- Le `setInterval` est posé dans `onMount` et nettoyé dans le `return` (cleanup)
- Le timer recalcule aussi à chaque changement de l'un des `$state` du formulaire (le `$derived` réactive sur les inputs + sur `now`)

**`prefers-reduced-motion`** :
- Pas d'animation continue (le compteur change discrètement chaque 30s, pas de tick visible)
- Les transitions de couleur (entrée dans la zone rouge) sont remplacées par un changement instantané

**Anatomie visuelle — état `awake`** :

```
┌──────────────────────────────────────────────┐
│ ☀  Éveillé depuis                            │
│                                              │
│        1h47                                  │
│                                              │
│   Prochaine sieste dans 38min (à 14:30)     │
│                                              │
│        [ ⏸  Démarrer sieste maintenant ]    │
└──────────────────────────────────────────────┘
```

**Anatomie — état `awake` (fenêtre dépassée)** :

```
┌──────────────────────────────────────────────┐
│ ☀  Éveillé depuis                            │
│                                              │
│        3h12                                  │
│                                              │
│   ⚠ Fenêtre dépassée de 27min               │
│                                              │
│        [ ⏸  Démarrer sieste maintenant ]    │
└──────────────────────────────────────────────┘
```

**Anatomie — état `napping`** :

```
┌──────────────────────────────────────────────┐
│ ☁  En sieste depuis                          │
│                                              │
│        47min                                 │
│                                              │
│   Sieste 2                                   │
│                                              │
│        [ ✓  Terminer sieste maintenant ]    │
└──────────────────────────────────────────────┘
```

## 5. Quick actions

### 5.1 Démarrer sieste maintenant

Visible uniquement en état `awake`.

1. `nowHHMM` = heure courante au format `HH:MM` dans `data.effectiveTz` (utiliser `Intl.DateTimeFormat` ou un helper `formatHHMMInTZ` à ajouter dans `$lib/tz.ts` si absent)
2. `slotIdx = nextEmptyNapSlot(naps)` (retourne 0..3 ou `null`)
3. Si `slotIdx === null` (4 siestes déjà pleines), le bouton est `disabled` en amont — on n'arrive pas ici
4. Le composant appelle `onNapStart(slotIdx, nowHHMM)` (callback fourni par la page parent)
5. La page parent : `napsArr[slotIdx].start = nowHHMM` (via les setters individuels existants), puis `form.requestSubmit()`
6. Pendant la soumission, le bouton est en état loading (spinner + `disabled`)
7. Toast "Sieste {slotIdx+1} démarrée à {nowHHMM}" affiché 3 secondes

### 5.2 Terminer sieste maintenant

Visible uniquement en état `napping`.

1. `nowHHMM` = heure courante au format `HH:MM`
2. `slotIdx = inProgressNapSlot(naps)` (retourne 0..3 ou `null`)
3. Le composant appelle `onNapEnd(slotIdx, nowHHMM)`
4. La page parent met à jour `napsArr[slotIdx].end = nowHHMM`, puis `form.requestSubmit()`
5. Toast "Sieste {slotIdx+1} terminée à {nowHHMM} (durée {formatDuration(d)})"

### 5.3 Toast

- Composant léger : une `<div role="status" aria-live="polite">` rendue **à l'intérieur de la card du timer** (pas de positionnement fixe global). Apparaît sous les boutons et disparaît après 3s.
- `$state` boolean `toastVisible` + `$state` string `toastMessage`
- Sur action : `toastMessage = ...; toastVisible = true; setTimeout(() => toastVisible = false, 3000)`
- Pas de bibliothèque tierce — vanilla Svelte

### 5.4 Confirmation

Aucune confirmation à l'action. Le bouton est nominatif (Démarrer / Terminer), l'utilisateur peut éditer le champ correspondant dans le formulaire en dessous en cas d'erreur. L'objectif est zéro friction.

## 6. Architecture technique

### 6.1 Décomposition

| Fichier | Responsabilité |
|---|---|
| `src/lib/wake-timer.ts` | Fonctions pures : `deriveTimerState`, `nextEmptyNapSlot`, `inProgressNapSlot`. Aucun accès au DOM, aucun import server-only. |
| `tests/wake-timer.test.ts` | Tests unitaires (≥ 11 cas) |
| `src/lib/components/WakeTimer.svelte` | Card UI : observe les valeurs du formulaire en props, gère le `setInterval`, rend l'état courant, déclenche les callbacks |
| `src/routes/app/babies/[id]/today/+page.svelte` | Intègre `<WakeTimer ... />` après les méta-infos. Fournit les callbacks `onNapStart` / `onNapEnd` qui mettent à jour les `$state` du formulaire et appellent `form.requestSubmit()` |

### 6.2 Types dans `src/lib/wake-timer.ts`

```ts
import type { AgeParams } from '$lib/age-params';

export type TimerInput = {
  wakeTime: string;
  naps: Array<{ start: string; end: string }>;  // exactement 4 entries
  bedtime: string;
  awakeWindowMin: number;
};

export type TimerState =
  | { kind: 'empty' }
  | { kind: 'awake'; elapsedMin: number; remainingMin: number; nextNapAt: string; overWindow: boolean }
  | { kind: 'napping'; napIdx: number; elapsedMin: number }   // napIdx 0..3
  | { kind: 'bedtime'; bedtime: string };

/**
 * Compute the timer state from the current form inputs and reference time.
 * Pure function: same inputs → same output.
 */
export function deriveTimerState(input: TimerInput, now: Date): TimerState;

/** Returns 0..3 for the first empty slot, or null if all 4 are filled. */
export function nextEmptyNapSlot(naps: TimerInput['naps']): number | null;

/** Returns 0..3 for the first slot with start filled but end empty, or null. */
export function inProgressNapSlot(naps: TimerInput['naps']): number | null;
```

### 6.3 Détermination de l'état (dans `deriveTimerState`)

```
1. Si bedtime valide → { kind: 'bedtime', bedtime }
2. Sinon, si inProgressNapSlot ≠ null → { kind: 'napping', napIdx, elapsedMin }
   - elapsedMin = (now - parseHHMMToToday(naps[napIdx].start, now))
   - clamp à >= 0 (si l'heure de sieste est dans le futur — saisie erronée — on affiche 0)
3. Sinon, si wakeTime valide → { kind: 'awake', ... }
   - origin = max(wakeTime, all valid napEnd values)
   - elapsedMin = (now - origin)
   - remainingMin = awakeWindowMin - elapsedMin
   - overWindow = elapsedMin > awakeWindowMin
   - nextNapAt = HH:MM représentation de (origin + awakeWindowMin)
4. Sinon → { kind: 'empty' }
```

**Détail `parseHHMMToToday`** : convertit `'14:30'` en `Date` représentant aujourd'hui à 14:30 dans le fuseau effectif. Vu qu'on calcule des durées en minutes via différence, on peut se contenter d'une approche simple : parser HH+MM et construire une `Date` du même jour que `now` mais à cette heure locale. Pas de gestion de minuit qui rollover : ce timer s'utilise dans une fenêtre 06:00-22:00, pas autour de minuit.

### 6.4 Tests unitaires (`tests/wake-timer.test.ts`)

Cas à couvrir :

- État `empty` quand wakeTime vide et naps tous vides
- État `awake` simple : wakeTime à 07:00, `now` à 09:00 → `elapsedMin = 120`
- État `awake` après sieste finie : wakeTime 07:00, nap1 09:00-10:00, `now` à 11:00 → `elapsedMin = 60` (depuis nap1End)
- État `awake` avec 2 siestes finies : compteur depuis la plus récente
- État `awake` avec fenêtre dépassée → `overWindow: true`, `remainingMin: négatif`
- État `awake` : `nextNapAt` est correctement formaté en HH:MM
- État `napping` : nap1Start rempli, nap1End vide → `napping(0)`
- État `napping` sur nap3 : naps 1 et 2 finies, nap3Start rempli → `napping(2)`
- État `bedtime` override : même si nap en cours, bedtime saisi → état `bedtime`
- `nextEmptyNapSlot` : retourne 0 quand tous vides, 1 quand nap1 plein, null quand 4 pleins
- `inProgressNapSlot` : retourne l'index correct ou null
- Edge case : HH:MM invalide dans wakeTime → `empty` (pas de crash)
- Edge case : nap dont start est dans le futur (saisie erronée) → `elapsedMin` clampé à 0

### 6.5 Composant `WakeTimer.svelte`

**Props** :

```ts
type Props = {
  wakeTime: string;
  naps: Array<{ start: string; end: string }>;  // 4 entries
  bedtime: string;
  ageParams: AgeParams;
  effectiveTz: string;
  onNapStart: (slotIdx: number, hhmm: string) => void;
  onNapEnd: (slotIdx: number, hhmm: string) => void;
};
```

**Logique interne** :

```ts
let now = $state(new Date());

onMount(() => {
  const id = setInterval(() => { now = new Date(); }, 30_000);
  return () => clearInterval(id);
});

const state = $derived(deriveTimerState({
  wakeTime, naps, bedtime, awakeWindowMin: ageParams.awakeWindowMin
}, now));

let toastMessage = $state('');
let toastVisible = $state(false);
let submitting = $state(false);

function handleStart() {
  if (submitting) return;
  const slot = nextEmptyNapSlot(naps);
  if (slot === null) return;
  submitting = true;
  const hhmm = formatNowHHMM(effectiveTz);
  onNapStart(slot, hhmm);
  toastMessage = `Sieste ${slot + 1} démarrée à ${hhmm}`;
  toastVisible = true;
  setTimeout(() => { toastVisible = false; }, 3000);
  // Self-clear after 2s — covers both normal submit completion and any stuck case.
  // Parent doesn't need to coordinate.
  setTimeout(() => { submitting = false; }, 2000);
}
```

**`formatNowHHMM(tz)`** : helper local au composant ou ajouté à `$lib/tz.ts`. Utilise `Intl.DateTimeFormat(..., { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })`.

**Le composant ne mute jamais directement les `$state` du formulaire** ; il appelle les callbacks et laisse la page parent décider quoi faire. Cette séparation rend le composant testable en isolation et évite les couplages.

### 6.6 Intégration page `+page.svelte`

Dans le `<script>`, ajout d'un `bindable` form ref pour pouvoir appeler `requestSubmit` :

```ts
let formEl: HTMLFormElement;

function handleNapStart(slotIdx: number, hhmm: string) {
  // mute le $state correspondant
  if (slotIdx === 0) nap1Start = hhmm;
  else if (slotIdx === 1) nap2Start = hhmm;
  else if (slotIdx === 2) nap3Start = hhmm;
  else if (slotIdx === 3) nap4Start = hhmm;
  // submit
  setTimeout(() => formEl.requestSubmit(), 0);  // laisse Svelte appliquer le $state avant submit
}

function handleNapEnd(slotIdx: number, hhmm: string) {
  if (slotIdx === 0) nap1End = hhmm;
  else if (slotIdx === 1) nap2End = hhmm;
  else if (slotIdx === 2) nap3End = hhmm;
  else if (slotIdx === 3) nap4End = hhmm;
  setTimeout(() => formEl.requestSubmit(), 0);
}
```

Et dans le template, ajouter avant le `<form>` :

```svelte
<WakeTimer
  {wake}
  {naps_array}
  {bedtime}
  ageParams={data.ageParams}
  effectiveTz={data.effectiveTz}
  onNapStart={handleNapStart}
  onNapEnd={handleNapEnd}
/>
```

où `naps_array` est un `$derived` qui construit `[{start: nap1Start, end: nap1End}, ...]`.

Ajouter `bind:this={formEl}` sur la balise `<form>`.

## 7. Critères d'acceptation

- [ ] Sur Today, une card sticky apparaît en haut, sous les méta-infos et au-dessus du formulaire
- [ ] État `empty` affiche le message d'invitation quand `wakeTime` n'est pas saisi
- [ ] État `awake` affiche le compteur live et le countdown vers la prochaine sieste, avec auto-refresh toutes les 30s
- [ ] Le compteur `awake` pointe correctement vers le dernier événement d'éveil (réveil OU fin de sieste la plus récente)
- [ ] Quand la fenêtre est dépassée, le sous-label passe en rouge avec "Fenêtre dépassée de Xmin"
- [ ] État `napping` affiche le compteur depuis le `napX_start` en cours, en couleur honey
- [ ] État `bedtime` affiche "Couché à HH:MM · bonne nuit 🌙" en violet
- [ ] Bouton "Démarrer sieste" remplit le prochain créneau vide + auto-submit + toast
- [ ] Bouton "Terminer sieste" remplit le `napX_end` en cours + auto-submit + toast
- [ ] Boutons disabled quand l'action ne s'applique pas (4 siestes pleines en `awake`, pas de sieste en cours en `napping`)
- [ ] Pas de double-clic possible pendant la soumission (bouton en état loading)
- [ ] Card lisible sur mobile : taille de police suffisante, sticky n'écrase pas le formulaire
- [ ] Toast accessible (`role="status"`, `aria-live="polite"`), disparaît seul après 3s
- [ ] `prefers-reduced-motion` respecté (pas de transition d'animation continue)
- [ ] Tests unitaires `wake-timer.test.ts` au vert (≥ 11 cas)
- [ ] Lighthouse mobile : pas de régression notable sur Performance / CLS

## 8. Hors scope v1 (notés pour itérations futures)

- **Notifications Web Push** quand la fenêtre d'éveil approche de sa fin (projet séparé : VAPID keys, opt-in par device, scheduler côté serveur)
- **PWA shortcuts** dans le manifest pour Démarrer/Terminer sieste depuis l'écran d'accueil mobile (Android uniquement)
- **Détection automatique de changement de tranche d'âge** entre deux ticks (l'`awakeWindowMin` est résolu une fois au load, suffit)
- **Mode "co-parent" temps réel** : timer synchronisé entre deux devices (nécessite WebSocket ou polling, gros chantier)
- **Historique des fenêtres d'éveil** : graphe "fenêtres réelles vs recommandées" sur la page Stats
- **Vibration** ou son d'alerte quand la fenêtre est dépassée (intrusif, opt-in nécessaire)
