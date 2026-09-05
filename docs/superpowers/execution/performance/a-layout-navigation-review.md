# Font, hydration and navigation performance review

Reviewed official guidance on2026-09-05. [web.dev font best practices](https://web.dev/articles/font-best-practices) recommends discovering critical fonts early and matching fallback metrics; preloads should be limited because they compete with other critical resources. [Optimize CLS](https://web.dev/articles/optimize-cls) identifies content inserted above existing content as a source of shifting and recommends reserving its space. [Back/forward cache](https://web.dev/articles/bfcache) recommends avoiding unload handlers so ordinary history navigation can benefit from browser snapshots. No unload/beforeunload listeners were found in the shipping app. The measured issues do not justify changing this finite static site into a client router.

## Measured causes and fixes

Used Chromium390×844,100ms network latency,200,000bytes/second download throughput,90,000bytes/second upload,4×CPU slowdown, serviceworkers blocked and buffered PerformanceObserver. Tested the existing pre-fix root production artifact through4176. Raw results are a-navigation-lab.json. These are local single-pass diagnostics, not field Core Web Vitals or Lighthouse scores.

Cold homepage CLS0.02916; source index0.16401; About/Workflows/HPO0. SourceSans3 preload began around115–123ms and completed650–665ms. Archivo was discovered through CSS around867–882ms and completed1181–1219ms. The late heading-font discovery supports adding a preload for that12.6kB critical asset; the build lane owns this change. Existing self-hosted subset fonts and measured local fallback metrics remain in place.

The source index SSR HTML omitted its entire filter form, then hydration inserted the form above existing results. Fixed ServerCatalog to render labeled input/select controls statically with disabled attributes until mounted. This reserves the actual form geometry, preserves SSR hydration agreement and retains all source links plus the explicit no-JavaScript notice. No placeholder or page-level overflow clipping was added.

Actual ordinary mobile footer-link navigation About→Workflows→Sources→HPO showed the same cause: source indexCLS0.16401, others0. FCP888–916ms, DOM-ready1495–1523ms. This uncompressed static harness returns no-cache200 responses even for fonts, so these timings do not demonstrate production cache reuse; final compressed nginx measurements belong to the coordinator. An early diagnostic attempted a hidden desktop navigation link at mobile width and timed out; corrected to visible footer links. Final navigation timing waits for load plus document.fonts.ready, replacing prematurely sampled entries.

## Accessibility and verification

Lighthouse's experimental label-content-name-mismatch audit identified mobile visible 'Menu' versus accessible 'Open navigation', and visible 'View source' versus accessible 'View {name} details'. Corrected names to 'Open navigation menu' and 'View source: {name} details'. A targeted axe run on the mobile homepage now reports0violations for that rule.

New SSR regression failed before the form fix and passes afterward. Filter plus SSR unit tests4/4pass. Four targeted browser regressions pass in2.6s: category intersection/reset, query/history recovery, keyboard clear-and-type, and mobile menu/text enlargement. Scoped ESLint passes. Code frozen for coordinator checkpoint; final rebuilt artifact/Lighthouse verification follows integration.
