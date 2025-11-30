import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
  // Base URL: '/' for Docker/VPS, '/genefoundry/' for GitHub Pages
  // Set VITE_BASE_URL=/ for Docker builds
  base: process.env.VITE_BASE_URL || '/genefoundry/',
  plugins: [
    vue(),
    tailwindcss(),
    // Pre-compress assets with Brotli (best) and gzip (fallback)
    // nginx serves these directly via brotli_static and gzip_static
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(png|jpg|jpeg|gif|webp|avif|ico)$/i], // Skip already-compressed images
      threshold: 1024, // Only compress files > 1KB
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(png|jpg|jpeg|gif|webp|avif|ico)$/i],
      threshold: 1024,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // Defer service worker registration to not block initial render
      // 'script-defer' adds defer attribute, loading after HTML parsing (v0.17.2+)
      injectRegister: 'script-defer',
      // DevOptions for testing PWA in development
      devOptions: {
        enabled: false
      },
      includeAssets: ['genefoundry_logo.svg', 'robots.txt'],
      manifest: {
        name: 'GeneFoundry - Forging Trust in Genomic AI',
        short_name: 'GeneFoundry',
        description: 'A modular registry for trustworthy, evidence-based genomic analysis powered by Model Context Protocols (MCPs).',
        theme_color: '#BE3E82',
        background_color: '#ffffff',
        display: 'standalone',
        scope: process.env.VITE_BASE_URL || '/genefoundry/',
        start_url: process.env.VITE_BASE_URL || '/genefoundry/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Force immediate activation of new service worker
        // skipWaiting: new SW takes over immediately without waiting
        // clientsClaim: new SW takes control of all open tabs immediately
        skipWaiting: true,
        clientsClaim: true,
        // Remove outdated precache entries when a new SW is activated
        cleanupOutdatedCaches: true,
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Runtime caching for Google Fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Disable gzip size reporting for faster builds
    reportCompressedSize: false,
    // Optimize module preloading - exclude non-critical chunks from preload
    // This reduces critical path chain length (workbox-window is not needed for FCP)
    modulePreload: {
      resolveDependencies: (filename, deps) => {
        // Only preload critical chunks, exclude PWA/workbox related
        return deps.filter(dep => !dep.includes('workbox'))
      }
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for Vue core
          'vue-vendor': ['vue']
        }
      }
    },
    // Disable CSS code splitting - single CSS file loads faster for small apps
    cssCodeSplit: false,
    // Minification settings
    minify: 'esbuild',
  },
  // Dev server config for WSL2 compatibility
  server: {
    host: true,
    watch: {
      // Use polling for WSL2 file system compatibility
      usePolling: true,
      interval: 1000
    },
    hmr: {
      // Ensure HMR works across WSL2/Windows boundary
      host: 'localhost'
    }
  },
  // Optimize dependency pre-bundling for dev server performance
  optimizeDeps: {
    include: [
      'vue',
      // Pre-bundle only the icons we actually use
      'lucide-vue-next/dist/esm/icons/database.js',
      'lucide-vue-next/dist/esm/icons/file-text.js',
      'lucide-vue-next/dist/esm/icons/book-open.js',
      'lucide-vue-next/dist/esm/icons/file-check.js',
      'lucide-vue-next/dist/esm/icons/shield-check.js',
      'lucide-vue-next/dist/esm/icons/dna.js',
      'lucide-vue-next/dist/esm/icons/stethoscope.js',
      'lucide-vue-next/dist/esm/icons/microscope.js',
      'lucide-vue-next/dist/esm/icons/activity.js',
      'lucide-vue-next/dist/esm/icons/users.js',
      'lucide-vue-next/dist/esm/icons/globe.js',
      // Newsletter signup icons
      'lucide-vue-next/dist/esm/icons/mail.js',
      'lucide-vue-next/dist/esm/icons/arrow-right.js',
      'lucide-vue-next/dist/esm/icons/check.js',
      'lucide-vue-next/dist/esm/icons/alert-circle.js',
      'lucide-vue-next/dist/esm/icons/loader-2.js'
    ],
    // Exclude the barrel file to prevent loading all icons
    exclude: ['lucide-vue-next']
  }
})
