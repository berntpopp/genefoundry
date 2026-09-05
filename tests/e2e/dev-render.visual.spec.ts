import { expect, test } from '@playwright/test'
import { PAGES } from '../../src/data/pages'
import { pageUrl } from '../helpers/navigation'

for (const definition of PAGES) {
  test(
    'development delivers styled HTML before hydration: ' + definition.path,
    async ({ browser, page, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const document = await context.newPage()
      const url = pageUrl(baseURL, definition.path.slice(1))
      const response = await document.goto(url)
      expect(response?.status()).toBe(200)
      await expect(document).toHaveTitle(definition.title)
      await expect(document.locator('h1')).toHaveCount(1)
      await document.evaluate(() => window.document.fonts.ready)
      let releaseScripts!: () => void
      const scriptsReady = new Promise<void>((resolve) => {
        releaseScripts = resolve
      })
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() === 'script') await scriptsReady
        await route.continue()
      })
      await page.goto(url, { waitUntil: 'commit' })
      await page.waitForFunction(
        () =>
          window.document.readyState !== 'loading' &&
          [...window.document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')].every(
            (link) => link.sheet
          )
      )
      await page.evaluate(() => window.document.fonts.ready)
      const initial = await page.evaluate(() =>
        ['header', 'h1', 'main'].map((selector) => {
          const element = window.document.querySelector(selector)!
          const { x, y, width, height } = element.getBoundingClientRect()
          return { x, y, width, height }
        })
      )
      expect(
        await document.locator('.navigation').evaluate((el) => getComputedStyle(el).display)
      ).toBe('flex')
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
      })
      releaseScripts()
      await page.waitForLoadState('load')
      await page.evaluate(() => window.document.fonts.ready)
      const hydrated = await page.evaluate(() =>
        ['header', 'h1', 'main'].map((selector) => {
          const element = window.document.querySelector(selector)!
          const { x, y, width, height } = element.getBoundingClientRect()
          return { x, y, width, height }
        })
      )
      expect(hydrated).toEqual(initial)
      expect(errors).toEqual([])
      await context.close()
    }
  )
}

for (const path of ['workflows/', 'about/', 'sources/hpo/']) {
  test('development stays stable with delayed fonts: ' + path, async ({ page, baseURL }) => {
    await page.route('**/*.woff2', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 700))
      await route.continue()
    })
    await page.addInitScript(() => {
      const tracked = window as typeof window & { layoutShifts: number[] }
      tracked.layoutShifts = []
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
          if (!shift.hadRecentInput) tracked.layoutShifts.push(shift.value)
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(pageUrl(baseURL, path))
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    expect(
      await page.evaluate(() => (window as typeof window & { layoutShifts: number[] }).layoutShifts)
    ).toEqual([])
  })
}
