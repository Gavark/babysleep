# Politique de sécurité · Security policy

[English below](#english)

## Français

### Versions supportées

Seule la dernière version publiée reçoit des correctifs de sécurité. BabySleep
est en `v0.x` : il n'y a pas de branche de maintenance, un correctif sort dans
une nouvelle version de patch. Si tu fais tourner une version plus ancienne,
mets à jour avant de signaler (voir [docs/UPGRADING.md](docs/UPGRADING.md)).

### Signaler une vulnérabilité

**N'ouvre pas d'issue publique.** Utilise le signalement privé de GitHub :

**<https://github.com/Gavark/babysleep/security/advisories/new>**

Le rapport n'est visible que par toi et par moi. Indique si possible :

- la version concernée (`docker inspect babysleep --format '{{index .Config.Labels "org.opencontainers.image.version"}}'`) ;
- ton type de déploiement : compose fourni, reverse proxy, variables d'environnement modifiées ;
- les étapes pour reproduire, et ce qu'un attaquant peut obtenir.

### Ce qui se passe ensuite

BabySleep est maintenu sur mon temps libre : je réponds dès que possible, sans
délai garanti. Une fois le problème confirmé, je prépare le correctif en privé,
je publie une version de patch, puis l'advisory GitHub, avec ton nom si tu le
souhaites. Merci de ne rien divulguer avant la sortie du correctif.

### Périmètre

Dans le périmètre :

- le code de l'application ;
- l'image Docker publiée sur `ghcr.io/gavark/babysleep` ;
- les fichiers de configuration fournis dans le dépôt (`docker-compose*.yml`,
  `Caddyfile.example`, `.env.example`).

Hors périmètre :

- les advisories déjà publiques sur une dépendance, sauf si tu montres
  qu'elles sont exploitables dans BabySleep (elles sont suivies via
  Dependabot) ;
- les attaques qui supposent déjà un accès à la machine hôte ou au volume
  Docker ;
- les déploiements dont la configuration s'écarte de celle du dépôt, quand le
  problème vient de cet écart.

## English

### Supported versions

Only the latest release receives security fixes. BabySleep is at `v0.x`:
there is no maintenance branch, and a fix ships as a new patch release. If you
run an older version, upgrade before reporting (see
[docs/UPGRADING.md](docs/UPGRADING.md)).

### Reporting a vulnerability

**Please do not open a public issue.** Use GitHub's private reporting:

**<https://github.com/Gavark/babysleep/security/advisories/new>**

Only you and I can see the report. If you can, include:

- the affected version (`docker inspect babysleep --format '{{index .Config.Labels "org.opencontainers.image.version"}}'`);
- how you deploy: the provided compose files, reverse proxy, changed environment variables;
- steps to reproduce, and what an attacker gains.

### What happens next

I maintain BabySleep in my spare time, so I reply as soon as I can, with no
guaranteed turnaround. Once the issue is confirmed, I prepare the fix
privately, cut a patch release, then publish the GitHub advisory, crediting
you if you wish. Please keep the details private until the fix is out.

### Scope

In scope:

- the application code;
- the Docker image published at `ghcr.io/gavark/babysleep`;
- the configuration files shipped in the repository (`docker-compose*.yml`,
  `Caddyfile.example`, `.env.example`).

Out of scope:

- advisories already public for a dependency, unless you show they are
  exploitable in BabySleep (those are tracked through Dependabot);
- attacks that already require access to the host machine or the Docker
  volume;
- deployments whose configuration departs from the repository's, when the
  problem comes from that departure.
