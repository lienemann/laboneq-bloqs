import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/laboneq-bloqs/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
        'robots.txt',
      ],
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,woff2,ico,webmanifest,cur,mp3,ogg,wav,gif}',
        ],
        navigateFallback: '/laboneq-bloqs/index.html',
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'LabOneQ Bloqs',
        short_name: 'Bloqs',
        description:
          'Visual block editor for LabOneQ quantum experiments. Privacy-preserving, offline-capable, runs entirely in your browser.',
        lang: 'en',
        start_url: '/laboneq-bloqs/',
        scope: '/laboneq-bloqs/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
