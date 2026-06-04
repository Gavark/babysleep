import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
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
      outputStructure: 'message-modules'
    }),
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
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
      },
      workbox: {
        navigateFallback: '/login',
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff2}']
      }
    })
  ],
  server: { port: 5173 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' }
});
