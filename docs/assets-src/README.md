# Regenerating the screenshots and brand assets

Everything under `static/screenshots/` is generated from a throwaway demo
instance, never from a real family database.

## 1. Start the demo instance

```bash
npm run demo
```

Outside daytime, use `npm run demo -- --at=14:30` instead: today's entries
are built as if it were 14:30, and the capture browser's clock must be set to
the same time (Playwright: `page.clock.setFixedTime(...)`). That clock is
context-wide and freezes Chart.js on its first frame (every chart reads zero),
so take the Stats captures from a separate browser context with the real
clock.

This seeds `data/demo.sqlite` (isolated from `data/babysleep.sqlite`) with one
baby and roughly three months of plausible sleep data, then serves it on
<http://localhost:5199>. The generator is deterministic, so the history is the
same on every run. Only "today" moves, which keeps the wake-window timer alive
in a fresh capture.

Sign in with `demo@babysleep.local` / `demo-babysleep-2026`.

## 2. Landing-page captures

The landing page needs each component in four variants: `fr` / `en` and light /
dark, at identical pixel dimensions. Set the locale from the header globe and
the theme from the header toggle, then capture these elements:

| File | Page | Element | Viewport |
| --- | --- | --- | --- |
| `feature-calendar-{fr,en}[-dark].png` | `/app/babies/1/calendar?month=2026-07` | `table.cal-grid` | 1024 wide |
| `feature-timer-{fr,en}[-dark].png` | `/app/babies/1/today` | `.wake-timer-card` | 1024 wide |
| `feature-stats-{fr,en}[-dark].png` | `/app/babies/1/stats?preset=30` | 4th `section.chart-section` | 1024 wide |
| `feature-mobile-{fr,en}[-dark].png` | `/app/babies/1/calendar?month=2026-07` | `.cal-mobile` (hour axis + list), first week only, axis not sticky, bottom bar hidden | 390 wide |

All four variants of one file must come out at the same size, otherwise the
theme swap in `src/routes/+page.svelte` shifts the layout. The `width` and
`height` passed to the `shot` snippet must match too, or the page reserves the
wrong box and shifts on load.

**Capture the Today page during daytime in the baby's timezone.** The seeder
builds "today" from the real clock and deliberately leaves the day empty
outside waking hours, and the wake-window timer is computed client-side from
the real time, so a capture taken at 2 a.m. Paris shows an empty day and a
timer reading zero. Or simulate the time of day with `--at=HH:MM` (see
section 1).

## 3. README captures

Viewport captures, light theme unless the name says `-dark`: `today` and
`today-dark` (1024x900), `calendar` (1024x960, `?month=2026-07`), `stats`
(1024x1150, `?preset=30`), `history` (1024x1000), `mobile-calendar`
(390x844, `?month=2026-07`).

Each exists twice: the bare name is French and feeds README.md, the `-en`
suffix is English and feeds README.en.md. Switch the locale from the header
globe between the two passes.

## 4. Banner and social card

`banner.html` and `og.html` in this folder render `banner.png` (1280x420) and
`og.png` (1200x630). Both read their colours straight from
`src/lib/styles/tokens.css` and embed a real capture rather than a mock-up, so
neither can drift away from the product. Each file's header comment carries
the render steps.

The banner board is bilingual: append `?lang=en` and it swaps every `data-en`
string in place. That is how `banner-en.png` comes out of the same design,
with `calendar-en.png` embedded instead of `calendar.png` for that pass.
