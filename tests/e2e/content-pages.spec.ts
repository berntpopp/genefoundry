import { expect, test } from '@playwright/test'
import { FAQS } from '../../src/data/faq'
test('client and imprint documents are useful without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(new URL('connect/codex/', baseURL).href)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Codex')
  await expect(page.getByText('https://genefoundry.org/mcp', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/Instructions checked against official documentation/)).toBeVisible()
  await page.goto(new URL('imprint/', baseURL).href)
  await expect(page.locator('section[lang="de"]')).toContainText('Impressum')
  await page.getByRole('link', { name: 'Deutsch', exact: true }).click()
  await expect(page).toHaveURL(/#imprint-de$/)
  await expect(page.locator('section[lang="en"]')).toContainText('Chaussestr. 58D')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await context.close()
})
test('all reading page kinds retain content and recovery without JavaScript', async ({
  browser,
  baseURL
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const [path, title] of [
    ['connect/', 'Connect your AI client'],
    ['workflows/', 'Research workflows'],
    ['workflows/phenotype-rare-disease/', 'Which genes link renal cysts and diabetes?'],
    ['about/', 'About GeneFoundry'],
    ['limitations/', 'Scope and limitations'],
    ['404.html', 'Page not found']
  ]) {
    await page.goto(new URL(path!, baseURL).href)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!)
  }
  await expect(page.getByRole('link', { name: 'Browse sources', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Return home', exact: true })).toBeVisible()
  await page.goto(new URL('about/', baseURL).href)
  for (const faq of FAQS) {
    await page.getByText(faq.question, { exact: true }).click()
    await expect(page.getByText(faq.answer, { exact: true })).toBeVisible()
  }
  await context.close()
})

test('worked examples expose reusable prompts and actual tool inputs without JavaScript', async ({
  browser,
  baseURL
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(new URL('workflows/variant-evidence/', baseURL).href)
  await expect(page.locator('blockquote')).toContainText('Use GeneFoundry to look up HNF1B')
  await page.locator('.workflow-method > summary').click()
  const lastCall = page.locator('.workflow-steps > li').last()
  await expect(lastCall.getByRole('region')).toContainText('"limit": 5')
  await expect(lastCall.getByRole('region')).toContainText('"gene_symbol": "HNF1B"')
  await context.close()
})
