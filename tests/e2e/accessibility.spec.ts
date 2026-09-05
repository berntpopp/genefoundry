import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const routes = [
  '/',
  '/sources/',
  '/sources/gnomad/',
  '/connect/',
  '/connect/codex/',
  '/connect/chatgpt/',
  '/connect/claude-ai/',
  '/workflows/variant-evidence/',
  '/about/',
  '/limitations/',
  '/imprint/',
  '/not-a-page/'
]
for (const width of [390, 1440]) {
  test(`public page kinds meet automated WCAG checks at ${width}px`, async ({ page }) => {
    test.setTimeout(120000)
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const route of routes) {
      await page.goto(route)
      await page.evaluate(() => document.fonts.ready)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        route
      ).toEqual([])
    }
  })
}
test('all page kinds retain readable 200% text at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  for (const route of routes) {
    await page.goto(route)
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route
    ).toBe(true)
    await expect(page.locator('h1')).toBeVisible()
  }
})
