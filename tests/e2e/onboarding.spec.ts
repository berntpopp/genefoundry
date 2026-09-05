import { expect, test } from '@playwright/test'
import { CLIENT_GUIDES } from '../../src/data/clients'
const connect = 'connect/'
test('clipboard denial exposes manual recovery', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException('Denied', 'NotAllowedError')
        }
      }
    })
  )
  await page.goto(connect)
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
  await expect(page.getByText('Endpoint copied', { exact: true })).toHaveCount(0)
})
test('legacy fallback never claims a false copy', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    document.execCommand = () => false
  })
  await page.goto(connect)
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
})
test('successful copy contains the absolute endpoint', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          if (value !== 'https://genefoundry.org/mcp') throw new Error('Wrong endpoint')
        }
      }
    })
  )
  await page.goto(connect)
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Endpoint copied', { exact: true })).toBeVisible()
})
test('all client choices retain honest setup state and matching guide', async ({ page }) => {
  await page.goto(connect)
  for (const guide of CLIENT_GUIDES) {
    await page.getByLabel('AI client', { exact: true }).selectOption(guide.id)
    await expect(
      page.locator('.selected-guide').getByRole('link', { name: /^Open .* guide$/ })
    ).toHaveAttribute('href', new RegExp(`/connect/${guide.id}/$`))
    if (guide.recipeState === 'documentation-only')
      await expect(page.locator('.selected-guide')).toContainText(
        'Setup not tested with this client.'
      )
    else if (guide.recipeState === 'documented')
      await expect(page.locator('.selected-guide')).toContainText(
        'Instructions checked against official documentation'
      )
    await expect(page.getByRole('button', { name: 'Copy setup', exact: true })).toHaveCount(
      guide.code === null ? 0 : 1
    )
    if (guide.recipeState !== 'verified')
      await expect(page.locator('.selected-guide')).not.toContainText('Setup verified')
  }
})
test('a previous copy cannot claim success for a newly selected client', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            Object.assign(window, { finishCopy: resolve })
          })
      }
    })
  )
  await page.goto(connect)
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Copying…' })).toBeDisabled()
  await page.getByLabel('AI client', { exact: true }).selectOption('codex')
  await page.evaluate(() => (window as unknown as { finishCopy: () => void }).finishCopy())
  await expect(page.getByText('Endpoint copied', { exact: true })).toHaveCount(0)
})
test('verified guide UI copies setup text and resets when content changes', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (!text.startsWith('Sample setup')) throw new Error('Wrong setup')
        }
      }
    })
  )
  await page.goto('tests/fixtures/verified-guide.html')
  await expect(
    page.getByText('UI test fixture — not compatibility evidence', { exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Copy setup', exact: true }).click()
  await expect(page.getByText('Setup copied', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Change fixture content' }).click()
  await expect(page.getByText('Setup copied', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Claude Code setup' })).toContainText(
    'Alternate sample text'
  )
})
test('verified guide UI preserves readable setup after copy denial', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied')
        }
      }
    })
  )
  await page.goto('tests/fixtures/verified-guide.html')
  await page.getByRole('button', { name: 'Copy setup', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Claude Code setup' })).toContainText(
    'Sample setup text'
  )
  await expect(page.getByText('Setup copied', { exact: true })).toHaveCount(0)
})

test('keyboard focus stays visible against the dark command panel', async ({ page }) => {
  await page.goto('connect/')
  const region = page.getByRole('region', { name: 'Hosted MCP endpoint' })
  await region.focus()
  await page.keyboard.press('Shift+Tab')
  const button = page.getByRole('button', { name: 'Copy endpoint', exact: true })
  await expect(button).toBeFocused()
  for (const target of [button, region]) {
    if (target === region) await page.keyboard.press('Tab')
    await expect(target).toBeFocused()
    const focus = await target.evaluate((element) => {
      const style = getComputedStyle(element)
      const panel = getComputedStyle(element.closest('.command-card')!)
      const luminance = (value: string) => {
        const channels = value
          .match(/\d+(?:\.\d+)?/g)!
          .slice(0, 3)
          .map(Number)
          .map((channel) => {
            const normalized = channel / 255
            return normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4
          })
        return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
      }
      const a = luminance(style.outlineColor)
      const b = luminance(panel.backgroundColor)
      return {
        width: parseFloat(style.outlineWidth),
        style: style.outlineStyle,
        contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      }
    })
    expect(focus.width).toBeGreaterThanOrEqual(2)
    expect(focus.style).toBe('solid')
    expect(focus.contrast).toBeGreaterThanOrEqual(3)
  }
})
