import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Disable gzip size reporting for faster builds
    reportCompressedSize: false,
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
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minification settings
    minify: 'esbuild',
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
      'lucide-vue-next/dist/esm/icons/globe.js'
    ],
    // Exclude the barrel file to prevent loading all icons
    exclude: ['lucide-vue-next']
  }
})
