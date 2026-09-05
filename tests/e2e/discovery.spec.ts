import { expect, test } from '@playwright/test'
import { SERVERS } from '../../src/data/servers'
test('directory intersects filters and offers complete recovery', async ({ page }) => {
  await page.goto('/sources/')
  await page.getByLabel('Search sources').fill('gnomad')
  await expect(page.getByRole('status')).toHaveText('1 source found')
  await expect(page.getByLabel('Search sources')).toBeFocused()
  await page.getByLabel('Research area', { exact: true }).selectOption('literature')
  await expect(page.getByText('No sources match your search.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).first().click()
  await expect(page.getByTestId('source-record')).toHaveCount(SERVERS.length)
  await expect(page.getByLabel('Search sources')).toBeFocused()
})
test('query links restore on reload and history navigation', async ({ page }) => {
  await page.goto('/sources/?q=gnomad&category=invalid')
  await expect(page.getByLabel('Search sources')).toHaveValue('gnomad')
  await expect(page.getByLabel('Research area', { exact: true })).toHaveValue('all')
  await expect(page.getByTestId('source-record')).toHaveCount(1)
  await page.reload()
  await expect(page.getByLabel('Search sources')).toHaveValue('gnomad')
  await page.getByRole('link', { name: 'View source: gnomAD details' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('gnomAD')
  await page.goBack()
  await expect(page.getByLabel('Search sources')).toHaveValue('gnomad')
  await page.getByLabel('Search sources').fill('<script>.*')
  await expect(page.getByTestId('source-record')).toHaveCount(0)
  await expect(page.getByLabel('Search sources')).toHaveValue('<script>.*')
})
test('all source destinations contain reviewed detail content', async ({ page }) => {
  for (const source of SERVERS) {
    await page.goto(`/sources/${source.namespace}/`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      `${source.source} through GeneFoundry`
    )
    await expect(page.getByText(source.sampleTool, { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Research tasks' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View integration code' })).toHaveAttribute(
      'href',
      `https://github.com/${source.repo}`
    )
  }
})

test('keyboard users can clear a query and continue typing', async ({ page }) => {
  await page.goto('/sources/')
  const search = page.getByLabel('Search sources')
  await search.focus()
  await page.keyboard.type('gnomad')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Clear search', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(search).toBeFocused()
  await page.keyboard.type('hpo')
  await expect(page.getByTestId('source-record')).toHaveCount(1)
})
