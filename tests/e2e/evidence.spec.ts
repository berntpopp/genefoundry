import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { WORKFLOWS } from '../../src/data/workflows'

for (const workflow of WORKFLOWS) {
  test(`worked prompt and recorded result: ${workflow.id}`, async ({ page }) => {
    await page.addInitScript((expected) => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            if (text !== expected) throw new Error('Copied the wrong workflow prompt')
          }
        }
      })
    }, workflow.prompt)
    await page.goto(`workflows/${workflow.id}/`)
    await expect(page.locator('blockquote')).toHaveText(workflow.prompt)
    await page.getByRole('button', { name: 'Copy prompt', exact: true }).click()
    await expect(page.getByText('Prompt copied', { exact: true })).toBeVisible()
    await expect(page.locator('.recorded-result')).toContainText(workflow.result!.summary)
    await expect(page.locator('.recorded-result table')).toHaveCount(workflow.result!.tables.length)
    await page.locator('.workflow-method > summary').click()
    await expect(page.locator('.workflow-steps > li')).toHaveCount(workflow.steps.length)
  })
}
test('homepage shows actual source values and links to the recorded result', async ({ page }) => {
  await page.goto('')
  const figure = page.locator('figure')
  await expect(figure.getByText('Actual GeneFoundry result', { exact: true })).toBeVisible()
  await expect(figure).toContainText('0.130')
  await expect(figure).toContainText('1.000')
  await expect(figure.getByRole('link')).toHaveAttribute('href', /workflows\/variant-evidence\/$/)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
test('actual workflow result leads with a reusable prompt and source-linked records', async ({
  page
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          if (!value.startsWith('Use GeneFoundry to look up HNF1B')) throw new Error('Wrong prompt')
        }
      }
    })
  )
  await page.goto('workflows/variant-evidence/')
  await page.getByRole('button', { name: 'Copy prompt', exact: true }).click()
  await expect(page.getByText('Prompt copied', { exact: true })).toBeVisible()
  await expect(page.locator('.recorded-result')).toContainText('933')
  await expect(
    page.locator('table').nth(1).getByRole('link', { name: 'VCV000012635' })
  ).toHaveAttribute('href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12635/')
  await expect(page.locator('.workflow-method')).not.toHaveAttribute('open')
  await page.locator('.workflow-method > summary').focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('region', { name: 'clinvar_get_variants_by_gene arguments', exact: true })
  ).toContainText('"limit": 5')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
test('actual phenotype result shows the full overlap and preserves prompt after copy failure', async ({
  page
}) => {
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
  await page.goto('workflows/phenotype-rare-disease/')
  await expect(page.locator('table').nth(1).locator('tbody tr')).toHaveCount(13)
  await expect(page.locator('.recorded-result')).toContainText('Definitive')
  await page.getByRole('button', { name: 'Copy prompt', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
  await expect(page.locator('blockquote')).toContainText('exact terms without descendants')
  await expect(page.getByText('Prompt copied', { exact: true })).toHaveCount(0)
})
test('documentation-only and failed-copy states meet automated accessibility checks', async ({
  page
}) => {
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
  await page.goto('connect/')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByLabel('AI client', { exact: true }).selectOption('gemini')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
