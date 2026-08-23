<script lang="ts">
  import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import SignIn from 'phosphor-svelte/lib/SignIn';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
  import Users from 'phosphor-svelte/lib/Users';
  import BellRinging from 'phosphor-svelte/lib/BellRinging';
  import Database from 'phosphor-svelte/lib/Database';
  import ShieldCheck from 'phosphor-svelte/lib/ShieldCheck';
  import Key from 'phosphor-svelte/lib/Key';
  import FileCsv from 'phosphor-svelte/lib/FileCsv';
  import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
  import * as m from '$paraglide/messages';

  let { data } = $props();

  const REPO = 'https://github.com/Gavark/babysleep';
  const DOCS = `${REPO}/blob/master/docs/CONFIGURATION.md`;

  // Longest window in the table drives the bar scale, so the chart stays
  // truthful if the age model is ever retuned.
  const maxWindow = $derived(Math.max(...data.ageBrackets.map((b) => b.awakeWindowMin)));

  function windowLabel(min: number): string {
    const h = Math.floor(min / 60);
    const rest = min % 60;
    if (h === 0) return `${rest} min`;
    return rest === 0 ? `${h} h` : `${h} h ${String(rest).padStart(2, '0')}`;
  }

  const privacyPoints = $derived([
    { icon: Database, text: m.landing_privacy_1() },
    { icon: ShieldCheck, text: m.landing_privacy_2() },
    { icon: Key, text: m.landing_privacy_3() },
    { icon: FileCsv, text: m.landing_privacy_4() }
  ]);
</script>

<svelte:head>
  <title>BabySleep</title>
  <meta name="description" content={m.landing_hero_lead()} />
  <meta property="og:title" content="BabySleep" />
  <meta property="og:description" content={m.landing_hero_lead()} />
  <meta property="og:image" content="/screenshots/og.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- Every capture exists in fr/en and light/dark at identical dimensions, so
     the UI inside the screenshots matches the page around them. The locale is
     resolved on the server, so only the theme needs a CSS swap, and that swap
     mirrors the token rules in tokens.css rather than relying on
     prefers-color-scheme alone (the theme is cookie-driven). -->
{#snippet shot(name: string, alt: string, w: number, h: number, eager = false)}
  <img
    class="shot-light"
    src="/screenshots/{name}-{data.locale}.png"
    {alt}
    width={w}
    height={h}
    loading={eager ? 'eager' : 'lazy'}
  />
  <img
    class="shot-dark"
    src="/screenshots/{name}-{data.locale}-dark.png"
    {alt}
    width={w}
    height={h}
    loading="lazy"
  />
{/snippet}

<header class="topbar">
  <a class="brand" href="/">
    <img src="/icon-192.png" alt="" width="34" height="34" />
    <span>BabySleep</span>
  </a>
  <nav class="topbar-nav">
    <a class="topbar-link" href={DOCS}>{m.landing_nav_docs()}</a>
    <a class="topbar-link" href={REPO}>{m.landing_nav_code()}</a>
    <LocaleSwitcher current={data.locale} />
    <ThemeToggle initial={data.theme ?? 'auto'} />
    <a class="btn btn-primary btn-sm" href="/login">
      <SignIn size={16} />
      {m.landing_nav_login()}
    </a>
  </nav>
</header>

<main class="landing">
  <!-- Hero: asymmetric split. Copy left, real product screenshot right. -->
  <section class="hero">
    <div class="hero-copy">
      <h1>{m.landing_hero_title()}</h1>
      <p class="lead">{m.landing_hero_lead()}</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="/login">
          <SignIn size={18} />
          {m.landing_nav_login()}
        </a>
        <a class="btn btn-secondary" href={REPO}>
          <GithubLogo size={18} />
          {m.landing_nav_code()}
        </a>
      </div>
    </div>
    <div class="hero-shot">
      {@render shot('feature-calendar', m.landing_hero_shot_alt(), 688, 508, true)}
    </div>
  </section>

  <!-- Features: asymmetric bento, five cells for five features. -->
  <section class="section">
    <h2>{m.landing_features_title()}</h2>
    <div class="bento">
      <article class="cell cell-wide">
        <div class="cell-text">
          <h3>{m.landing_feat_today_title()}</h3>
          <p>{m.landing_feat_today_body()}</p>
        </div>
        <div class="cell-img">
          {@render shot('feature-timer', m.landing_feat_today_alt(), 689, 161)}
        </div>
      </article>

      <article class="cell cell-half">
        <div class="cell-text">
          <h3>{m.landing_feat_stats_title()}</h3>
          <p>{m.landing_feat_stats_body()}</p>
        </div>
        <div class="cell-img">
          {@render shot('feature-stats', m.landing_feat_stats_alt(), 689, 303)}
        </div>
      </article>

      <article class="cell cell-half cell-mobile">
        <div class="cell-text">
          <h3>{m.landing_feat_mobile_title()}</h3>
          <p>{m.landing_feat_mobile_body()}</p>
        </div>
        <div class="cell-img cell-img-narrow">
          {@render shot('feature-mobile', m.landing_feat_mobile_alt(), 343, 327)}
        </div>
      </article>

      <article class="cell cell-plain">
        <Users size={26} weight="duotone" />
        <h3>{m.landing_feat_share_title()}</h3>
        <p>{m.landing_feat_share_body()}</p>
      </article>

      <article class="cell cell-plain">
        <BellRinging size={26} weight="duotone" />
        <h3>{m.landing_feat_push_title()}</h3>
        <p>{m.landing_feat_push_body()}</p>
      </article>
    </div>
  </section>

  <!-- Wake window: one idea, full width, with the app's real age table. -->
  <section class="section window">
    <div class="window-intro">
      <h2>{m.landing_window_title()}</h2>
      <p>{m.landing_window_body()}</p>
    </div>
    <figure class="chart">
      <figcaption>{m.landing_window_chart_title()}</figcaption>
      <ul class="bars">
        {#each data.ageBrackets as bracket (bracket.label)}
          <li class="bar-row">
            <span class="bar-label">{bracket.label}</span>
            <span class="bar-track">
              <span class="bar-fill" style="width: {(bracket.awakeWindowMin / maxWindow) * 100}%"></span>
            </span>
            <span class="bar-value">{windowLabel(bracket.awakeWindowMin)}</span>
            <span class="bar-naps">
              {bracket.naps === 1 ? m.landing_window_nap_one() : m.landing_window_naps({ count: bracket.naps })}
            </span>
          </li>
        {/each}
      </ul>
      <p class="chart-note">{m.landing_window_chart_note()}</p>
    </figure>
  </section>

  <!-- Privacy: four short points, two columns. -->
  <section class="section privacy">
    <h2>{m.landing_privacy_title()}</h2>
    <ul class="points">
      {#each privacyPoints as point (point.text)}
        {@const Icon = point.icon}
        <li>
          <Icon size={22} weight="duotone" />
          <span>{point.text}</span>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Install: three steps named by their verb, then the real command. -->
  <section class="section install">
    <h2>{m.landing_install_title()}</h2>
    <p class="lead">{m.landing_install_lead()}</p>
    <ol class="steps">
      <li>
        <h3>{m.landing_install_step_get()}</h3>
        <p>{m.landing_install_step_get_body()}</p>
      </li>
      <li>
        <h3>{m.landing_install_step_config()}</h3>
        <p>{m.landing_install_step_config_body()}</p>
      </li>
      <li>
        <h3>{m.landing_install_step_run()}</h3>
        <p>{m.landing_install_step_run_body()}</p>
      </li>
    </ol>
    <pre class="cmd"><code>docker compose up -d</code></pre>
    <a class="docs-link" href={DOCS}>
      {m.landing_install_docs_link()}
      <ArrowRight size={16} />
    </a>
  </section>

  <footer class="landing-footer">
    <span>{m.landing_footer_license()}</span>
    <a href={REPO}>
      <GithubLogo size={16} />
      {m.landing_nav_code()}
    </a>
  </footer>
</main>

<style>
  /* ---------------------------------------------------------------- shell */

  .landing {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 var(--s-4) var(--s-6);
  }

  .topbar {
    max-width: 1160px;
    margin: 0 auto;
    padding: var(--s-3) var(--s-4);
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-4);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-size: var(--fs-lg);
    font-weight: 800;
    letter-spacing: -0.3px;
    color: var(--c-text);
    text-decoration: none;
    white-space: nowrap;
  }
  .brand img { border-radius: 9px; display: block; }
  .topbar-nav {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    white-space: nowrap;
  }
  .topbar-link {
    color: var(--c-text);
    font-weight: 600;
    font-size: var(--fs-md);
    text-decoration: none;
  }
  .topbar-link:hover { color: var(--c-link-hover); text-decoration: underline; }

  .section { margin-top: clamp(64px, 9vw, 120px); }

  h1 {
    font-size: clamp(1.9rem, 3.4vw, 2.45rem);
    line-height: 1.1;
    letter-spacing: -1px;
    font-weight: 800;
    margin-bottom: var(--s-4);
  }
  .section h2 {
    font-size: clamp(1.5rem, 2.6vw, 2rem);
    line-height: 1.15;
    letter-spacing: -0.6px;
    font-weight: 800;
    margin-bottom: var(--s-5);
  }
  .lead {
    font-size: var(--fs-lg);
    line-height: 1.55;
    color: var(--c-text-muted);
    max-width: 46ch;
  }

  /* ----------------------------------------------------------------- hero */

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: clamp(var(--s-5), 4vw, 56px);
    align-items: center;
    padding-top: clamp(var(--s-5), 4vw, 72px);
  }
  .hero-cta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-3);
    margin-top: var(--s-5);
  }
  /* Shown whole, at its own aspect ratio. Cropping it to a fixed height meant
     slicing a calendar row in half at every breakpoint. */
  .hero-shot {
    border-radius: var(--r-lg);
    border: 1.5px solid var(--c-border);
    background: var(--c-bg-card);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  /* --------------------------------------------------------------- bento */

  .bento {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--s-4);
  }
  .cell {
    border-radius: var(--r-lg);
    border: 1.5px solid var(--c-border);
    background: var(--c-bg-card);
    padding: var(--s-5);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    overflow: hidden;
  }
  .cell h3 {
    font-size: var(--fs-lg);
    font-weight: 700;
    letter-spacing: -0.3px;
    margin: 0;
  }
  .cell p {
    color: var(--c-text-muted);
    line-height: 1.6;
    margin: 0;
    max-width: 48ch;
  }
  /* Row 1 is a horizontal split, row 2 an asymmetric pair, row 3 two plain
     cells. Five features, five cells, three different rhythms. */
  .cell-wide {
    grid-column: span 6;
    flex-direction: row;
    align-items: center;
    gap: var(--s-5);
  }
  .cell-wide .cell-text { flex: 1 1 40%; }
  .cell-wide .cell-img { flex: 1 1 60%; margin-top: 0; }
  .cell-half { grid-column: span 4; }
  .cell.cell-mobile { grid-column: span 2; }
  .cell-plain { grid-column: span 3; }
  .cell-plain :global(svg) { color: var(--c-primary); }

  .cell-text { display: flex; flex-direction: column; gap: var(--s-2); }
  /* Every capture below is an element screenshot of the real component at its
     natural size, so nothing is cropped or upscaled. */
  .cell-img {
    margin-top: auto;
    border-radius: var(--r-md);
    border: 1px solid var(--c-border);
    background: var(--c-bg-app);
    overflow: hidden;
  }
  .cell-img-narrow { border: 0; background: none; align-self: center; max-width: 100%; }

  /* -------------------------------------------------------- wake window */

  .window-intro { max-width: 62ch; margin-bottom: var(--s-5); }
  .install .lead, .steps, .cmd { max-width: 900px; }
  .window-intro p { color: var(--c-text-muted); line-height: 1.65; font-size: var(--fs-md); }

  .chart {
    margin: 0;
    max-width: 780px;
    border-radius: var(--r-lg);
    border: 1.5px solid var(--c-border);
    background: var(--c-bg-card);
    padding: var(--s-5);
  }
  .chart figcaption {
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--c-text-muted);
    margin-bottom: var(--s-4);
  }
  .bars { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-3); }
  .bar-row {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr) 62px 74px;
    align-items: center;
    gap: var(--s-3);
    margin: 0;
  }
  .bar-label { font-size: var(--fs-sm); font-weight: 700; }
  .bar-track {
    height: 12px;
    border-radius: 999px;
    background: var(--c-bg-muted);
    overflow: hidden;
  }
  .bar-fill { display: block; height: 100%; border-radius: 999px; background: var(--c-accent-honey); }
  .bar-value { font-size: var(--fs-sm); font-weight: 700; text-align: right; font-variant-numeric: tabular-nums; }
  .bar-naps { font-size: var(--fs-xs); color: var(--c-text-muted); text-align: right; }
  .chart-note { margin: var(--s-4) 0 0; font-size: var(--fs-xs); color: var(--c-text-muted); }

  /* ------------------------------------------------------------ privacy */

  .points {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-4) var(--s-5);
    max-width: 900px;
  }
  .points li {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    margin: 0;
    line-height: 1.6;
    color: var(--c-text-muted);
  }
  .points :global(svg) { color: var(--c-accent-sage); flex: none; margin-top: 2px; }

  /* ------------------------------------------------------------ install */

  .steps {
    list-style: none;
    margin: var(--s-5) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--s-5);
  }
  .steps li { margin: 0; }
  .steps h3 { font-size: var(--fs-md); font-weight: 700; margin-bottom: var(--s-2); }
  .steps p { color: var(--c-text-muted); line-height: 1.6; margin: 0; font-size: var(--fs-sm); }

  .cmd {
    margin: var(--s-5) 0 var(--s-4);
    padding: var(--s-4);
    border-radius: var(--r-md);
    border: 1.5px solid var(--c-border);
    background: var(--c-bg-muted);
    overflow-x: auto;
  }
  .cmd code {
    font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Mono', Consolas, monospace;
    font-size: var(--fs-md);
    color: var(--c-text);
  }
  .docs-link {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-weight: 700;
    color: var(--c-link);
  }

  /* ------------------------------------------------------------- footer */

  .landing-footer {
    margin-top: clamp(64px, 9vw, 120px);
    padding-top: var(--s-4);
    border-top: 1px solid var(--c-border);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--s-3);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .landing-footer a {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--c-text);
    font-weight: 600;
  }

  /* ------------------------------------------------------- theme swap */

  .shot-light, .shot-dark { display: block; width: 100%; height: auto; }
  .shot-dark { display: none; }

  :global(:root[data-theme='dark']) .shot-light { display: none; }
  :global(:root[data-theme='dark']) .shot-dark { display: block; }

  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .shot-light { display: none; }
    :global(:root:not([data-theme='light'])) .shot-dark { display: block; }
  }

  /* ------------------------------------------------------------- motion */

  @media (prefers-reduced-motion: no-preference) {
    .hero-copy, .hero-shot {
      animation: rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .hero-shot { animation-delay: 0.09s; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }

  /* ------------------------------------------------------------ responsive */

  @media (max-width: 900px) {
    .bento { grid-template-columns: repeat(2, 1fr); }
    .cell-wide { grid-column: span 2; }
    .cell-half, .cell.cell-mobile, .cell-plain { grid-column: span 1; }
    .steps { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 768px) {
    .topbar {
      height: auto;
      flex-wrap: wrap;
      row-gap: var(--s-3);
    }
    /* Without this the nav keeps its nowrap row and pushes the whole document
       past the viewport, giving the page a horizontal scrollbar on a phone. */
    .topbar-nav {
      flex-wrap: wrap;
      justify-content: flex-end;
      row-gap: var(--s-2);
    }
    .hero {
      grid-template-columns: 1fr;
      gap: var(--s-5);
      padding-top: var(--s-5);
    }
    .bento { grid-template-columns: 1fr; }
    .cell-wide {
      grid-column: span 1;
      flex-direction: column;
      align-items: stretch;
      gap: var(--s-3);
    }
    .cell-half, .cell.cell-mobile, .cell-plain { grid-column: span 1; }
    .points { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr; gap: var(--s-4); }
    .bar-row { grid-template-columns: 78px minmax(0, 1fr) 56px; }
    .bar-naps { display: none; }
  }
</style>
