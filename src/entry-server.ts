import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import type { PageDefinition } from './data/contracts'
import { PAGES } from './data/pages'
import { SERVERS } from './data/servers'
import { SOURCE_DETAILS } from './data/source-details'
import { CLIENT_GUIDES } from './data/clients'
import { WORKFLOWS } from './data/workflows'
import { validateContent } from './lib/validation'

export { PAGES } from './data/pages'
export { resolvePage } from './lib/resolve-page'
export { SITE } from './data/site'
export { pageHead, schemaFor } from './lib/metadata'
export { FAQS } from './data/faq'
export { SERVERS, SERVER_COUNT, TOOL_COUNT, HOSTED_ENDPOINT } from './data/servers'
export { CLIENT_GUIDES } from './data/clients'
export { WORKFLOWS } from './data/workflows'

export function validatePublication(): void {
  validateContent(
    {
      servers: SERVERS,
      details: SOURCE_DETAILS,
      clients: CLIENT_GUIDES,
      workflows: WORKFLOWS,
      pages: PAGES
    },
    { publication: true }
  )
}

export async function render(page: PageDefinition): Promise<string> {
  return renderToString(createSSRApp(App, { page }))
}
