import { defineConfig, devices } from '@playwright/test'
const phase = process.env.TEST_PHASE || 'dev'
const runId = process.env.PW_RUN_ID || phase
if (!/^[a-z0-9-]+$/.test(runId)) throw new Error('Invalid PW_RUN_ID')
if (!['dev', 'static', 'http'].includes(phase)) throw new Error(`Unknown TEST_PHASE: ${phase}`)
const staticMatch = /(?:rendering|content-pages|artifacts|service-worker)\.spec\.ts/
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: `.build/test-results/${runId}`,
  fullyParallel: true,
  workers: 3,
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: `.build/playwright-report/${runId}` }]
  ],
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects:
    phase === 'dev'
      ? [
          {
            name: 'dev',
            testMatch: /(?:discovery|onboarding|evidence|visual|accessibility)\.spec\.ts/,
            use: { baseURL: 'http://127.0.0.1:5175/' }
          }
        ]
      : phase === 'static'
        ? [
            {
              name: 'static-root',
              testMatch: staticMatch,
              use: { baseURL: 'http://127.0.0.1:4176/' }
            },
            {
              name: 'static-mirror',
              testMatch: staticMatch,
              use: { baseURL: 'http://127.0.0.1:4177/genefoundry/' }
            }
          ]
        : [
            {
              name: 'nginx',
              testMatch: /http\.spec\.ts/,
              use: { baseURL: 'http://127.0.0.1:4180/' }
            }
          ],
  webServer:
    phase === 'dev'
      ? [
          {
            command: 'VITE_BASE_URL=/ npm run dev -- --host 127.0.0.1 --port 5175 --strictPort',
            url: 'http://127.0.0.1:5175/',
            reuseExistingServer: !process.env.CI
          }
        ]
      : phase === 'static'
        ? [
            {
              command:
                'node scripts/serve-static.mjs --dir .build/artifacts/root --base / --port 4176',
              url: 'http://127.0.0.1:4176/',
              reuseExistingServer: !process.env.CI
            },
            {
              command:
                'node scripts/serve-static.mjs --dir .build/artifacts/mirror --base /genefoundry/ --port 4177',
              url: 'http://127.0.0.1:4177/genefoundry/',
              reuseExistingServer: !process.env.CI
            }
          ]
        : []
})
