import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
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
  // Use the underlying recommended rules directly. This project does not use
  // type-aware lint rules, so it needs no file-discovery glob dependency.
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    ...(config.files && { files: [...config.files, '**/*.vue'] })
  })),
  ...pluginVue.configs['flat/base'],
  {
    name: 'app/vue-typescript',
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: { js: 'espree', jsx: 'espree', ts: tseslint.parser, tsx: tseslint.parser },
        ecmaVersion: 2024,
        ecmaFeatures: { jsx: false },
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      'vue/block-lang': ['error', { script: { lang: ['ts'], allowNoLang: false } }]
    }
  },
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
