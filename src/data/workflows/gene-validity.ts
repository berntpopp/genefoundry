import type { Workflow } from '../contracts'

export const GENE_VALIDITY_WORKFLOW: Workflow = {
  id: 'gene-validity',
  title: 'How strong is the MYH7 link to different heart and muscle diseases?',
  summary:
    'Compare five ClinGen relationships with GenCC assertions without turning one definitive association into a claim about every condition.',
  prompt:
    'Use GeneFoundry to assess MYH7 gene-disease validity. List each ClinGen disease, inheritance, evidence strength, curator and date; compare GenCC submissions for the same disease identifiers. Explain which relationships are definitive and which remain limited, without classifying a patient variant.',
  outcome:
    'A disease-specific MYH7 validity table and a submitter-level comparison across 11 GenCC disease groups.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-gene-validity-20260906',
  steps: [
    {
      title: 'Resolve MYH7',
      instruction: 'Resolve the exact gene symbol before comparing curated relationships.',
      namespace: 'gencc',
      tool: 'gencc_resolve_identifier',
      identifier: 'MYH7',
      arguments: {
        query: 'MYH7',
        kind: 'gene'
      },
      inspect: [
        'Confirm HGNC:7577. The maximum classification is a catalog summary, not a statement about every disease.'
      ],
      evidence: [
        {
          label: 'MYH7 assertions in GenCC',
          url: 'https://search.thegencc.org/genes/HGNC:7577'
        }
      ]
    },
    {
      title: 'Read each ClinGen disease relationship',
      instruction:
        'Retrieve all five validity assertions, keeping disease, inheritance, curator and date together.',
      namespace: 'clingen',
      tool: 'clingen_get_gene_validity',
      identifier: 'MYH7',
      arguments: {
        gene_symbol: 'MYH7',
        response_mode: 'full'
      },
      inspect: [
        'Distinguish hypertrophic cardiomyopathy from dilated cardiomyopathy, arrhythmogenic right ventricular cardiomyopathy and congenital heart disease.',
        'AD means autosomal dominant; gene-disease validity does not classify an individual variant.'
      ],
      evidence: [
        {
          label: 'MYH7-related skeletal myopathy · ClinGen',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_8974721a-f333-4fb7-b8b7-043233d3d100-2021-05-13T160000.000Z'
        },
        {
          label: 'arrhythmogenic right ventricular cardiomyopathy · ClinGen',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_0265f091-a67d-4521-b6bd-5a110bd5356f-2019-08-06T160000.000Z'
        },
        {
          label: 'congenital heart disease · ClinGen',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_e9da50d1-a17c-4396-a6e6-632077b277b2-2024-02-12T170000.000Z'
        },
        {
          label: 'dilated cardiomyopathy 1S · ClinGen',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4ec27d4f-70ea-4c6a-ad67-d6260ecadcde-2026-03-04T170000.000Z'
        },
        {
          label: 'hypertrophic cardiomyopathy · ClinGen',
          url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_31325c90-05cb-4db0-9372-e4f705cd5c82-2023-07-12T160000.000Z'
        }
      ]
    },
    {
      title: 'Compare submitter assertions in GenCC',
      instruction:
        'Retrieve all 11 disease groups and their 21 submissions; compare the actual disease identifiers and inheritance before comparing strengths.',
      namespace: 'gencc',
      tool: 'gencc_get_gene_curations',
      identifier: 'HGNC:7577',
      arguments: {
        gene_symbol: 'HGNC:7577',
        response_mode: 'full',
        limit: 200,
        offset: 0
      },
      inspect: [
        'Check count=total=11 and retain each submitter classification.',
        'ClinGen assertions reappear in GenCC; these are reused records, not independent replication.',
        'No conflict flag does not mean all submitters used the same evidence strength.'
      ],
      evidence: [
        {
          label: 'MYH7 assertions in GenCC',
          url: 'https://search.thegencc.org/genes/HGNC:7577'
        }
      ]
    }
  ],
  limitations: [
    'A definitive gene-disease relationship does not establish that any particular MYH7 variant is pathogenic or that a patient has that disease.',
    'Disease labels may reflect different grouping policies. Compare identifiers, phenotype scope, inheritance and original evidence before merging records.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'MYH7-related skeletal myopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_8974721a-f333-4fb7-b8b7-043233d3d100-2021-05-13T160000.000Z'
      },
      {
        label: 'arrhythmogenic right ventricular cardiomyopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_0265f091-a67d-4521-b6bd-5a110bd5356f-2019-08-06T160000.000Z'
      },
      {
        label: 'congenital heart disease · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_e9da50d1-a17c-4396-a6e6-632077b277b2-2024-02-12T170000.000Z'
      },
      {
        label: 'dilated cardiomyopathy 1S · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4ec27d4f-70ea-4c6a-ad67-d6260ecadcde-2026-03-04T170000.000Z'
      },
      {
        label: 'hypertrophic cardiomyopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_31325c90-05cb-4db0-9372-e4f705cd5c82-2023-07-12T160000.000Z'
      },
      {
        label: 'MYH7 assertions in GenCC',
        url: 'https://search.thegencc.org/genes/HGNC:7577'
      }
    ],
    limitation:
      'Three actual MCP calls rerun with Claude Opus 5. ClinGen validity snapshot 31 August 2026; GenCC release 30 August 2026. Curations retain their own dates.'
  },
  result: {
    summary:
      'ClinGen returned three Definitive and two Limited MYH7 relationships, all autosomal dominant. GenCC returned all 11 disease groups and 21 submissions from five submitters; its strongest-per-gene label conceals this disease-specific variation.',
    tables: [
      {
        caption: 'All five ClinGen MYH7 validity assertions',
        columns: [
          'Disease / identifier',
          'Inheritance',
          'Validity',
          'Expert panel',
          'Classification date'
        ],
        rows: [
          [
            'MYH7-related skeletal myopathy · MONDO:0008050',
            'Autosomal dominant',
            'Definitive',
            'Congenital Myopathies and Myasthenic Syndromes Gene Curation Expert Panel',
            '2021-05-13'
          ],
          [
            'arrhythmogenic right ventricular cardiomyopathy · MONDO:0016587',
            'Autosomal dominant',
            'Limited',
            'Arrhythmogenic Right Ventricular Cardiomyopathy Gene Curation Expert Panel',
            '2019-08-06'
          ],
          [
            'congenital heart disease · MONDO:0005453',
            'Autosomal dominant',
            'Limited',
            'Congenital Heart Disease Gene Curation Expert Panel',
            '2024-02-12'
          ],
          [
            'dilated cardiomyopathy 1S · MONDO:0013262',
            'Autosomal dominant',
            'Definitive',
            'Dilated Cardiomyopathy Gene Curation Expert Panel',
            '2026-03-04'
          ],
          [
            'hypertrophic cardiomyopathy · MONDO:0005045',
            'Autosomal dominant',
            'Definitive',
            'Hereditary Cardiovascular Disease Gene Curation Expert Panel',
            '2023-07-12'
          ]
        ]
      },
      {
        caption: 'GenCC disease groups · each submitter’s assertion retained',
        columns: ['Disease / identifier', 'Submitter: classification / inheritance / date'],
        rows: [
          [
            'MYH7-related skeletal myopathy · MONDO:0008050',
            'ClinGen: Definitive / Autosomal dominant / 2021-05-13; Ambry Genetics: Strong / Autosomal dominant / 2017-05-19; Labcorp Genetics (formerly Invitae): Strong / Autosomal dominant / 2022-01-13; Orphanet: Supportive / Autosomal dominant / 2021-09-14'
          ],
          [
            'dilated cardiomyopathy 1S · MONDO:0013262',
            'ClinGen: Definitive / Autosomal dominant / 2026-03-04; G2P: Definitive / Autosomal dominant / 2024-03-20; Ambry Genetics: Strong / Autosomal dominant / 2020-03-31; Labcorp Genetics (formerly Invitae): Strong / Autosomal dominant / 2023-06-01'
          ],
          [
            'hypertrophic cardiomyopathy · MONDO:0005045',
            'ClinGen: Definitive / Autosomal dominant / 2023-07-12'
          ],
          [
            'hypertrophic cardiomyopathy 1 · MONDO:0008647',
            'Ambry Genetics: Definitive / Autosomal dominant / 2017-05-19; G2P: Definitive / Autosomal dominant / 2024-03-20; Labcorp Genetics (formerly Invitae): Strong / Autosomal dominant / 2023-01-27'
          ],
          [
            'myopathy, myosin storage, autosomal recessive · MONDO:0009708',
            'Labcorp Genetics (formerly Invitae): Strong / Autosomal recessive / 2019-05-28; Ambry Genetics: Moderate / Autosomal recessive / 2020-03-30'
          ],
          [
            'myopathy, myosin storage, autosomal dominant · MONDO:0012018',
            'Ambry Genetics: Moderate / Autosomal dominant / 2020-03-31'
          ],
          [
            'Ebstein anomaly · MONDO:0009144',
            'Orphanet: Supportive / Autosomal dominant / 2021-09-14'
          ],
          [
            'familial isolated dilated cardiomyopathy · MONDO:0015470',
            'Orphanet: Supportive / Autosomal dominant / 2021-09-14'
          ],
          [
            'left ventricular noncompaction · MONDO:0018901',
            'Orphanet: Supportive / Autosomal dominant / 2021-09-14'
          ],
          [
            'arrhythmogenic right ventricular cardiomyopathy · MONDO:0016587',
            'ClinGen: Limited / Autosomal dominant / 2019-08-06; G2P: Limited / Autosomal dominant / 2025-09-25'
          ],
          [
            'congenital heart disease · MONDO:0005453',
            'ClinGen: Limited / Autosomal dominant / 2024-02-12'
          ]
        ]
      }
    ],
    notes: [
      'ClinGen: MYH7-related skeletal myopathy, dilated cardiomyopathy 1S and hypertrophic cardiomyopathy are Definitive; arrhythmogenic right ventricular cardiomyopathy and congenital heart disease are Limited. These are separate disease-specific assessments.',
      'GenCC reports has_conflict=false, yet submitted strengths differ (for example Strong, Definitive and Supportive for skeletal myopathy). The flag is not unanimity and the submissions are not independent votes.',
      'GenCC separately lists autosomal recessive and autosomal dominant myosin-storage myopathy. Preserve those inheritance-specific relationships rather than merging them under the MYH7 gene label.',
      'No patient phenotype or variant was evaluated. Use the relevant disease relationship to guide subsequent variant-mechanism review.'
    ],
    sources: [
      {
        label: 'MYH7-related skeletal myopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_8974721a-f333-4fb7-b8b7-043233d3d100-2021-05-13T160000.000Z'
      },
      {
        label: 'arrhythmogenic right ventricular cardiomyopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_0265f091-a67d-4521-b6bd-5a110bd5356f-2019-08-06T160000.000Z'
      },
      {
        label: 'congenital heart disease · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_e9da50d1-a17c-4396-a6e6-632077b277b2-2024-02-12T170000.000Z'
      },
      {
        label: 'dilated cardiomyopathy 1S · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4ec27d4f-70ea-4c6a-ad67-d6260ecadcde-2026-03-04T170000.000Z'
      },
      {
        label: 'hypertrophic cardiomyopathy · ClinGen',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_31325c90-05cb-4db0-9372-e4f705cd5c82-2023-07-12T160000.000Z'
      },
      {
        label: 'MYH7 assertions in GenCC',
        url: 'https://search.thegencc.org/genes/HGNC:7577'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
