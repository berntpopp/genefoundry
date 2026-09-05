import { chromium, expect, test } from '@playwright/test'
import { PAGES } from '../../src/data/pages'
import { FEATURED_WORKFLOWS, WORKFLOWS } from '../../src/data/workflows'
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
  await expect(examples).toHaveCount(FEATURED_WORKFLOWS.length)
  for (const [index, workflow] of FEATURED_WORKFLOWS.entries()) {
    await expect(examples.nth(index).locator('blockquote')).toHaveText(workflow.prompt)
    await expect(
      examples
        .nth(index)
        .getByRole('link', { name: `View worked example: ${workflow.title}`, exact: true })
    ).toHaveAttribute('href', `/workflows/${workflow.id}/`)
  }
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
  await expect(examples).toHaveCount(WORKFLOWS.length)
  const first = await examples.first().boundingBox()
  const second = await examples.nth(1).boundingBox()
  expect(first!.y).toBe(second!.y)
  expect(second!.x).toBeGreaterThan(first!.x)
  await page.setViewportSize({ width: 320, height: 900 })
  for (const route of ['/workflows/', '/about/', '/sources/hpo/']) {
    await page.goto(route)
    await page.addStyleTag({ content: 'html{font-size:200% !important}' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('hero contours keep moving and support pause and resume', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const backdrop = page.locator('.hero-backdrop')
  await expect(backdrop).toHaveAttribute('aria-hidden', 'true')
  await expect(backdrop).not.toHaveClass(/motion-paused/)
  const before = await page.locator('#intro-title').boundingBox()
  await page.waitForTimeout(4200)
  expect(
    await backdrop.evaluate(
      (element) =>
        element
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length
    )
  ).toBe(3)
  expect(await page.locator('#intro-title').boundingBox()).toEqual(before)
  await page.getByRole('button', { name: 'Pause animation', exact: true }).click()
  await expect(backdrop).toHaveClass(/motion-paused/)
  await page.waitForTimeout(100)
  const stopped = await page
    .locator('.contour-current path')
    .first()
    .evaluate((element) => getComputedStyle(element).strokeDashoffset)
  await page.waitForTimeout(250)
  expect(
    await page
      .locator('.contour-current path')
      .first()
      .evaluate((element) => getComputedStyle(element).strokeDashoffset)
  ).toBe(stopped)
  await page.getByRole('button', { name: 'Resume animation', exact: true }).click()
  await expect(backdrop).not.toHaveClass(/motion-paused/)
})

test('hero contours pause offscreen and in a hidden document', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const backdrop = page.locator('.hero-backdrop')
  await expect(backdrop).not.toHaveClass(/motion-paused/)
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(backdrop).toHaveClass(/motion-paused/)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(backdrop).not.toHaveClass(/motion-paused/)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(backdrop).toHaveClass(/motion-paused/)
})

test('reduced motion keeps the contour illustration static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const backdrop = page.locator('.hero-backdrop')
  await expect(backdrop).toBeVisible()
  expect(
    await backdrop.evaluate((element) => element.getAnimations({ subtree: true }).length)
  ).toBe(0)
  await expect(page.getByRole('button', { name: 'Pause animation' })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('every page keeps navbar alignment when classic scrollbars appear or disappear', async ({
  baseURL
}) => {
  test.setTimeout(120000)
  const browser = await chromium.launch({
    ignoreDefaultArgs: ['--hide-scrollbars'],
    args: ['--disable-features=OverlayScrollbar,FluentOverlayScrollbar']
  })
  const measurePosition = () => {
    const logo = document.querySelector('.brand-link')!.getBoundingClientRect()
    const nav = document.querySelector('.navigation')!.getBoundingClientRect()
    return {
      logo: { x: logo.x, y: logo.y },
      nav: { x: nav.x, width: nav.width },
      scrollbar: innerWidth - document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }
  }
  try {
    const positions = []
    for (const definition of PAGES) {
      // Each route is a layout sample; close its context to release dev modules and HMR.
      const context = await browser.newContext({ viewport: { width: 1440, height: 1600 } })
      try {
        const page = await context.newPage()
        await page.goto(new URL(definition.path.slice(1), baseURL).href)
        await page.evaluate(() => document.fonts.ready)
        positions.push(await page.evaluate(measurePosition))
      } finally {
        await context.close()
      }
    }
    expect(positions.some((position) => position.scrollbar > 0)).toBe(true)
    expect(positions.some((position) => position.scrollbar === 0)).toBe(true)
    for (const [index, position] of positions.entries()) {
      expect.soft(position.logo, PAGES[index]!.path).toEqual(positions[0]!.logo)
      expect.soft(position.nav, PAGES[index]!.path).toEqual(positions[0]!.nav)
      expect.soft(position.overflow, PAGES[index]!.path).toBe(false)
    }

    // Start at the short recovery page, then follow real links to longer pages.
    const context = await browser.newContext({ viewport: { width: 1440, height: 1600 } })
    try {
      const page = await context.newPage()
      await page.goto(new URL('404.html', baseURL).href)
      await page.evaluate(() => document.fonts.ready)
      const transitions = [await page.evaluate(measurePosition)]
      for (const label of ['GeneFoundry home', 'Workflows', 'About', 'GeneFoundry home']) {
        const link =
          label === 'GeneFoundry home'
            ? page.getByRole('link', { name: label, exact: true })
            : page.locator('.desktop-navigation').getByRole('link', { name: label, exact: true })
        await link.click()
        await page.waitForLoadState('load')
        await page.evaluate(() => document.fonts.ready)
        transitions.push(await page.evaluate(measurePosition))
      }
      expect(transitions.some((position) => position.scrollbar > 0)).toBe(true)
      expect(transitions.some((position) => position.scrollbar === 0)).toBe(true)
      for (const position of transitions) {
        expect(position.logo).toEqual(positions[0]!.logo)
        expect(position.nav).toEqual(positions[0]!.nav)
        expect(position.overflow).toBe(false)
      }
    } finally {
      await context.close()
    }
  } finally {
    await browser.close()
  }
})
