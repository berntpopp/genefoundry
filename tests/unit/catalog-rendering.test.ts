import { expect, test } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ServerCatalog from '../../src/components/ServerCatalog.vue'
import { SERVERS } from '../../src/data/servers'

test('static catalog reserves its filter controls before hydration', async () => {
  const html = await renderToString(createSSRApp(ServerCatalog))
  expect(html).toMatch(/<form[^>]*class="catalog-filters"/)
  expect(html).toMatch(/<input[^>]*id="source-search"[^>]*disabled/)
  expect(html).toMatch(/<select[^>]*id="source-category"[^>]*disabled/)
  expect((html.match(/data-testid="source-record"/g) ?? []).length).toBe(SERVERS.length)
  expect(html).toContain('Search and filters need JavaScript. Browse all sources below.')
})
