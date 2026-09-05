# GeneFoundry Static Delivery and SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver complete route-specific HTML, correct metadata/HTTP behavior, fresh offline pages and reliable root/mirror builds.

**Architecture:** Worker C creates a build-time Vue rendering pipeline, ordered before PWA hashing and final compression. The static container serves only known frontend files; existing edge ownership of biomedical/auth routes stays separate.

**Tech Stack:** Existing Vue server-renderer, Vite 7, VitePWA 1.3.0, Node 24/zlib, nginx Brotli image, Vitest/Playwright.

**Spec:** [Design](../specs/2026-09-05-genefoundry-design.md), [contracts](../specs/2026-09-05-genefoundry-contracts.md), [architecture evidence](../research/2026-09-05-execution-architecture.md); execute within [master plan](2026-09-05-genefoundry-modernization.md).

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

## C1 — Static route rendering and unique metadata

**Depends:** G0; overlaps A1/B1. Skeleton content may render in development but publication validation must reject it until G1.

**Files:** modify `vite.config.js`, `index.html`, `src/main.ts`; create `src/entry-server.ts`, `src/lib/metadata.ts`, `scripts/build.mjs`, `scripts/prerender.mjs`; tests `tests/unit/metadata.test.ts`, `tests/e2e/rendering.spec.ts`.

**Consumes:** App page prop, PAGES, SITE, common types, URL helpers and safe publication data. **Produces:** full static HTML per registered route and deterministic hydration.

- [ ] Add metadata test before renderer implementation:

```ts
import { expect, test } from 'vitest'
import { pageHead } from '../../src/lib/metadata'
import type { PageDefinition } from '../../src/data/contracts'
test('metadata escapes author content and canonicalizes an actual route', () => {
  const page: PageDefinition = {
    kind: 'about',
    path: '/about/',
    title: 'A "quoted" <title>',
    description: '</script><img src=x onerror=alert(1)>',
    indexable: true
  }
  const head = pageHead(page)
  expect(head).not.toContain('<img src=x')
  expect(head).toContain('https://genefoundry.org/about/')
  expect(head).toContain('&lt;title&gt;')
})
```

Also test JSON-LD serialization with script-closing content and indexability for mirror/404. Test escaped outputs by parsing them in a browser artifact check, not solely matching strings.

- [ ] Implement server entry using existing `vue/server-renderer`:

```ts
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import type { PageDefinition } from './data/contracts'
export { PAGES } from './data/pages'
export { SITE } from './data/site'
export { pageHead, schemaFor } from './lib/metadata'
export async function render(page: PageDefinition): Promise<string> {
  return renderToString(createSSRApp(App, { page }))
}
```

No window/document, service-worker imports, timers or mutable cross-page singleton state enter this module graph. Report A/B SSR violations to their owner.

- [ ] Replace the old head/noscript duplication with the two frozen HTML slots and one client entry. Maintain only invariant head elements in the template. pageHead supplies route title/description/canonical/social/robots/JSON-LD; do not emit a second metadata set. Public verification IDs contain no local paths; the build-only evidence ledger must not enter the client module graph or public output.
- [ ] Main resolves base-stripped current pathname against PAGES; use createSSRApp for prerendered markup and createApp only for dev's empty mount. Unknown path uses not-found page. Initial state matches SSR; A/B apply query/client/user effects only after hydration. Keep service-worker registration in browser code only.
- [ ] Implement prerender: first read built dist/index.html as an immutable template; import the SSR bundle; loop finite PAGES; render and inject escaped head/body; write `<path>/index.html` and `404.html`. Validate output paths stay inside outDir; do not derive file paths from arbitrary browser input. Write noindex for error/mirror. Unknown paths never receive generated homepage duplicates.
- [ ] Author no-JS tests now for the static-root/static-mirror projects; execute integrated acceptance at G1 once A3/B3 have removed fixtures: correct H1/title, substantive distinct content, page-specific source/client/workflow identity and local links; create fresh JS-enabled contexts to require zero hydration warnings/page errors. Use exact URL helper base matrix. Test direct navigation and reload on nested pages.
- [ ] Run metadata/unit tests and focused SSR tests using isolated temporary fixture output; run type check and scoped lint. Full static rendering acceptance runs at G1 with completed page content. Request coordinator change `build` to `node scripts/build.mjs` only once pipeline is valid; workers never edit package.json. Commit C1 scope.

**Gate:** actual HTML contains the content before JS, with one correct head per route; skeleton content cannot pass final validator.

## C2 — Machine files, PWA finalization, compression and social preview

**Depends:** C1; final production validation also needs B1/A3 complete.

**Files:** extend vite/build/prerender; create `scripts/compress.mjs`, `scripts/validate-artifacts.mjs`; modify machine-file source strategy for `public/robots.txt`, `sitemap.xml`, `llms.txt`; update `scripts/generate-og-image.js`, `public/og-image.svg`, `public/og-image.png`; tests `tests/unit/compression.test.ts`, `tests/e2e/artifacts.spec.ts`, `service-worker.spec.ts`.

**Consumes:** final registry/content, reviewed copy and design tokens. **Produces:** coherent metadata/machine artifacts, correct worker revision, valid compressed sidecars and real social preview.

- [ ] Use one build orchestrator. Set build year once for both phases. Clean only `.build/server/` and `dist/`; preserve baseline and retained root/mirror artifacts. SSR build excludes publicDir, PWA and compression. Browser build has awaited prerender before PWA.

```js
// Relevant shape inside the browser-only Vite configuration:
const prerenderPlugin = {
  name: 'genefoundry-prerender',
  closeBundle: {
    order: 'pre',
    sequential: true,
    async handler() {
      await prerender({
        templatePath: 'dist/index.html',
        serverEntry: '.build/server/entry-server.js',
        outDir: 'dist'
      })
    }
  }
}
// VitePWA receives integration: { closeBundleOrder: 'post' }.
// scripts/build.mjs awaits SSR build, then browser build, then compression.
```

Check emitted SSR filename against configuration and set rollup output explicitly if needed. Do not rely on an unverified plugin order; add the worker freshness regression below.

- [ ] Generate sitemap/robots/llms from final PAGES/catalog; remove independently maintained stale public versions from the copy stage so they cannot overwrite generated files. Counts and titles use data. Production sitemap contains indexable production URLs only; mirror uses noindex and a pointer to production rather than an indexable mirror sitemap. Actual content dates are not replaced by build time.
- [ ] Keep one SW registration path: `virtual:pwa-register`, `injectRegister:null`. VitePWA `navigateFallback:null`; no custom fallback to home. Precache known static docs/assets, exclude 404 and backend routes; remove stale Google-font runtime caches. Require final HTML fingerprints, not pre-prerender shells. Review worker registration errors and update behavior without periodic requests to unrelated services.
- [ ] Replace duplicate compression plugins with one Node zlib pass after all original files are final. Skip preexisting sidecars, compressed image/font assets and private artifacts. Use Brotli and gzip for HTML/CSS/JS/SVG/JSON/webmanifest/XML/text. Test decompression equality with both algorithms on a temporary directory:

```ts
import { brotliDecompressSync, gunzipSync } from 'node:zlib'
import { readFile } from 'node:fs/promises'
// After compressDirectory(tempDir):
expect(gunzipSync(await readFile(htmlPath + '.gz'))).toEqual(await readFile(htmlPath))
expect(brotliDecompressSync(await readFile(htmlPath + '.br'))).toEqual(await readFile(htmlPath))
```

The committed test must create/clean its own temporary directory, write HTML fixture, run the function and compare bytes; never overwrite a shared dist while other workers test it.

- [ ] Update the existing SVG/PNG social assets to “Biomedical data. One MCP connection.” with actual mark and brand colors. Use existing Sharp generation, retaining logo provenance and output 1200×630. Do not use reference-site screenshots as art. Index/head points to absolute production social image; alt text follows copy spec.
- [ ] Implement artifact validator: route/file bijection; escaped unique metadata/canonical; one H1; source/client/workflow coverage; working local document/fragment/asset URLs; no fixtures, local evidence paths, duplicate obsolete noscript, hidden contract or stale counts; visible FAQ equals schema; decompression bytes equal originals; manifest counts/base/scope correct. Keep the build validator Node-only: validate generated records, serialized metadata, manifest data, file existence and bytes without launching a browser. Browser DOM parsing, accessible content and hydration checks belong to the separate Playwright artifact phase in CI. Docker builds must not require an installed Chromium browser.
- [ ] Add controlled-worker tests. In a clean context install SW online, reload under its control, visit two different source/client routes and ensure each retains its own content offline. Missing route stays genuine 404 online and must never display home offline. Reserved paths use an isolated local network stub returning a recognizable sentinel; assert SW leaves it intact. Exercise update from retained baseline worker/artifact on the same origin and confirm new source page bytes replace old shell after activation/reload.
- [ ] Run helper/compression tests now; author artifact/worker tests for G1 and run them when complete publication content is available; request coordinator scripts `check:artifacts=node scripts/validate-artifacts.mjs` and keep exact flags `--dir`, `--base`. Commit C2 scope.

**Component-completion gate:** ordered build/helper code and tests are ready; helper tests prove ordering and byte correctness on isolated temporary output. **Integrated acceptance at G1:** worker hashes match final complete HTML, compression cannot serve stale copies, each page remains itself offline, and SEO artifacts describe visible current content. Do not wait for final A3 pages before handing ready delivery code to integration; do not bypass publication validation to claim a final build passed.

## C3 — Static HTTP delivery, base matrix and CI

**Depends:** C2; overlaps A3/B3. Current Docker nginx owns frontend files plus a local container health response, not public OAuth proxying.

**Files:** `docker/nginx.conf`, `docker/Dockerfile`, `.dockerignore`, relevant compose config only if necessary; `.github/workflows/ci.yml`; create `scripts/serve-static.mjs`, `tests/e2e/http.spec.ts`; update `docs/vps-setup.md` with precise operations handoff. Coordinate engine changes; C owns CI/container Node 24 alignment, coordinator owns package engines.

**Consumes:** final static artifact, two explicit bases, current proxy/deployment documentation. **Produces:** real 404/cache behavior, local test fixtures and CI artifacts.

- [ ] Write direct HTTP assertions against the real built nginx image before fixing fallback:

```ts
test('unknown HTML and assets are real 404s', async ({ request }) => {
  expect((await request.get('/sources/gnomad/')).status()).toBe(200)
  const missing = await request.get('/not-a-real-page/')
  expect(missing.status()).toBe(404)
  expect(await missing.text()).toContain('Page not found')
  expect((await request.get('/assets/missing.js')).status()).toBe(404)
})
```

Run on a dedicated container port, not Vite preview. Test exact /health 200 separately; /health-nonsense must not inherit its prefix handler.

- [ ] Replace SPA fallback with:

```nginx
location = /health {
    access_log off;
    default_type text/plain;
    return 200 "OK\n";
}
error_page 404 /404.html;
location = /404.html { internal; }
location / { try_files $uri $uri/ =404; }
```

Integrate with existing cache/security locations. Ensure the resulting error response remains 404; do not use `=200` error mapping. Validate with the actual Brotli image's `nginx -t`.

- [ ] Revalidate HTML, SW, manifest and unhashed changing assets; immutable cache only on fingerprinted assets. Add exact worker/manifest locations before broad JS regex as needed. Ensure inherited security headers remain on new locations. Missing assets must retain HTTP 404 and must never return HTTP 200 homepage content. The shared error document may be HTML with status 404; Content-Type and nosniff must remain accurate. Verify Content-Type and gzip/Brotli response bytes, no stale compressed original.
- [ ] Make the Docker build context include the build-only verification ledger and its sanitized evidence. The existing `.dockerignore` excludes `docs` and `*.md`; replace that blanket documentation exclusion with explicit parent/child rules that retain only `docs/superpowers/execution/verification-ledger.json` and `docs/superpowers/execution/verification/`. Keep other documentation excluded. Use sanitized JSON evidence in that directory; ledger paths are relative to the repository root and cannot escape this directory. Verify a ledger-backed sample in an isolated fixture Docker build; do not publish the sample. Copy only final dist into the runtime image, so the ledger and evidence are absent from runtime/public artifacts.
- [ ] Align Docker and CI to Node 24 compatible with the frozen test stack. Retain the current Brotli runtime image unless separate maintenance evidence requires change; this task is not a wholesale dependency upgrade. CI's lint check is non-mutating and reports dirty output if any tool changes source.
- [ ] Add a minimal test-only static server supporting `--dir`, `--base`, `--port`, real 404 and content types. Path traversal is rejected. It does not become a production runtime. Use it for the /genefoundry/ mirror and no-JS/browser artifact tests.
- [ ] Build bases sequentially and retain their directories; test on separate ports:

```bash
VITE_BASE_URL=/ npm run build
# Retain dist as .build/artifacts/root using a copy operation.
VITE_BASE_URL=/genefoundry/ npm run build
# Retain dist as .build/artifacts/mirror using a copy operation.
node scripts/serve-static.mjs --dir .build/artifacts/mirror --base /genefoundry/ --port 4177
```

Add actual `cp`/fs.cp implementation to the coordinator CI harness; no simultaneous dist mutations. Check all nested assets/canonicals, mirror noindex and normal link navigation. GitHub CI currently uploads artifacts; do not quietly add a production deployment job.

- [ ] Update CI to install exact locked deps/Chromium, run type/lint/unit/browser/artifact tests, root/mirror build matrix without sharing output directories, and upload failure traces/screenshots plus final artifacts. Browser/state tests may parallelize per independent context; performance runs are separate/sequential.
- [ ] Write operations checklist for the actual edge: preserve /mcp, /authorize, /token, /register, /consent, /auth/, /.well-known/, /health, /metrics, /docs, /redoc, /openapi.json. Record known ownership and unknown mappings honestly; do not invent upstream proxy URLs. Test read-only routing before/after authorized deployment; no OAuth mutation probes in unauthenticated smoke tests.
- [ ] Run nginx config and isolated HTTP fixture checks now; complete container/mirror cache, worker and CI-equivalent acceptance at G1 with final validated artifacts; review exact changes and commit C3 scope. Report any external edge validation unavailable as a release dependency, not a failed local static build.

**Gate:** the frontend artifact is deployable and correct locally; actual hosted gateway preservation is checked by the edge owner during authorized release. Preview success cannot substitute for HTTP or worker evidence.

## Independent C review after G1

Inspect final artifacts independently of source assumptions. Verify status codes, canonicals, complete static text, source/client links, JSON-LD, metadata, social image, compression and installed-worker navigation. Re-run only failed/newly affected cases after corrections. Give coordinator raw evidence and distinguish local delivery from production field behavior.
