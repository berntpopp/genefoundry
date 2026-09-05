<div align="center">

<a href="https://genefoundry.org/">
  <img src="https://genefoundry.org/genefoundry_logo.svg" alt="GeneFoundry" width="110" height="110" />
</a>

<h1>GeneFoundry</h1>

<p><strong>Biomedical databases in your AI chat.</strong></p>

<p>The website behind <a href="https://genefoundry.org/">genefoundry.org</a>, the source directory, setup guides and research workflows for the GeneFoundry MCP router. The backend that federates the <code>*-link</code> fleet lives in <a href="https://github.com/berntpopp/genefoundry-router">genefoundry-router</a>.</p>

[![CI](https://github.com/berntpopp/genefoundry/actions/workflows/ci.yml/badge.svg)](https://github.com/berntpopp/genefoundry/actions/workflows/ci.yml)
[![Security](https://github.com/berntpopp/genefoundry/actions/workflows/security.yml/badge.svg)](https://github.com/berntpopp/genefoundry/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fgenefoundry.org&label=genefoundry.org&up_color=BE3E82)](https://genefoundry.org/)

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

## Development

Use Node 24 and the committed lockfile.

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

Vite defaults to `/`. Use `VITE_BASE_URL=/genefoundry/ npm run dev` for the mirror layout. This website presents the source directory and connection guides; it does not run the MCP gateway or authenticate a client.

## Production and verification

```bash
npm run type-check
npm run lint:check
npm test
npx playwright install chromium
npm run build:matrix
npm run test:e2e:all
```

The matrix builds `/` and `/genefoundry/` sequentially, retaining artifacts in `.build/artifacts/`. The complete browser suite exercises Vite, both static artifacts and an isolated Docker/nginx container. Docker must be available for the HTTP checks. Reports and caches are ignored by Git.

To build one deployment explicitly:

```bash
VITE_BASE_URL=/ npm run build
# Or: VITE_BASE_URL=/genefoundry/ npm run build
```

Each build prerenders all registered pages, validates content and references, generates the service worker from final HTML, then creates compression sidecars. The runtime image serves only the public artifact. The edge proxy separately owns MCP and OAuth routes; see [deployment notes](docs/vps-setup.md).

## Using GeneFoundry

The site provides setup guides for seven clients, with Claude and ChatGPT first, followed by Claude Code, Codex CLI, Cursor, Gemini CLI and VS Code. Add the hosted endpoint `https://genefoundry.org/mcp` using your client’s instructions and complete browser sign-in when requested.

Two research workflows include copyable prompts and real captured results:

- **HNF1B:** gnomAD gene constraint alongside five source-linked ClinVar variant records.
- **Renal cysts and diabetes:** complete HPO gene-list comparison, 13 shared genes, and the returned HNF1B ClinGen curation.

The pages include retrieval dates, source versions where returned, original record links and the exact executed calls. They are for research, not clinical decision support.

## Content and design

The catalog is maintained inventory, not a live health measurement. Client guides use three distinct states: `documentation-only` provides browser instructions without a code snippet; `documented` provides reviewed code/configuration with no execution claim; `verified` additionally requires sanitized execution evidence. The current release has two documentation-only browser guides, five documented coding-client recipes and no verified setup recipes. The two verified workflow results were obtained through an existing Claude Code connection; they do not establish that a fresh client add/login recipe was tested.

Archivo headings and Source Sans 3 body text are self-hosted with their font licenses. All page kinds share the same 1200 px outer alignment and use responsive content columns rather than a narrow page-wide reading strip.

See [DESIGN.md](DESIGN.md), the [usage revision](docs/superpowers/specs/2026-09-05-usage-revision.md) and the [verification record](docs/superpowers/execution/content-verification.md) for the final implementation. The original [design specification](docs/superpowers/specs/2026-09-05-genefoundry-design.md), [execution plan](docs/superpowers/plans/2026-09-05-genefoundry-modernization.md) and [shared contracts](docs/superpowers/specs/2026-09-05-genefoundry-contracts.md) retain planning context; the later user-directed revision supersedes their initial illustrative workflows and documentation-only recipe restriction.

Generated audits, screenshots and local design-tool state are ignored. Source files, font licenses, sanitized execution evidence and the build-only verification ledger remain versioned. The runtime artifact excludes private evidence paths and account/session data.
