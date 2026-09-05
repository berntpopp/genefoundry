# GeneFoundry frozen implementation contracts

Current implementation follows the [user-directed usage revision](2026-09-05-usage-revision.md), which supersedes conflicting original requirements.
Status: proposed code contracts for execution, not files already implemented. Applies to [design specification](2026-09-05-genefoundry-design.md). This document supersedes interfaces in the architecture research. Coordinator implements and freezes these names in G0. Workers request changes through the coordinator; no parallel edits to shared contracts.

## Global constraints (copy verbatim into every implementation plan)

- Preserve Vue 3, TypeScript, Tailwind 4 and Vite; no runtime server or framework/router migration.
- Use warm light reading surfaces, dark code panels, Archivo 600 display, existing Inter body and the GeneFoundry mark.
- No fabricated biomedical output, live status, citation, affiliation, privacy promise or tested-client claim.
- Preserve the absolute hosted endpoint `https://genefoundry.org/mcp`; never prepend the website base to backend URLs.
- Support website bases `/` and `/genefoundry/`; production canonicals use `https://genefoundry.org`.
- Public routes use `/sources/`, `/connect/`, `/workflows/`, `/about/`, `/limitations/`, `/imprint/`; backend `/docs/` stays reserved.
- All public pages have useful static HTML; source filtering and copy are progressive enhancements.
- Target WCAG 2.2 AA, 320 px reflow, 200% text stress, reduced motion and 44 px primary controls.
- Only the coordinator edits shared contracts, package/lockfiles, application composition and test configuration.
- Worker checks are non-mutating and scoped; do not run repository-wide autofix/format concurrently.
- Generate PWA hashes after final HTML; add compression sidecars afterward without mutating originals.
- No deployment, merge or external publication is implied by the planning deliverable.

## Data types — `src/data/contracts.ts`

```ts
export type ClientId = 'claude-code' | 'claude-ai' | 'codex' | 'cursor' | 'gemini' | 'vscode'
export type WorkflowId = 'variant-evidence' | 'phenotype-rare-disease'
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
  title: string
  instruction: string
  namespace: string
  tool: string | null
  identifier: string | null
  evidence: EvidenceLink[]
}
export interface Workflow {
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
```

`reviewedAt` is an actual editorial/source-doc review date, never inferred from deployment time. `recipeTest` is actual execution evidence, not the same as a documentation review. Public records carry only an opaque verificationId/executionReviewId. Local evidence paths live in the build-only verification ledger described below; browser modules never import that ledger. Hosted clients with no exposed version use clientVersion:null and a recorded platform; render the copy specification’s date-only tested wording instead of inventing a version. `Workflow.exampleKind='verified'` requires a non-null review ID joined to actual reviewed execution evidence at build time; initial two records are illustrative with null evidence. Null identifier/version means not supplied; do not populate invented values to satisfy a schema.

Preserve existing `ServerCategory`, `CategoryMeta`, `ServerEntry`, `SERVERS`, `CATEGORIES`, `SERVER_COUNT`, `TOOL_COUNT`, `HOSTED_ENDPOINT`, `GITHUB_URL`, `HEALTH_URL` in `servers.ts`. `ADD_COMMAND` remains temporarily compatible until B removes all old universal-command consumers; then coordinator approves its deletion. Category `text` and `dot` fields map to accessible semantic category classes fixed by A/G0, never new arbitrary bright-on-light colors.

## Frozen exports and joins

| File / owner                      | Exports                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/site.ts` / coordinator  | `SITE: SiteConfig`, `FEATURED_NAMESPACES: readonly string[]`                                                                                                                                              |
| `src/data/pages.ts` / coordinator | `PAGES: PageDefinition[]`, `getPage(path: string): PageDefinition \| undefined`                                                                                                                           |
| `src/data/clients.ts` / B         | `CLIENT_GUIDES: ClientGuide[]`                                                                                                                                                                            |
| `src/data/source-details.ts` / B  | `SOURCE_DETAILS: SourceDetail[]`                                                                                                                                                                          |
| `src/data/workflows.ts` / B       | `WORKFLOWS: Workflow[]`                                                                                                                                                                                   |
| `src/data/faq.ts` / B             | `FAQS: FaqEntry[]`                                                                                                                                                                                        |
| `src/data/copy.ts` / B            | `COPY` object with `hero`, `sources`, `evidence`, `connect`, `maintenance`, `footer`, `states` keys; content uses approved copy                                                                           |
| `src/lib/urls.ts` / coordinator   | `siteHref(path: string, basePath?: string): string`, `assetHref(path: string, basePath?: string): string`, `canonicalUrl(path: string): string`, `stripBase(pathname: string, basePath?: string): string` |
| `src/lib/catalog.ts` / A          | `filterSources(servers: readonly ServerEntry[], details: readonly SourceDetail[], query: string, category: ServerCategory \| 'all'): ServerEntry[]`                                                       |

`SITE.buildYear` comes from one build environment value shared by SSR and browser (not separate current-date calls). G0 uses a fixed value for dev. `FEATURED_NAMESPACES`: gnomad, clinvar, clingen, hpo, uniprot, pubtator. The semantic leaf strings of `COPY` are frozen when B1 lands, before A starts final homepage composition. A may use exact spec literals before that gate, but must replace duplicates with COPY during integration.

Freeze COPY leaf names in G0 using the following `SiteCopy` interface in contracts.ts; B1 supplies final string values from the copy specification. A1 can use G0's approved literal values through these keys immediately. Further keys require a coordinator amendment; do not let inference from a temporary empty object define the public API.

```ts
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
```

`COPY` is exported as `SiteCopy`. Dynamic counts use explicit small formatters in the consuming component with singular/plural handling; no untyped template engine is introduced. NoRecipeBody may substitute the selected client's reviewed label as escaped text. Other whole-page copy remains in page data and the approved copy document.

URL helper rules: input paths are internal and root-relative; reject protocols, protocol-relative URLs, traversal and malformed base values. `siteHref('/sources/gnomad/', '/genefoundry/')` → `/genefoundry/sources/gnomad/`. `siteHref('/#connect', '/genefoundry/')` → `/genefoundry/#connect`. Canonicals strip queries/fragments and always use the production origin. Do not silently strip an arbitrary existing prefix twice; callers supply unprefixed registry paths. `assetHref('/fonts/archivo-latin-600.woff2')` applies the same base discipline. `stripBase` removes exactly the configured prefix and preserves root semantics; paths outside a non-root base resolve to no registered page. Map only finite safe registry paths to build filesystem paths.

All `SOURCE_DETAILS.namespace` joins must match exactly one server; all server entries require one detail. All clients and workflows get one page each. Duplicate path, invalid date, absent required source-specific field, unreviewed terms reference, broken internal destination or verified recipe without evidence is a content/build failure. Unknown data does not become a false statement: use documented limitations and an explicit null rather than falsifying content.

## Component contracts and owners

| Component / owner                                                                 | Props / responsibilities                                                                                                                |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `App.vue` / coordinator                                                           | `{ page: PageDefinition }`; mounts NavBar, one page component, FooterSection; no browser globals in setup                               |
| `HomePage.vue` / A                                                                | No props; composes final hero, preview, workflows, ConnectSection, maintenance, FAQ                                                     |
| `SourceIndexPage.vue` / A                                                         | No props; heading plus ServerCatalog                                                                                                    |
| `SourceDetailPage.vue` / A                                                        | `{ source: ServerEntry; detail: SourceDetail }`                                                                                         |
| `ServerCatalog.vue` / A                                                           | No required props; complete registry with progressive filters                                                                           |
| `SourceList.vue` / A                                                              | `{ sources: readonly ServerEntry[] }`; display-only source records                                                                      |
| `HeroSection.vue`, `NavBar.vue`, `FooterSection.vue` / A                          | No required props; use shared URL/copy helpers                                                                                          |
| `ConnectSection.vue` / B                                                          | `{ initialClientId?: ClientId }`; selection starts deterministically at supplied ID or claude-code                                      |
| `ClientGuidePage.vue` / B                                                         | `{ guide: ClientGuide }`                                                                                                                |
| `ConnectIndexPage.vue`, `WorkflowIndexPage.vue` / B                               | No props; complete static navigation with content                                                                                       |
| `WorkflowPage.vue` / B                                                            | `{ workflow: Workflow }`                                                                                                                |
| `EvidenceTrace.vue` / B                                                           | `{ workflow: Workflow; compact?: boolean }`; truthful semantic figure, no live call                                                     |
| `FaqSection.vue` / B                                                              | `{ items: readonly FaqEntry[] }`; native details with readable static content                                                           |
| `AboutPage.vue`, `LimitationsPage.vue`, `ImprintPage.vue`, `NotFoundPage.vue` / B | No props; static content from shared records/approved existing legal text                                                               |
| `ui/CommandCard.vue` / B                                                          | Preserve `{ command: string; label?: string; prompt?: string }`; add `{ copyKind?: 'endpoint' \| 'setup' }` for correct success wording |

Source imports/types live in `src/data/servers.ts`; new common types in `contracts.ts`. Use `<script setup lang="ts">`. All page components live in `src/pages/`. Coordinator creates compiling skeletons once during G0, then hands file ownership to A/B. Skeleton content carries a development-only fixture marker blocked by the artifact validator; it must never become a shippable page. No worker silently creates a new public interface or edits another owner's component.

Clipboard interface remains `useClipboard(resetMs = 2000): { copied: Ref<boolean>; pending: Ref<boolean>; error: Ref<string | null>; copy: (text: string) => Promise<void>; reset: () => void }`. B owns the implementation and all consumers. `reset` clears timers/status on content change; stale asynchronous completions are ignored using an operation counter. Tests cover the previous request finishing after a new selection.

## Build interface — owner C

Build-only verification ledger: `docs/superpowers/execution/verification-ledger.json` is authored by B and read only by Node build validation. Shape: `{ "records": [{ "id": "opaque-review-id", "kind": "client" | "workflow", "subjectId": "catalog-or-client-id", "reviewedAt": "ISO-date", "evidencePath": "development-relative-path" }] }`. These quoted examples describe schema values, not preapproved evidence. A verified public record must join exactly one matching ledger entry whose reviewed date/subject agree and whose sanitized JSON evidence exists under `docs/superpowers/execution/verification/`. Ledger evidence paths are repository-relative and may not escape that directory. The Docker builder must receive this ledger and evidence despite the existing documentation exclusions; the runtime image receives only the public artifact. An illustrative workflow/documentation-only guide has no execution review ID and needs no execution record. A forged ID or missing file fails publication. No credentials, tokens or personal data belong in the ledger or evidence.

`src/lib/validation.ts` is coordinator-owned and exports `validateContent(input, options): void`, where input is `{ servers: readonly ServerEntry[]; details: readonly SourceDetail[]; clients: readonly ClientGuide[]; workflows: readonly Workflow[]; pages: readonly PageDefinition[] }` and options is `{ publication: boolean }`. It validates structure, joins, dates and public state invariants only. C's Node artifact validator additionally loads the build-only ledger and checks execution-evidence joins. This separation prevents browser imports of filesystem evidence. Development fixtures are allowed only when publication is false; a production build always sets it true.

`src/entry-server.ts` exports `render(page: PageDefinition): Promise<string>`, `PAGES` and `SITE`. Each render creates a fresh Vue SSR app. `scripts/prerender.mjs` exports `prerender({ templatePath, serverEntry, outDir }): Promise<void>`. `scripts/compress.mjs` exports `compressDirectory(outDir): Promise<void>` and can be called from `scripts/build.mjs`. `scripts/validate-artifacts.mjs` exports `validateArtifacts({ outDir, basePath }): Promise<void>` and supports CLI `--dir` and `--base`.

`src/lib/metadata.ts` exports `pageHead(page: PageDefinition): string` and `schemaFor(page: PageDefinition): object[]`; C owns it. Its SSR export may re-export these helpers for the Node prerender script. Head generation reads approved page data and never interpolates raw unescaped content. Client code does not regenerate already correct head tags on mount.

Template markers: exactly one `<!--page-head-->` in head; exactly one `<!--app-html-->` inside `<div id="app">`. Development uses an empty client mount. Static build replaces both markers before PWA hashing. Unknown routes hydrate NotFoundPage with noindex; `404.html` is not in the sitemap or precache.

Build envs: `VITE_BASE_URL` explicit `/` or `/genefoundry/`; `VITE_BUILD_YEAR` one generated integer passed consistently to both build phases. Production identity is not derived from localhost or mirror URLs. Do not include local evidence files, design contracts or source-only fixtures in public output.

## Release disposition

The website can truthfully publish documentation-only client guides. That does not satisfy a claim of tested support for those clients. The handoff must list the exact verified clients and the documentation-only clients separately. A future full-activation milestone requires recorded execution of each supported recipe; this planning task does not conceal that dependency.
