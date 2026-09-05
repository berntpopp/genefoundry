import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { PAGES } from '../../src/data/pages'

const routes = PAGES.map((page) => (page.kind === 'not-found' ? '/not-a-page/' : page.path))

for (const width of [390, 1440]) {
  test(`every public route meets automated accessibility checks at ${width}px`, async ({
    browser,
    baseURL
  }) => {
    test.setTimeout(120000)
    for (const route of routes) {
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height: 900 },
        reducedMotion: 'reduce'
      })
      try {
        const page = await context.newPage()
        await page.goto(route)
        await page.evaluate(() => document.fonts.ready)
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        expect
          .soft(
            results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
            route
          )
          .toEqual([])
      } finally {
        await context.close()
      }
    }
  })
}
test('every public route retains readable 200% text at narrow width', async ({
  browser,
  baseURL
}) => {
  test.setTimeout(120000)
  for (const route of routes) {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 320, height: 900 },
      reducedMotion: 'reduce'
    })
    try {
      const page = await context.newPage()
      await page.goto(route)
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
      expect
        .soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route)
        .toBe(true)
      await expect.soft(page.locator('h1'), route).toBeVisible()
    } finally {
      await context.close()
    }
  }
})
