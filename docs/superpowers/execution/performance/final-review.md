# Final performance and SEO review

Measured 6 September 2026 with Lighthouse 13.4.0 against the local production nginx container, using mobile throttling. All 37 indexable routes were audited sequentially. These are local lab results, not field Core Web Vitals or a guarantee of Google indexing/ranking.

## Results

Every route scored 99–100 performance and 100 accessibility, best practices and SEO. All recorded CLS values were zero. The homepage includes the continuous contour animation; it scored 99 performance. The desktop homepage scored 100 in all four categories in the separate desktop run.

| Route                                | Performance | Accessibility | Best practices | SEO |    LCP | CLS |
| ------------------------------------ | ----------: | ------------: | -------------: | --: | -----: | --: |
| `/`                                  |          99 |           100 |            100 | 100 | 1.85 s |   0 |
| `/sources/`                          |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/`                          |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/workflows/`                        |          99 |           100 |            100 | 100 | 1.83 s |   0 |
| `/sources/pubtator/`                 |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/gnomad/`                   |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/orphanet/`                 |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/clingen/`                  |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/hpo/`                      |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/mavedb/`                   |          99 |           100 |            100 | 100 | 1.88 s |   0 |
| `/sources/uniprot/`                  |          99 |           100 |            100 | 100 | 1.86 s |   0 |
| `/sources/mgi/`                      |         100 |           100 |            100 | 100 | 1.72 s |   0 |
| `/sources/genereviews/`              |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/mondo/`                    |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/gencc/`                    |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/metadome/`                 |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/stringdb/`                 |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/gtex/`                     |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/hgnc/`                     |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/panelapp/`                 |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/autopvs1/`                 |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/spliceai/`                 |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/vep/`                      |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/sources/clinvar/`                  |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/sources/litvar/`                   |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/claude-ai/`                |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/chatgpt/`                  |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/claude-code/`              |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/connect/codex/`                    |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/cursor/`                   |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/connect/gemini/`                   |         100 |           100 |            100 | 100 | 1.50 s |   0 |
| `/connect/vscode/`                   |          99 |           100 |            100 | 100 | 1.84 s |   0 |
| `/workflows/variant-evidence/`       |          99 |           100 |            100 | 100 | 1.83 s |   0 |
| `/workflows/phenotype-rare-disease/` |          99 |           100 |            100 | 100 | 1.85 s |   0 |
| `/about/`                            |          99 |           100 |            100 | 100 | 1.82 s |   0 |
| `/limitations/`                      |          99 |           100 |            100 | 100 | 1.82 s |   0 |
| `/imprint/`                          |          99 |           100 |            100 | 100 | 1.80 s |   0 |

## Causes fixed and independently checked

- Development previously sent an empty app container, then injected global and component styles through JavaScript. It now uses the production renderer and a shared route resolver, with generated stylesheets linked before paint. All 38 routes are compared before and after hydration on both deployment bases.
- Font preload paths in the mirror were accidentally prefixed twice. Vite now applies the base once. Both local fonts are preloaded, with metric-adjusted fallbacks and `font-display: optional`. Artificially delayed font loading produced zero layout shifts on About, Workflows and HPO.
- The source-directory filter form was inserted on mount. It now reserves its real geometry in the server-rendered HTML; custom controls become available only after their handlers are attached.
- Classic scrollbars changed the available page width. At 1440×1600, the logo previously moved from x=112.5 on Home/About to x=120 on Workflows. A global stable scrollbar gutter keeps x=112.5 across these pages. The regression covers all 38 routes plus real navigation between short and long pages.
- Vite was watching generated HTML, test reports and copied audit tsconfig files, causing repeated full reloads during development. A regression reproduced three reload messages before the fix and zero afterward. Watch ignores are anchored inside the project so they do not accidentally ignore the implementation worktree itself.
- The development server excluded the Lucide barrel from dependency optimization, generating 1,714 raw module requests. Prebundling reduces this to one optimized request. Root and mirror caches are separate.
- The rejected wiring decoration was replaced by continuous organic contours. Three SVG strokes animate; there is a pause/resume control, a static reduced-motion version, and offscreen/hidden-tab pausing. No animation library or JavaScript frame loop is used.

## SEO and evidence boundaries

The production root sends rendered content, distinct titles/descriptions, absolute canonical URLs, indexable robots directives, a sitemap and JSON-LD. Breadcrumbs reflect the actual source/client/workflow hierarchy. FAQ schema is limited to visible FAQ content. Error pages return true 404 responses and remain excluded from indexing. The `/genefoundry/` duplicate mirror intentionally uses `noindex`; its lower SEO audit score is not the production indexing policy.

Two worked examples are backed by actual GeneFoundry calls and sanitized captures. Browser and coding-client setup instructions remain documentation-based unless a separately recorded setup proves them. Result validation checks capture identity/date and complete table shape.

## References and reproduction

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): rendered content and crawlable links.
- [Google robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- [web.dev render-blocking CSS](https://web.dev/articles/critical-rendering-path/render-blocking-css), [CLS](https://web.dev/articles/optimize-cls), [font optimization](https://web.dev/learn/performance/optimize-web-fonts), and [animation performance](https://web.dev/articles/animations-guide).
- [MDN scrollbar gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter) and [Vite dependency prebundling](https://vite.dev/guide/dep-pre-bundling).
- [W3C pause/stop/hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide), [reduced motion](https://web.dev/articles/prefers-reduced-motion), and [flow-field visual reference](https://observablehq.com/@esperanc/flow-fields).

Run `npm run build:matrix`, serve the production image on port 4182, then `npm run audit:lighthouse`. Generated Lighthouse reports, browser traces and screenshots stay in ignored output directories. The maintained test suite covers static/no-JavaScript content, hydration, every page at desktop/mobile/200% text, clipboard failure, navigation, offline updates, backend route boundaries, compression and nginx headers.
