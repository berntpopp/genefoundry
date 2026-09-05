import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import globals from 'globals'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx,cjs,mjs}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.build/**',
      '**/.worktrees/**',
      '**/.superpowers/**',
      'docs/audits/**',
      'docs/superpowers/research/**',
      'test-results/**',
      'playwright-report/**'
    ]
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,

  // Node.js build scripts configuration
  {
    name: 'scripts/node-config',
    files: ['scripts/**/*.{js,mjs,cjs}', '*config.{js,ts}', 'tests/**/*.{ts,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  // Vite config uses Node.js process.env
  {
    name: 'vite-config/node-globals',
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]
