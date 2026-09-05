import type { Workflow } from '../contracts'

export const TISSUE_EXPRESSION_WORKFLOW: Workflow = {
  id: 'tissue-expression',
  title: 'Where are HNF1B, PAX2 and GATA3 expressed?',
  summary: 'Compare three genes across adult kidney cortex, kidney medulla and pancreas in GTEx.',
  prompt:
    'Use GeneFoundry to compare HNF1B, PAX2 and GATA3 expression in GTEx v10 adult kidney cortex, kidney medulla and pancreas. Report median TPM, sample counts and the returned versioned gene IDs. Explain what bulk adult tissue expression can and cannot tell me about a developmental disease candidate.',
  outcome:
    'A three-gene tissue expression table with GTEx release, GENCODE identifiers and sample counts.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-tissue-expression-20260906',
  steps: [
    {
      title: 'Compare tissue medians in one batch',
      instruction:
        'Request the three gene symbols and three tissues together, fixing the dataset to GTEx v10. The expression response resolves each symbol to its versioned gene identifier.',
      namespace: 'gtex',
      tool: 'gtex_get_median_expression_levels',
      identifier: 'HNF1B · PAX2 · GATA3 · GTEx v10',
      arguments: {
        gencode_id: ['HNF1B', 'PAX2', 'GATA3'],
        tissue_site_detail_id: ['Kidney_Cortex', 'Kidney_Medulla', 'Pancreas'],
        dataset_id: 'gtex_v10',
        response_mode: 'full',
        sort: 'none'
      },
      inspect: [
        'Match rows by geneSymbol and tissue, not response order. Record datasetId, gencodeId and the TPM unit.',
        'Keep the tissue sample counts next to the values: kidney medulla has far fewer samples than cortex or pancreas.',
        'Check that each gene has all three requested tissues. A missing row is not zero expression.'
      ],
      evidence: [
        {
          label: 'GTEx adult data and median TPM downloads',
          url: 'https://gtexportal.org/home/downloads/adult-gtex/overview'
        },
        { label: 'GTEx connector tools', url: 'https://github.com/berntpopp/gtex-link#readme' }
      ]
    }
  ],
  limitations: [
    'These are adult bulk-tissue RNA measurements. They do not identify the expressing cell type, describe fetal kidney development, or establish that a gene or variant causes disease.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'GTEx adult data and median TPM downloads',
        url: 'https://gtexportal.org/home/downloads/adult-gtex/overview'
      },
      { label: 'GTEx connector tools', url: 'https://github.com/berntpopp/gtex-link#readme' }
    ],
    limitation:
      'One batch expression call executed through Claude Code 2.1.261 · Claude Opus 5. The recorded values and identifiers come from that successful GTEx v10 response.'
  },
  result: {
    summary:
      'All three genes had higher median expression in the two sampled kidney tissues than in pancreas. HNF1B also had a pancreatic median of 24.401 TPM; PAX2 and GATA3 were below 1 TPM there.',
    tables: [
      {
        caption: 'Median expression · GTEx v10 · adult bulk RNA-seq · TPM',
        columns: [
          'Gene',
          'Kidney cortex (n = 104)',
          'Kidney medulla (n = 11)',
          'Pancreas (n = 362)'
        ],
        rows: [
          ['HNF1B', '57.2718', '108.491', '24.401'],
          ['PAX2', '49.2482', '101.601', '0.2083'],
          ['GATA3', '20.0471', '33.7963', '0.0933']
        ]
      },
      {
        caption: 'Gene identifiers returned with the expression data · GENCODE v39',
        columns: ['Gene', 'Versioned identifier'],
        rows: [
          ['HNF1B', 'ENSG00000275410.6'],
          ['PAX2', 'ENSG00000075891.23'],
          ['GATA3', 'ENSG00000107485.18']
        ]
      }
    ],
    notes: [
      'TPM means transcripts per million. These tissue medians summarize different sample groups; they are not a matched-donor comparison or a statistical test of differential expression.',
      'The medulla estimate uses only 11 samples. A higher median in this table does not establish tissue specificity or a developmental role.',
      'Low adult expression does not exclude a gene from a congenital-disease investigation.'
    ],
    sources: [
      { label: 'GTEx HNF1B', url: 'https://gtexportal.org/home/gene/ENSG00000275410' },
      { label: 'GTEx PAX2', url: 'https://gtexportal.org/home/gene/ENSG00000075891' },
      { label: 'GTEx GATA3', url: 'https://gtexportal.org/home/gene/ENSG00000107485' },
      {
        label: 'GTEx adult data and release downloads',
        url: 'https://gtexportal.org/home/downloads/adult-gtex/overview'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
