import type { PageDefinition } from './contracts'
import { SERVERS } from './servers'
import { SOURCE_DETAILS } from './source-details'
import { CLIENT_GUIDES } from './clients'
import { WORKFLOWS } from './workflows'
const staticPage = (
  kind:
    | 'home'
    | 'source-index'
    | 'client-index'
    | 'workflow-index'
    | 'about'
    | 'limitations'
    | 'imprint',
  path: string,
  title: string,
  description: string
): PageDefinition => ({ kind, path, title, description, indexable: true })
export const PAGES: PageDefinition[] = [
  staticPage(
    'home',
    '/',
    'GeneFoundry — Biomedical data for your AI tools',
    'Explore biomedical sources, review example research workflows, and connect your MCP client to the GeneFoundry gateway.'
  ),
  staticPage(
    'source-index',
    '/sources/',
    'Biomedical data sources | GeneFoundry',
    'Find biomedical sources by research task, identifier, or category. Review each source’s tools, documentation and limitations.'
  ),
  staticPage(
    'client-index',
    '/connect/',
    'Connect your MCP client | GeneFoundry',
    'Choose your AI client, review its documentation, and connect to GeneFoundry with browser sign-in. Check the setup verification status before use.'
  ),
  staticPage(
    'workflow-index',
    '/workflows/',
    'Research workflows | GeneFoundry',
    'Tested research workflows show how biomedical sources can contribute different kinds of evidence. Each step links to its source and limitations.'
  ),
  ...SERVERS.map((source): PageDefinition => ({
    kind: 'source',
    namespace: source.namespace,
    path: `/sources/${source.namespace}/`,
    title: `${source.source} MCP tools | GeneFoundry`,
    description:
      SOURCE_DETAILS.find((d) => d.namespace === source.namespace)?.summary || source.domain,
    modifiedAt: SOURCE_DETAILS.find((d) => d.namespace === source.namespace)?.review.reviewedAt,
    indexable: true
  })),
  ...CLIENT_GUIDES.map((guide): PageDefinition => ({
    kind: 'client',
    clientId: guide.id,
    path: `/connect/${guide.id}/`,
    title: `Connect ${guide.label} to GeneFoundry`,
    description: guide.summary,
    modifiedAt: guide.review.reviewedAt,
    indexable: true
  })),
  ...WORKFLOWS.map((workflow): PageDefinition => ({
    kind: 'workflow',
    workflowId: workflow.id,
    path: `/workflows/${workflow.id}/`,
    title: `${workflow.title} | GeneFoundry`,
    description: workflow.summary,
    modifiedAt: workflow.review.reviewedAt,
    indexable: true
  })),
  staticPage(
    'about',
    '/about/',
    'About GeneFoundry',
    'How the GeneFoundry gateway connects MCP clients to biomedical source tools, how the project is maintained, and where to report an issue.'
  ),
  staticPage(
    'limitations',
    '/limitations/',
    'Research limitations | GeneFoundry',
    'Understand source coverage, release differences, tool availability and the limits of AI-assisted biomedical research before using GeneFoundry.'
  ),
  staticPage(
    'imprint',
    '/imprint/',
    'Imprint | GeneFoundry',
    'Legal notice and provider contact information for GeneFoundry, in English and German.'
  ),
  {
    kind: 'not-found',
    path: '/404.html',
    title: 'Page not found | GeneFoundry',
    description: 'This page could not be found. Explore the source directory or connection guides.',
    indexable: false
  }
]
export function getPage(path: string): PageDefinition | undefined {
  return PAGES.find((page) => page.path === path)
}
