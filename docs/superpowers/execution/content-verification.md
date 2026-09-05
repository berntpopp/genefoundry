# Current publication evidence

Both research workflows now publish actual captured GeneFoundry responses, executed through Claude Code 2.1.261 on 2026-09-05. The earlier documentation-only/illustration notes below describe superseded implementation stages, not the current workflow publication state.

- `variant-evidence`: three captured calls, gnomAD HNF1B gene resolution and constraint followed by five ClinVar records. Exact arguments are published in the collapsed method. Rounded constraint metrics and each variant classification/accession are checked against sanitized execution JSON.
- `phenotype-rare-disease`: seven captured calls, exact HPO terms without descendants, all 129 + 222 gene records, and the HNF1B ClinGen assertion. The 13-gene intersection is independently recomputed from NCBI gene IDs in a regression test. The diabetes list is verified complete at 200 + 22 records.
- Execution evidence is stored only under `docs/superpowers/execution/verification/`, with two opaque workflow IDs joined by the build-only ledger. Request IDs and latency fields were removed. No credentials or user account/session data are included.
- Client guides distinguish documentation-only browser setup, documented code/configuration, and verified recipes. No new add/login recipe was tested; observed workflow execution used an existing Claude account connection. No client recipe claims verified status from these executions.

The public results preserve source versions, retrieval date, variant/gene identity, ClinVar classifications/review statuses, and the actual ClinGen curation permalink. Numeric rounding is stated. The page does not classify a new variant or diagnose an individual.

Current validation: eight content/contracts tests pass, including exact-call/evidence joins, numeric and classification comparisons, and the independently calculated HPO overlap. The final B browser suite passes 12/12, including both actual result pages, prompt copy/failure, all seven client states, clipboard races, axe, and dark-panel keyboard focus. Full TypeScript and scoped ESLint pass. Eight 390px/1440px captures of both workflows, Claude setup and imprint have document widths equal to their viewports; the HNF1B desktop and phenotype mobile captures were visually inspected.

## Historical implementation record

# Content and documentation verification

Editorial review date: 2026-09-05. This is documentation evidence, not a hosted connection or biomedical execution report.

All 21 integration README files were fetched from their first-party GitHub repositories (raw main/README.md), and the purpose, tool table, identifier forms, data provenance and License section were inspected. Listed namespace/tool names remain the maintained website inventory: no live count or deployment parity was measured. The README License sections distinguish software rights from upstream data and attribution requirements. Source detail links describe that documentation basis; no blanket data license is asserted. All dataVersion fields remain null because a deployed version was not queried.

## Sources

### PubTator3 (pubtator)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/pubtator-link#readme); [data terms section](https://github.com/berntpopp/pubtator-link#license). Representative catalog tool checked against README: `pubtator_search_literature`.

Purpose checked: Search biomedical literature and inspect machine-annotated entities and relations from PubTator3.

Identifier forms: PubMed search text; PMID; PMCID; PubTator entity identifiers.

Publication boundaries: An extracted entity or relation is an annotation, not independent confirmation of an experimental finding. Full-text coverage depends on article access; publication reuse terms still apply.

### gnomAD (gnomad)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/gnomad-link#readme); [data terms section](https://github.com/berntpopp/gnomad-link#license). Representative catalog tool checked against README: `gnomad_search_genes`.

Purpose checked: Explore population variation, gene constraint and coverage through the listed gnomAD integration.

Identifier forms: Gene symbol or alias; Ensembl gene identifier; CHROM-POS-REF-ALT with reference assembly; rsID resolved to a canonical variant identifier.

Publication boundaries: Dataset and reference assembly must agree: the integration documents different query schemas for GRCh37 and GRCh38 releases. A gene lookup does not identify a specific allele. Resolve the complete variant before querying its frequency. Missing records, low coverage and filtered observations must not be interpreted as proof that a variant is absent from a population. This page includes no captured frequency response. Record the dataset version returned by your query; the deployed version has not been measured here.

### Orphadata (orphanet)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/orphanet-link#readme); [data terms section](https://github.com/berntpopp/orphanet-link#license). Representative catalog tool checked against README: `orphanet_resolve_disease`.

Purpose checked: Resolve rare disease concepts and explore Orphadata nomenclature, classifications and associations.

Identifier forms: Disease label or synonym; ORPHA code; External disease CURIE such as OMIM or MONDO.

Publication boundaries: The integration reads a local index of English Orphadata knowledge files, whose release may differ from the current website. An association or cross-reference does not establish a diagnosis; retain the original disease concept and mapping context.

### ClinGen (clingen)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/clingen-link#readme); [data terms section](https://github.com/berntpopp/clingen-link#license). Representative catalog tool checked against README: `clingen_get_gene_validity`.

Purpose checked: Review ClinGen gene–disease validity, dosage, actionability and expert-panel evidence as distinct curation domains.

Identifier forms: Gene symbol or alias; HGNC identifier; MONDO disease identifier.

Publication boundaries: Different evidence domains have different review processes and identifiers. A validity classification is not a variant classification. The integration combines snapshot-backed domains; inspect source dates and expert-panel records before interpretation.

### Human Phenotype Ontology (hpo)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/hpo-link#readme); [data terms section](https://github.com/berntpopp/hpo-link#license). Representative catalog tool checked against README: `hpo_resolve_term`.

Purpose checked: Resolve phenotype terminology and explore the Human Phenotype Ontology hierarchy and curated associations.

Identifier forms: Phenotype label or synonym; HP:NNNNNNN identifier; External ontology CURIE supported by the resolver.

Publication boundaries: HPO terms describe phenotypic abnormalities; a matching term or associated disease does not establish a diagnosis. The integration reads a pinned local ontology and annotation snapshot. Its loaded release may differ from the latest upstream release. Cross-ontology mappings have different predicates and may be ambiguous. Preserve the original wording and inspect the resolved term, obsolescence and mapping relationship. Gene associations may be derived through disease annotations; inspect that provenance rather than treating all edges as direct experimental findings.

### MaveDB (mavedb)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/mavedb-link#readme); [data terms section](https://github.com/berntpopp/mavedb-link#license). Representative catalog tool checked against README: `mavedb_search_score_sets`.

Purpose checked: Find multiplexed variant-effect experiments and inspect scores with their assay and calibration context.

Identifier forms: Score-set URN; Variant URN; Score-set URN together with HGVS notation.

Publication boundaries: A raw functional score has no universal pathogenicity threshold; calibration belongs to its score set. Each score set has its own reuse license, experimental system and measured effect.

### UniProt (uniprot)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/uniprot-link#readme); [data terms section](https://github.com/berntpopp/uniprot-link#license). Representative catalog tool checked against README: `uniprot_find_proteins`.

Purpose checked: Explore protein function, features and cross-references through the UniProt integration.

Identifier forms: UniProt accession; Gene symbol with organism context; Taxonomy identifier.

Publication boundaries: Distinguish reviewed and unreviewed entries and retain organism and isoform context. Broad SPARQL joins can be capped or rejected; a limited response is not a complete protein inventory.

### MGI (mgi)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/mgi-link#readme); [data terms section](https://github.com/berntpopp/mgi-link#license). Representative catalog tool checked against README: `mgi_get_marker_phenotypes`.

Purpose checked: Explore mouse genes, alleles and phenotypes from Mouse Genome Informatics.

Identifier forms: Mouse gene symbol; MGI identifier; Human symbol or HGNC identifier for ortholog resolution.

Publication boundaries: Mouse phenotype evidence is model-specific and is not a direct prediction of a human phenotype. The local index depends on bulk-report freshness; retain allele and genetic-background context.

### GeneReviews (genereviews)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/genereviews-link#readme); [data terms section](https://github.com/berntpopp/genereviews-link#license). Representative catalog tool checked against README: `genereviews_search_genereviews`.

Purpose checked: Find expert-authored GeneReviews chapters and review passages in their chapter context.

Identifier forms: Gene symbol; NCBI Bookshelf NBK accession; Passage identifier returned by the integration.

Publication boundaries: Chapters have individual update dates; a passage does not replace the full review or establish current clinical guidance. GeneReviews text is copyrighted and has specific attribution and redistribution terms.

### Mondo (mondo)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/mondo-link#readme); [data terms section](https://github.com/berntpopp/mondo-link#license). Representative catalog tool checked against README: `mondo_resolve_disease`.

Purpose checked: Resolve disease terminology and inspect Mondo hierarchy and cross-ontology mappings.

Identifier forms: Disease label or synonym; MONDO identifier; External disease CURIE.

Publication boundaries: A cross-reference may not assert exact equivalence; inspect its mapping predicate. The integration uses a local release index and can include obsolete concepts.

### GenCC (gencc)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/gencc-link#readme); [data terms section](https://github.com/berntpopp/gencc-link#license). Representative catalog tool checked against README: `gencc_resolve_identifier`.

Purpose checked: Compare submitted gene–disease validity assertions in the Gene Curation Coalition resource.

Identifier forms: Gene symbol; HGNC identifier; MONDO or OMIM disease identifier.

Publication boundaries: Assertions from different submitters can disagree or use different disease scopes. Preserve the submitter, classification and date. A gene–disease assertion is not a classification of a particular variant.

### MetaDome (metadome)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/metadome-link#readme); [data terms section](https://github.com/berntpopp/metadome-link#license). Representative catalog tool checked against README: `metadome_resolve_transcript`.

Purpose checked: Explore protein tolerance landscapes and domain context for a resolved MetaDome transcript.

Identifier forms: Gene symbol; Versioned Ensembl transcript identifier.

Publication boundaries: Transcript and dataset build determine which residues can be compared. Not every transcript is analyzable. Homologous-domain aggregates and residue-specific annotations are different evidence; tolerance does not establish pathogenicity.

### STRING (stringdb)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/stringdb-link#readme); [data terms section](https://github.com/berntpopp/stringdb-link#license). Representative catalog tool checked against README: `stringdb_get_interaction_partners`.

Purpose checked: Explore STRING protein association networks and their supporting evidence channels.

Identifier forms: STRING protein identifier; Gene symbol or synonym; UniProt accession with organism context.

Publication boundaries: A STRING association need not be a direct physical interaction; inspect evidence channels and scores. Network thresholds, species and response limits change the set of reported partners.

### GTEx Portal (gtex)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/gtex-link#readme); [data terms section](https://github.com/berntpopp/gtex-link#license). Representative catalog tool checked against README: `gtex_get_median_expression_levels`.

Purpose checked: Explore tissue-level expression and regulatory associations in open-access GTEx Portal data.

Identifier forms: Gene symbol; Versioned GENCODE/Ensembl gene identifier; GTEx tissue identifier.

Publication boundaries: Median tissue expression is an aggregate and does not describe an individual patient or cell type. Gene identifiers must match the selected dataset. Protected individual-level data are outside this integration’s documented scope.

### HGNC (hgnc)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/hgnc-link#readme); [data terms section](https://github.com/berntpopp/hgnc-link#license). Representative catalog tool checked against README: `hgnc_resolve_symbol`.

Purpose checked: Resolve approved human gene symbols, aliases and cross-references using HGNC nomenclature.

Identifier forms: Approved gene symbol; Previous or alias symbol; HGNC identifier; Supported external gene identifier.

Publication boundaries: Aliases can be ambiguous and records can be withdrawn. Inspect match type and candidates before choosing a gene. A nomenclature match identifies a gene; it is not evidence for a disease relationship.

### PanelApp (panelapp)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/panelapp-link#readme); [data terms section](https://github.com/berntpopp/panelapp-link#license). Representative catalog tool checked against README: `panelapp_search_panels`.

Purpose checked: Explore curated gene panels from Genomics England and PanelApp Australia.

Identifier forms: Panel name or disorder text; Panel identifier with region; Approved gene symbol.

Publication boundaries: Panel identifiers are region-specific; retain the portal, panel version and sign-off context. Confidence categories and panel inclusion are curated evidence summaries, not a patient-specific diagnostic conclusion.

### AutoPVS1 (autopvs1)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/autopvs1-link#readme); [data terms section](https://github.com/berntpopp/autopvs1-link#license). Representative catalog tool checked against README: `autopvs1_get_variant_pvs1_data`.

Purpose checked: Inspect AutoPVS1 loss-of-function evidence for sequence variants and copy-number changes.

Identifier forms: CHROM-POS-REF-ALT for SNVs/indels; CHROM-START-END-DEL or DUP for CNVs; Explicit hg19 or hg38 genome build.

Publication boundaries: PVS1 is one evidence criterion, not a complete variant classification. Transcript and disease mechanism matter. The integration documents an HTML-scraping dependency that can change without a versioned API contract.

### SpliceAI Lookup (spliceai)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/spliceailookup-link#readme); [data terms section](https://github.com/berntpopp/spliceailookup-link#license). Representative catalog tool checked against README: `spliceai_predict_splicing`.

Purpose checked: Inspect predicted splice effects through SpliceAI Lookup, with model and consequence context.

Identifier forms: CHROM-POS-REF-ALT with genome build; HGVS or rsID resolved to a canonical variant.

Publication boundaries: Predicted splice effects are computational evidence and do not establish an experimentally observed effect. Models and annotations have separate terms; retain genome build, model context and submitted allele.

### Ensembl VEP (vep)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/vep-link#readme); [data terms section](https://github.com/berntpopp/vep-link#license). Representative catalog tool checked against README: `vep_annotate_variant`.

Purpose checked: Annotate sequence variants and inspect transcript consequences through Ensembl VEP.

Identifier forms: HGVS notation; rsID; Genomic CHR-POS-REF-ALT; SPDI or VCF representation supported by the recoder.

Publication boundaries: Consequences depend on reference assembly, transcript and annotation release. Preserve these with the variant. A predicted consequence is not a pathogenicity classification; batch and response limits may omit detail.

### ClinVar (clinvar)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/clinvar-link#readme); [data terms section](https://github.com/berntpopp/clinvar-link#license). Representative catalog tool checked against README: `clinvar_get_variant`.

Purpose checked: Review submitted variant classifications, review status and condition context from ClinVar.

Identifier forms: VCV accession; VariationID; dbSNP rsID; HGVS expression; AlleleID.

Publication boundaries: ClinVar archives submitted classifications; it does not independently curate or change a classification without a submission. Conflicting submissions and different condition scopes can coexist. Review the supporting evidence, submitter and date rather than treating an aggregate label as a conclusion. The integration uses a local weekly-release index. The loaded snapshot and available fields can differ from the current ClinVar web record. VCV records aggregate by variant, while RCV records aggregate by variant–condition pair. Keep the relevant accession and reference sequence.

### LitVar2 (litvar)

Reviewed: 2026-09-05. [Integration README](https://github.com/berntpopp/litvar-link#readme); [data terms section](https://github.com/berntpopp/litvar-link#license). Representative catalog tool checked against README: `litvar_get_variant_literature`.

Purpose checked: Find publications associated with genetic variants in NCBI LitVar2.

Identifier forms: dbSNP rsID; Gene symbol; Protein notation supported by autocomplete.

Publication boundaries: A publication mentioning a variant may not provide evidence about that variant’s effect. Read the article and the variant context. Literature indexing and accessible text are incomplete; no result does not prove that no publication exists.

## Client documentation

Verified clients: none. Documentation-only clients: Claude Code, Claude.ai / Claude Desktop, Codex CLI, Cursor, Gemini CLI and VS Code. All have code:null and recipeTest:null. No login, credential collection or tool discovery was performed for these clients.

- **Claude Code:** [official MCP guide](https://code.claude.com/docs/en/mcp), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Open the official HTTP MCP server instructions for Claude Code. Use the hosted endpoint when adding a remote server. Choose scope deliberately, then follow Claude Code’s authorization guidance. Runtime connection not tested.
- **Claude.ai / Claude Desktop:** [official MCP guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Use the official custom remote connector guide and supply the hosted endpoint in the connector interface. For Claude Desktop, follow the documented remote connector workflow for your account. Do not substitute a local stdio configuration for a hosted connector. Runtime connection not tested.
- **Codex CLI:** [official MCP guide](https://developers.openai.com/codex/mcp/), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Open the official Codex MCP guide for remote Streamable HTTP servers. Add the hosted endpoint using the documented configuration flow, then complete the documented OAuth login for that server. Inspect your installed CLI help if options differ. Runtime connection not tested.
- **Cursor:** [official MCP guide](https://cursor.com/docs/mcp), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Follow Cursor’s official remote MCP instructions using the hosted endpoint. Cursor documents project .cursor/mcp.json and user ~/.cursor/mcp.json locations. Use its own remote-server schema and complete requested OAuth authorization. Runtime connection not tested.
- **Gemini CLI:** [official MCP guide](https://geminicli.com/docs/tools/mcp-server/), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Open the Gemini CLI guide for HTTP-based MCP servers and OAuth. Use the hosted endpoint in the documented HTTP configuration. Gemini CLI’s httpUrl setting is distinct from the url field used by some other clients. Runtime connection not tested.
- **VS Code:** [official MCP guide](https://code.visualstudio.com/docs/agent-customization/mcp-servers), opened 2026-09-05. Checked remote transport and configuration scope/authentication documentation. Follow the official VS Code guide to add an HTTP MCP server using the hosted endpoint. Choose workspace or user scope. VS Code’s workspace configuration uses .vscode/mcp.json and its own servers schema; follow the documented trust and sign-in prompts. Runtime connection not tested.

Codex review used the OpenAI Docs skill, official MCP page (redirecting to learn.chatgpt.com/docs/extend/mcp?surface=cli), and local read-only `codex mcp --help`, `codex mcp add --help`, `codex mcp login --help`. The local help exposes HTTP add and a login subcommand. Available options are not proof of server interoperability; no flags or executable setup are published. Cursor’s older docs URL redirected to the docs index; the relevant current /docs/mcp page was then opened. VS Code’s older customization URL redirected to /docs/agent-customization/mcp-servers. Claude’s official remote connector page documents account restrictions and web/Desktop availability; the website makes no verified eligibility claim.

## Illustration and legal preservation

Both workflow records are illustrative with executionReviewId:null. They contain no executed query, invented biomedical response, citation result, diagnosis or frequency. The execution ledger intentionally contains no records.

The English and German legal content objects and contact details were copied verbatim from the original ImprintModal into ImprintPage, with only semantic document layout and always-available language anchors added. This migration does not re-review or amend the legal claims.

## Verification results

- Tests authored before implementation. Initial npm test could not run because coordinator had not installed the test script yet; recorded as a harness dependency, not a behavioral failure.
- Content/contracts: 6 tests passed after fixing source-reference completeness.
- TypeScript: full type-check passed.
- Scoped ESLint: passed for all B source and test files.
- Onboarding: 7 browser tests passed, including denied clipboard, false legacy fallback, absolute endpoint, six selections, stale completion, verified UI fixture success/reset and denial. UI fixtures are explicitly labeled and are not compatibility evidence.
- First evidence/axe run: 2 tests failed solely for the missing dev document title. After the build owner supplied the dev title, the complete B browser suite passed: 9/9. Axe covers the trace disclosure, default and selected documentation-only clients, and denied-copy recovery.
- Static no-JavaScript content tests authored; execution pending integrated root/mirror artifacts at G1.

Additional primary terms review: the GeneReviews NCBI copyright/usage page was retrieved and read; its direct URL is published. gnomAD policies and GTEx license returned JavaScript shells, HPO license failed browser retrieval, and Ensembl disclaimer timed out. Those records retain the actually reviewed integration data-terms section rather than claiming independent primary-policy verification.

Final B component gate: all B source files pass scoped non-mutating ESLint; full Vue TypeScript check and 6 content/contracts tests pass. A one-time Node VM object comparison against git HEAD confirmed every English/German legal string and contact field is identical before removing the old modal. Unused universal ADD_COMMAND was removed with coordinator approval after all consumers were deleted. A confirmed final compact three-stage trace with listed tool in the static native disclosure.

Independent interface review follow-up: CommandCard now uses a scoped light focus outline on its dark panel. A real keyboard regression tabs between endpoint copy and the named code region, requiring a solid outline at least 2px wide and computed contrast of at least 3:1 against the panel; it passed. Scoped lint passed. This adds one passing browser check to the earlier 9/9 suite.

## Actionable workflow revision after user review

The user rejected the original abstract workflow outlines. They were replaced with two reusable research prompts and specific documented call sequences: HNF1B gene constraint plus a ClinVar overview and five records; renal cyst / diabetes HPO association-set comparison plus separate HNF1B ClinGen curation. No tool results are shown or inferred. The workflow execution records remain null.

Each example argument object was checked against the actual Python tool signature in adjacent source checkouts, with pinned GitHub blob references published beside the inputs:

- gnomad-link `6922250c0d87f57378b7d8bafb18c7ff95e1ae87`: `mcp/tools/search.py` and `genes.py`. Search uses `query`, GRCh38, limit5; details use `gene`, GRCh38, compact mode. Constraint is not presented as allele frequency.
- clinvar-link `b16f6ffd336fda734f6d58cf0b0603107a787fe8`: `mcp/tools/genes.py`, with response guidance additionally checked in `docs/mcp-tool-catalog.md`. Summary uses `gene_symbol`; variant listing uses `gene_symbol`, `sort:stars_desc`, `limit:5`, `offset:0`, compact mode. Pagination and variant/condition context remain explicit.
- hpo-link `e2b24a3a2c36e80ebb9deab3fb69a97029b66efc`: `mcp/tools/ontology.py`, `annotations.py` and `docs/usage.md`. Resolver uses `query`; association listing uses `hpo_id`, `include_descendants:true`, `limit:200`, `offset:0`, compact mode. The prompt requires complete pagination before set intersection.
- clingen-link `09ead33761449e80df72cd2f76ee3fe1d25c1ad6`: `mcp/tools/genes.py` and `validity.py`. Resolve with `query:HNF1B`, then validity with `gene_symbol:HNF1B`, compact mode. The fixed gene is never claimed to be an HPO overlap result.

The reviewed files match their pinned HEAD contents (non-mutating git diff checks). HPO term labels were independently checked by retrieving the current primary ontology file at `https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo`: HP:0000107 is “Renal cyst”; HP:0000819 is “Diabetes mellitus”. The primary website term pages failed browser retrieval, so the ontology file is the evidence basis. No term association outputs were fetched.

A new content regression failed on the old missing prompt/outcome fields before the implementation. New browser checks cover actual prompt copy, denied-copy manual recovery, keyboard opening of real JSON argument examples, and automated accessibility. Browser-first onboarding now defaults to Claude’s remote connector and displays reviewed steps before a brief untested-status line. The coordinator owns the new ChatGPT record and client documentation changes.
