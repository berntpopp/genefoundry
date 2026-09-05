# Genetics workflow expansion — 6 September 2026

Seven new worked examples extend the two existing examples. Each page contains a reusable prompt, an actual returned result, source links, exact tool arguments and a dated execution record. The new examples contain 28 recorded data calls. At the user’s request, all nine workflows were then rerun with explicit `--model opus` through Claude Code 2.1.261: 38 actual GeneFoundry calls, including the documented population-lookup failure. Every published capture records `claude-opus-5`, and the website identifies Claude Opus 5 as the executing model. Direct Codex connector authentication failed; the successful Claude connection was used instead. Raw discovery/recovery logs remain ignored under `.build/live-mcp/`; sanitized public-data captures are registered in `verification-ledger.json`.

| Task                  | Concrete example                    | Actual result and interpretation boundary                                                                                                                                                                                          |
| --------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Variant annotation    | CFTR NM_000492.4:c.1521_1523del     | VEP in-frame deletion, MANE Select and alternative transcript comparison; ClinVar VCV000007105. Different transcript versions and VCF spellings remain explicit; VEP impact is not an ACMG classification.                         |
| Literature review     | HNF1B renal-development experiments | Three complete abstracts, PMIDs 33737325, 36402859 and 36522156, support a model-and-finding comparison. Full-text methods and figures were not reviewed.                                                                          |
| Report summary        | HNF1B gene-level research summary   | GeneReviews chapter passages and a ClinGen assertion support a concise draft. Intragenic HNF1B disease is distinguished from the broader 17q12 deletion syndrome. Corpus and live chapter revision dates differ and are disclosed. |
| Gene–disease validity | MYH7                                | Five ClinGen assertions and 21 GenCC submissions across 11 disease groups; disease, inheritance, submitter and date remain separate. No single gene-wide validity label is inferred.                                               |
| ACMG evidence review  | HNF1B c.529C>T, p.Arg177Ter         | Source assertions and an AutoPVS1 suggestion form a review worksheet. A failed gnomAD lookup leaves PM2 unassigned; inferred PVS1 strength is not independently assigned, and no overall classification is manufactured.           |
| Animal models         | Pax2 renal phenotypes               | Four selected genotype/phenotype records with genetic backgrounds, references and allele types. The returned sample is 30 of 68 annotations; conditional-genotype exclusions and background confounding are stated.                |
| Candidate expression  | HNF1B, PAX2 and GATA3               | Nine GTEx v10 median TPM values across adult kidney cortex, medulla and pancreas, with sample counts and versioned gene identifiers. Adult bulk expression is not a developmental assay or proof of pathogenicity.                 |

## Scientific review

The examples were reviewed against exact MCP responses, not merely catalog descriptions. Independent reviews checked all ClinGen/GenCC assertion joins, nine expression values, mouse genotype/background/phenotype/reference joins, annotation transcript versions and coordinate spellings, abstract-supported findings, and report-scope distinctions. Source aggregate classifications are kept separate from independently assigned criteria.

The ACMG worksheet follows the distinctions in [ClinGen variant-classification guidance](https://www.clinicalgenome.org/tools/clingen-variant-classification-guidance/) and the [Sequence Variant Interpretation working group](https://www.clinicalgenome.org/working-groups/sequence-variant-interpretation/). In particular, missing allele numbers do not establish rarity, automated truncation predictions require contextual review, and a source classification is not an independent pathogenic criterion. [ClinGen gene–disease validity](https://www.clinicalgenome.org/curation-activities/gene-disease-validity/) is attached to a relationship, not automatically every disorder associated with a gene.

## Implementation

Each workflow now has its own data module. A shared finite workflow registry drives route validation; routes and metadata are derived from the published collection. The homepage retains two featured examples, while the directory lists all nine. No animation or visual theme changes were made.

Regression checks compare published calls with the sanitized ledger, join expression by gene/tissue identity rather than response order, preserve both annotation coordinate spellings, require actual abstract text behind each literature citation, and keep missing-frequency ACMG criteria unassigned. Browser tests cover prompt copying and recorded-result rendering for every workflow; the existing all-route checks also expand automatically to the new pages.

## Explicit Opus verification

The first Opus attempts hit Claude’s five-hour quota (the CLI also described a spend limit). No complete workflow was labeled Opus-tested from those partial runs. After the reported 00:50 Europe/Berlin reset, the sessions resumed with `--model opus`, without fallback, and completed all requested calls. Model identity was checked in actual assistant tool-use messages as well as session initialization. Fresh scientific payloads matched the earlier successful executions; time/request/cache metadata was allowed to differ. The original 5 September captures remain as historical evidence, while active ledger records reference the fresh 6 September Opus captures.

The Docker build-context check initially failed because its synthetic evidence fixture lacked the identity fields now required by validation. The fixture was corrected; the production validator was retained. The corrected context check, dependency audit, Dockerfile lint and health-container check pass.

## Final local checks

Formatting, TypeScript and ESLint pass. The final run passed 41 unit tests, 8 release tests, compose/workflow shell checks, 91 development browser tests, 106 root/mirror static browser tests and 3 production nginx tests. Both builds validate 45 documents (44 indexable content routes plus the 404 page). Docker context, health-container and Dockerfile-lint checks pass. npm audit reports zero vulnerabilities; Trivy source and built-image scans report no HIGH/CRITICAL findings under the CI policy. These are local CI equivalents; remote CI was not triggered.

Lighthouse 13.4.0 audited the production homepage, workflow directory and all nine workflow details after the Opus update. Accessibility, best practices and SEO scored 100 throughout; measured CLS was zero. Performance scored 100 on ten routes and 99 on the animal-model route. Three additional animal-model runs scored 100, 99 and 100 on the same artifact, with LCP between 1.58 and 1.83 seconds. The observed range is reported rather than selecting only the highest run. These are local lab measurements, not field Core Web Vitals.

| Route                                | Performance | Accessibility | Best practices | SEO | CLS |
| ------------------------------------ | ----------: | ------------: | -------------: | --: | --: |
| `/`                                  |         100 |           100 |            100 | 100 |   0 |
| `/workflows/`                        |         100 |           100 |            100 | 100 |   0 |
| `/workflows/variant-evidence/`       |         100 |           100 |            100 | 100 |   0 |
| `/workflows/phenotype-rare-disease/` |         100 |           100 |            100 | 100 |   0 |
| `/workflows/variant-annotation/`     |         100 |           100 |            100 | 100 |   0 |
| `/workflows/literature-review/`      |         100 |           100 |            100 | 100 |   0 |
| `/workflows/report-summary/`         |         100 |           100 |            100 | 100 |   0 |
| `/workflows/gene-validity/`          |         100 |           100 |            100 | 100 |   0 |
| `/workflows/acmg-evidence/`          |         100 |           100 |            100 | 100 |   0 |
| `/workflows/animal-models/`          |          99 |           100 |            100 | 100 |   0 |
| `/workflows/tissue-expression/`      |         100 |           100 |            100 | 100 |   0 |
