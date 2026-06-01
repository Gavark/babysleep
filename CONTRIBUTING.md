# Contributing

Thanks for considering a contribution. This is a small project I maintain in my
spare time, so the bar for merge is "does it move the project forward without
making my future self's life harder."

## Reporting bugs / requesting features

Use the [Issue templates](https://github.com/Gavark/babysleep/issues/new/choose).
Usage questions go to [Discussions](https://github.com/Gavark/babysleep/discussions).

## Local development

```bash
npm install
cp .env.example .env
mkdir -p data
npm run db:migrate
npm run dev
```

The app boots on <http://localhost:5173>. Hit `/setup` to create your first
account.

Useful commands:

| Command | Purpose |
|---|---|
| `npm test` | Run the vitest suite once |
| `npm run test:watch` | Watch mode |
| `npm run check` | Type-check + svelte-check |
| `npm run build` | Production build |
| `npm run db:generate` | Generate a Drizzle migration after editing the schema |
| `npm run db:migrate` | Apply pending migrations to the local DB |

## Pull request standards

Before you open a PR:

- **Tests pass** — `npm test` and `npm run check` both green.
- **No new svelte-check warnings** — the project currently sits at 0 warnings.
  If your PR adds warnings, fix them or explain why they're unavoidable.
- **Touch only what serves the change** — adjacent cleanups belong in their
  own PR, even if you spot them while you're in the file.
- **Add a test for new behaviour and for any fixed bug** — if you can't write
  a test, mention why in the PR description.

The CI pipeline runs `check` and `test` on every PR. A red CI = won't be
merged.

## Commit messages

Conventional Commits with a scope:

```
feat(calendar): add monthly view
fix(timer): off-by-one when wake is exactly midnight
docs: update BACKUP.md restore steps
chore: bump phosphor-svelte to 3.1
refactor(sleep-calc): extract projection helper
ci(docker): publish multi-arch image to GHCR
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`. Scope
is the area touched (`calendar`, `timer`, `auth`, `sleep-calc`, `pwa`, …) or
omitted for repo-wide changes.

Subject line ≤ 72 chars, imperative mood ("add X", not "added X" or "adds X").
A multi-paragraph body is fine and encouraged for non-trivial changes — say
what changed and *why*, not how (the diff already shows how).

## Code style

- TypeScript strict mode, no `any` unless you have a clear reason
  (and a comment).
- Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`). No `export let`.
- Pure functions go in `src/lib/` and have unit tests in `tests/`.
- Server-only modules live under `src/lib/server/`. Don't import them from
  components or pure libs — SvelteKit will refuse to bundle.
- CSS uses the design tokens in `src/lib/styles/tokens.css`. Hard-coded colour
  values should be rare and justified.

## What I'm unlikely to merge

- Translations of the UI to other languages until the i18n framework lands
  (currently strings are inline in Svelte templates).
- Cosmetic refactors of working code without a clear gain.
- New dependencies that pull in significant size/maintenance burden for a
  small feature.
- Features that require account systems beyond the current
  admin + invitations model.

If you're unsure whether a PR fits, open a Discussion first.

## License of contributions

By submitting a PR, you agree your contribution is licensed under
[AGPL-3.0-or-later](./LICENSE), same as the rest of the project.
