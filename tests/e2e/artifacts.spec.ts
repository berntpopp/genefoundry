import { expect, test } from '@playwright/test'
import { PAGES } from '../../src/data/pages'
import { pageUrl } from '../helpers/navigation'

test('every document has one canonical and safely parsed metadata', async ({ page, baseURL }) => {
  for (const definition of PAGES.filter((entry) => entry.kind !== 'not-found')) {
    await page.goto(pageUrl(baseURL, definition.path.slice(1)))
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://genefoundry.org' + definition.path
    )
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      definition.description
    )
    const robots = baseURL!.includes('/genefoundry/') ? 'noindex,follow' : 'index,follow'
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', robots)
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(schemas.length).toBeGreaterThan(0)
    for (const schema of schemas) expect(JSON.parse(schema)['@context']).toBe('https://schema.org')
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0)
    expect(await page.locator('head > style').textContent()).toContain('scrollbar-gutter:stable')
    const localResources = await page
      .locator('script[src],link[rel="stylesheet"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('src') || element.getAttribute('href'))
      )
    for (const resource of localResources) {
      expect(resource).toMatch(
        baseURL!.includes('/genefoundry/') ? /^\/genefoundry\/assets\// : /^\/assets\//
      )
    }
  }
})

test('social preview is real PNG with expected dimensions', async ({ request, baseURL }) => {
  const response = await request.get(pageUrl(baseURL, 'og-image.png'))
  expect(response.status()).toBe(200)
  const png = await response.body()
  expect(png.subarray(1, 4).toString()).toBe('PNG')
  expect(png.readUInt32BE(16)).toBe(1200)
  expect(png.readUInt32BE(20)).toBe(630)
})
