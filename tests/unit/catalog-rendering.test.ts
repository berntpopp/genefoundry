import { expect, test } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ServerCatalog from '../../src/components/ServerCatalog.vue'
import SourceList from '../../src/components/SourceList.vue'
import { SERVERS } from '../../src/data/servers'

test('static catalog reserves its filter controls before hydration', async () => {
  const html = await renderToString(createSSRApp(ServerCatalog))
  expect(html).toMatch(/<form[^>]*class="catalog-filters"/)
  expect(html).toMatch(/<input[^>]*id="source-search"[^>]*disabled/)
  expect(html).toMatch(/<select[^>]*id="source-category"[^>]*disabled/)
  expect((html.match(/data-testid="source-record"/g) ?? []).length).toBe(SERVERS.length)
  expect(html).toContain('Search and filters need JavaScript. Browse all sources below.')
  expect((html.match(/<h2\b/g) ?? []).length).toBe(SERVERS.length)
  expect(html).not.toContain('<h3')
})

test('homepage source lists retain third-level headings below their section heading', async () => {
  const html = await renderToString(createSSRApp(SourceList, { sources: SERVERS.slice(0, 2) }))
  expect((html.match(/<h3\b/g) ?? []).length).toBe(2)
  expect(html).not.toContain('<h2')
})
