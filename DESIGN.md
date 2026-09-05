# GeneFoundry visual system

The September 2026 implementation follows a warm, light scientific registry direction, revised after the user requested concrete usage, real results and consistent wide page layouts. The [usage revision](docs/superpowers/specs/2026-09-05-usage-revision.md) records those changes. Product context lives in PRODUCT.md; implemented data types live in src/data/contracts.ts.

## Visual language

The homepage pairs a direct description with an actual GeneFoundry result, followed by source discovery, research examples and client setup. The two research workflows show captured biomedical source responses, their dates and links, and a reusable prompt. Exact tool calls sit behind a native disclosure.

- Canvas `#F6F5F1`; white panels; ink `#182325`; secondary text `#52616B`.
- Magenta `#A23570` for actions and links, `#85285A` on hover. Rules `#D8DCD7`; control borders `#748079`.
- Dark code panels `#111119`, text `#E8E8ED`, secondary text `#A4AFB8`. Use a light focus outline on dark controls and code regions.
- Archivo 600 headings and Source Sans 3 400–600 body text, both self-hosted. System monospace is reserved for literal code, identifiers and endpoints. Font files and OFL notices live in public/fonts/.
- A shared 1200 px outer container aligns navigation, page headers and content. A stable scrollbar gutter preserves this alignment between short and long pages. Interior pages use explicit columns or content groups, with readable text measures inside them. They do not reduce the whole page to a narrow reading strip. Columns stack on small screens in the same document order.
- Restrained borders, compact corner radii and generous section spacing. Source rows use aligned fields and dividing rules. Avoid animated terminals, decorative dashboards and simulated output.

## Page structure

The source directory supports source-name, namespace, research-area and curated-alias filtering. Its six-source homepage preview submits searches to the full directory. Source pages separate useful research context from identifiers, source links and review details.

Research pages pair a copyable question with the recorded result. HNF1B combines gnomAD constraint with five ClinVar records. The phenotype example compares complete exact-term HPO gene lists and shows the returned HNF1B ClinGen curation. Tables preserve source classifications; a dated capture is not a promise that later responses will be identical. The method disclosure contains the actual executed arguments.

Client setup is browser-first: Claude and ChatGPT precede Claude Code, Codex CLI, Cursor, Gemini CLI and VS Code. Steps appear prominently; account requirements and documentation links remain available. Client pages use a main setup column and a help column. About and source details use explicit main/aside compositions, limitations use grouped sections, and the preserved English/German imprint uses parallel language sections on wide screens.

Both self-hosted fonts are preloaded with `font-display: optional` and metric-adjusted fallbacks, preventing late font swaps under slow loading.

## Interaction and evidence

Native selects and details remain accessible without custom widget conventions. Copy exposes pending, success and recoverable failure states, resets on content changes, and ignores stale completions. A successful copy never represents a successful connection.

Client documentation-only instructions have no code snippet. Documented code or configuration may be published after source review, with no execution claim. A verified recipe additionally requires a matching execution record. The seven current guides include two documentation-only browser guides and five documented coding-client recipes; none is marked as an executed setup recipe. The two recorded workflow executions used an existing Claude Code connection and are tracked separately.

Use one H1 per page, labelled controls, visible keyboard focus, a skip link and semantic result tables. Support 320 px reflow, 200% text and reduced motion. Wide data tables may scroll within named, keyboard-focusable regions. Static pages retain useful content and ordinary navigation without JavaScript. Automated checks support review; they do not establish complete WCAG conformance.

## Hero motion

The hero uses ten authored organic contours in magenta, with a faint blush wash. Three brighter strokes travel continuously along the curves over fourteen seconds. There are no diagram nodes, endpoints, particles or simulated requests. A gradual SVG mask softens the lines beneath the copy without a rectangular cutout; the evidence panel remains opaque.

HeroBackdrop.vue uses inline SVG and CSS stroke-dashoffset animation. Only three paths animate, with no animation library, canvas or JavaScript frame loop. This SVG property repaints, so production performance is measured rather than assumed to be compositor-only. A visible 44 px Pause animation / Resume animation button gives the reader control. IntersectionObserver and document visibility pause the animation offscreen or in a hidden tab; listeners are cleaned up on unmount. Reduced motion shows a static illustration and omits the unnecessary pause control. The decorative SVG is aria-hidden and never intercepts input. Content is visible immediately and never waits for motion.

Desktop and mobile captures live in docs/superpowers/execution/screenshots/hero-contours-{initial,moving}-{1440,390}.png. Focused tests check continuous motion beyond four seconds, pause/resume, offscreen and hidden-document pausing, reduced-motion rendering and stable heading geometry. Production Lighthouse and all-route checks remain separate release evidence.

## Asset and publication boundaries

Retain the GeneFoundry SVG mark and its raster/PWA derivatives. The social image is generated locally by scripts/generate-og-image.js from project vector/text and font assets. Research screenshots and test captures are not shipping artwork.

Public workflow records contain reviewed display data and opaque verification IDs. Sanitized execution responses and their ledger stay under docs/superpowers/execution/ and are checked during the build; local evidence paths and account/session material never ship. Preserve upstream source identity and terms separately from integration software licensing.
