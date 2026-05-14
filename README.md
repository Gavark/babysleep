# BabySleep

Petite app web de suivi de sommeil bébé (calculateur + historique), dockerisée, PWA, multi-bébés, auth privée.

## Démarrage rapide

```bash
cp .env.example .env
# Édite SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up -d
```

L'app écoute sur http://localhost:3000. Mets un reverse proxy (Caddy, Traefik) devant pour HTTPS.

À la première montée, le compte admin est créé depuis `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Ensuite, génère des invitations dans `/admin/invitations` pour ajouter d'autres comptes.

## Variables d'environnement

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Clé aléatoire ≥ 32 chars |
| `ADMIN_EMAIL` | Email du compte admin créé au premier démarrage |
| `ADMIN_PASSWORD` | Mot de passe initial (≥ 10 chars) |
| `DATABASE_PATH` | Défaut `/data/babysleep.sqlite` |
| `DISABLE_SIGNUP` | `true` pour couper `/signup` |
| `TZ` | Défaut `Europe/Paris` |

## Mot de passe oublié

```bash
docker compose exec app sh -c "node --import tsx /app/scripts/reset-password.ts ton@email"
```

## Backup

Un container `backup` tourne en sidecar et copie `babysleep.sqlite` dans `./backups/` tous les jours à 3h (heure locale `TZ`). Rétention par défaut : 30 jours. Configurable via `.env` :

```bash
BACKUP_RETENTION=30
BACKUP_SCHEDULE=0 3 * * *   # cron format
```

Manuellement à tout moment :

```bash
docker compose exec backup sh /usr/local/bin/run-backup
```

Voir les logs :

```bash
docker compose logs -f backup
```

Restauration : arrêter l'app, copier le `.sqlite` voulu depuis `./backups/` vers le volume Docker, redémarrer.

## Développement local

```bash
npm install
cp .env.example .env
mkdir -p data
npm run db:migrate
npm run dev
```

Tests : `npm test`. Type-check : `npm run check`.

## Stack

SvelteKit (adapter-node) + TypeScript strict + Drizzle ORM + SQLite (better-sqlite3) + argon2id + vite-plugin-pwa.
