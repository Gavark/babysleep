import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
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
