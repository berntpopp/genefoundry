import type { Workflow } from '../contracts'

export const ACMG_EVIDENCE_WORKFLOW: Workflow = {
  id: 'acmg-evidence',
  title: 'What evidence supports HNF1B p.Arg177Ter—and what is still missing?',
  summary:
    'Build an ACMG/AMP research worksheet from an exact allele, a PVS1 suggestion and an unsuccessful population-frequency lookup.',
  prompt:
    'Use GeneFoundry to build an ACMG/AMP evidence worksheet for HNF1B NM_000458.4:c.529C>T (p.Arg177Ter), ClinVar VCV000012635, in autosomal dominant renal cysts and diabetes syndrome. Resolve the GRCh38 allele, retrieve its ClinVar record and gnomAD frequency, inspect AutoPVS1 and VEP, and confirm ClinGen validity and dosage context. Separate source classifications from candidate criteria, identify missing evidence and avoid double counting. Do not produce an autonomous final classification.',
  outcome:
    'A source-linked worksheet that separates ClinVar’s Pathogenic aggregate from a review-required PVS1 suggestion and leaves population and patient-dependent criteria unassigned.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-acmg-evidence-20260906',
  steps: [
    {
      title: 'Resolve the exact ClinVar allele',
      instruction:
        'Read VCV000012635 and preserve its transcript, GRCh38 allele, submitted classification and condition context.',
      namespace: 'clinvar',
      tool: 'clinvar_get_variant',
      identifier: 'VCV000012635',
      arguments: {
        identifier: 'VCV000012635',
        id_type: 'vcv',
        response_mode: 'full'
      },
      inspect: [
        'NM_000458.4:c.529C>T (p.Arg177Ter) maps to GRCh38 17-37739455-G-A. The transcript C>T and genomic G>A are consistent with the minus-strand gene.',
        'Pathogenic is the source aggregate with two review stars, not a new classification from this workflow. Review individual condition submissions before applying it to a different phenotype.'
      ],
      evidence: [
        {
          label: 'ClinVar VCV000012635',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12635/'
        }
      ]
    },
    {
      title: 'Confirm the disease relationship',
      instruction:
        'Check HNF1B specifically for autosomal dominant renal cysts and diabetes syndrome.',
      namespace: 'clingen',
      tool: 'clingen_get_gene_validity',
      identifier: 'HNF1B',
      arguments: {
        gene_symbol: 'HNF1B',
        response_mode: 'standard'
      },
      inspect: [
        'The returned relationship is Definitive for MONDO:0007669, classified 19 January 2021.',
        'Gene-disease validity establishes context; it does not by itself establish a loss-of-function mechanism or a variant criterion.'
      ],
      evidence: [
        {
          label: 'HNF1B renal cysts and diabetes validity',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
        }
      ]
    },
    {
      title: 'Check the assembly-matched population identifier',
      instruction: 'Search the ClinVar-resolved GRCh38 allele in gnomAD r4.',
      namespace: 'gnomad',
      tool: 'gnomad_resolve_variant_id',
      identifier: '17-37739455-G-A',
      arguments: {
        query: '17-37739455-G-A',
        dataset: 'gnomad_r4',
        enrich: true,
        limit: 5
      },
      inspect: [
        'The call succeeded but returned zero matches. Do not substitute gene constraint or another variant.',
        'A missing catalog record does not establish the callable allele number at this site.'
      ],
      evidence: [
        {
          label: 'Exact GRCh38 allele in gnomAD',
          url: 'https://gnomad.broadinstitute.org/variant/17-37739455-G-A?dataset=gnomad_r4'
        }
      ]
    },
    {
      title: 'Record the unavailable frequency',
      instruction: 'Request frequency for that exact allele and retain the not_found response.',
      namespace: 'gnomad',
      tool: 'gnomad_get_variant_frequencies',
      identifier: '17-37739455-G-A',
      arguments: {
        variant_id: '17-37739455-G-A',
        dataset: 'gnomad_r4',
        response_mode: 'compact'
      },
      inspect: [
        'This call returned an error, not an allele frequency of zero.',
        'Keep PM2 unassigned until ancestry-relevant frequency, coverage, allele number and applicable disease threshold can be checked.'
      ],
      evidence: [
        {
          label: 'Exact GRCh38 allele in gnomAD',
          url: 'https://gnomad.broadinstitute.org/variant/17-37739455-G-A?dataset=gnomad_r4'
        }
      ]
    },
    {
      title: 'Inspect the automated loss-of-function suggestion',
      instruction:
        'Run AutoPVS1 for the same hg38 allele and inspect its transcript-specific decision path.',
      namespace: 'autopvs1',
      tool: 'autopvs1_get_variant_pvs1_data',
      identifier: '17-37739455-G-A',
      arguments: {
        variant_id: '17-37739455-G-A',
        genome_build: 'hg38',
        response_mode: 'standard',
        meta_mode: 'compact'
      },
      inspect: [
        'The source reports NM_000458.4 exon 2/9, predicted nonsense-mediated decay and VeryStrong, with final_strength_source=inferred.',
        'Before assigning PVS1, independently review transcript relevance, exon expression, NMD assumptions and the established disease mechanism under the applicable ClinGen guidance.',
        'AutoPVS1 is parsed from upstream HTML; the response warns that fields can drift. Its invalid ClinVar link was removed, so use the separately resolved ClinVar record.'
      ],
      evidence: [
        {
          label: 'AutoPVS1 allele assessment',
          url: 'https://autopvs1.bgi.com/variant/hg38/17-37739455-G-A'
        },
        {
          label: 'ClinGen SVI PVS1 recommendations',
          url: 'https://www.clinicalgenome.org/docs/recommendations-for-interpreting-the-loss-of-function-pvs1-acmg-amp-variant-criterion/'
        }
      ]
    },
    {
      title: 'Cross-check consequence without counting it twice',
      instruction:
        'Annotate the same GRCh38 allele with VEP and preserve versioned transcript consequences.',
      namespace: 'vep',
      tool: 'vep_annotate_variant',
      identifier: '17-37739455-G-A',
      arguments: {
        variant: '17-37739455-G-A',
        assembly: 'GRCh38',
        response_mode: 'standard',
        transcripts: 'auto'
      },
      inspect: [
        'VEP reports stop_gained, including ENST00000617811.5:c.529C>T and p.Arg177Ter. Confirm transcript correspondence rather than assuming all Ensembl and RefSeq transcripts are interchangeable.',
        'VEP consequence, CADD and AutoPVS1 are not independent experimental observations. Do not add PP3 or PM4 merely to duplicate the same predicted loss-of-function evidence.'
      ],
      evidence: [
        {
          label: 'Ensembl VEP documentation',
          url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
        },
        {
          label: 'ClinGen SVI variant-classification guidance',
          url: 'https://www.clinicalgenome.org/tools/clingen-variant-classification-guidance/'
        }
      ]
    },
    {
      title: 'Review the loss-of-function mechanism',
      instruction: 'Read ClinGen dosage sensitivity before interpreting the PVS1 suggestion.',
      namespace: 'clingen',
      tool: 'clingen_get_gene_dosage',
      identifier: 'HNF1B',
      arguments: {
        gene_symbol: 'HNF1B',
        response_mode: 'full'
      },
      inspect: [
        'Haploinsufficiency score 3 means sufficient evidence for dosage pathogenicity; the record is linked to MONDO:0007669 and was evaluated 21 December 2020.',
        'Use this mechanism context with the relevant transcript and phenotype. Haploinsufficiency is not a second independent variant criterion.'
      ],
      evidence: [
        {
          label: 'HNF1B dosage sensitivity',
          url: 'https://search.clinicalgenome.org/kb/gene-dosage/HNF1B'
        },
        {
          label: 'ClinGen SVI PVS1 recommendations',
          url: 'https://www.clinicalgenome.org/docs/recommendations-for-interpreting-the-loss-of-function-pvs1-acmg-amp-variant-criterion/'
        }
      ]
    }
  ],
  limitations: [
    'This educational worksheet is not a complete ACMG/AMP assessment, clinical classification or patient report. No genotype, phenotype, segregation, de novo or case-level evidence was supplied.',
    'The exact gnomAD lookup failed with not_found. No allele frequency, coverage or allele number was returned; absence and PM2 cannot be inferred from that failure.',
    'The automated PVS1 strength is a source suggestion marked inferred. Assignment requires review of gene-disease mechanism, biologically relevant transcript and nonsense-mediated decay.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'ClinVar VCV000012635',
        url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12635/'
      },
      {
        label: 'HNF1B renal cysts and diabetes validity',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
      },
      {
        label: 'HNF1B dosage sensitivity',
        url: 'https://search.clinicalgenome.org/kb/gene-dosage/HNF1B'
      },
      {
        label: 'AutoPVS1 allele assessment',
        url: 'https://autopvs1.bgi.com/variant/hg38/17-37739455-G-A'
      },
      {
        label: 'Ensembl VEP documentation',
        url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
      },
      {
        label: 'ClinGen SVI PVS1 recommendations',
        url: 'https://www.clinicalgenome.org/docs/recommendations-for-interpreting-the-loss-of-function-pvs1-acmg-amp-variant-criterion/'
      },
      {
        label: 'ClinGen SVI PM2 recommendation',
        url: 'https://www.clinicalgenome.org/site/assets/files/5182/pm2_-_svi_recommendation_-_approved_sept2020.pdf'
      },
      {
        label: 'ClinGen SVI variant-classification guidance',
        url: 'https://www.clinicalgenome.org/tools/clingen-variant-classification-guidance/'
      }
    ],
    limitation:
      'Seven actual MCP calls rerun with Claude Opus 5, including the preserved gnomAD not_found error. The worksheet interpretation was reviewed against ClinGen SVI guidance; no final classification is assigned.'
  },
  result: {
    summary:
      'ClinVar reports Pathogenic with two review stars for the resolved GRCh38 allele. AutoPVS1 suggests VeryStrong loss-of-function evidence, but this remains a candidate for expert review. The gnomAD lookup returned not_found, so no population-frequency criterion is assigned.',
    tables: [
      {
        caption: 'Retrieved evidence for one allele · GRCh38 17-37739455-G-A',
        columns: ['Source / observation', 'Captured result'],
        rows: [
          ['ClinVar identity', 'VCV000012635 · NM_000458.4:c.529C>T · p.Arg177Ter'],
          [
            'ClinVar aggregate classification',
            'Pathogenic · 2/4 stars · criteria provided, multiple submitters, no conflicts · 7 submitters'
          ],
          ['ClinVar dates', 'Last evaluated 7 March 2025; weekly release 31 August 2026'],
          [
            'ClinGen gene-disease context',
            'HNF1B–renal cysts and diabetes syndrome (MONDO:0007669) · autosomal dominant · Definitive'
          ],
          [
            'ClinGen mechanism context',
            'Haploinsufficiency score 3: sufficient evidence for dosage pathogenicity'
          ],
          [
            'AutoPVS1',
            'NM_000458.4 · exon 2/9 · predicted NMD · NF1 path · VeryStrong (source: inferred)'
          ],
          [
            'VEP',
            'stop_gained; ENST00000617811.5:c.529C>T / ENSP00000480291.1:p.Arg177Ter among returned transcripts'
          ],
          [
            'gnomAD 4.1.1 / r4',
            'Resolver: zero matches. Frequency call: not_found. No AF, AC, AN or coverage returned.'
          ]
        ]
      },
      {
        caption: 'ACMG/AMP worksheet · interpretation, not an assigned classification',
        columns: ['Criterion / evidence', 'Status in this worksheet', 'What still needs review'],
        rows: [
          [
            'PVS1',
            'Candidate; AutoPVS1 suggests VeryStrong, not independently assigned',
            'Confirm relevant transcript/exon expression, predicted NMD and HNF1B loss-of-function mechanism for this disease. Apply current SVI and any applicable gene-specific specification.'
          ],
          [
            'PM2',
            'Unassigned',
            'No frequency or callable allele number was returned. Verify site coverage and ancestry-relevant rarity against an appropriate disease threshold; general SVI guidance reduces PM2 to Supporting.'
          ],
          [
            'PP3 / PM4',
            'Not added for the same predicted truncation',
            'VEP stop_gained, CADD and the NMD prediction do not supply independent support to stack on PVS1 for the same effect.'
          ],
          [
            'PP5 / source assertion',
            'Not used',
            'ClinVar’s aggregate classification is reported separately. Inspect the underlying evidence; a reputable-source label is not an independent pathogenic criterion.'
          ],
          [
            'PS2 / PM6 / PP1 / PP4',
            'Unassigned',
            'No parental testing, confirmed de novo event, segregation or sufficiently specific patient phenotype was provided.'
          ],
          [
            'PS3 / PS4',
            'Unassigned',
            'No validated functional assay or independently reviewed case-enrichment evidence was retrieved.'
          ],
          [
            'Overall classification',
            'Not assigned',
            'Complete and critically review the missing evidence before applying an ACMG/AMP combination framework.'
          ]
        ]
      }
    ],
    notes: [
      'This is an actual execution with a documented failed lookup, not a successful frequency measurement. VEP also returned an empty frequencies array; that does not repair the missing gnomAD denominator.',
      'The worksheet focuses on renal cysts and diabetes syndrome. ClinVar also returned a composite condition label; its aggregate must not be silently generalized to every listed condition.',
      'The separate ClinGen validity and dosage records provide disease and mechanism context. They do not prove the variant’s effect independently of AutoPVS1.',
      'AutoPVS1 is an automated, HTML-derived assessment and its final strength was marked inferred. Predicted NMD is not an experimentally demonstrated RNA result.'
    ],
    sources: [
      {
        label: 'ClinVar VCV000012635',
        url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12635/'
      },
      {
        label: 'HNF1B renal cysts and diabetes validity',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
      },
      {
        label: 'HNF1B dosage sensitivity',
        url: 'https://search.clinicalgenome.org/kb/gene-dosage/HNF1B'
      },
      {
        label: 'AutoPVS1 allele assessment',
        url: 'https://autopvs1.bgi.com/variant/hg38/17-37739455-G-A'
      },
      {
        label: 'Exact GRCh38 allele in gnomAD',
        url: 'https://gnomad.broadinstitute.org/variant/17-37739455-G-A?dataset=gnomad_r4'
      },
      {
        label: 'Ensembl VEP documentation',
        url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
      },
      {
        label: 'ClinGen SVI PVS1 recommendations',
        url: 'https://www.clinicalgenome.org/docs/recommendations-for-interpreting-the-loss-of-function-pvs1-acmg-amp-variant-criterion/'
      },
      {
        label: 'ClinGen SVI PM2 recommendation',
        url: 'https://www.clinicalgenome.org/site/assets/files/5182/pm2_-_svi_recommendation_-_approved_sept2020.pdf'
      },
      {
        label: 'ClinGen SVI variant-classification guidance',
        url: 'https://www.clinicalgenome.org/tools/clingen-variant-classification-guidance/'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
