import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { prerender } from './scripts/prerender.mjs'
import { devRender } from './scripts/dev-render.mjs'
import { SERVER_COUNT, TOOL_COUNT } from './src/data/servers.ts'

export default defineConfig(({ isSsrBuild, command }) => {
  const base = process.env.VITE_BASE_URL || '/'
  if (!['/', '/genefoundry/'].includes(base)) throw new Error('Unsupported VITE_BASE_URL')
  const staticBuild = command === 'build' && !isSsrBuild
  return {
    base,
    cacheDir: `.build/vite/${base === '/' ? 'root' : 'mirror'}`,
    publicDir: isSsrBuild ? false : 'public',
    plugins: [
      vue(),
      tailwindcss(),
      devRender(),
      ...(staticBuild
        ? [
            {
              name: 'genefoundry-prerender',
              closeBundle: {
                order: 'pre',
                sequential: true,
                async handler(error) {
                  if (error) return
                  await prerender({
                    templatePath: 'dist/index.html',
                    serverEntry: '.build/server/entry-server.js',
                    outDir: 'dist'
                  })
                }
              }
            }
          ]
        : []),
      ...(!isSsrBuild
        ? [
            VitePWA({
              integration: { closeBundleOrder: 'post' },
              registerType: 'autoUpdate',
              injectRegister: null,
              devOptions: { enabled: false },
              manifest: {
                name: 'GeneFoundry: Biomedical data. One MCP connection.',
                short_name: 'GeneFoundry',
                description: `${SERVER_COUNT} catalog-listed biomedical MCP servers and ${TOOL_COUNT} listed tools. Browser sign-in required. Research use only.`,
                theme_color: '#F6F5F1',
                background_color: '#F6F5F1',
                display: 'standalone',
                scope: base,
                start_url: base,
                icons: [
                  { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                  { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                  {
                    src: 'maskable-icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                  }
                ]
              },
              workbox: {
                navigateFallback: null,
                skipWaiting: true,
                clientsClaim: true,
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
                globIgnores: ['404.html', '**/*.br', '**/*.gz'],
                runtimeCaching: []
              }
            })
          ]
        : [])
    ],
    build: {
      target: 'es2020',
      minify: 'oxc',
      reportCompressedSize: false,
      cssCodeSplit: false,
      ...(isSsrBuild
        ? {
            ssr: 'src/entry-server.ts',
            outDir: '.build/server',
            rollupOptions: { output: { entryFileNames: 'entry-server.js' } }
          }
        : {
            outDir: 'dist',
            rollupOptions: {
              output: {
                manualChunks(id) {
                  if (/[\\/]node_modules[\\/](?:@vue[\\/]|vue[\\/])/.test(id)) {
                    return 'vue-vendor'
                  }
                }
              }
            }
          })
    },
    server: {
      host: '127.0.0.1',
      watch: {
        // Anchor ignores inside this project: its own path may be in a worktree.
        ignored: [
          '.build',
          '.worktrees',
          '.impeccable',
          '.superpowers',
          '.cache',
          'test-results',
          'playwright-report',
          'blob-report',
          'coverage',
          'docs/audits',
          'docs/superpowers/research',
          'docs/superpowers/execution/screenshots',
          'docs/superpowers/execution/layout-revision',
          'docs/superpowers/execution/performance'
        ].map((directory) => fileURLToPath(new URL(`${directory}/**`, import.meta.url)))
      }
    },
    // Collapse Lucide's large ESM barrel into a single development dependency.
    optimizeDeps: { include: ['vue', 'lucide-vue-next'] }
  }
})
