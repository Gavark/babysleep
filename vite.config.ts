import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
  // Plugin order matters: paraglideVitePlugin must run before sveltekit() so
  // its codegen output in src/paraglide/ is in place when SvelteKit scans the
  // source tree. Reordering breaks $paraglide imports at build time.
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      // Don't auto-emit src/paraglide/.gitignore — we commit the generated dir
      // (stable IDE types + CI works without a pre-step).
      emitGitIgnore: false,
      // Pin the output layout so `npm run dev` and `npm run paraglide` (CLI)
      // produce byte-identical files. Without this, the plugin's dev mode
      // can drift to `locale-modules` and create noisy diffs in src/paraglide
      // every time a contributor starts the dev server.
      outputStructure: 'message-modules',
      // Tell the client-side runtime to read the locale from the SAME cookie
      // hooks.server.ts sets ('locale'), with Accept-Language as a fallback
      // for first visits. Without this, the client default strategy is
      // ['baseLocale'] which means EVERY client-side re-render falls back
      // to 'fr' even when the server resolved 'en' — the page hydrates in
      // EN then reverts to FR after Svelte rebinds the message functions.
      // The server still uses our AsyncLocalStorage override (set in
      // hooks.server.ts via overwriteGetLocale), so this only affects
      // browser-side rendering.
      strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
      cookieName: 'locale'
    }),
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff2}'],
        // Landing-page and README imagery is served from static/screenshots/.
        // It is marketing material, not app shell, so keep it out of the
        // service worker precache: every install would otherwise download
        // ~300 kB of screenshots it never shows offline.
        globIgnores: ['client/screenshots/**']
      },
      manifest: {
        name: 'BabySleep',
        short_name: 'BabySleep',
        start_url: '/',
        display: 'standalone',
        background_color: '#FBF8F3',
        theme_color: '#C97A5D',
        lang: 'fr',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  server: { port: 5173 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' }
});
