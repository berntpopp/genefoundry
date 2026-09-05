import { expect, test } from '@playwright/test'
import { PAGES } from '../../src/data/pages'
import { pageUrl } from '../helpers/navigation'

for (const definition of PAGES.filter((page) => page.kind !== 'not-found')) {
  test('static content and hydration: ' + definition.path, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    const response = await page.goto(pageUrl(baseURL, definition.path.slice(1)))
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(definition.title)
    await expect(page.locator('h1')).toHaveCount(1)
    expect((await page.locator('main').innerText()).length).toBeGreaterThan(150)
    await expect(page.locator('a[href*="/sources/"]').first()).toBeVisible()
    await context.close()

    const interactive = await browser.newContext()
    const hydrated = await interactive.newPage()
    const errors: string[] = []
    hydrated.on('pageerror', (error) => errors.push(error.message))
    hydrated.on('console', (message) => {
      if (message.type() === 'error' || /hydration.*mismatch/i.test(message.text()))
        errors.push(message.text())
    })
    await hydrated.goto(pageUrl(baseURL, definition.path.slice(1)))
    await expect(hydrated.locator('main')).toBeVisible()
    await hydrated.reload()
    await expect(hydrated.locator('h1')).toHaveCount(1)
    expect(errors).toEqual([])
    await interactive.close()
  })
}

test('direct index.html document URLs hydrate their registered page', async ({ page, baseURL }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydration.*mismatch/i.test(message.text()))
      errors.push(message.text())
  })
  for (const [path, heading] of [
    ['index.html', 'Biomedical data'],
    ['sources/index.html', 'Biomedical sources'],
    ['sources/gnomad/index.html', 'gnomAD']
  ]) {
    const response = await page.goto(pageUrl(baseURL, path))
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText(heading)
  }
  expect(errors).toEqual([])
  const missing = await page.goto(pageUrl(baseURL, 'unregistered/index.html'))
  expect(missing?.status()).toBe(404)
  await expect(page.locator('h1')).toContainText('Page not found')
})
