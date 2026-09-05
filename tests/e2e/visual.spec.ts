import { expect, test } from '@playwright/test'
test('mobile menu dismisses to its trigger and enlarged text reflows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByLabel('Open navigation')
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(page.locator('.mobile-navigation')).not.toHaveAttribute('open', '')
  await page.addStyleTag({ content: 'html{font-size:200% !important}' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
test('hero exposes connection before the mobile fold', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const action = page
    .locator('#intro')
    .getByRole('link', { name: 'Connect your client', exact: true })
  const bounds = await action.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844)
  await expect(page.locator('#intro').getByText(/Browser sign-in required/)).toBeVisible()
})
for (const width of [320, 390, 768, 1440]) {
  test(`pages reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/sources/', '/sources/gnomad/', '/connect/', '/imprint/']) {
      await page.goto(route)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route
      ).toBe(true)
    }
  })
}

test('homepage shows usable prompts leading to worked examples', async ({ page }) => {
  await page.goto('/')
  const examples = page.locator('.workflow-previews article')
  await expect(examples).toHaveCount(2)
  await expect(examples.first().locator('blockquote')).toContainText(
    'Use GeneFoundry to review HNF1B'
  )
  await expect(examples.last().locator('blockquote')).toContainText(
    'renal cysts and diabetes mellitus'
  )
  await examples
    .first()
    .getByRole('link', { name: /^View worked example:/ })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HNF1B')
  await expect(page.locator('main')).toContainText('GRCh38')
  await expect(page.locator('main')).toContainText('gnomad')
})

test('reading and workflow pages keep the navigation alignment', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const route of ['/workflows/', '/about/', '/sources/hpo/']) {
    await page.goto(route)
    await page.evaluate(() => document.fonts.ready)
    const alignment = await page.evaluate(() => ({
      navigation: document.querySelector('.navigation')!.getBoundingClientRect().left,
      heading: document.querySelector('h1')!.getBoundingClientRect().left,
      contentWidth: document
        .querySelector('.worked-examples, .about-columns, .source-layout')!
        .getBoundingClientRect().width
    }))
    expect(alignment.heading, route).toBe(alignment.navigation)
    expect(alignment.contentWidth, route).toBe(1200)
  }
  await page.goto('/workflows/')
  const examples = page.locator('.worked-examples > section')
  await expect(examples).toHaveCount(2)
  const first = await examples.first().boundingBox()
  const second = await examples.last().boundingBox()
  expect(first!.y).toBe(second!.y)
  expect(second!.x).toBeGreaterThan(first!.x)
  await page.setViewportSize({ width: 320, height: 900 })
  for (const route of ['/workflows/', '/about/', '/sources/hpo/']) {
    await page.goto(route)
    await page.addStyleTag({ content: 'html{font-size:200% !important}' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  }
})
