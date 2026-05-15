# BabySleep — Design System "Nursery / Terracotta & Miel"

**Date** : 2026-05-14
**Statut** : Design validé, prêt pour plan d'implémentation
**Itération précédente** : palette utilitaire bleue (`#1F4E78`) + emojis + composants Svelte inline

## 1. Objectif

Construire un design system cohérent pour BabySleep — palette, typographie, tokens d'espacement, composants réutilisables, support dark mode automatique. Le résultat doit être chaleureux ("nursery"), lisible de jour comme de nuit, et appliqué uniformément à toutes les pages existantes (Today, Historique, Stats, Édition bébé, Compte, Admin, Login, Signup).

## 2. Décisions validées en brainstorming

| Dimension | Choix | Justification |
|---|---|---|
| Mood | Doux & accueillant ("nursery scandinave") | App familiale utilisée à toute heure, doit rassurer |
| Palette | Terracotta & Miel sur crème | Chaud, cocoon, accent sage froid pour équilibre |
| Typographie | Nunito (400 / 600 / 700) seule famille | Sans-serif arrondi humaniste, lisible, vibe câline sans tomber dans le "kids" |
| Icônes | Phosphor (style Regular) | Cohérent, open-source, ~10-15 icônes nécessaires |
| Dark mode | Auto via `prefers-color-scheme` | Pas de toggle dans l'app pour v1, suit l'OS |
| Layout | Mobile-first conservé, max-width ~720px desktop | Pas de refonte structurelle, juste polish |

## 3. Tokens

### 3.1 Couleurs — light mode

| Token | Valeur | Usage |
|---|---|---|
| `--c-bg-app` | `#FBF8F3` | Fond de page (crème) |
| `--c-bg-card` | `#FFFFFF` | Cartes, inputs |
| `--c-bg-soft` | `#F0D9C2` | Surfaces accentuées (key-box, hint) |
| `--c-bg-muted` | `#FAF0E6` | Hints, zones "info secondaire" |
| `--c-primary` | `#C97A5D` | Terracotta — boutons primaires, accents, liens actifs |
| `--c-primary-hover` | `#B6694F` | Hover state |
| `--c-accent-honey` | `#E8B86E` | Miel — accents secondaires, bordures des "moments" siestes |
| `--c-accent-sage` | `#7A9A87` | Sage — success states, accent froid |
| `--c-text` | `#3D2E25` | Texte principal (brun chaud foncé) |
| `--c-text-muted` | `#7A6655` | Texte secondaire |
| `--c-border` | `#E5D5C0` | Bordures inputs, séparateurs |
| `--c-danger` | `#B8514A` | Erreurs, suppressions |

### 3.2 Couleurs — dark mode (`@media (prefers-color-scheme: dark)`)

| Token | Valeur |
|---|---|
| `--c-bg-app` | `#1F1814` |
| `--c-bg-card` | `#2A2117` |
| `--c-bg-soft` | `#3D2E25` |
| `--c-bg-muted` | `#2A2117` |
| `--c-primary` | `#E89876` |
| `--c-primary-hover` | `#F4A988` |
| `--c-accent-honey` | `#F0C988` |
| `--c-accent-sage` | `#94B5A2` |
| `--c-text` | `#F5EBE0` |
| `--c-text-muted` | `#B4A593` |
| `--c-border` | `#3D2E25` |
| `--c-danger` | `#E89189` |

### 3.3 Typographie

- Famille : **Nunito** (Google Fonts), self-hosted ou chargé via Google Fonts avec `display=swap`.
- Poids utilisés : **400** (corps), **500** (labels), **600** (medium / titres secondaires), **700** (titres principaux, valeurs-clés)
- Tabular nums : `font-feature-settings: "tnum"` sur les chiffres (heures, durées) pour qu'ils s'alignent.

Échelle (rem, base 16px) :

| Token | Valeur | Usage |
|---|---|---|
| `--fs-xs` | 0.75rem (12px) | Labels uppercase, badges |
| `--fs-sm` | 0.8125rem (13px) | Texte secondaire |
| `--fs-base` | 0.875rem (14px) | Corps |
| `--fs-md` | 0.9375rem (15px) | Inputs, boutons |
| `--fs-lg` | 1.125rem (18px) | Sous-titres |
| `--fs-xl` | 1.375rem (22px) | Titres de page |
| `--fs-2xl` | 1.75rem (28px) | Valeurs-clés mises en avant |

Line-height : `1.5` corps, `1.2` titres.

### 3.4 Espacement (4-point grid)

| Token | Valeur | Usage |
|---|---|---|
| `--s-1` | 4px | Gap minuscule, séparation visuelle |
| `--s-2` | 8px | Gap standard entre éléments inline |
| `--s-3` | 12px | Padding cellule, gap form fields |
| `--s-4` | 16px | Padding card, marge entre sections |
| `--s-5` | 24px | Marge entre blocs majeurs |
| `--s-6` | 32px | Marge entre sections de page |

### 3.5 Bordures et coins

| Token | Valeur | Usage |
|---|---|---|
| `--r-sm` | 6px | Pills, tags |
| `--r-md` | 10px | Inputs, boutons, hints |
| `--r-lg` | 14px | Cards, key-boxes |
| `--r-xl` | 20px | Modales, conteneurs majeurs |

### 3.6 Ombres

| Token | Valeur |
|---|---|
| `--shadow-sm` | `0 1px 3px rgba(61, 46, 37, 0.08)` |
| `--shadow-md` | `0 2px 8px rgba(61, 46, 37, 0.12)` |
| `--shadow-lg` | `0 4px 16px rgba(61, 46, 37, 0.16)` |

En dark mode, on remplace par des ombres plus subtiles ou on les supprime au profit de bordures contrastées.

## 4. Composants

### 4.1 Button

```svelte
<button class="btn btn-primary">
  <Icon name="floppy-disk" />
  Enregistrer la journée
</button>
```

Variantes : `.btn-primary` (terracotta plein), `.btn-secondary` (border, fond transparent), `.btn-danger` (rouge profond), `.btn-ghost` (juste texte coloré, pas de fond). Tailles : default (padding `var(--s-3) var(--s-4)`), `.btn-sm` (compact).

Tous arrondis `var(--r-md)`, font Nunito 600, transition sur hover/focus.

### 4.2 Input

Inputs `<input type="text|time|date|number">` et `<select>` partagent un style :
- bg `var(--c-bg-card)`, border `1.5px solid var(--c-border)`, radius `var(--r-md)`
- focus : border `var(--c-primary)`, ombre légère `0 0 0 3px rgba(C97A5D, 0.15)`
- font-size `var(--fs-md)`, padding `var(--s-3)` horizontal et vertical

### 4.3 Card

```svelte
<div class="card">
  <div class="field-label">Réveil</div>
  <input class="field-input" type="time" />
</div>
```

bg `var(--c-bg-card)`, radius `var(--r-lg)`, padding `var(--s-4)`, shadow `--shadow-sm`.

### 4.4 Key-box (valeurs clés mises en avant)

Pour "Coucher idéal", "Coucher suggéré", futurs résultats stats clés.
- bg `var(--c-bg-soft)` (chaud beige)
- border `1.5px solid var(--c-accent-honey)`
- radius `var(--r-lg)`, padding `var(--s-4)`
- layout : titre + sous-titre à gauche, valeur (terracotta, 22px bold, tabular) à droite

### 4.5 Nap-block (groupe début/fin par sieste)

```svelte
<div class="nap-block">
  <div class="nap-title"><Icon name="sun" /> Sieste 1</div>
  <div class="hint">Suggérée vers <strong>08:45</strong></div>
  <div class="pair">
    <Input label="DÉBUT" />
    <Input label="FIN" />
  </div>
</div>
```

Bordure gauche 3px `var(--c-accent-honey)`, padding-left `var(--s-3)`. Groupe visuellement les deux inputs liés.

### 4.6 Hint

Phrase d'aide contextuelle. bg `var(--c-bg-muted)`, padding `var(--s-2) var(--s-3)`, radius `var(--r-md)`, font-size `--fs-sm`, couleur `--c-text-muted`. La valeur suggérée à l'intérieur est en `--c-primary` bold.

### 4.7 Navigation

- **Header** : brand (icône bed + texte) à gauche, nav-pill à droite (Bébés / Compte). Sur mobile, nav-pill devient un menu sandwich si nécessaire — v1 garde la version horizontale tout simplement.
- **Baby-tabs** : pills par bébé, bg `var(--c-primary)` quand actif sinon border. Cliquables.
- **Sub-nav** : Aujourd'hui / Historique / Stats / Éditer. Onglet actif souligné `2px solid var(--c-primary)` + font-weight 600.
- **Back link** : `← Tous les bébés` etc., font-size sm, color muted, hover primary.

### 4.8 Badge / Label

Petits indicateurs ("admin", statut invitation). Padding `2px var(--s-2)`, radius `var(--r-sm)`, font-size xs, uppercase tracking 0.5px.

## 5. Icônes Phosphor — inventaire d'usage

| Icône Phosphor | Usage |
|---|---|
| `Bed` (regular) | Brand / Today |
| `Clock` | Inputs heure, "réveil" |
| `Sun` | Sieste / journée |
| `Moon` | Coucher / nuit |
| `Star` | Valeurs-clés (Coucher idéal/suggéré) |
| `ListChecks` | Historique |
| `ChartLine` | Stats |
| `Pencil` | Éditer |
| `ArrowLeft` | Liens retour |
| `Plus` | Ajouter bébé / invitation |
| `Trash` | Supprimer |
| `SignOut` | Déconnexion |
| `UserCircle` | Compte |
| `Envelope` | Invitations |
| `FloppyDisk` | Enregistrer |
| `Globe` | Fuseau horaire |

Lib : **`phosphor-svelte`** (paquet officiel). Tree-shakeable, on importe au cas par cas pour ne pas alourdir le bundle.

## 6. Implémentation

### 6.1 Fichiers nouveaux

- `src/lib/styles/tokens.css` — toutes les variables CSS (light + dark via media query)
- `src/lib/styles/base.css` — reset minimal + base body/html, import Nunito, application des tokens sur les éléments natifs
- `src/lib/styles/components.css` — classes utilitaires `.btn`, `.btn-primary`, `.card`, `.field-input`, `.field-label`, `.hint`, `.key-box`, `.nap-block`, `.badge`
- (optionnel) `src/lib/components/Icon.svelte` — wrapper léger autour de phosphor-svelte pour usage uniforme (`<Icon name="bed" size={16} />`)

### 6.2 Modification du layout racine

`src/routes/+layout.svelte` :
- Importe `tokens.css` et `base.css` en `<svelte:head>` (ou via Vite via `+layout.svelte` script tag direct).
- Charge Nunito : préférer Google Fonts avec `display=swap` pour v1 (zero setup). Document un upgrade futur vers self-hosted woff2 pour la perf.
- Définit le `<body>` avec `background: var(--c-bg-app); color: var(--c-text); font-family: Nunito, system-ui, sans-serif;`.

### 6.3 Migration page par page

1. **`+layout.svelte` racine** : import des CSS + Nunito + meta theme-color terracotta
2. **`/login` et `/signup`** : refonte simple (form centré, card, btn-primary)
3. **`/app/+layout.svelte`** : nouveau header (brand + nav-pill), baby-tabs stylés, sub-nav avec underline
4. **`/app/babies/[id]/today`** : application des nap-blocks, key-boxes, replace emojis par Phosphor là où pertinent
5. **`/app/babies/[id]/history`** : table polishée, summary strip en cards horizontales, bouton CSV `.btn-secondary`
6. **`/app/babies/[id]/stats`** : period selector en pills, charts unchanged (Chart.js gère ses couleurs), summary header en cards
7. **`/app/babies` et `/app/babies/[id]`** : forms en cards, btn-primary
8. **`/account`** : sessions en cards, forms uniformes
9. **`/admin/invitations`** : table polished, btn-primary pour générer
10. **`/+error`** : page d'erreur avec illustration éventuelle (out of scope v1) ou simple card centrée

### 6.4 Stratégie d'écrasement progressive

- Ne **pas** réécrire toutes les pages d'un coup — risque de régressions UX.
- Ordre proposé : tokens + base + components.css en premier (impact global mais subtil), puis layout racine, puis pages dans l'ordre listé.
- Chaque page = un commit séparé pour debug facile.

### 6.5 Tests

Pas de tests automatisés visuels pour v1 (pas de Playwright + screenshot diff). Vérification manuelle après chaque page migrée :
- Rendu light + dark
- Mobile + desktop (Chrome DevTools responsive)
- Formulaire fonctionnel (les handlers existants doivent continuer de marcher — on touche QUE le CSS et le markup wrapper)

Les **tests Vitest existants doivent rester verts** — aucun test ne dépend du markup.

## 7. Compatibilité avec le code existant

- `svelte.config.js` CSP : `style-src 'self' 'unsafe-inline'` est déjà OK pour les styles Svelte scopés. Si on charge Google Fonts, il faudra ajouter `'fonts.googleapis.com' 'fonts.gstatic.com'` à `style-src` et `font-src`. **Action requise** dans la migration.
- PWA : le manifest theme-color passe de `#1F4E78` à `#C97A5D` (terracotta). Background `#FBF8F3` (crème).
- L'icône PWA actuelle (1×1 placeholder) reste à remplacer un jour par une vraie image, hors scope v1 du redesign.

## 8. Hors scope (notes pour plus tard)

- Toggle dark mode manuel dans l'app (env. 1h de travail)
- Animations / transitions (subtiles transitions sur les hovers et le `prefers-reduced-motion` à respecter)
- Vraies icônes PWA 192/512 dessinées
- Page d'erreur 404 avec illustration custom
- Spinner / skeleton loaders pendant les navigations
- Mode "lecture seule" (pour partager une vue avec un proche)

## 9. Critères de succès

L'implémentation est livrable quand :
- [ ] Tokens chargés et application du `body` au minimum
- [ ] Nunito visible partout (test rapide : la page de login)
- [ ] Light mode et dark mode passables sur tous les écrans existants
- [ ] Au moins l'icône Phosphor `bed` dans le header (preuve d'intégration)
- [ ] CSP mise à jour si Google Fonts utilisé
- [ ] Tous les tests Vitest existants restent verts
- [ ] Manifest PWA color cohérent
- [ ] Pas de régression fonctionnelle dans les form actions (login, save journée, change mdp, etc.)
