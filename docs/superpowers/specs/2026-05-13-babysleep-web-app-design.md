# BabySleep — Web app de suivi de sommeil bébé

**Date** : 2026-05-13
**Statut** : Design validé, prêt pour planning d'implémentation
**Itération précédente** : feuille Google Sheets `calculateur_sommeil_bebe.xlsx` (livrée) — port vers une vraie app web

## 1. Objectif

Porter le calculateur de sommeil bébé Google Sheets vers une application web dockerisée, multi-bébés, avec authentification, export CSV et installation PWA. Usage privé/familial uniquement.

## 2. Contraintes & exigences explicites

Exigences directes de l'utilisateur :
- Application web déployable via Docker (`docker-compose`).
- Base de données persistante.
- Authentification avec mot de passe, possibilité de changer son mot de passe.
- Un seul compte peut suivre plusieurs bébés.
- Export des données de sommeil au format CSV.
- Compatible PWA (installable sur écran d'accueil).
- Sessions tenant plusieurs jours (cookies longue durée).

Exigences implicites validées en brainstorming :
- Audience : famille (privé, pas de SaaS public).
- Inscription : bootstrap admin via env + invitations par lien.
- Modèle d'âge : date de naissance avec override possible (âge corrigé prématurés).
- Granularité du log : parité Sheets — 1 ligne par (bébé, date).
- PWA : installable, **online requis** (pas d'offline-first).
- Export CSV : par bébé, avec filtre de dates.

## 3. Stack technique

| Couche             | Choix                                                                          |
|--------------------|--------------------------------------------------------------------------------|
| Framework          | **SvelteKit** (adapter-node, output standalone)                                |
| Langage            | TypeScript strict                                                              |
| Base de données    | **SQLite** via `better-sqlite3` (WAL mode)                                     |
| ORM                | **Drizzle** (migrations TS, type-safe queries)                                 |
| Mots de passe      | **argon2id** via `@node-rs/argon2` (params OWASP 2025 : m=19456, t=2, p=1)     |
| Sessions           | Cookies HttpOnly Secure SameSite=Lax, IDs en table `sessions`                  |
| PWA                | `vite-plugin-pwa` mode `generateSW` (Workbox), precache du shell               |
| Front UI           | Svelte 5, CSS scoped, pas de framework UI (composants maison légers)           |
| Tests              | `vitest` (unitaires + intégration légère). Pas de Playwright pour v1.          |
| Container          | `node:22-alpine` multi-stage build                                             |
| Reverse proxy      | **Hors scope** — fourni par l'utilisateur (Caddy/Traefik en amont, gère HTTPS) |

## 4. Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Reverse proxy externe (Caddy/Traefik) — HTTPS                 │
└──────────────────────┬─────────────────────────────────────────┘
                       │ HTTP interne
            ┌──────────▼──────────┐
            │  SvelteKit (Node)   │   un seul conteneur :
            │  - Pages SSR + form │     - app + API + service worker
            │    actions          │     - argon2id, sessions, CSV
            │  - API /api/*       │     - Drizzle
            │  - Service Worker   │
            └──────────┬──────────┘
                       │ binding natif
            ┌──────────▼──────────┐
            │  SQLite + WAL       │   volume Docker `/data`
            │  /data/babysleep.db │   backup = copie du fichier
            └─────────────────────┘
```

Une seule image, un seul service applicatif, un volume Docker nommé.

## 5. Modèle de données (Drizzle / SQLite)

```ts
// users
{
  id: integer PK autoincrement,
  email: text NOT NULL UNIQUE,           // lowercased à l'insertion
  password_hash: text NOT NULL,          // argon2id
  is_admin: integer NOT NULL DEFAULT 0,  // 0/1
  created_at: integer NOT NULL,          // unix seconds
  updated_at: integer NOT NULL,
}

// sessions
{
  id: text PK,                           // 32 octets aléatoires → base64url
  user_id: integer FK users.id NOT NULL,
  expires_at: integer NOT NULL,          // unix seconds, sliding
  last_used_at: integer NOT NULL,
  user_agent: text,                      // pour la liste "appareils connectés"
  created_at: integer NOT NULL,
}
// index : sessions(expires_at), sessions(user_id)

// invitations
{
  id: integer PK autoincrement,
  token: text NOT NULL UNIQUE,           // 32 octets → base64url
  created_by: integer FK users.id NOT NULL,
  expires_at: integer NOT NULL,          // unix seconds, +7 jours par défaut
  used_at: integer,                      // NULL = non utilisée
  used_by: integer FK users.id,
  created_at: integer NOT NULL,
}

// babies
{
  id: integer PK autoincrement,
  user_id: integer FK users.id NOT NULL,
  name: text NOT NULL,
  birth_date: text NOT NULL,             // ISO date YYYY-MM-DD
  age_override_months: integer,          // NULL = calcul depuis birth_date
  created_at: integer NOT NULL,
  updated_at: integer NOT NULL,
}
// index : babies(user_id)

// sleep_entries — 1 ligne par (baby, date), parité Sheets
{
  id: integer PK autoincrement,
  baby_id: integer FK babies.id NOT NULL,
  date: text NOT NULL,                   // ISO date YYYY-MM-DD
  wake_time: text,                       // 'HH:MM' ou NULL
  nap1_end: text,
  nap2_end: text,
  nap3_end: text,
  nap4_end: text,
  bedtime: text,
  notes: text,
  created_at: integer NOT NULL,
  updated_at: integer NOT NULL,
}
// UNIQUE(baby_id, date)
// index : sleep_entries(baby_id, date DESC)
```

**Convention heures** : `TEXT 'HH:MM'` 24h pour la lisibilité. Conversions vers minutes-depuis-minuit pour les calculs et moyennes (`lib/time.ts`).

**Paramètres d'âge** : codés en dur dans `src/lib/age-params.ts` (les 8 tranches du Sheets, structure `{ageMinMonths, ageMaxMonths, label, naps, awakeWindowMin, beforeBedWindowMin, nightSleepH, daySleepH}`). Versionné en git, pas en DB.

## 6. Authentification

### Mots de passe
- Hashing argon2id, params OWASP 2025 (`memoryCost: 19456 KiB, timeCost: 2, parallelism: 1`).
- Politique : ≥ 10 caractères, vérification côté serveur. Pas de regex de complexité.

### Bootstrap admin (premier compte)
- Au démarrage : si `users` est vide ET `ADMIN_EMAIL` + `ADMIN_PASSWORD` sont définis, on crée l'admin (`is_admin=1`).
- Si la table n'est pas vide, on ignore les variables (pas de "reset" magique par redémarrage).
- Si l'admin oublie son mdp : script CLI `npm run reset-password -- <email>` exécutable dans le conteneur.

### Invitations
1. Admin sur `/admin/invitations` clique "Générer une invitation" → ligne créée avec token aléatoire, `expires_at = now + 7j`.
2. Page affiche le lien `<host>/signup?token=<token>` à copier-coller.
3. `/signup?token=...` :
   - Sans token / token expiré / token déjà utilisé → page "inscription sur invitation uniquement".
   - Avec token valide → form email + mot de passe + confirmation.
   - À la soumission : création du user, `used_at = now`, `used_by = new_user_id`. Redirection vers `/login`.
4. Liste des invitations dans `/admin/invitations` avec leur statut (en attente / utilisée / expirée).

### Sessions
- **Login** : POST `/login` (form action) → vérif argon2id → génération `session_id` (32B aléatoires → base64url) → INSERT dans `sessions` (`expires_at = now + 30j`) → cookie `session=<id>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=30j`.
- **Chaque requête** (`hooks.server.ts`) :
  1. Lit le cookie `session`.
  2. SELECT dans `sessions` join `users`. Si introuvable ou `expires_at < now` → `locals.user = null`.
  3. Sinon `locals.user = user`, `locals.session = session`.
  4. Si `last_used_at < now - 24h` → UPDATE `last_used_at = now`, `expires_at = now + 30j` (sliding). Cap dur à `created_at + 90j` (au-delà : session révoquée, force re-login).
- **Logout** : DELETE de la ligne `sessions`, clear cookie.
- **Purge** : un `setInterval` au démarrage (toutes les heures) `DELETE FROM sessions WHERE expires_at < now`.

### Changement de mot de passe
- Page `/account` → form `current_password`, `new_password`, `confirm`.
- Vérification de l'ancien mot de passe argon2id.
- UPDATE `password_hash` + `updated_at`.
- **Révoque toutes les autres sessions du user** : `DELETE FROM sessions WHERE user_id = X AND id != current_session_id`.
- Feedback : "Mot de passe modifié — vos autres appareils ont été déconnectés."

### Liste appareils / sessions actives
- `/account` affiche aussi la liste des sessions du user (date création, user_agent, last_used). Bouton "Révoquer" sur chaque ligne (sauf la session courante, marquée "Cet appareil").

### Rate limiting
- Map en RAM, scopée par IP. Limites :
  - `/login` : 5 essais / 15 min / IP.
  - `/signup` : 5 essais / 15 min / IP.
  - Au-delà : réponse 429 + Retry-After.
- Reset au redémarrage de l'app (acceptable pour un usage privé).

## 7. Routes & pages

```
/                          → redirection vers /app si loggué, sinon /login
/login                     → form action POST
/logout                    → form action POST (CSRF via origin check)
/signup?token=<...>        → form action POST, token requis
/account                   → changement mdp + liste sessions actives
/account/sessions/<id>     → DELETE (form action) pour révoquer une session
/admin/invitations         → admin only : créer + lister
/app                       → redirection : vers /app/babies/<dernier_id>/today si défini,
                             sinon vers /app/babies (création si aucun bébé)
/app/babies                → liste / créer
/app/babies/<id>           → édition (nom, DOB, override) + suppression
/app/babies/<id>/today     → calculateur du jour (page principale, switcher bébé en header)
/app/babies/<id>/history   → tableau historique + filtres date + bouton CSV
/api/babies/<id>/export.csv?from=YYYY-MM-DD&to=YYYY-MM-DD  → endpoint CSV
```

Le "dernier bébé consulté" est mémorisé dans un cookie `last_baby_id` non-HttpOnly (lisible côté serveur uniquement, pas sensible), pour rediriger directement vers son `today`. Le switcher de bébé dans le header met à jour ce cookie.

### Page calculateur (`/app/babies/<id>/today`)
Reprend exactement le flow du Sheets :
- Header : nom du bébé, âge calculé (DOB ou override), tranche d'âge correspondante.
- Recommandations pour l'âge (Nb siestes, fenêtre éveil, fenêtre avant coucher, sommeil nuit, coucher idéal).
- Plan du jour : champs `wake_time`, `nap1_end`..`nap4_end`, `bedtime` (saisie progressive avec suggestions à la volée).
- Bouton "Enregistrer la journée" : UPSERT dans `sleep_entries` pour `(baby_id, today)`. Toast de confirmation.
- Récap historique des 7 derniers jours en bas.

### Page historique (`/app/babies/<id>/history`)
- Tableau paginé (50 lignes / page), tri par date desc.
- Colonnes : Date, Réveil, Siestes 1–4, Coucher, Nb siestes, Durée nuit préc., Notes.
- Synthèse en haut (moyennes sur la période filtrée).
- Filtres : date de début, date de fin (par défaut : 30 derniers jours).
- Bouton "Télécharger CSV" → ouvre l'endpoint export avec les filtres courants.
- Click sur une ligne → édition inline (modale).

## 8. Calculateur (port direct du Sheets)

Lib pure `src/lib/sleep-calc.ts`, testée unitaire :

```ts
type AgeParams = {
  label: string;
  naps: number;
  awakeWindowMin: number;
  beforeBedWindowMin: number;
  nightSleepH: number;
  daySleepH: number;
};

function ageInMonths(birthDate: string, override?: number, today = new Date()): number;
function paramsForAge(months: number): AgeParams;
function idealBedtime(wakeTimeHHMM: string, nightSleepH: number): string;
function suggestNextNap(lastEndHHMM: string, awakeWindowMin: number): string;
function suggestedBedtime(events: DayEvents, ageParams: AgeParams): string;
```

Cas limites couverts par tests :
- Passage de minuit (réveil 23:00 → coucher idéal "00:00")
- Bébé sans aucune sieste saisie → retombe sur coucher idéal
- Âge hors bornes 0–36 mois → clamp aux bornes du tableau
- DOB dans le futur → erreur explicite
- `age_override_months` priorise sur birth_date

## 9. PWA

- `vite-plugin-pwa` config `registerType: 'autoUpdate'`, `generateSW` Workbox.
- Précache : shell SvelteKit (HTML, JS, CSS hashés).
- Runtime cache : fonts/icones en stale-while-revalidate.
- Manifest :
  ```json
  {
    "name": "BabySleep",
    "short_name": "BabySleep",
    "display": "standalone",
    "background_color": "#1F4E78",
    "theme_color": "#1F4E78",
    "icons": [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]
  }
  ```
- Meta iOS pour splash + theme.
- En offline : toast "pas de réseau" mais l'app shell reste affichée (depuis le cache).

## 10. Export CSV

- Endpoint `GET /api/babies/:id/export.csv?from=YYYY-MM-DD&to=YYYY-MM-DD`.
- Auth requise. Vérif `baby.user_id === locals.user.id` (sinon 404 — pas de 403 pour ne pas révéler l'existence).
- Format :
  - UTF-8 avec BOM (pour Excel français)
  - Séparateur `;` (idem)
  - Sauts de ligne `\r\n`
  - Header : `Date;Réveil;Sieste 1;Sieste 2;Sieste 3;Sieste 4;Coucher;Nb siestes;Durée nuit préc.;Notes`
  - Notes échappées : guillemets doubles + doublement des guillemets internes.
- Filename : `Content-Disposition: attachment; filename="babysleep_<slug>_<from>_<to>.csv"`.
- Colonnes calculées :
  - `Nb siestes` : count des `napX_end` non-NULL.
  - `Durée nuit préc.` : différence entre `wake_time` du jour et `bedtime` du jour précédent (au format `HH:MM`, vide si données manquantes).

## 11. Docker

### Dockerfile
- Multi-stage : stage `deps` (install + prune), stage `build` (`npm run build`), stage `runtime` (`node:22-alpine` + l'output standalone uniquement). Image cible ~150 MB.
- User non-root `node`.
- Healthcheck `GET /healthz` → 200 si la DB est accessible.

### docker-compose.yml
```yaml
services:
  app:
    build: .
    image: babysleep:latest
    container_name: babysleep
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/data/babysleep.sqlite
      - SESSION_SECRET=${SESSION_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - DISABLE_SIGNUP=${DISABLE_SIGNUP:-false}
      - TZ=Europe/Paris
    volumes:
      - babysleep_data:/data
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3
volumes:
  babysleep_data:
```

### Variables d'environnement (`.env.example`)
| Variable           | Obligatoire | Description                                                     |
|--------------------|-------------|-----------------------------------------------------------------|
| `SESSION_SECRET`   | Oui         | Réserve pour signer cookies/CSRF tokens (≥ 32 octets aléatoires). L'ID de session lui-même est opaque (random 32B) et lookupé en DB, donc pas signé — mais le secret reste utile pour les form actions de SvelteKit et tout cookie auxiliaire futur. |
| `ADMIN_EMAIL`      | Au premier démarrage | Email de l'admin bootstrap                             |
| `ADMIN_PASSWORD`   | Au premier démarrage | Mot de passe de l'admin bootstrap (peut être vidé ensuite) |
| `DATABASE_PATH`    | Non         | Défaut `/data/babysleep.sqlite`                                 |
| `DISABLE_SIGNUP`   | Non         | Coupe `/signup` (utile si toutes les invitations sont émises)   |
| `TZ`              | Non         | Défaut `Europe/Paris`                                            |

## 12. Tests

`vitest`. Cible : passer en local et en CI (GitHub Actions ou rien — au choix).

**Unitaires (lib pure)** :
- `lib/sleep-calc.test.ts` : tous les cas limites listés en §8.
- `lib/time.test.ts` : parse/format HH:MM, diff en minutes, passage de minuit.
- `lib/age-params.test.ts` : lookup à toutes les bornes, hors bornes, négatifs.

**Intégration (in-memory SQLite)** :
- Signup avec token valide / expiré / déjà utilisé.
- Login + session créée + cookie posé.
- Sliding expiration : session de 25h refresh, session de 91j révoquée.
- Password change : ancien mdp invalide rejeté ; autres sessions révoquées, courante préservée.
- CSV export : auth requise, ownership vérifiée, format BOM + `;`.
- Multi-bébés : un user ne voit pas les bébés d'un autre user (404).

Pas de Playwright pour v1.

## 13. Hors scope v1 (notes pour plus tard)

- Graphes / charts d'évolution (Chart.js ou similaire).
- Notifications push de rappel.
- Reset mot de passe par email (nécessite SMTP).
- Offline-first avec sync queue (IndexedDB + background sync).
- Import du CSV Sheets existant vers la DB (proposé en option, refusé pour v1).
- Photo / avatar par bébé.
- Mode sombre.
- i18n (l'app sera 100% FR en v1).
- Multi-tenants / SaaS public.

## 14. Risques & mitigations

| Risque                                    | Mitigation                                                   |
|-------------------------------------------|--------------------------------------------------------------|
| Perte du fichier SQLite                   | Doc backup (`sqlite3 .backup`) + volume nommé Docker         |
| Admin oublie son mot de passe             | Script CLI `npm run reset-password` dans le conteneur        |
| Session leak via XSS                      | Cookies HttpOnly + CSP stricte (`default-src 'self'`)        |
| CSRF                                      | Form actions same-origin uniquement, vérif `Origin` header   |
| Brute force login                         | Rate limit 5/15min/IP                                        |
| Bug calcul d'heure (passage minuit)       | Tests unitaires exhaustifs sur `lib/sleep-calc`              |
| Lock SQLite sous charge                   | WAL mode (faible probabilité vu l'usage perso)               |

## 15. Critères de succès

L'app v1 est livrable quand :
- [ ] `docker-compose up` lance l'app, l'admin se logge avec ses creds env.
- [ ] L'admin génère une invitation, le conjoint s'inscrit via le lien.
- [ ] Chaque user peut créer un bébé (nom + DOB), saisir une journée, voir l'historique.
- [ ] Le calculateur affiche les bonnes suggestions pour chaque tranche d'âge.
- [ ] L'export CSV produit un fichier ouvrable dans Excel français.
- [ ] L'app s'installe sur Android via "Ajouter à l'écran d'accueil".
- [ ] La session survit à un redémarrage du téléphone et 7 jours d'inactivité.
- [ ] Le changement de mot de passe déconnecte les autres appareils mais pas le courant.
- [ ] Tous les tests `vitest` passent.
