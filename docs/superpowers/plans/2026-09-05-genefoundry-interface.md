# GeneFoundry Interface and Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the distinctive scientific registry, concise homepage and accessible source discovery at desktop/mobile sizes.

**Architecture:** Worker A owns global presentation, shell and all discovery components; B supplies frozen source/copy/evidence records and components. Native semantic HTML carries navigation and records; CSS adapts layout without switching SSR trees.

**Tech Stack:** Vue 3, TypeScript, Tailwind 4, Archivo/Inter, Vitest, Playwright.

**Spec:** [Design](../specs/2026-09-05-genefoundry-design.md), [contracts](../specs/2026-09-05-genefoundry-contracts.md), [copy](../specs/2026-09-05-genefoundry-copy.md); execute within [master plan](2026-09-05-genefoundry-modernization.md).

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

## A1 — Visual system, font and accessible shell

**Depends:** G0; can overlap B1 and C1.

**Files:** modify `src/style.css`, `src/components/NavBar.vue`, `FooterSection.vue`; create `public/fonts/archivo-latin-600.woff2`, `public/fonts/archivo-OFL.txt`, `docs/superpowers/execution/font-provenance.md`; test `tests/e2e/visual.spec.ts`.

**Consumes:** SITE, URL helpers, design token names, source category IDs. **Produces:** stable visual foundation, native responsive navigation, direct imprint link, shared category classes.

- [ ] Add a browser regression for the actual audit failures before replacing the shell:

```ts
import { expect, test } from '@playwright/test'
test('mobile navigation dismisses and the page survives text enlargement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByLabel('Open navigation')
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(page.getByLabel('Open navigation')).toBeFocused()
  await page.addStyleTag({ content: 'html{font-size:200% !important}' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
```

Run `npm run test:e2e -- tests/e2e/visual.spec.ts`; the baseline should fail because its menu/reflow does not meet the contract. If skeletons already changed selectors, record that it fails on the missing required behavior, not merely a typo.

- [ ] Obtain the licensed normal-width Archivo 600 Latin WOFF2, verify font identity/weight and size ≤50 kB, retain OFL and exact download provenance. Keep existing Inter resources; remove unused display-serif preloads via request to C, not an edit to index.html.
- [ ] Implement CSS-first semantic tokens and type/space roles from the spec, with exact typography and accessible category classes. A representative configuration:

```css
@theme {
  --color-canvas: #f6f5f1;
  --color-ink: #182325;
  --color-muted: #52616b;
  --color-brand: #a23570;
  --color-code: #111119;
  --font-display: 'Archivo', Arial, sans-serif;
}
html {
  scroll-padding-top: 5.5rem;
}
body {
  background: var(--color-canvas);
  color: var(--color-ink);
}
:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
}
.source-record > *,
.site-grid > * {
  min-width: 0;
}
.endpoint {
  overflow-wrap: anywhere;
}
```

Define remaining tokens exactly from the design table. Do not retain an `overflow-x:clip` page-level safety net to hide broken layout. Remove obsolete glow/grid/marquee/float/serif utilities after all old consumers are removed; do not delete useful unrelated behavior.

- [ ] Rebuild NavBar with a solid header, normal logo/home link and native mobile `details/summary` disclosure enhanced for Escape/selection closing and focus restoration. The menu remains usable without JS. All six link destinations use base-aware URL helpers; external GitHub remains absolute. Remove setup-time window access and decorative logo animation. Use CSS responsive layouts, not viewport-dependent initial rendering.
- [ ] Rebuild Footer with direct `/imprint/` link, wrapping endpoint, visible maintenance/limits/contact and no unused modal/scroll-lock state. B moves legal content; A does not rewrite it. Preserve required link destinations and old fragment aliases agreed with coordinator.
- [ ] Run the scoped browser regression, `npx eslint src/components/NavBar.vue src/components/FooterSection.vue`, and type check. Capture 390/1440 shell screenshots after fonts settle; report token/font deviations. Request coordinator commit of A1-owned files only.

**Gate:** A/B share a real working token system; no global color invention downstream. Header, footer and keyboard navigation work before final marketing composition.

## A2 — Searchable full registry and source detail views

**Depends:** A1 and B1 source/content records. Full browsing tests can be authored using catalog fixture records while B1 researches.

**Files:** modify `src/components/ServerCatalog.vue`; create `SourceList.vue`, `src/lib/catalog.ts`; complete `src/pages/SourceIndexPage.vue`, `SourceDetailPage.vue`; tests `tests/unit/catalog.test.ts`, `tests/e2e/discovery.spec.ts`.

**Consumes:** SERVERS, SOURCE_DETAILS, CATEGORIES, filterSources contract, siteHref, reviewed copy. **Produces:** full directory, progressive search/filter state, every source detail template.

- [ ] Write meaningful filter tests:

```ts
import { expect, test } from 'vitest'
import { filterSources } from '../../src/lib/catalog'
import { SERVERS } from '../../src/data/servers'
import { SOURCE_DETAILS } from '../../src/data/source-details'
test('source search intersects research area and can reset', () => {
  expect(
    filterSources(SERVERS, SOURCE_DETAILS, ' GNOMAD ', 'variant').map((x) => x.namespace)
  ).toEqual(['gnomad'])
  expect(filterSources(SERVERS, SOURCE_DETAILS, 'gnomad', 'literature')).toEqual([])
  expect(filterSources(SERVERS, SOURCE_DETAILS, '', 'all')).toHaveLength(SERVERS.length)
})
test('task aliases are useful without executing a biomedical query', () => {
  expect(
    filterSources(SERVERS, SOURCE_DETAILS, 'phenotype', 'ontology').some(
      (x) => x.namespace === 'hpo'
    )
  ).toBe(true)
})
```

Run `npm test -- tests/unit/catalog.test.ts`, observe failure, then implement pure normalized token matching with stable catalog order. Query handling must not execute regex supplied by the user.

- [ ] Build SourceList as `ul > li > article`, with source/detail heading link, task, listed count and readable field labels. Use CSS columns on wide screens and labeled stacked records on narrow screens. Do not make nested whole-card links or duplicate tiny link targets.
- [ ] Build ServerCatalog inputs: Search sources; Research area select; count region; Clear search; Clear filters. Match count/empty/error copy exactly. Restore query/category after mount from URL and synchronize via replaceState; do not mutate URL while prerendering. Cap input at 200 characters and keep long/hostile input as plain text; reset invalid category to All. Back/forward navigation restores via URL rather than hidden global state.
- [ ] Build the source-detail page with real content fields, terms/upstream/repo links, reviewed date and explicit unknown version. Link listed sampleTool as a catalog reference, not an executed result. The source heading/metadata come from matched props; missing joins fail at build, not an empty production card.
- [ ] Add browser test:

```ts
test('full source directory keeps search recoverable', async ({ page }) => {
  await page.goto('/sources/')
  await page.getByLabel('Search sources').fill('gnomad')
  await expect(page.getByRole('status')).toContainText('1 source found')
  await page.getByLabel('Research area').selectOption('literature')
  await expect(page.getByText('No sources match your search.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.locator('[data-testid="source-record"]')).toHaveCount(21)
})
```

The test fixture baseline has 21; derive the assertion from SERVERS in the committed test to avoid catalog maintenance drift. Also test direct query link, unknown category, special characters, reload/back, keyboard-only filtering, every source detail link and all content without JS.

- [ ] Run unit/discovery tests, type check and scoped lint. Capture full directory/detail at 320/390/768/1440, with 200% text and keyboard focus. Review and commit A2 file scope.

**Gate:** all listed sources are discoverable; source pages contain individually reviewed substance from B1, and the directory is complete without JS.

## A3 — Final homepage and visual integration

**Depends:** A2, B2 EvidenceTrace/ConnectSection, B3 FaqSection and reading routes. Can start static composition before dependencies finish, but cannot declare complete with fixtures.

**Files:** complete `src/pages/HomePage.vue`, `HeroSection.vue`; remove unused TrustBar/FeatureGrid/CtaSection/SectionLabel components only after confirming zero imports; extend `tests/e2e/visual.spec.ts`.

**Consumes:** COPY, FEATURED_NAMESPACES, all shared records, EvidenceTrace/ConnectSection/FaqSection contracts. **Produces:** complete homepage with the exact first-viewport contract and consistent downstream surfaces.

- [ ] Assemble the published order: hero/evidence, six-row source preview + GET search, two workflow summaries, setup, maintenance, FAQ/footer. Give the hero `id=intro` and `aria-labelledby=intro-title`, with that ID on its H1. Place `id=connect` on one unique section. Preserve old fragment navigation via semantic target aliases. Root App owns no second header/footer inside HomePage.
- [ ] Use the exact approved headline/lead/requirements. Build the 7:5 desktop hero with a 56 px Archivo headline and plain figure; 36 px mobile headline and primary action before evidence. Use whitespace deliberately, no forced viewport-height stage. Source preview search submits to the full directory and does not misleadingly filter six records in place.
- [ ] Remove obsolete duplicated count bands, old universal command CTAs, fake terminal and background decorations. Keep needed architecture facts in workflow/limitations text. Run `rg` for old component imports and universal phrases; review matches in context rather than blindly rewriting source names.
- [ ] Add focused viewport test:

```ts
test('mobile first viewport exposes the primary action and requirements', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const action = page
    .locator('#intro')
    .getByRole('link', { name: 'Connect your client', exact: true })
  const box = await action.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(844)
  await expect(page.locator('#intro').getByText(/Browser sign-in required/)).toBeVisible()
})
```

Scope the committed locator to the hero to avoid accidentally passing on a navigation CTA. Do not apply the first-viewport height condition at enlarged text sizes; assert readable reflow there.

- [ ] Run all A tests and pass final screenshots to an independent visual reviewer with the surface contract and references. Review hierarchy, source-specific character, text measure, record density, mobile order, contrast and focus. These checks cannot be replaced with a count of forbidden CSS classes.
- [ ] Apply one cohesive set of material findings, recapture affected viewports and return the review packet. Coordinator integrates and writes final DESIGN.md from the built result.

**Gate:** a source/evidence product is visually recognizable; rendering is not the old template with a new palette. Tests and screenshot review both support completion.
