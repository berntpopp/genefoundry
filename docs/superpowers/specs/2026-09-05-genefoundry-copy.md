# GeneFoundry publication copy specification

Current implementation follows the [user-directed usage revision](2026-09-05-usage-revision.md), which supersedes conflicting original requirements.
Date: 5 September 2026. Companion to the modernization design and execution plan. This document supplies copy and editorial release rules; it does not validate the hosted service or client recipes. The approved direction is a scientific registry with warm reading surfaces and dark panels reserved for code. No application changes are part of this deliverable.

## Editorial contract

Write for researchers choosing a source and developers connecting a client. Use “client” for the AI application, “source” for the biomedical resource, and “MCP server” for its integration. Explain Model Context Protocol on first use. Keep source and integration distinct: a configured source is not a claim of partnership, endorsement or uptime.

Quoted text below is intended for publication. Braced values are typed content bindings, never literal placeholders on the published page. Generate counts from `src/data/servers.ts`; the reviewed snapshot contains 22 server entries and 285 listed tools. Describe these as catalog counts, not a live discovery measurement. Dates must describe the event actually recorded: editorial review, recipe test or response retrieval. A build date is none of these.

Default evidence treatment: a static, explicitly illustrative discovery trace. No fabricated biomedical response, allele frequency, clinical conclusion, citation flag, response time or live status. A tool name taken from the catalog can be labeled “Listed tool”; it cannot be labeled “Tool called” without execution evidence.

## Homepage: exact copy and destinations

### Navigation and hero

Navigation: “Sources” → `/sources/`; “Workflows” → `/workflows/`; “About” → `/about/`; primary action “Connect your client” → `/#connect`. Brand link accessible name: “GeneFoundry home”. Mobile controls: “Open navigation”, “Close navigation”.

H1: **Biomedical data for your AI tools. One MCP connection.**

Lead: “Connect a compatible AI client to biomedical sources including gnomAD, ClinVar and HPO through GeneFoundry.”

Supporting definition: “Model Context Protocol (MCP) lets compatible AI tools connect to external data and tools.”

Primary CTA: “Connect your client”. Secondary CTA: “Explore sources” → `/sources/`.

Requirement line, before any command or configuration: “Browser sign-in required · Open source · Research use only”.

Catalog line: “{serverCount} MCP servers · {toolCount} tools listed in the catalog”. Omit the entire line when catalog data is unavailable; do not substitute zero.

### Evidence example

H2: “Start with the source”

Intro: “Choose a source for your question, then inspect its response before using an AI-generated summary.”

Persistent badge: “Illustrative discovery trace”.

Question label: “Research question”. Question: “Which listed source could I use to look up population variation for a gene?”

Trace, shown in reading order:

1. “Research task” — “Population variation”.
2. “Listed source” — “gnomAD”. Link: “View gnomAD source details” → `/sources/gnomad/`.
3. “Listed tool” — `gnomad_search_genes`.
4. “Next step” — “Connect your client and inspect the tool’s input requirements.”

Caption: “This trace uses the website catalog. It does not run a tool or show a biomedical result.”

Provenance fields: “Basis: Website catalog”; “Source: gnomAD”; “Example type: Illustration”. No fake request JSON or result block. Link: “Open gnomAD” → catalog `sourceUrl`. Secondary link: “Follow the variant evidence workflow” → `/workflows/variant-evidence/`.

If a captured response is later substituted, use badge “Recorded example”; add actual tool, complete submitted identifiers, retrieval date, source record URL and version if returned. Label absent version “Source version not supplied”. A biomedical reviewer must approve the interpretation. Preserve the raw response and capture reference internally. Until these conditions pass, publish the illustration above unchanged.

### Source catalog

H2: “Explore biomedical sources”

Intro: “Find a source by name or research task. Open its details to see the listed integration and upstream resource.”

Search label: “Search sources”. Placeholder: “Try gnomAD, phenotype or literature”. Clear button: “Clear search”. Category label: “Research area”. Default: “All research areas”. Reuse catalog category labels: “Variants”, “Gene–disease”, “Genes & proteins”, “Expression & models”, “Literature”, “Ontologies”.

Columns: “Source”, “Research task”, “Listed tools”, “Details”. Each row uses the catalog source name and domain. Link text: “View source”; accessible name: “View {source} details”. Tool count is `{tools}` with accessible label `{tools} listed tools` and singular inflection. Do not call these “available now”.

Homepage preview: six named rows, gnomAD, ClinVar, ClinGen, HPO, UniProt and PubTator3. The homepage search form submits to `/sources/?q={encodedQuery}`. It does not filter the six-row preview in place. Search and research-area filtering operate on the full catalog on `/sources/`; preserve the submitted query in its search field. Default preview caption: “Showing 6 of {serverCount} catalog entries”. CTA: “View all sources” → `/sources/`.

Directory page H1: “Biomedical sources”. Lead: “Browse the biomedical MCP servers listed in GeneFoundry’s catalog. Source pages link to the upstream resource and integration repository.”

### Setup

H2: “Connect your client”

Intro: “Choose your AI client for setup instructions.”

Authentication note, displayed above the selector and all copy actions: “The hosted endpoint uses OAuth. Complete browser sign-in when your client requests it. Your client’s account and access requirements still apply.”

Separate backend note: “Hosted sign-in and upstream API keys are different requirements. If you run the router or a source integration yourself, check its repository for backend credentials and configuration.” Do not promise that hosted users never need keys without checking the router configuration.

Selector label: “AI client”. Choices: “Claude Code”, “Claude.ai / Claude Desktop”, “Codex CLI”, “Cursor”, “Gemini CLI”, “VS Code”. Guide action: “Open {client} guide” → its `/connect/<client>/` route.

Endpoint label: “Hosted MCP endpoint”. Value: `https://genefoundry.org/mcp`. Action: “Copy endpoint”.

Verification heading: “Check the connection”. Body: “In your client, confirm that GeneFoundry is connected and that its tools can be discovered. A successful copy does not confirm a connection.”

Recovery heading: “If the connection fails”. Body: “Check the endpoint, complete any pending sign-in and review the troubleshooting steps for your client.” Link: “Open troubleshooting” → selected client guide troubleshooting anchor.

Health link: “Open endpoint health check” → `https://genefoundry.org/health`. Explanation: “This checks endpoint reachability. It does not confirm your sign-in or the health of each source.”

The initial release uses the explicit recipe fallback in the client-guide section unless a current recipe passes verification. Never retain an unverified command merely because it already appears in the repository.

### Maintenance and limits

H2: “Maintained in the open”

Body: “Explore the router code and the repositories behind the listed source integrations. Report an integration issue with the source name, client and steps needed to reproduce it.”

Links: “Router repository” → `https://github.com/berntpopp/genefoundry-router`; “About GeneFoundry” → `/about/`; “Contact” → `mailto:support@genefoundry.org`.

H3: “Research use only”

Body: “GeneFoundry is not clinical decision support. Review the upstream evidence and its limitations before using a result in research. Source coverage, response formats and availability can differ.”

Link: “Read the limitations” → `/limitations/`.

### Visible FAQ

**What is GeneFoundry?**

“GeneFoundry brings a catalog of biomedical MCP servers behind one hosted endpoint. A compatible AI client uses MCP to discover and call tools.”

**Do I need to sign in?**

“Yes. The hosted endpoint uses OAuth browser sign-in. Your AI client may also require its own account or access plan.”

**Which client should I use?**

“Start with the client you already use. We provide guide pages for Claude Code, Claude.ai / Claude Desktop, Codex CLI, Cursor, Gemini CLI and VS Code. Each page states whether its setup recipe has been verified.”

**Does one connection include every biomedical database?**

“No. The source catalog lists the integrations included in this website’s catalog. Browse it to find the source you need.”

**Where does the data come from?**

“The catalog links each integration to a named upstream source. Check the returned record and source documentation when interpreting data. An AI-generated summary can contain errors.”

**Do I need upstream API keys?**

“Signing in to GeneFoundry is separate from configuring credentials for an upstream service. Check the router and source integration documentation for the requirements of your deployment.”

**Can I use GeneFoundry for clinical decisions?**

“GeneFoundry is for research use only and is not clinical decision support.”

**How can I report a problem?**

“Use the router repository to report a connection issue, or the source integration repository for a source-specific issue. Include reproducible steps and remove credentials and personal data.”

### Footer

Description: “Biomedical MCP sources through one endpoint.”

Links: “Sources”, “Workflows”, “Connect your client”, “About”, “Limitations”, “GitHub”, “Endpoint health check”, “Contact”, “Imprint”. Use the destinations defined above; “Imprint” links to `/imprint/`, a standalone accessible document. Add “Privacy” only when an actual privacy destination has been reviewed and published; never create a dead placeholder link or invent retention assurances.

Closing line: “Research use only. Not clinical decision support.”

Copyright: “© {year} Bernt Popp”. Only add an MIT license label after checking the relevant repository license and scope; do not imply upstream datasets inherit the router’s license. Imprint/legal prose remains an independently reviewed content concern, not copywriter-authored legal advice.

## Client guides: common template and six distinctions

Route IDs preserve the existing six client IDs: `/connect/claude-code/`, `/connect/claude-ai/`, `/connect/codex/`, `/connect/cursor/`, `/connect/gemini/`, `/connect/vscode/`.

H1 pattern: “Connect {client} to GeneFoundry”. Lead: “Use GeneFoundry’s hosted MCP endpoint with {client}. Review sign-in requirements before setting up the connection.”

Required section order and exact labels:

1. “Before you begin” — common OAuth note from the homepage; documented prerequisite client version and account requirements only after verification.
2. “Setup status” — one of the states below, with test version/date only if a test exists.
3. “Add GeneFoundry” — verified instructions or defined fallback; endpoint always visible and copyable.
4. “Sign in” — “Complete the browser sign-in requested by your client. Return to the client to continue.” No promise that this happens only once.
5. “Check the connection” — “Confirm that GeneFoundry appears as connected and that the client can discover its tools.” Add exact observed UI/command only after testing that client. No invented successful tool result.
6. “Troubleshooting” — use relevant failure copy below.
7. “Next steps” — “Explore sources” and “Follow a workflow”.

The six guides use `recipeState` and nullable `code` from the architecture contract. For the initial untested state, `code` is null: there is no command/configuration copy action and no completed-connection indicator. The endpoint remains selectable and copyable.

The following are audit observations about existing recipes, not current client compatibility guarantees. They define what implementers must verify before promoting a recipe:

| Client                     | Distinction to preserve                                                                     | Required verification before executable recipe publication                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code                | Terminal workflow; command must be labeled for Claude Code                                  | Check current add syntax and transport option against official documentation, test browser authorization, then discovery in the recorded CLI version                 |
| Claude.ai / Claude Desktop | Account connector UI; do not conflate a web connector with a local Desktop JSON integration | Verify account eligibility, current connector labels and web/Desktop parity separately; split steps inside this one guide when interfaces differ                     |
| Codex CLI                  | Add and login are separate operations in the existing recipe                                | Verify current CLI help and official documentation; specifically audit existing OAuth client/resource flags, then test login and discovery; remove unsupported flags |
| Cursor                     | Existing recipe uses `mcpServers` and a user-level config file                              | Verify current schema, user versus project scope, secret handling and browser sign-in behavior; explain chosen scope                                                 |
| Gemini CLI                 | Existing recipe uses `httpUrl`, not the other clients’ `url` field                          | Verify current schema, config location, HTTP transport and OAuth support in the tested version; do not normalize keys across clients                                 |
| VS Code                    | Existing recipe uses a `servers` object and project `.vscode/mcp.json`                      | Verify current schema, HTTP type, workspace scope, trust/approval behavior and OAuth flow; do not present this as Cursor configuration                               |

**Mandatory release fallback when a recipe is unverified:** retain the useful guide page and endpoint, but omit executable commands and configuration snippets. Publish status “Documentation link only, no tested recipe” and body “A connection recipe for {client} has not been tested here. Copy the hosted endpoint and follow your client’s official instructions for adding a remote MCP server with OAuth.” CTA “Copy endpoint”; secondary CTA “Open official {client} documentation”. The documentation URL must be checked during implementation and point to the actual relevant first-party guide. If no working relevant guide can be verified, omit that link and show “Contact us for setup help” linked to the existing support address. This is a complete release state, not a TODO. Do not advertise this client as tested or fully supported.

Verified state: “Setup verified with {client} {version} on {date}”. Where a version cannot be identified for a hosted UI: “Setup verified in {client} on {date}”; record account tier and tested platform internally and expose prerequisites that affect access. Official documentation review alone is insufficient for the “Setup verified” badge; call it “Instructions checked against official documentation on {date}” if runtime verification is absent and retain an explicit “Connection not tested” note.

## Representative source page: `/sources/gnomad/`

Breadcrumbs: “Home / Sources / gnomAD”. H1: “gnomAD through GeneFoundry”. Lead: “Explore the gnomAD integration listed in GeneFoundry’s catalog for variant, gene and population frequency queries.”

Facts: “Research area: Variants”; “Namespace: gnomad”; “Listed tools: {tools}”; “Upstream source: gnomAD”. Bind all facts to the `gnomad` entry; reviewed count is 22. Link the source name to its catalog `sourceUrl`.

H2: “Start with tool discovery”. Body: “The catalog lists `gnomad_search_genes` as a representative tool. After connecting your client, inspect the tools and input requirements returned by the service before submitting a query.”

H2: “Review the response”. Body: “Keep the source record link and submitted identifiers with your notes. Record the dataset version and retrieval date when available. This page does not contain a captured gnomAD response.”

H2: “Scope and limitations”. Body: “The listed tool count describes this website’s catalog. It does not confirm current service availability. Consult gnomAD’s documentation for dataset coverage and interpretation, and the integration repository for supported inputs. GeneFoundry is for research use only.”

Links: “Open gnomAD” → `https://gnomad.broadinstitute.org/`; “View integration code” → `https://github.com/berntpopp/gnomad-link`; “Connect your client” → `/#connect`; “Variant evidence workflow” → `/workflows/variant-evidence/`; “All sources” → `/sources/`.

Use the same content structure for other sources but author source-specific “Start with…” and limits sections. Do not generate 21 nearly identical pages solely by swapping a name. If a source lacks useful reviewed content, keep its catalog row and upstream/repository links and defer its detail page; never link to an unpublished path.

## Two workflow outlines with publishable narrative

### `/workflows/variant-evidence/`

H1: “Plan a variant evidence review”. Lead: “Find sources for a variant research question, then inspect their tools and source records.” Badge: “Illustrative workflow”.

“Define your question”: “Decide whether you need a gene lookup or a specific variant record. Keep the identifiers and reference context needed by your chosen source.”

“Choose a source”: “Open the gnomAD source page and review the linked resource and integration repository.” Link `/sources/gnomad/`.

“Inspect the tools”: “Connect your client and inspect the input requirements. The website catalog lists `gnomad_search_genes`; it does not specify a complete request schema.”

“Review the record”: “When you run a query, preserve the submitted identifiers, returned source link, retrieval date and dataset version if supplied. Check the upstream documentation before interpreting the response.”

“Keep interpretation separate”: “A returned record and an AI-generated summary are different artifacts. Review the summary against the record.”

Outcome caption: “This workflow outlines a discovery and review process. It contains no executed query, population frequency or clinical interpretation.” CTA: “Connect your client”.

### `/workflows/phenotype-rare-disease/`

H1: “Explore phenotype and rare disease sources”. Lead: “Find sources for phenotype terms, rare disease concepts and gene–disease curation.” Badge: “Illustrative workflow”.

“Define the scope”: “Write down the phenotype terms and research question you want to investigate. Keep the original terms alongside any identifiers you resolve.”

“Choose sources”: “The catalog includes Human Phenotype Ontology for phenotype terms and associations, Orphadata for rare disease ontology and associations, and ClinGen for gene–disease curation.” Link their source rows or published detail pages; never link to an unpublished detail route.

“Inspect input requirements”: “The catalog lists `hpo_resolve_term`, `orphanet_resolve_disease` and `clingen_get_gene_validity`. Discover their current input schemas in your connected client before forming requests.”

“Review records separately”: “Keep phenotype terms, disease concepts and curation records distinct. Preserve returned identifiers, source links and retrieval dates. Review the upstream records before describing a relationship between them.”

“Document uncertainty”: “Record ambiguous terms, missing information and differences between sources. A matching term or associated record does not establish a diagnosis.”

Outcome caption: “This is a workflow outline. No phenotype association, rare disease match or diagnosis has been retrieved or inferred for this example.” CTA: “Explore sources”.

## About and limitations page copy

`/about/` H1: “About GeneFoundry”. Lead: “GeneFoundry is a gateway for a catalog of biomedical MCP servers.” Body: “The website helps researchers and developers choose a source and connect an AI client. Source entries link to the upstream resource and integration code. The project is maintained by Bernt Popp.” Links: router repository, source directory, contact, limitations. Do not add funding, institutional affiliation, user numbers or guarantees without evidence.

`/limitations/` H1: “Scope and limitations”. Intro: “Use GeneFoundry for research. Review source records and documentation before relying on a result.” Sections: “Research use” — “GeneFoundry is not clinical decision support.”; “Catalog and availability” — “Catalog entries and tool counts describe the website’s published inventory. A listed integration may be unavailable.”; “Source evidence” — “Coverage, versions and response fields depend on the source and integration. Check the original record and note missing information.”; “AI summaries” — “An AI-generated answer may misread or omit evidence. Review it against the source response.”; “Access and source terms” — “Hosted OAuth sign-in is separate from upstream credentials and source terms. Review the relevant source and integration documentation.”; “Examples” — “Illustrative examples explain a process and are labeled. They do not establish that a query was run.”

## Exact interface states

| Context                                     | Exact visible copy                                                                                    | Action / condition                                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Filter count                                | “{count} sources found” / “1 source found”                                                            | Announce changes politely; zero uses empty state below                                                         |
| Active category                             | “Research area: {category}”                                                                           | Clear action “Clear filters” resets search and category                                                        |
| No matches                                  | “No sources match your search.”                                                                       | “Try another source name or clear the filters.”; “Clear filters”                                               |
| Catalog absent                              | “The source catalog is unavailable.”                                                                  | “Reload the page or open the router repository.”; “Reload page”, “Open repository”                             |
| Loading catalog, only if truly asynchronous | “Loading sources…”                                                                                    | Do not display on already prerendered content                                                                  |
| Copy pending                                | “Copying…”                                                                                            | Expose busy state                                                                                              |
| Copy endpoint success                       | “Endpoint copied”                                                                                     | Only after confirmed clipboard success                                                                         |
| Copy recipe success                         | “Setup copied”                                                                                        | Only after confirmed clipboard success                                                                         |
| Copy failure                                | “Couldn’t copy. Select and copy the text manually.”                                                   | Keep text selectable; button “Try copying again”                                                               |
| Client not selected                         | “Choose your AI client to see setup instructions.”                                                    | Selector “AI client”                                                                                           |
| Authentication recovery                     | “Sign-in did not complete. Return to your client and start sign-in again.”                            | Guide text or observed failure only; page must not infer external session state                                |
| Tool discovery recovery                     | “No GeneFoundry tools appeared. Check the endpoint and sign-in, then retry discovery in your client.” | Guide text or observed failure only                                                                            |
| Endpoint check unknown                      | “Endpoint status not checked”                                                                         | Default; action “Open endpoint health check”                                                                   |
| Health request failed                       | “Couldn’t check endpoint status.”                                                                     | “Try again” only when real fetch exists; never translate this into global outage                               |
| Confirmed endpoint unavailable              | “Endpoint unavailable at last check.”                                                                 | Show actual timestamp; “Check again”; requires validated response semantics                                    |
| Stale recipe                                | “Setup instructions need rechecking.”                                                                 | “Client behavior may have changed since the last verification.”; fall back to endpoint-only setup              |
| Offline with cached page                    | “You’re offline. This saved page may be out of date.”                                                 | “Setup and source queries need an internet connection.”; do not claim cached responses                         |
| Unknown route                               | “Page not found”                                                                                      | “The address may have changed. Browse sources or return home.”; “Browse sources”, “Return home”; true HTTP 404 |
| Unpublished result                          | “No recorded response is included in this example.”                                                   | Static illustration caption, not a runtime error                                                               |

Do not show authentication, tool-discovery or offline outcomes as observed facts without a corresponding observable signal. A static guide can present them as troubleshooting conditions. Staleness must be driven by an explicit review policy or known invalidation, not an invented timestamp. Dates and status colors always retain text labels.

## Metadata and index copy

Homepage title: “GeneFoundry | Biomedical sources for AI tools”. Description: “Explore biomedical MCP sources and connect your AI client to GeneFoundry. Browse source details, setup guides and research workflow outlines.”

Source title: “{source} MCP integration | GeneFoundry”. Description pattern: “Explore GeneFoundry’s {source} integration for {reviewed task phrase}. Find source links, a listed tool and connection guidance.” Use natural, individually edited task phrases; do not splice awkward catalog punctuation.

Client title: “Connect {client} to GeneFoundry”. Description: “Find the GeneFoundry endpoint, sign-in requirements and setup guidance for {client}. Check the recipe’s verification status before connecting.”

Workflow title: “{workflow title} | GeneFoundry”. Description: a unique one-sentence purpose plus “An illustrative research workflow.” No promises of retrieved findings.

About title: “About GeneFoundry”; limitations title: “Scope and limitations | GeneFoundry”. Imprint title: “Imprint | GeneFoundry”. Index titles: “Biomedical sources | GeneFoundry”, “Connect your AI client | GeneFoundry”, “Research workflows | GeneFoundry”. Index lead for connect: “Choose your client to review setup and sign-in requirements.” Index lead for workflows: “Explore illustrative ways to find sources and review their evidence.”

Use the same core title/description for social metadata with purposeful short image text: “Biomedical data. One MCP connection.” Social image alternative text: “GeneFoundry — biomedical MCP source catalog and client setup guides.” No counts in metadata/PWA copy unless bound to the same catalog generator. Canonicals must use each actual published URL. Unpublished pages must not appear in navigation or the sitemap. FAQ answers must be visible; adding structured data cannot substitute for content.

## Claims ledger and release disposition

“Approved from source” means approved for the bounded wording here, not independently verified runtime behavior. The evidence basis is repository content inspected on 5 September 2026, including `src/data/servers.ts`, `src/components/ConnectSection.vue`, `FooterSection.vue`, `ImprintModal.vue`, the website review and modernization brief.

| Claim                                                                | Evidence / status                                                         | Approved wording or release action                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Endpoint address                                                     | Catalog constant; approved from source                                    | “Hosted MCP endpoint: https://genefoundry.org/mcp”                                         |
| Source names, URLs, namespaces, representative tool names and counts | Catalog; approved as listed inventory                                     | Use “listed”, bind values; do not claim current live parity                                |
| OAuth sign-in requirement                                            | Existing setup disclosure; approved as current documented requirement     | Prominent browser sign-in note; no “once”, “no signup” or account eligibility promises     |
| Backend key requirements                                             | Not established per integration                                           | Separate from OAuth; point to deployment docs; no blanket “no keys”                        |
| Six client recipes work today                                        | Existing recipes only; needs official-doc and runtime verification        | Use explicit endpoint-only fallback until recipe gates pass                                |
| Current Codex OAuth CLI flags                                        | Existing source only; unverified                                          | Do not publish flags without current help/docs plus connection test                        |
| One gateway / multiple integrations                                  | Current product/catalog representation; approved bounded description      | “A catalog of biomedical MCP servers behind one endpoint”                                  |
| MCP definition                                                       | Editorial conceptual explanation                                          | Plain-language definition; do not imply all clients accept the same configuration          |
| Open source / maintainer identity                                    | Public repository reference and footer/imprint; approved project identity | Link code and name Bernt Popp; inspect LICENSE before attaching license claims             |
| Research-use boundary                                                | Existing footer and audit; approved                                       | “Research use only. Not clinical decision support.”                                        |
| Biomedical values or clinical interpretation                         | No captured response reviewed                                             | Omit; publish discovery illustration                                                       |
| Upstream citations and versions always returned                      | No schemas or runtime responses reviewed                                  | Do not promise; use “when available” / “if supplied”                                       |
| Tool names and request schemas                                       | Names in catalog; schemas not reviewed                                    | Show listed name only; no fabricated arguments or response properties                      |
| Healthy / Live / uptime / latency                                    | No relevant runtime evidence                                              | Default “Endpoint status not checked”; avoid health badge as ornament                      |
| Data retention, privacy, source licensing                            | Not established                                                           | No invented policy. Preserve actual legal destination; review separately before new claims |
| Every biomedical source / trustworthy or grounded answers            | Unsupported universals                                                    | Remove; bounded catalog language and inspectable evidence process                          |

Publication review: check bound values against the catalog, all destinations against published routes, visible authentication before copy, illustration labels in both visual and text representations, metadata consistency, and absence of unverified recipe code. These are content acceptance checks; deployment and backend verification remain separate work.
