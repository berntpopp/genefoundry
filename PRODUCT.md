# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

GeneFoundry presents a gateway that federates biomedical Model Context Protocol (MCP) servers behind one hosted endpoint. The website helps a visitor understand supported sources and connect a compatible client. The existing website is Vue 3, TypeScript, Vite and Tailwind 4; it is not the gateway backend.

## Users

Planning audience: biomedical researchers and bioinformatics developers evaluating source coverage or setting up an MCP client. The accepted audit recommends supporting both researchers new to MCP and experienced integrators. Relative audience proportions have not been established by analytics or a user study.

## Positioning

One connection to a finite catalog of independently maintained biomedical MCP backends, with namespaced tools and discovery before invocation. Avoid universal coverage claims. The catalog in `src/data/servers.ts` currently contains 21 servers and 280 tools; these are maintained catalog facts, not a live health measurement.

## Operating Context

Visitors arrive to assess biomedical source coverage, understand the gateway's role, inspect a recorded workflow, and find client-specific setup. The hosted endpoint is `https://genefoundry.org/mcp`. Current instructions cover Claude web/Desktop, ChatGPT web, Claude Code, Codex CLI, Cursor, Gemini CLI and VS Code. Browser clients are presented first. Current connection content states that hosted access uses browser sign-in with OAuth; setup instructions are checked against current client documentation; a tested setup badge requires a separately recorded successful setup.

## Capabilities and Constraints

- Public marketing/documentation and local source filtering belong to this website. Authentication and biomedical tool execution belong to the gateway/client.
- Preserve the existing endpoint and upstream/repository links. Do not invent availability guarantees, source validation, response fields, privacy guarantees or clinical suitability.
- Research use only; not clinical decision support.
- Hosted root deployment and the `/genefoundry/` static deployment base both exist in the codebase. Gateway/auth routes must not be repurposed by content routing.
- The current project links the router's MIT license. Upstream data terms must be represented separately rather than inherited from router licensing.

## Brand Commitments

Preserve the name GeneFoundry, existing logo and recognizable magenta accent. The user accepted a scientific-registry direction and specifically chose warm light reading surfaces with dark code panels on 5 September 2026. Exact visual values live in the design specification, not this product record.

## Evidence on Hand

- `src/data/servers.ts`: names, categories, tool counts, upstream URLs, repositories and representative tool names.
- `src/components/ConnectSection.vue`: browser and coding-client instructions with hosted authentication explanation.
- `docs/audits/2026-09-05-website-review.md`: baseline design, interaction, SEO and performance review, with linked screenshots and raw evidence.
- `public/genefoundry_logo.svg`: existing brand mark.
- The workflow pages show two executed MCP queries with sanitized source responses and a verification ledger. No real user testimonials, conversion statistics, live uptime evidence or field-performance dataset were established in the audit.

## Product Principles

1. Show supported sources and exact setup requirements before making broad claims.
2. Let readers inspect provenance and distinguish illustrative material from verified output.
3. Keep expert setup efficient while explaining unfamiliar protocol terms to newcomers.
4. Preserve upstream identity, terms and limitations.
5. Publish useful accessible content that works without depending on a live gateway call.

## Accessibility & Inclusion

The modernization specification targets WCAG 2.2 AA, keyboard operation, reduced motion, mobile reflow and readable text enlargement. This is a planned acceptance standard, not certification of the incumbent site. Primary controls should use comfortable 44×44 CSS px targets; AA minimum/spacing exceptions are evaluated separately.

## User review revision

The user rejected abstract workflows and repeated caveats after reviewing the implementation. The site now demonstrates executed MCP examples, gives concrete browser and coding-client setup instructions, uses Source Sans 3 body with Archivo headings, and shares a consistent wide layout across pages. See docs/superpowers/specs/2026-09-05-usage-revision.md.
