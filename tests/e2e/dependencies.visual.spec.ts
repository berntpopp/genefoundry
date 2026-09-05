import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { pageUrl } from '../helpers/navigation'

for (const path of ['about/', 'tests/fixtures/verified-guide.html']) {
  test('development prebundles icons for ' + path, async ({ page, baseURL }) => {
    const requests: string[] = []
    page.on('request', (request) => requests.push(request.url()))
    await page.goto(pageUrl(baseURL, path))
    await expect(page.locator('h1')).toHaveCount(1)
    // Both application and isolated fixture must use the optimized dependency,
    // rather than fetching every module exported by the icon package's barrel.
    expect(
      requests.filter((url) =>
        /\.build\/vite\/(?:root|mirror)\/deps\/lucide-vue-next\.js/.test(url)
      )
    ).toHaveLength(1)
    expect(requests.filter((url) => /\/lucide-vue-next\/dist\//.test(url))).toEqual([])
  })
}

test('generated reports and copied TypeScript configs never reload an open page', async ({
  page,
  baseURL
}) => {
  await mkdir('.build', { recursive: true })
  const fixture = await mkdtemp(join(process.cwd(), '.build/watch-fixture-'))
  const html = join(fixture, 'index.html')
  const config = join(fixture, 'tsconfig.json')
  await writeFile(html, '<!doctype html><title>Report</title>')
  await writeFile(config, '{}')
  const reloads: unknown[] = []
  let connected = false
  page.on('websocket', (socket) => {
    socket.on('framereceived', ({ payload }) => {
      const message = JSON.parse(String(payload))
      if (message.type === 'connected') connected = true
      if (message.type === 'full-reload') reloads.push(message)
    })
  })
  try {
    await page.goto(pageUrl(baseURL, 'about/'))
    await expect.poll(() => connected).toBe(true)
    const navigations: string[] = []
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigations.push(frame.url())
    })
    await writeFile(html, '<!doctype html><title>Updated report</title>')
    await writeFile(config, '{"compilerOptions":{"strict":true}}')
    // Observe the normal Vite watcher/HMR delivery window, including debounced changes.
    await page.waitForTimeout(1000)
    expect(reloads).toEqual([])
    expect(navigations).toEqual([])
    await expect(page.locator('h1')).toHaveText('About GeneFoundry')
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
})
