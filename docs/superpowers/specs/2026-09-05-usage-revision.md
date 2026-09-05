# User-directed implementation revision

This revision supersedes conflicting portions of the original design, copy, contracts and plans. The user reviewed the working site and requested concrete executed examples, browser setup, less repetitive copy, different body typography and consistent page widths.

## Product and presentation

- Use Archivo headings and self-hosted Source Sans 3 body. Inter is removed, not exempted from the detector.
- Remove the abstract discovery trace. Demonstrate a real user prompt, the observed tool activity and a recorded result from the hosted GeneFoundry MCP.
- Both worked examples are executed through Claude Code 2.1.261 using its existing authenticated Claude.ai GeneFoundry connection. This verifies these tool calls; it does not claim a fresh add-and-login flow was tested for every client.
- Homepage: direct explanation, concrete example, source directory preview, tested example links, useful browser-first setup and footer. Remove repeated homepage FAQ/maintenance sections; retain relevant detail on dedicated pages. FAQ schema appears only where those answers are visible.
- All page types share the main container and gutters. Use purposeful desktop content columns and readable text inside them; do not center a narrow, font-dependent article across otherwise wide pages.

## Client instructions

Seven guides: Claude browser/Desktop, ChatGPT browser, Claude Code, Codex CLI, Cursor, Gemini CLI and VS Code. Browser clients appear first; Claude browser is the default. Provide actual documented steps and syntax, with a concise distinction between documentation review and execution testing.

`ClientGuide` adds `{ recipeState: 'documented'; code: string; recipeTest: null }`. Browser click instructions may retain `documentation-only` with null code. Only `verified` has a non-null RecipeTest and may claim the fresh setup recipe was executed. Five coding-client snippets are documented; two browser guides give current UI paths. No page calls a documentation check an execution test.

ChatGPT current developer documentation describes Settings → Security and login → Developer mode, followed by Plugins and its add control. Its Help Center also documents an Apps interface used by some workspaces; the guide gives that alternative and links both sources. Claude instructions use Customize → Connectors and conversation-level enablement. Account/workspace eligibility is stated where it affects setup.

## Executed examples

The first example resolves HNF1B on GRCh38, retrieves gene constraint and queries five ClinVar records ordered by review stars. The result separates gene-level population constraint from variant-level assertions and includes source links and returned release metadata.

The second resolves renal cyst and diabetes mellitus in HPO, fetches complete exact-term gene sets (no descendants), intersects them, and checks HNF1B gene–disease validity in ClinGen. The result states complete pagination, overlap and the actual assertion. An overlap is not a diagnosis or gene ranking.

Workflow adds `prompt: string`, `outcome: string`, `result: WorkflowResult | null`. WorkflowStep adds `arguments: Record<string, unknown> | null` and `inspect: string[]`. WorkflowResult contains `summary`, tables with caption/columns/rows, notes, sources, executedAt and client. Public results are small sanitized factual projections; raw CLI sessions remain ignored. Each verified workflow joins sanitized execution JSON through its opaque executionReviewId at build time.

The route count now derives from 21 sources + 7 clients + 2 workflows + 7 static content pages = 37 public pages, plus the noindex 404 document. Tests and machine content must derive counts from the registry rather than preserve the old 36-page literal.
