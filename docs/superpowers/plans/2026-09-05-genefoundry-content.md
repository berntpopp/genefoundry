# GeneFoundry Content, Onboarding and Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish precise source/client/workflow content and reliable setup interactions without unsupported claims.

**Architecture:** Worker B owns editorial records, all setup/evidence components and reading pages. A consumes frozen data and B's components; C renders their static content and metadata. One claims ledger determines whether a recipe/result is illustrative, documented or actually tested.

**Tech Stack:** Vue 3, TypeScript, native select/details, clipboard APIs, Vitest, Playwright and axe.

**Spec:** [Design](../specs/2026-09-05-genefoundry-design.md), [contracts](../specs/2026-09-05-genefoundry-contracts.md), [publication copy](../specs/2026-09-05-genefoundry-copy.md); execute within [master plan](2026-09-05-genefoundry-modernization.md).

## Global Constraints

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

---

## B1 — Source, client, copy and workflow records

**Depends:** G0; overlaps A1/C1. This is the main content dependency, so publish reviewed source data and COPY before polishing prose unrelated to consumers.

**Files:** modify `src/data/servers.ts`; create `clients.ts`, `source-details.ts`, `workflows.ts`, `faq.ts`, `copy.ts`; `tests/unit/content.test.ts`; editorial ledger `docs/superpowers/execution/content-verification.md` and build-only execution map `docs/superpowers/execution/verification-ledger.json`.

**Consumes:** frozen common types, current catalog, approved copy, category CSS agreement from A. **Produces:** CLIENT_GUIDES, SOURCE_DETAILS, WORKFLOWS, FAQS, COPY with no development fixtures.

- [ ] Inventory every current server and representative tool against its linked integration/upstream documentation. Record source URL, actual review date, what was checked, and limitations. Correct the misleading live-sync comment in servers.ts to describe maintained inventory. Preserve 21 current entries unless evidence supports a documented catalog correction; inform coordinator before counts/routes change.
- [ ] Populate SourceDetail for every namespace with actual purpose, research tasks, meaningful aliases, identifier forms supported by docs, limitations and terms references. Null dataVersion is valid; invented version is not. At minimum review gnomAD, ClinVar and HPO individually in depth. A source page must explain its unique task/limits rather than repeat a fixed paragraph. Use primary linked docs, not an AI-generated source summary as evidence.
- [ ] Verify current first-party client docs for all six IDs. For Codex/OpenAI behavior, use the openai-docs skill and local CLI help first as applicable. Check transport, scope, account prerequisites, auth workflow and exact syntax. Only run login with authorized available credentials; do not request or record secret values. Runtime test records must name client/version or explicitly version-unavailable hosted platform, date and sanitized evidence path.
- [ ] Set each record to `documentation-only` with `code:null` until its recipe test exists. Preserve endpoint, relevant official docs and the exact honest fallback copy. When a recipe really passes, use `verified`, nonempty code and recipeTest; include specific prerequisite limitations. Do not conflate a reachable /health with authenticated tool discovery.
- [ ] Populate COPY from publication text, replacing bound counts from existing exports. Define and freeze exact nested COPY leaf keys before A3; notify coordinator and A. FAQ remains one array for visible rendering/schema. WORKFLOWS uses only `variant-evidence` and `phenotype-rare-disease`, both illustrative with null executionReviewId; include no fabricated request/response or clinical interpretation.
- [ ] Add content-validation regressions (use the frozen validateContent export from src/lib/validation.ts; C separately checks private ledger joins):

```ts
import { expect, test } from 'vitest'
import { CLIENT_GUIDES } from '../../src/data/clients'
import { WORKFLOWS } from '../../src/data/workflows'
test('documentation-only guides cannot expose an executable recipe', () => {
  for (const guide of CLIENT_GUIDES) {
    if (guide.recipeState === 'documentation-only') {
      expect(guide.code).toBeNull()
      expect(guide.recipeTest).toBeNull()
      expect(guide.steps.length).toBeGreaterThan(0)
    } else {
      expect(guide.code.trim()).not.toBe('')
      expect(guide.recipeTest.verificationId.trim()).not.toBe('')
    }
  }
})
test('illustrations never assert that an execution occurred', () => {
  expect(WORKFLOWS.map((w) => w.id).sort()).toEqual(['phenotype-rare-disease', 'variant-evidence'])
  for (const workflow of WORKFLOWS) {
    if (workflow.exampleKind === 'illustrative') expect(workflow.executionReviewId).toBeNull()
  }
})
```

Also reject duplicate IDs, absent source-detail joins, invalid review dates and unregistered internal links. These tests validate publication safety, not word-for-word copy styling.

- [ ] Run `npm test -- tests/unit/content.test.ts tests/unit/contracts.test.ts`, type check and scoped data lint. Deliver source/claims ledger and explicit verified/documentation-only client list. Request coordinator commit; publish B1 interface freeze to A/C.

**Gate:** every required page has meaningful content; unknown runtime facts have honest states. No development fixtures or universal “Every/No signup” claims remain in shipping records.

## B2 — Client selection, clipboard and illustrative trace

**Depends:** B1 and A1 tokens. Build these independently of A's page composition.

**Files:** modify ConnectSection.vue, ui/CommandCard.vue, useClipboard.ts and its barrel; create EvidenceTrace.vue; remove unused ConsoleDemo.vue/HowItWorks.vue after A/coordinator removes imports. Tests `tests/e2e/onboarding.spec.ts`, `evidence.spec.ts`.

**Consumes:** all common contracts, client/workflow/COPY records, URL helpers. **Produces:** accessible native client selection, reliable local copy states, semantic evidence figure.

- [ ] Add failure-path tests before changing clipboard behavior:

```ts
import { expect, test } from '@playwright/test'
test('clipboard denial exposes manual recovery', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException('Denied', 'NotAllowedError')
        }
      }
    })
  )
  await page.goto('/connect/')
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
  await expect(page.getByText('Endpoint copied', { exact: true })).toHaveCount(0)
})
test('legacy fallback never claims a false copy', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    document.execCommand = () => false
  })
  await page.goto('/connect/')
  await page.getByRole('button', { name: 'Copy endpoint', exact: true }).click()
  await expect(page.getByText('Couldn’t copy. Select and copy the text manually.')).toBeVisible()
})
```

Run those against the initial implementation and record the failure. Add success using a writeText stub that records only the supplied expected endpoint; never read the machine clipboard.

- [ ] Implement clipboard state with operation counter, pending/error/copied and reset. Return value of execCommand matters. Restore focus/selection and clean temporary elements on both outcomes. Announce exact success/error strings; retain readable selectable command. Abort or ignore stale completion after client/content changes and unmount.
- [ ] Add a race regression: delay a mocked writeText promise, change client/reset state, resolve the old promise, and assert no success attaches to the new content. Double-click while pending must not spawn contradictory states. Set a named code region focusable when it horizontally scrolls.
- [ ] Exercise verified-recipe presentation even when no real client is verified using B-owned `tests/fixtures/verified-guide.html` and `verified-guide.ts`. These are an isolated Vite dev fixture importing ClientGuidePage with synthetic props, never a PAGES entry or production entrypoint. Display “UI test fixture — not compatibility evidence”; use a harmless non-executable sample string and opaque test verification ID. Test recipe-copy success/error, correct setup label and reset using that fixture. Production validation rejects fixture markers and tests/fixture assets from dist. Screenshots are labeled UI test state and cannot be used to claim actual supported-client verification. Public screenshots show only the statuses actually published.
- [ ] Replace custom tabs with labeled native select. Selected guide starts from initialClientId or deterministic claude-code. Show OAuth note before endpoint/recipe copy. For unverified records show only endpoint/docs/fallback; for verified recipes show full correctly labeled code, test date/version and troubleshooting. Static guides and no-JS client links remain functional. Never infer the external client's connection status from a local selection or copy.
- [ ] Build EvidenceTrace as figure/caption + ordered semantic records and native details. Use approved illustration wording and gnomAD catalog reference. Compact hero mode may combine source/tool fields visually but keeps the copy's full meaning. No live request, terminal frame, automatic replay or fake JSON. Link to actual registered source and workflow pages.
- [ ] Add tests that all six select values lead to the correct guide/code status, endpoint remains absolute at mirror base, illustration label exists outside aria-hidden, all source links are real, no fake biomedical result is rendered, and details operate by keyboard. Axe scan settled default, selected guide and copy-error states.
- [ ] Run scoped onboarding/evidence tests, type check and lint. Capture client selector, copied/failed and documentation-only states at 390/1440. Commit only B2-owned files after coordinator review.

**Gate:** no silent denied copy or false success; no misleading universal CLI command; all clients are reachable through correct stated status; illustration is honest and accessible.

## B3 — Client, workflow, maintenance and imprint documents

**Depends:** B1/B2 and A1. Can be split into separate file groups after B2 if a worker slot is available; no shared data edits during that split.

**Files:** complete ConnectIndexPage.vue, ClientGuidePage.vue, WorkflowIndexPage.vue, WorkflowPage.vue, AboutPage.vue, LimitationsPage.vue, ImprintPage.vue, NotFoundPage.vue; create FaqSection.vue; remove ImprintModal.vue. Tests `tests/e2e/content-pages.spec.ts`.

**Consumes:** common page props, all reviewed records/COPY, URL helpers, A's shell/tokens, CommandCard/EvidenceTrace. **Produces:** all named reading-page templates and visible FAQ.

- [ ] Build client guide structure exactly: before you begin → setup status → add → sign in → check connection → troubleshooting → next steps. Code appears only in verified state. Official documentation and endpoint still make untested guides useful; no invented successful outputs. Add `id=troubleshooting` for selected-guide deep links.
- [ ] Build two substantive workflow pages from the approved outlines, with trace, input-requirement guidance, source/detail links and limitations. Clarify gene versus variant identity and ontology association versus diagnosis. Do not add an executable argument schema without source verification.
- [ ] Build About/Limitations with the reviewed maintainer, repo/contact and source boundaries. Render FAQ with native details; answers are in static HTML and match the shared dataset. Avoid a duplicated generic feature/claims grid.
- [ ] Move existing imprint text verbatim into semantic EN/DE sections at /imprint/, preserving links and setting language attributes. Persistent inline underlines and wrapping URLs fix the prior link/reflow defects. Do not revise legal wording or fabricate a privacy page. Delete old modal and its listeners only after A's footer points to the new document and coordinator confirms no imports.
- [ ] Build a genuinely distinct NotFoundPage with the approved explanation and Sources/Home recovery links. It must not import the homepage or show a success title; C determines actual HTTP status.
- [ ] Add a representative no-JS regression:

```ts
test('client and imprint documents are useful without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(new URL('connect/codex/', baseURL).href)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Codex')
  await expect(page.getByText('https://genefoundry.org/mcp', { exact: true }).first()).toBeVisible()
  await page.goto(new URL('imprint/', baseURL).href)
  await expect(page.locator('[lang="de"]')).toContainText('Impressum')
  await context.close()
})
```

Author this test for the static-root/static-mirror projects and execute at G1 on the completed C-built artifact, not the dev skeleton. B3 component completion does not depend on this later acceptance run. Extend to every page kind and FAQ answer presence. Browser language navigation, no modal trigger, long URLs and error recovery need explicit assertions.

- [ ] Run B dev tests/content checks/type/lint, record artifact tests pending G1, and provide the component-completion review packet and list every documentation-only guide. Pass reviewed components to A3 and C. No hidden unfinished claims.

**Component-completion gate for A3:** all page components and records compile and render in dev; legal content is preserved and accessible; final copy matches component states. Author the no-JS tests now, but execute their acceptance at G1 after A3/C2 complete and production validation succeeds. There is no publication-validation bypass for unfinished pages. **Integrated acceptance:** substantive static documents exist for every route and final metadata matches. A successful route render is not proof of a client login or biomedical correctness.

## Independent B review after G1

Read final built pages with JS disabled and enabled. Compare to claims ledger, copy and references. Check bounded counts/auth wording, source terms, recorded review dates, illustration labels and real links. Verify no unreviewed code was promoted to verified during integration. Report each discrepancy with page/file and correction; the coordinator assigns edits back to the owner.
