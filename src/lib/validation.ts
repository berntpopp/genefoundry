import { WORKFLOW_IDS } from '../data/contracts'
import type { ServerEntry } from '../data/servers'
import type {
  SourceDetail,
  ClientGuide,
  Workflow,
  WorkflowResult,
  PageDefinition,
  ReviewRecord,
  EvidenceLink
} from '../data/contracts'
interface ContentInput {
  servers: readonly ServerEntry[]
  details: readonly SourceDetail[]
  clients: readonly ClientGuide[]
  workflows: readonly Workflow[]
  pages: readonly PageDefinition[]
}
function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid content: ${message}`)
}
const nonempty = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0
function date(value: string): void {
  requireValue(
    /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value,
    `invalid review date ${value}`
  )
}
function links(values: EvidenceLink[]): void {
  requireValue(values.length > 0, 'missing source references')
  for (const link of values) {
    requireValue(nonempty(link.label), 'missing reference label')
    requireValue(/^https:\/\//.test(link.url), 'references must use HTTPS')
    new URL(link.url)
  }
}
function review(value: ReviewRecord): void {
  date(value.reviewedAt)
  links(value.sources)
  requireValue(nonempty(value.limitation), 'missing review limitation')
}
function workflowResult(value: WorkflowResult | null | undefined): void {
  requireValue(value && typeof value === 'object', 'missing workflow result')
  requireValue(nonempty(value.summary) && nonempty(value.client), 'incomplete workflow result')
  date(value.executedAt)
  requireValue(Array.isArray(value.sources), 'missing workflow result sources')
  links(value.sources)
  requireValue(
    Array.isArray(value.notes) && value.notes.every(nonempty),
    'invalid workflow result notes'
  )
  requireValue(Array.isArray(value.tables) && value.tables.length > 0, 'missing result tables')
  for (const table of value.tables) {
    requireValue(
      table &&
        nonempty(table.caption) &&
        Array.isArray(table.columns) &&
        table.columns.length > 0 &&
        table.columns.every(nonempty) &&
        Array.isArray(table.rows) &&
        table.rows.length > 0 &&
        table.rows.every(
          (row: string[]) =>
            Array.isArray(row) && row.length === table.columns.length && row.every(nonempty)
        ),
      'invalid workflow result table'
    )
  }
}
function unique(values: readonly string[], name: string): void {
  requireValue(new Set(values).size === values.length, `duplicate ${name}`)
}
export function validateContent(input: ContentInput, options: { publication: boolean }): void {
  const { servers, details, clients, workflows, pages } = input
  unique(
    servers.map((s) => s.namespace),
    'source'
  )
  unique(
    details.map((d) => d.namespace),
    'detail'
  )
  unique(
    clients.map((c) => c.id),
    'client'
  )
  unique(
    workflows.map((w) => w.id),
    'workflow'
  )
  unique(
    pages.map((p) => p.path),
    'page'
  )
  unique(
    pages.map((p) => p.title),
    'page title'
  )
  unique(
    pages.map((p) => p.description),
    'page description'
  )
  requireValue(servers.length > 0 && servers.length === details.length, 'source/detail coverage')
  for (const source of servers) {
    requireValue(/^[a-z0-9-]+$/.test(source.namespace), 'unsafe source namespace')
    requireValue(Number.isInteger(source.tools) && source.tools > 0, 'invalid tool count')
    const detail = details.find((d) => d.namespace === source.namespace)
    requireValue(detail, `missing detail ${source.namespace}`)
    requireValue(
      nonempty(detail.summary) &&
        detail.tasks.length > 0 &&
        detail.tasks.every(nonempty) &&
        detail.identifiers.length > 0 &&
        detail.identifiers.every(nonempty) &&
        detail.limitations.length > 0 &&
        detail.limitations.every(nonempty),
      `incomplete detail ${source.namespace}`
    )
    requireValue(detail.dataVersion === null || nonempty(detail.dataVersion), 'invalid version')
    links(detail.terms)
    review(detail.review)
    requireValue(
      pages.some(
        (p) =>
          p.kind === 'source' &&
          p.namespace === source.namespace &&
          p.path === `/sources/${source.namespace}/`
      ),
      `missing source page ${source.namespace}`
    )
  }
  const clientIds = ['chatgpt', 'claude-code', 'claude-ai', 'codex', 'cursor', 'gemini', 'vscode']
  requireValue(
    clients.length === clientIds.length &&
      clientIds.every((id) => clients.some((c) => c.id === id)),
    'all supported client guides required'
  )
  for (const client of clients) {
    requireValue(
      nonempty(client.label) &&
        nonempty(client.summary) &&
        client.steps.length > 0 &&
        client.prerequisites.length > 0 &&
        client.verification.length > 0 &&
        client.troubleshooting.length > 0,
      `incomplete client ${client.id}`
    )
    review(client.review)
    links(client.documentation)
    if (client.recipeState === 'verified') {
      requireValue(
        nonempty(client.code) && client.recipeTest,
        'verified recipe requires execution record'
      )
      requireValue(
        nonempty(client.recipeTest.verificationId) && nonempty(client.recipeTest.platform),
        'missing recipe execution identity'
      )
      requireValue(
        client.recipeTest.clientVersion === null || nonempty(client.recipeTest.clientVersion),
        'invalid tested version'
      )
      date(client.recipeTest.testedAt)
    } else if (client.recipeState === 'documented') {
      requireValue(
        nonempty(client.code) && client.recipeTest === null,
        'documented code cannot claim execution'
      )
    } else {
      requireValue(
        client.recipeState === 'documentation-only' &&
          client.code === null &&
          client.recipeTest === null,
        'documentation-only guide cannot claim tested code'
      )
    }
    requireValue(
      pages.some(
        (p) =>
          p.kind === 'client' && p.clientId === client.id && p.path === `/connect/${client.id}/`
      ),
      `missing client page ${client.id}`
    )
  }
  requireValue(
    workflows.length === WORKFLOW_IDS.length &&
      WORKFLOW_IDS.every((id) => workflows.some((w) => w.id === id)),
    'all approved workflow tasks required'
  )
  for (const workflow of workflows) {
    review(workflow.review)
    requireValue(
      nonempty(workflow.prompt) &&
        nonempty(workflow.outcome) &&
        nonempty(workflow.title) &&
        nonempty(workflow.summary) &&
        workflow.steps.length > 0 &&
        workflow.limitations.length > 0,
      'incomplete workflow'
    )
    requireValue(
      workflow.exampleKind === 'verified'
        ? nonempty(workflow.executionReviewId) && workflow.result !== null
        : workflow.exampleKind === 'illustrative' && workflow.executionReviewId === null,
      'workflow evidence state'
    )
    if (workflow.exampleKind === 'verified') workflowResult(workflow.result)
    for (const step of workflow.steps) {
      const source = servers.find((s) => s.namespace === step.namespace)
      requireValue(
        source &&
          nonempty(step.title) &&
          nonempty(step.instruction) &&
          step.inspect.length > 0 &&
          step.inspect.every(nonempty),
        'invalid workflow step'
      )
      requireValue(
        step.arguments === null ||
          (typeof step.arguments === 'object' && !Array.isArray(step.arguments)),
        'invalid workflow arguments'
      )
      requireValue(
        step.tool === null || step.tool.startsWith(`${source.namespace}_`),
        'tool namespace mismatch'
      )
      links(step.evidence)
    }
    requireValue(
      pages.some(
        (p) =>
          p.kind === 'workflow' &&
          p.workflowId === workflow.id &&
          p.path === `/workflows/${workflow.id}/`
      ),
      'missing workflow page'
    )
  }
  for (const page of pages) {
    requireValue(
      /^\/(?:[a-z0-9-]+\/)*$/.test(page.path) || page.path === '/404.html',
      'unsafe page path'
    )
    requireValue(nonempty(page.title) && nonempty(page.description), 'missing page metadata')
    if (page.modifiedAt) date(page.modifiedAt)
    if (page.kind === 'source')
      requireValue(
        servers.some((s) => s.namespace === page.namespace),
        'orphan source page'
      )
    if (page.kind === 'client')
      requireValue(
        clients.some((c) => c.id === page.clientId),
        'orphan client page'
      )
    if (page.kind === 'workflow')
      requireValue(
        workflows.some((w) => w.id === page.workflowId),
        'orphan workflow page'
      )
  }
  if (options.publication) {
    requireValue(
      !/development.only.fixture|UI test fixture|tests\/fixtures|evidencePath/i.test(
        JSON.stringify(input)
      ),
      'development evidence or fixture in public data'
    )
    requireValue(
      pages.filter((p) => p.indexable).length ===
        servers.length + clients.length + workflows.length + 7,
      'route coverage'
    )
    requireValue(
      pages.some((p) => p.kind === 'not-found' && !p.indexable && p.path === '/404.html'),
      'missing noindex 404'
    )
    const staticRoutes = {
      '/': 'home',
      '/sources/': 'source-index',
      '/connect/': 'client-index',
      '/workflows/': 'workflow-index',
      '/about/': 'about',
      '/limitations/': 'limitations',
      '/imprint/': 'imprint'
    }
    for (const [path, kind] of Object.entries(staticRoutes))
      requireValue(
        pages.some((p) => p.path === path && p.kind === kind && p.indexable),
        `missing static page ${path}`
      )
    for (const page of pages.filter((p) => p.kind !== 'not-found'))
      requireValue(page.indexable, 'public registry pages must be indexable on production')
  }
}
