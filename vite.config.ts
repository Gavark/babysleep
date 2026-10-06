import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
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
      // As of 2.26 the Vite plugin writes the absolute project path into the
      // generated README, so it would change with every checkout location.
      // It is generic Paraglide documentation; don't emit it.
      emitReadme: false,
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
    // The service worker (src/service-worker/) and the web app manifest
    // (static/manifest.webmanifest) are handled by SvelteKit itself, no PWA
    // plugin involved.
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({ out: 'build' }),
      csp: {
        directives: {
          'default-src': ['self'],
          'script-src': ['self'],
          'style-src': ['self', 'unsafe-inline'],
          'img-src': ['self', 'data:', 'blob:'],
          'connect-src': ['self'],
          'manifest-src': ['self'],
          'worker-src': ['self'],
          'object-src': ['none'],
          'base-uri': ['self'],
          'form-action': ['self'],
          'frame-ancestors': ['none']
        }
      },
      // SvelteKit 3 no longer generates $lib (it moved to #lib in package.json
      // "imports"). Declaring it here keeps the existing imports working;
      // `alias` is deprecated, so switching to #lib is a separate change.
      alias: {
        $lib: 'src/lib',
        $paraglide: 'src/paraglide'
      }
    })
  ],
  server: { port: 5173 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' }
});
