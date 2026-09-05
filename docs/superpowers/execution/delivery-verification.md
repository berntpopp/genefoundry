# Static delivery implementation evidence

C lane, 5 September 2026. Worktree: `.worktrees/website-modernization`. No deployment or merge performed.

Implemented finite Vue SSR output (36 production content pages plus 404), shared escaped metadata, sitemap/robots/machine summary generation, explicit root/mirror bases, one service-worker registration, final-HTML precaching and one final Node zlib compression pass. The Node-only validator checks the private execution ledger, routes/links/fragments, canonical/indexability, readable FAQ/schema agreement, worker revisions and compressed bytes. The private validation manifest lives beside retained artifacts, never inside public output.

Verification completed:

- Six helper tests passed across metadata escaping, route-output containment, compression round trips, static-server error/base behavior and forged/missing/escaping execution evidence.
- Both final root and `/genefoundry/` builds validated 37 static documents, including the final shared FAQ on limitations. Publication validation was not bypassed.
- The preceding complete static browser suite passed **82/82** tests: all 36 content pages without JavaScript and with hydration/reload, both-base metadata and PNG dimensions, offline source/client navigation, missing paths, reserved backend network sentinels, and upgrading the retained pre-modernization mirror worker. The coordinator's final all-phase run rechecks the latest integrated build.
- An isolated actual Node 24 Docker fixture verified that `.dockerignore` includes ledger-backed sanitized JSON evidence but excludes unrelated documentation. Fixture image and temporary files were removed.
- Actual `fholzer/nginx-brotli:v1.28.0` `nginx -t` passed after quoting the fingerprint-cache regex. Real image HTTP/compression tests are included in `tests/e2e/http.spec.ts` and the coordinator's all-phase runner.
- Scoped C ESLint and `git diff --check` passed.

Social preview provenance: `public/og-image.png` is generated at 1200×630 by `scripts/generate-og-image.js` from `public/og-image.svg`; its embedded mark is the repository's original `public/genefoundry_logo.svg`. No reference-site screenshot, generated biological result or synthetic laboratory image is shipped. The script fails on generation errors rather than emitting unrelated fallback branding.

Known operational boundary: static-container `/health` is not gateway authentication or backend health. Preserve the live edge's MCP/OAuth paths during a separately authorized deployment. All client recipes remain documentation-only until actual execution evidence exists. Build output reports stale Browserslist/baseline-data warnings; these do not change the completed checks and no unrelated dependency upgrade was performed.
