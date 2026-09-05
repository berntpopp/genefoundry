# Repository guidance

GeneFoundry is a Vue 3 / TypeScript / Tailwind 4 website for a biomedical MCP gateway. Vite produces static HTML for each route; Vue hydrates local interactions. The gateway backend lives in the separate genefoundry-router repository.

## Commands

- Node 24; install with `npm ci`.
- `npm run dev` serves the root base; `VITE_BASE_URL=/genefoundry/ npm run dev` uses the mirror base.
- `npm run type-check`, `npm run lint:check` and `npm test` are non-mutating checks.
- `npm run build:matrix` produces root and mirror artifacts sequentially.
- `npm run test:e2e:all` requires Chromium and Docker; it starts dedicated test servers and cleans up its own test container.
- `VITE_BASE_URL=/ npm run build` builds one explicitly selected base.
- `npm run lint` and `npm run format` modify files; never run them across concurrent worker edits.

## Architecture

- `src/data/contracts.ts` defines shared source, client, workflow and page types.
- `src/data/pages.ts` is the finite route registry; unknown paths resolve to the error page.
- `src/App.vue` receives a page definition and composes one header, page and footer.
- `src/pages/` contains the home, source directory/details, client guides, workflows and legal/limitations pages.
- `src/lib/urls.ts` owns base-aware internal links. Absolute MCP/OAuth URLs never receive the website prefix.
- `src/lib/validation.ts` validates public content. Node artifact validation separately checks private execution evidence.
- `src/entry-server.ts` creates a fresh SSR app per page. `src/main.ts` hydrates the static result.
- `scripts/build.mjs` sequences rendering, PWA generation, compression and validation. Build cleanup must preserve `.build/baseline/` and retained artifacts.

## Content and design requirements

Follow DESIGN.md and the user-directed usage revision in docs/superpowers/specs/2026-09-05-usage-revision.md. The initial design/copy plan is historical where the revision changes it. Implemented shared types are in src/data/contracts.ts. Use typed Vue script setup, semantic HTML, native controls, warm light surfaces, Archivo headings, Source Sans 3 body and dark code panels. Shared tokens live in src/style.css; component-specific scoped styles are appropriate.

Keep the same 1200 px outer alignment across page types. Use explicit responsive content groups or main/aside columns, with readable measures inside sections; do not narrow the entire page. Preserve document order when columns stack. Support 320 px reflow, enlarged text, keyboard and reduced motion.

There are seven client guides. Claude and ChatGPT browser instructions come first. `documentation-only` has null code and null recipeTest; `documented` has reviewed code and null recipeTest; only `verified` may carry a tested-setup claim and must have a matching execution record. Current workflow execution through an existing Claude Code connection is separate from testing a new add/login recipe.

Both research workflows now show actual dated source responses. Lead with a copyable user question and readable results, then place exact executed tool arguments in a collapsed method section. Preserve the complete submitted identifiers, source versions where supplied, review classifications and original record links. Numeric rounding must remain traceable to the captured response. HPO set comparisons require complete pagination and consistent descendant scope.

Never fabricate biomedical responses, privacy guarantees, deployed source versions or client test claims. Opaque public verification IDs join build-only sanitized JSON records under docs/superpowers/execution/verification; filesystem evidence paths and credentials never ship. Run the evidence-integrity regressions when changing recorded result data. Preserve the existing English/German legal wording and the external edge’s backend route ownership.
