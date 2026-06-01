# BabySleep

Une PWA auto-hébergée pour suivre le sommeil, les siestes et les nuits de ton
bébé. Pensée pour les parents qui veulent garder leurs données de famille sur
leur propre serveur.

🇬🇧 [Read in English](./README.en.md)

![Vue calendrier mensuelle](./docs/screenshots/1.png)

---

## C'est quoi ?

BabySleep est une petite app web que tu fais tourner sur ta propre machine
(Raspberry Pi, NAS, VPS, laptop — tout ce qui fait tourner Docker). Elle te
permet de :

- Enregistrer l'heure de réveil, les siestes et le coucher de bébé
- Voir une suggestion par tranche d'âge pour la prochaine sieste et l'heure
  de coucher du soir
- Suivre l'évolution sur plusieurs semaines via un calendrier heatmap et une
  page de stats
- Noter chaque nuit manuellement (bonne / moyenne / mauvaise) pour un repère
  visuel rapide
- Partager l'accès avec ton/ta partenaire via des invitations privées

Pas de cloud, pas d'analytics, pas de compte chez un tiers. Tes données vivent
dans un fichier SQLite unique sur un volume Docker que tu contrôles.

---

## Fonctionnalités

- **Vue Aujourd'hui** — formulaire rapide pour les saisies du jour avec un
  timer live "fenêtre d'éveil" qui te dit quand caler la prochaine sieste.
- **Calendrier** — grille mensuelle (ou strip vertical sur mobile) avec une
  timeline 24h par jour, couleurs heatmap selon le % du quota de sommeil
  recommandé pour l'âge, et une note manuelle par nuit (✓ / − / ✗).
- **Historique** — tableau filtrable avec export CSV.
- **Stats** — graphes des moyennes sur la période (heure de réveil, coucher,
  durée des siestes).
- **Multi-bébés** — suivre plusieurs bébés sous le même compte.
- **Multi-utilisateurs** — l'admin génère des liens d'invitation à durée
  limitée ; auth par mot de passe avec hash argon2id.
- **PWA** — installable depuis le navigateur ; mode standalone iOS avec
  apple-touch-icon et metas dédiées.
- **Fuseaux horaires** — overrides par utilisateur, par bébé et par entrée.
- **Schéma simple** — facile à migrer depuis un autre tracker via CSV.

UI en français pour l'instant. EN dans la roadmap.

---

## Captures d'écran

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/2.png" alt="Calendrier — vue mobile (strip vertical)" /></td>
    <td width="50%"><img src="./docs/screenshots/3.png" alt="Page Aujourd'hui avec le timer fenêtre d'éveil" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Calendrier (mobile)</sub></td>
    <td align="center"><sub>Page Aujourd'hui avec timer live</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/4.png" alt="Tableau historique avec export CSV" /></td>
    <td><img src="./docs/screenshots/5.png" alt="Stats avec Chart.js" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Tableau historique</sub></td>
    <td align="center"><sub>Stats sur une période</sub></td>
  </tr>
</table>

---

## Démarrage rapide (Docker)

Tu as besoin de Docker et Docker Compose v2.

```bash
git clone https://github.com/Gavark/babysleep.git
cd babysleep
cp .env.example .env
# Édite .env et mets une valeur pour SESSION_SECRET (chaîne aléatoire ≥ 32 chars)
docker compose up -d
```

Ouvre <http://localhost:3000> dans ton navigateur — tu seras redirigé vers un
wizard de configuration pour créer ton compte admin. Ensuite, connecte-toi et
commence à enregistrer.

### Derrière un reverse proxy avec HTTPS

Si tu veux HTTPS via Let's Encrypt et un nom de domaine, le projet ship une
stack complète avec Caddy + un container annexe qui fait un backup SQLite chaque nuit :

```bash
cp Caddyfile.example Caddyfile
# Édite Caddyfile et mets ton domaine (records DNS A/AAAA pointant vers ce host)
docker compose -f docker-compose.full.yml up -d
```

Si tu préfères Nginx Proxy Manager, Traefik ou ton propre reverse proxy, reste
sur le `docker-compose.yml` minimal et pointe ton proxy vers le port 3000.

---

## Configuration

Toute la config passe par des variables d'environnement. Voir
[`.env.example`](./.env.example) pour la liste complète annotée. Les principales :

| Variable | Requis | Description |
|---|---|---|
| `SESSION_SECRET` | oui | Chaîne aléatoire ≥ 32 chars. Signe les cookies d'auth. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | non | Passe le wizard pour les déploiements scriptés. |
| `DISABLE_SIGNUP` | non | `true` pour bloquer `/signup`. Les invitations marchent quand même. |
| `ORIGIN` | oui si derrière un proxy | URL publique HTTPS pour les checks CSRF/Origin. |
| `TZ` | non | Fuseau horaire du container. Défaut `Europe/Paris`. |

---

## Backup

`docker-compose.full.yml` inclut un container dédié qui copie la DB SQLite
dans `./backups/` tous les jours à 03:00 (configurable via `BACKUP_SCHEDULE`).
Rétention par défaut : 30 snapshots quotidiens (`BACKUP_RETENTION`).

Pour déclencher un backup à la demande :

```bash
docker compose -f docker-compose.full.yml exec backup sh /usr/local/bin/run-backup
```

Si tu utilises le compose minimal, apporte ton propre outil de backup
(restic, borg, …) pointé sur le volume Docker `babysleep_data`.

---

## Mise à jour

```bash
git pull
docker compose -f docker-compose.full.yml pull app
docker compose -f docker-compose.full.yml up -d app
```

L'app applique les migrations Drizzle en attente au démarrage. Les migrations
à ce jour sont uniquement additives (aucun drop, aucun changement destructif) —
tes données sont safe entre versions pendant la phase `v0.x`.

---

## Mot de passe oublié

```bash
docker compose exec app npm run reset-password -- ton@email
```

Un prompt te demandera le nouveau mot de passe. **Aucune donnée n'est perdue** :
seul le hash du mot de passe est remplacé en base. Tes bébés, tes saisies de
sommeil et tes invitations sont conservés.

En revanche, **toutes tes sessions actives sont déconnectées** (y compris celle
que tu utilises au moment du reset) — c'est volontaire, ça évite qu'une session
volée reste valide avec l'ancien mot de passe. Tu te reconnectes avec le nouveau.

## Sessions actives

La page `/account` liste les sessions ouvertes (navigateur, dernière utilisation,
device). Trois moyens de les couper :

- **Couper une session précise** : bouton "Déconnecter" en face de chaque ligne
  sur `/account`. Celle que tu utilises actuellement n'a pas le bouton — utilise
  le menu "Déconnexion" du header pour ça.
- **Couper toutes les autres** : la section "Changer mon mot de passe" de
  `/account` invalide automatiquement toutes les autres sessions une fois le
  changement réussi (la tienne reste).
- **Tout couper d'un coup** : le `reset-password` CLI ci-dessus, ou en SQL direct :

  ```bash
  docker compose exec app sqlite3 /data/babysleep.sqlite \
    "DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email='ton@email');"
  ```

---

## Développement local

```bash
npm install
cp .env.example .env
# Mets une valeur pour SESSION_SECRET
mkdir -p data
npm run db:migrate
npm run dev
```

Tests :

```bash
npm test
```

Type-check :

```bash
npm run check
```

Stack : SvelteKit 2 + Svelte 5 (runes) + TypeScript strict, Drizzle ORM sur
better-sqlite3, argon2id via `@node-rs/argon2`, Chart.js pour les stats,
phosphor-svelte pour les icônes, Nunito Variable (self-hosted) pour la typo.

---

## Statut & roadmap

On est en `v0.x` — le modèle de données et la surface de config peuvent break
entre versions mineures. Le schéma est petit (`users`, `babies`, `sleep_entries`,
`sessions`, `invitations`) et les migrations sont additives, mais je ne m'engage
pas sur la stabilité de l'API avant `v1.0`.

Ce que je veux ajouter (pas d'ETA ferme) :

- UI anglaise (i18n)
- Image arm64 native (Raspberry Pi sans rebuild depuis les sources)
- Notifications Web Push quand la fenêtre d'éveil est dépassée
- Partage co-parent avec distinction lecture-seule / lecture-écriture
- Tags optionnels par jour (malade, crèche, vacances)

---

## Licence

[AGPL-3.0-or-later](./LICENSE). Si tu fais tourner une copie modifiée en
tant que service public, tu dois publier tes modifications sous la même
licence.

---

## Auteur

Construit par [@Gavark](https://github.com/Gavark). Issues et PRs bienvenues.
