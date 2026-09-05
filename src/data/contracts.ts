export type ClientId =
  'chatgpt' | 'claude-code' | 'claude-ai' | 'codex' | 'cursor' | 'gemini' | 'vscode'
export const WORKFLOW_IDS = [
  'variant-evidence',
  'phenotype-rare-disease',
  'variant-annotation',
  'literature-review',
  'report-summary',
  'gene-validity',
  'acmg-evidence',
  'animal-models',
  'tissue-expression'
] as const
export type WorkflowId = (typeof WORKFLOW_IDS)[number]
export interface EvidenceLink {
  label: string
  url: string
}
export interface ReviewRecord {
  reviewedAt: string
  sources: EvidenceLink[]
  limitation: string
}
export interface RecipeTest {
  clientVersion: string | null
  platform: string
  testedAt: string
  verificationId: string
}
interface ClientGuideCommon {
  id: ClientId
  label: string
  summary: string
  hint: string
  documentation: EvidenceLink[]
  prerequisites: string[]
  steps: string[]
  verification: string[]
  troubleshooting: string[]
  review: ReviewRecord
}
export type ClientGuide = ClientGuideCommon &
  (
    | { recipeState: 'verified'; code: string; recipeTest: RecipeTest }
    | { recipeState: 'documented'; code: string; recipeTest: null }
    | { recipeState: 'documentation-only'; code: null; recipeTest: null }
  )
export interface SourceDetail {
  namespace: string
  summary: string
  tasks: string[]
  aliases: string[]
  identifiers: string[]
  dataVersion: string | null
  limitations: string[]
  terms: EvidenceLink[]
  review: ReviewRecord
}
export interface WorkflowStep {
  arguments: Record<string, unknown> | null
  inspect: string[]
  title: string
  instruction: string
  namespace: string
  tool: string | null
  identifier: string | null
  evidence: EvidenceLink[]
}
export interface WorkflowResult {
  summary: string
  tables: { caption: string; columns: string[]; rows: string[][] }[]
  notes: string[]
  sources: EvidenceLink[]
  executedAt: string
  client: string
}
export interface Workflow {
  result: WorkflowResult | null
  prompt: string
  outcome: string
  id: WorkflowId
  title: string
  summary: string
  exampleKind: 'illustrative' | 'verified'
  steps: WorkflowStep[]
  limitations: string[]
  review: ReviewRecord
  executionReviewId: string | null
}
export interface FaqEntry {
  id: string
  question: string
  answer: string
}
export interface PageMeta {
  path: string
  title: string
  description: string
  modifiedAt?: string
  indexable: boolean
}
export type PageDefinition = PageMeta &
  (
    | {
        kind:
          | 'home'
          | 'source-index'
          | 'client-index'
          | 'workflow-index'
          | 'about'
          | 'limitations'
          | 'imprint'
          | 'not-found'
      }
    | { kind: 'source'; namespace: string }
    | { kind: 'client'; clientId: ClientId }
    | { kind: 'workflow'; workflowId: WorkflowId }
  )
export interface SiteConfig {
  canonicalOrigin: string
  basePath: string
  isMirror: boolean
  buildYear: number
}

export interface SiteCopy {
  hero: {
    title: string
    lead: string
    definition: string
    primaryAction: string
    secondaryAction: string
    requirements: string
  }
  sources: {
    heading: string
    lead: string
    searchLabel: string
    searchPlaceholder: string
    categoryLabel: string
    allCategories: string
    clearSearch: string
    clearFilters: string
    previewAction: string
    noResults: string
    noResultsHelp: string
  }
  evidence: { heading: string; intro: string; caption: string; illustrationLabel: string }
  connect: {
    heading: string
    intro: string
    clientLabel: string
    endpointLabel: string
    oauthNote: string
    backendNote: string
    verificationHeading: string
    verificationBody: string
    troubleshootingHeading: string
    troubleshootingBody: string
  }
  maintenance: {
    heading: string
    body: string
    limitationsHeading: string
    limitationsBody: string
  }
  footer: { description: string; researchNotice: string }
  states: {
    copyPending: string
    copyEndpointSuccess: string
    copySetupSuccess: string
    copyFailure: string
    copyRetry: string
    noRecipeStatus: string
    noRecipeBody: string
  }
}
