# GeneFoundry website modernization specification

Current implementation follows the [user-directed usage revision](2026-09-05-usage-revision.md), which supersedes conflicting original requirements.
Status: implementation-ready proposal, 5 September 2026. The user approved planning the audit recommendations and selected **warm light pages with dark code panels**. This specification and its execution plans do not claim that a redesign has been implemented.

## 1. Outcome and authority

Build a modern scientific registry and connection guide for GeneFoundry. A researcher should understand the gateway, identify a relevant source, and reach the correct client instructions. An experienced integrator should reach setup in one action. Beauty comes from a distinctive evidence-record composition, readable typography, precise alignment and meaningful scientific content.

Authority order: explicit user direction → this design specification and [shared contracts](2026-09-05-genefoundry-contracts.md) → [copy specification](2026-09-05-genefoundry-copy.md) → accepted audit → research recommendations. The shared contracts supersede draft interfaces in architecture research. Any execution change to public types, routes, global tokens or claims must be integrated by the coordinator before dependent workers continue.

Product truth: [PRODUCT.md](../../../PRODUCT.md). Baseline: [website audit](../../audits/2026-09-05-website-review.md), revision `53d6ce27f1c60c2fb0422b2f05f9752e3dce8b77`. Preserve actual source inventory, endpoint, source/repository links, research-use boundary, GeneFoundry name/logo and magenta recognition. Audience mix remains an explicitly stated planning assumption; no user study or conversion evidence is invented.

## 2. Requirements with stable IDs

| ID  | Requirement                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------- |
| R01 | Distinctive warm-light scientific registry; dark code panels; responsive, coherent visual system            |
| R02 | Complete approved copy; bounded coverage and consistent OAuth/client expectations                           |
| R03 | Honest static evidence trace and two useful workflow guides; no fabricated biomedical output                |
| R04 | Full 21-source registry, search/category intersection, state recovery, substantive source detail pages      |
| R05 | All six client guides, visible authentication before copy, accurate verification status, reliable clipboard |
| R06 | Keyboard, screen-reader semantics, 320 px reflow, text enlargement, reduced motion and comfortable targets  |
| R07 | Static HTML for every public route, safe hydration, ordinary links and both deployment bases                |
| R08 | Correct metadata, canonicals, sitemap, counts, social image and visible FAQ; meaningful SEO destinations    |
| R09 | Genuine 404 delivery, correct compression/caching, PWA freshness and preserved backend route ownership      |
| R10 | Reproducible behavior/content/artifact tests, visual review and performance evidence                        |
| R11 | Maximum safe parallel execution with frozen contracts and exclusive ownership                               |
| R12 | Maintenance, limitations and accessible imprint; no invented legal/privacy promises                         |

## 3. Research and selected design

[Rendered research](../research/2026-09-05-visual-references.md) contains four inspected desktop captures and mobile observations. These references calibrate craft, not imitation:

- [EMBL Research](https://www.embl.org/research/): prominent plain headings and an unboxed directory. Transfer the hierarchy, not photography or institutional authority.
- [gnomAD](https://gnomad.broadinstitute.org/): source-specific tasks and identifiers. Transfer useful search labels and version context, not a dense top bar or the implication that this website executes a query.
- [Our World in Data](https://ourworldindata.org/): research figures with captions and attribution. Transfer evidence prominence, not its news grid, colors or serif brand.
- [uv installation](https://docs.astral.sh/uv/#installation): exact setup in readable code surfaces. Transfer operational clarity, not another product's commands or theme.

Seven grounded forms were considered: (1) museum accession catalogue, (2) genomic track annotation, (3) scientific atlas spread, (4) methods protocol, (5) source/discovery trace, (6) illustrated field guide, (7) library subject catalogue. These span records, analytical notation, editorial publications and procedural interfaces. Impeccable seed `ea1f0301` selected form 5, which fits the approved registry direction. The trace becomes a real information structure: question → discover relevant tools → inspect source documentation. It is not a mock terminal or an execution animation.

The borrowed discipline is priority-based information reduction on narrow screens and durable identity of source records. Decorative kit typography, ceramic texture, risograph effects and phosphor-terminal styling do not fit the pinned reading surface or the site's task. No random stylistic motif overrides the user's selected direction. A generated raster comp is not required for this planning deliverable; the written first-viewport contract, reference evidence and future rendered review define the implementation bar. No standing image-generation workflow preference is invented.

## 4. Visual system

The visitor is reading source and setup material on a laptop or phone in ordinary working light. Use a warm, near-white surface for extended reading, with a dark surface only around executable syntax.

| Token            | Value     | Usage                                              |
| ---------------- | --------- | -------------------------------------------------- |
| `canvas`         | `#F6F5F1` | Page background                                    |
| `surface`        | `#FFFFFF` | Input fields and selected task surfaces            |
| `ink`            | `#182325` | Main text                                          |
| `muted`          | `#52616B` | Secondary text, captions                           |
| `rule`           | `#D8DCD7` | Decorative separators, never sole control boundary |
| `control-border` | `#748079` | Essential input boundaries                         |
| `brand`          | `#A23570` | Primary action, selection, important link          |
| `brand-hover`    | `#85285A` | Hover/active primary action                        |
| `brand-tint`     | `#F6E7EF` | Selected surface with a label/border               |
| `code`           | `#111119` | Command background                                 |
| `code-text`      | `#E8E8ED` | Command foreground                                 |
| `code-muted`     | `#A4AFB8` | Code caption                                       |
| `success`        | `#21634B` | Confirmed local action success, with text          |
| `error`          | `#A72D32` | Action failure, with text                          |

Calculated solid-color contrast: ink/canvas 14.74:1; muted/canvas 5.87:1; brand/canvas 5.87:1; white/brand 6.40:1; code-text/code 15.38:1. These are token calculations, not a completed rendered-state accessibility audit. Recheck hover, disabled, focus and opacity combinations. Use a 2 px brand focus ring with 3 px offset; dark surfaces get a clearly visible light outline. Controls do not depend on a pale divider for their boundary.

**Typography:** Archivo 600, normal width, H1/H2 only; self-hosted existing Inter for body, navigation and metadata; system monospace for actual code/identifiers. Obtain Archivo from its [official publisher](https://www.omnibus-type.com/fonts/archivo/), retain the [OFL license](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt), and record asset provenance. One display weight is enough. Inter is retained for legibility and asset economy, not used as the sole source of identity. No repeated italic serif emphasis, all-caps slogan, condensed display or novelty mono heading.

| Role             | Desktop      | Mobile       | Additional rule                                      |
| ---------------- | ------------ | ------------ | ---------------------------------------------------- |
| H1               | 56 px / 1.06 | 36 px / 1.08 | Clamp between endpoints; max 18ch; -0.025em tracking |
| H2               | 36 px / 1.15 | 28 px / 1.18 | Sentence case; no decorative highlighted word        |
| H3               | 20 px / 1.3  | 20 px / 1.3  | Inter 600                                            |
| Lead             | 18 px / 1.6  | 17 px / 1.6  | About 55ch maximum                                   |
| Body             | 16 px / 1.6  | 16 px / 1.6  | Reading pages 68ch maximum                           |
| Caption/metadata | 14 px / 1.45 | 14 px / 1.45 | Avoid tiny letterspaced labels                       |
| Code             | 14 px / 1.65 | 14 px / 1.65 | Selectable; wraps or keyboard-scrolls locally        |

**Geometry:** 1200 px maximum outer content; 24 px mobile gutters, 16 px at 320; 32 px tablet; desktop gutters grow with viewport. Use an 8 px rhythm with 4 px for fine alignment. Section spacing 80 px desktop / 48 px mobile. Desktop columns share alignment with the navigation and registry. Primary controls minimum 44 px height, 8 px radius; input 8 px radius; evidence frame at most 12 px radius. Source records have rules, not individual card chrome. No decorative shadow; an overlay may use a subtle shadow to communicate elevation.

**Motion:** no automatic typing, glow drift, source marquee, floating logo or animated status dot. Use 120–160 ms color/opacity feedback where useful. Reduced motion removes movement while retaining readable state changes. No element slides on hover. No global microsecond animation-kill strategy is needed after decorative motion is removed.

## 5. First viewport and page topology

Desktop 1440×900: solid 72 px navigation, followed by a 1200 px-wide hero with approximately 7:5 columns. Copy occupies the left, evidence record the right. Top hero spacing 72 px; use explicit line measure, not forced `br` that isolates MCP at intermediate widths. Headline: **Biomedical data for your AI tools. One MCP connection.** Supporting text names a generated finite source count. The primary filled action is **Connect your client**; the secondary action is an ordinary underlined **Explore sources** link. The authentication/research-use note is visible next to the action. No command terminal competes with the headline.

The right column is a semantic figure: a research question, three ordered stages, and source records with named links. It says **Illustrative workflow — no query is run**. A source detail disclosure reveals a catalog-listed tool and upstream/repository links; it does not synthesize a biomedical answer. The figure is approximately 420 px high at desktop, with captions inside the same reading flow. The lower page starts visibly soon after the hero; avoid a full-screen empty stage.

Mobile 390×844: 64 px navigation → headline → concise support → primary action → authentication/research-use note → figure. Primary action must fit in the initial viewport at default text size. At enlarged text sizes prioritize reading and scrolling rather than a brittle first-screen constraint. No sticky bottom action obscures content. The figure stacks vertically in the same DOM order. Navigation is a labeled native `details` disclosure at narrow widths, enhanced for Escape and focus return; it remains usable without JS.

Homepage sequence:

1. Proposition, connection action and illustrative evidence trace.
2. **Biomedical sources**: six curated preview records (gnomAD, ClinVar, ClinGen, HPO, UniProt, PubTator3), plus a labeled source-search form submitting to `/sources/?q=...` and **View all sources**. Preview is not an incomplete in-place search universe.
3. Two linked research workflow summaries; no duplicated generic feature grid.
4. **Connect your client**: all six clients represented, host selector, prominent sign-in requirements, exact endpoint and selected guide. The primary action can anchor here directly; `/connect/` remains independently useful.
5. Maintenance, scope/limitations, visible FAQ and footer.

Navigation: Sources → `/sources/`; Workflows → `/workflows/`; About → `/about/`; GitHub → router repository; primary Connect → `/#connect` from home or `/connect/` from other pages. Use explicit labels rather than an ambiguous “Why”. Footer has direct source, workflow, connection, about, limitations, contact, repository, health and imprint destinations. Old fragments `#catalog`, `#how`, `#features` retain nonintrusive semantic target aliases or explicit anchor mapping to Sources, Workflows and Limitations; do not create invisible duplicate content.

## 6. Source discovery and content pages

The full `/sources/` directory contains every entry from `SERVERS` with local text search across source name, namespace, domain and curated aliases. Search is ordinary case-insensitive token matching, not biomedical inference. Whitespace trims; every query token must match the normalized record haystack; category intersects search. Stable order follows the catalog. Inputs update results without losing focus; count is announced politely after a short debounce. Query/category are shareable via query parameters and restored on navigation. Unknown categories reset to All; malformed or unusually long input does not crash. Render text escaped.

Provide labeled inputs, source/task/result-count metadata, clear search and **Clear filters**. Zero results retain query/category and offer recovery. All source links remain in static HTML without JS; display “Search and filters need JavaScript. Browse all sources below” only when JS is disabled. A static server cannot perform query filtering without JS, so do not promise server-side search. Initial hydration matches the default complete catalog; apply URL query state after mounting, avoiding mismatch.

Records use a semantic list with each source as an article and explicit labels. Desktop aligns source, research task, listed tools and details as grid columns. Mobile reorganizes those fields vertically; it does not shrink a desktop table. Source name and details link point to the same internal source page without duplicative tiny controls. Upstream/repository links live mainly on detail pages, keeping directory scan order clear.

Each of 21 `/sources/<namespace>/` pages contains: source name and purpose; specific research tasks; supported identifier forms documented by references; one catalog-listed tool without invented schemas; upstream resource, integration repository and source-term references; limitations; connection link; genuinely reviewed date/reference links. No new source version is invented. At least gnomAD, ClinVar and HPO get an individually reviewed task example. Other entries still require source-specific substance, not a repeated paragraph with the name replaced. Missing required source content fails publication validation rather than producing thin pages.

## 7. Connection, clipboard and evidence behavior

Client IDs and guides: `claude-code`, `claude-ai`, `codex`, `cursor`, `gemini`, `vscode`. These distinguish Claude Code from Claude web/Desktop and distinguish each client's file/command/config expectations. The copy specification supplies full wording and the verification ledger.

Use a labeled native select for all viewport sizes, with six fully visible choices when opened. This replaces the incomplete custom tab pattern; do not preserve `role=tab` without implementing its required behavior. Every guide also has a plain static link. Without JS, the connect index provides all six links and the endpoint, and each guide contains complete rendered instructions.

Every code recipe has `recipeState`. `verified` means current documented instructions and actual connection evidence for the named client/version exist. `documentation-only` contains endpoint plus official documentation and explicitly says **Documentation link only, no tested recipe**. In that state `code` is null and no setup-copy action appears; endpoint copying remains available. Never fill missing flags with a guessed command. All six routes must be useful and truthful even if a particular GUI client cannot be tested during execution. A release containing documentation-only guides must identify them in the handoff and must not claim six verified integrations.

Copy state: idle → pending → success or error. Report success only after resolved clipboard write or true legacy copy return value. Clear a previous error at a new attempt; restore the previous focused element/selection when using a temporary textarea. Expose polite success/error text next to the action, preserve the original text and provide manual-copy guidance. Copy feedback resets when selected content changes; stale timers must not attach a previous recipe's success to a new recipe. Do not request clipboard-read permission or expose existing clipboard contents.

Evidence uses `exampleKind='illustrative'` for this release's two workflows: `/workflows/variant-evidence/` and `/workflows/phenotype-rare-disease/`. Tool names are catalog references, not proof of a completed invocation. The diagram uses semantic HTML, not a bitmap of text. A later verified example requires saved request/response evidence, correct identifier/build/version, upstream link, actual review date and limitations before changing its label. No `af_popmax`, `cited:true`, fake result count, fabricated latency or status badge ships in the illustration.

## 8. Accessibility and operational reading

Target WCAG 2.2 AA with automated and human keyboard/visual review, not a certificate claim. One H1 and main per page, skip link visible on focus, ordered headings, named controls, text labels for status, persistent inline-link underlines. Focus ring is never clipped by containers. Copy/filters announce changes without excessive verbosity; user-controlled details maintain focus. Commands that exceed available width have `tabindex=0`, a useful accessible name and visible scroll affordance; endpoint display can wrap with `overflow-wrap:anywhere`.

At 320 px and at a 390 px viewport with 200% root text size, no document-wide horizontal overflow. Use `min-width:0` for grid children and allow long source labels/URLs to wrap. Test browser zoom separately from the text-resize stress fixture. Verify keyboard focus remains visible below the header. Controls aim for 44×44 px; verify actual WCAG target-size/spacing exceptions instead of asserting all sub-44 controls fail AA.

Replace the imprint modal with `/imprint/`, preserving existing EN/DE content without copywriter-authored legal changes. Both language sections are present in static HTML, use `lang=en/de`, heading anchors and an accessible language navigation. Footer becomes a link; delete unused modal listeners/scroll-lock logic. Removing the modal removes its focus trap obligation; acceptance verifies no remaining modal trigger or overlay. Other future dialogs require native-dialog or fully managed focus behavior.

## 9. Technical delivery and SEO

Use the existing Vue 3/TypeScript/Tailwind 4/Vite stack. Generate finite static HTML using Vue `renderToString` at build time and hydrate with `createSSRApp`; no runtime server, framework migration, CMS, arbitrary markdown pipeline or router dependency. Ordinary page links provide navigation and browser back/forward. Keep browser-only APIs inside lifecycle/event paths. No timestamps, random values, viewport-dependent DOM or timers during SSR. Fresh app per rendered page; static metadata and content come from the same data records.

Routes: homepage; source/client/workflow indexes; 21 source details; six client details; two workflows; about, limitations, imprint; separate `404.html`. Current total: 36 indexable routes on production plus the error document. Generate totals from data. `/docs`, `/redoc`, `/openapi.json` and backend/auth paths are reserved.

HTML contains one title/description/canonical, language, coherent OG/Twitter metadata and visible page content. Use conservative WebSite, Organization/project identity, WebPage and breadcrumb schema; source entries may use accurate Dataset references only where factual support exists, not invented dataset ownership. FAQ schema, if retained, is generated from visible answers; no HowTo/FAQ rich-result promise. Escape HTML attributes and safely serialize JSON-LD including `<` and script-closing sequences. Metadata must not include planning contracts, test tokens or hidden promotional text.

Production canonical origin is `https://genefoundry.org`. Root build uses `/`; GitHub Pages mirror uses `/genefoundry/` for document/assets/manifest/SW links but canonical URLs point to production equivalents. Mirror documents are `noindex,follow`; root production is indexable. Query variants canonicalize to their base content page. Generate sitemap only for indexable production records; modified dates reflect actual content review/change, not every build. robots permits crawling needed to see noindex; do not combine mirror noindex with crawl blocking. Generate catalog counts in machine files/PWA description from one source. Social image is updated to the approved concise copy with the real mark, no invented statistics, at 1200×630 with PNG dimensions checked.

Build order: SSR bundle → browser bundle → awaited prerender/head/machine files → PWA worker generation using final bytes → compression sidecars → artifact validation. Vite PWA 1.3.0's installed sequential closeBundle hook supports `integration.closeBundleOrder='post'`; prerender is sequential `pre`. Do not mutate precached originals after worker generation. One registration path only. Disable homepage navigation fallback; no API/auth cache. Preserve useful offline static pages without implying saved biomedical responses.

Nginx serves known static pages with 200 and unknown pages/assets with 404. Actual container tests, not Vite preview, verify statuses and cache headers. Service-worker/manifest/unhashed changing assets revalidate; only fingerprinted assets are immutable. Keep exact local container `/health` distinct from gateway reachability. The edge proxy owns hosted MCP/OAuth routes; record its existing routing before release and do not invent backend proxy locations in this frontend container.

## 10. Quality gates and non-goals

Acceptance matrix and exact tests live in the execution plans. Required: all content joins/routes valid; true claimed recipe/evidence states; core keyboard/copy/search regressions pass; no hydration/runtime errors; all public content useful with JS disabled; nested assets and links work at both bases; correct HTML/compressed/worker content; real 404; controlled-worker requests never return marketing HTML for backend paths; visual desktop/mobile review against this specification.

Maintain mobile Lighthouse performance ≥95 in comparable local production runs, lab LCP ≤2.5 s, CLS ≤0.1 and initial transferred JS+CSS ≤100 kB gzip. Verify actual served compression. Initial added display font ≤50 kB WOFF2; no new animation framework. Run performance presets sequentially. Field LCP/INP/CLS and real conversion remain separate owner-access measurements, not inferred from lab scores. Re-score against the original rubric, target ≥80 UX, domain specificity and SEO readiness, and report actual outcomes even if targets are missed. User testing with five representative participants is a proposed post-build validation milestone, not an automated release pass.

Non-goals: redesigning gateway APIs/OAuth, performing clinical interpretation, inventing privacy policy, full dark theme, real-time source health dashboard, AI-powered homepage search, animated DNA, generated result screenshots, newsletter/account system, added analytics without a chosen measurement destination, or publishing/deploying as part of this planning task.

## 11. Implementation handoff

[Master execution plan](../plans/2026-09-05-genefoundry-modernization.md) assigns three workers plus coordinator, with a runnable contract freeze before simultaneous implementation. [Interface plan](../plans/2026-09-05-genefoundry-interface.md), [content/onboarding plan](../plans/2026-09-05-genefoundry-content.md), and [delivery plan](../plans/2026-09-05-genefoundry-delivery.md) own disjoint files. Final integration and visual review are serialized where evidence depends on all three.

This specification deliberately chooses the registry, plain source-trace figure, native selector and standalone imprint. Those are decisions, not unanswered design questions. Any client or source fact that lacks evidence has a defined honest publishing state; it is not permission to invent a plausible claim.
