import type { Workflow } from '../contracts'

export const LITERATURE_REVIEW: Workflow = {
  id: 'literature-review',
  title: 'What do three studies show about HNF1B in kidney development?',
  summary:
    'A focused literature search turns three primary-study abstracts into a comparison of models, mechanisms and findings.',
  prompt:
    'Use GeneFoundry to find three primary studies of HNF1B in kidney development. Retrieve their full abstracts and compare the experimental models, the main findings and what each study adds. Cite every finding with its PMID and distinguish experimental mechanisms from evidence in patients.',
  outcome:
    'Three passage-supported study summaries, with PubMed links and a concise comparison of the mechanisms studied.',
  steps: [
    {
      title: 'Find relevant studies',
      instruction:
        'Search PubTator for HNF1B kidney development and nephron biology, requesting abstracts for ten relevance-ranked records.',
      namespace: 'pubtator',
      tool: 'pubtator_search_literature',
      identifier: 'HNF1B',
      arguments: {
        text: 'HNF1B kidney development nephron',
        limit: 10,
        metadata: 'with_abstract',
        sort: 'score desc'
      },
      inspect: ['Review study titles and abstracts before selecting primary experimental papers.'],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/pubtator-link/blob/2c513a49653a477d71c8aa870871759023392033/README.md'
        }
      ]
    },
    {
      title: 'Read the three complete abstracts',
      instruction:
        'Retrieve all abstract passages for the selected PMIDs; the returned coverage is abstract-only for all three.',
      namespace: 'pubtator',
      tool: 'pubtator_get_publication_passages',
      identifier: 'HNF1B',
      arguments: {
        pmids: ['36402859', '36522156', '33737325'],
        mode: 'full_abstract',
        max_passages_per_pmid: 10,
        verbosity: 'standard'
      },
      inspect: [
        'Check PMID, passage_id and coverage_by_pmid; do not treat a title as evidence for a finding.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/pubtator-link/blob/2c513a49653a477d71c8aa870871759023392033/README.md'
        }
      ]
    }
  ],
  limitations: [
    'This focused selection covers three experimental papers, not a systematic review. Abstract-level findings from model systems do not establish the effect of an individual patient’s variant.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'PMID 36402859',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36402859/'
      },
      {
        label: 'PMID 36522156',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36522156/'
      },
      {
        label: 'PMID 33737325',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33737325/'
      },
      {
        label: 'PubTator tool documentation',
        url: 'https://github.com/berntpopp/pubtator-link/blob/2c513a49653a477d71c8aa870871759023392033/README.md'
      }
    ],
    limitation:
      'Synthesis checked against the complete abstracts returned by the recorded calls; full-text methods and figures were not reviewed.'
  },
  result: {
    summary:
      'The three abstracts examine complementary parts of HNF1B biology: regulation of its expression by Pax8, selective disruption of its downstream program by R295C, and kidney abnormalities after reduced HNF1B dosage in a mouse model.',
    tables: [
      {
        caption: 'Three primary studies, with findings supported by their abstracts',
        columns: ['Study', 'Experimental model', 'Main finding', 'Source'],
        rows: [
          [
            'Goea et al. · 2022',
            'Xenopus and mammalian renal cells',
            'A conserved distal enhancer, CNS1, drove renal Hnf1b expression. Functional assays and CRISPR experiments supported Pax8-dependent enhancer activity.',
            'PMID 36402859'
          ],
          [
            'Grand et al. · 2023',
            'Reprogrammed mouse fibroblasts and Xenopus',
            'R295C retained renal reprogramming and induction capacity but altered specific downstream gene sets. The effect was selective rather than a general loss of transcriptional activity.',
            'PMID 36522156'
          ],
          [
            'Niborski et al. · 2021',
            'Mouse model carrying a human splice-site mutation',
            'Heterozygous mice had reduced HNF1B protein, embryonic renal cysts and delayed proximal-tubule differentiation. A subset of developmental target genes was dysregulated.',
            'PMID 33737325'
          ]
        ]
      }
    ],
    notes: [
      'Together, these experiments support studying both HNF1B dosage and the particular target-gene programs affected by a mutation. This comparison is a synthesis of the retrieved abstracts.',
      'Read the linked full papers before using these findings to design an experiment or interpret a specific variant.'
    ],
    sources: [
      {
        label: 'PMID 36402859',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36402859/'
      },
      {
        label: 'PMID 36522156',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36522156/'
      },
      {
        label: 'PMID 33737325',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33737325/'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  },
  exampleKind: 'verified',
  executionReviewId: 'workflow-literature-review-20260906'
}
