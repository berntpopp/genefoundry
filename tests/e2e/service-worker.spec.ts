import { expect, test } from '@playwright/test'
import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Page } from '@playwright/test'
import { startStaticServer } from '../../scripts/serve-static.mjs'
import { pageUrl } from '../helpers/navigation'

async function control(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
}

test('installed worker preserves individual pages offline', async ({ browser, baseURL }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await page.goto(pageUrl(baseURL))
    await control(page)
    await context.setOffline(true)
    for (const [path, heading] of [
      ['sources/gnomad/', 'gnomAD'],
      ['connect/codex/', 'Codex']
    ]) {
      const response = await page.goto(pageUrl(baseURL, path))
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(heading)
    }
    await context.setOffline(false)
    const missing = await page.goto(pageUrl(baseURL, 'not-a-real-worker-page/'))
    expect(missing?.status()).toBe(404)
    await expect(page.locator('h1')).toContainText('Page not found')
    await context.setOffline(true)
    await page.goto(pageUrl(baseURL, 'not-a-real-worker-page/')).catch(() => undefined)
    expect(await page.locator('h1').allTextContents()).not.toContain(
      'Biomedical data for your AI tools. One MCP connection.'
    )
  } finally {
    await context.close()
  }
})

test('worker leaves reserved backend paths to the network', async ({ browser }) => {
  const server = await startStaticServer({
    outDir: '.build/artifacts/root',
    basePath: '/',
    port: 0,
    backendSentinels: true
  })
  const context = await browser.newContext()
  const page = await context.newPage()
  const origin = 'http://127.0.0.1:' + server.address().port
  try {
    await page.goto(origin)
    await control(page)
    for (const path of [
      '/mcp',
      '/authorize',
      '/token',
      '/register',
      '/consent',
      '/auth/callback',
      '/.well-known/oauth-authorization-server',
      '/health',
      '/metrics',
      '/docs',
      '/redoc',
      '/openapi.json'
    ]) {
      await page.goto(origin + path)
      expect(await page.locator('body').innerText()).toBe('GENEFOUNDRY_NETWORK_SENTINEL:' + path)
    }
  } finally {
    await context.close()
    await new Promise<void>((done) => server.close(() => done()))
  }
})

test('previous mirror worker updates to complete modernized documents', async ({ browser }) => {
  test.setTimeout(60000)
  const directory = await mkdtemp(join(tmpdir(), 'genefoundry-worker-update-'))
  // The retained baseline was built at /genefoundry/. Never modify that evidence.
  await cp(resolve('.build/baseline'), directory, { recursive: true })
  const server = await startStaticServer({ outDir: directory, basePath: '/genefoundry/', port: 0 })
  const origin = 'http://127.0.0.1:' + server.address().port + '/genefoundry/'
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await page.goto(origin)
    await control(page)
    const oldScript = await page.evaluate(() => navigator.serviceWorker.controller!.scriptURL)
    expect(oldScript).toBe(origin + 'sw.js')
    await cp(resolve('.build/artifacts/mirror'), directory, { recursive: true })
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      await registration.update()
    })
    // Probe the new URL until the replacement worker serves its own page, not the old SPA shell.
    await expect(async () => {
      await page.goto(origin + 'sources/gnomad/')
      await expect(page.locator('h1')).toContainText('gnomAD')
    }).toPass({ timeout: 20000 })
    await context.setOffline(true)
    await page.goto(origin + 'connect/codex/')
    await expect(page.locator('h1')).toContainText('Codex')
  } finally {
    await context.close()
    await new Promise<void>((done) => server.close(() => done()))
    await rm(directory, { recursive: true, force: true })
  }
})
