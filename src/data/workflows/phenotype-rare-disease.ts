import type { Workflow } from '../contracts'

export const PHENOTYPE_RARE_DISEASE_WORKFLOW: Workflow = {
  id: 'phenotype-rare-disease',
  title: 'Which genes link renal cysts and diabetes?',
  summary:
    'Two phenotype searches found 13 shared genes. A ClinGen lookup added curated evidence for HNF1B.',
  prompt:
    'Use GeneFoundry to find genes associated with renal cyst and diabetes mellitus in HPO, using exact terms without descendants. Retrieve every page and show the genes shared by both lists. Then check the ClinGen gene–disease validity evidence for HNF1B and link to the original curation.',
  outcome:
    'The overlap between two complete HPO gene lists, plus a source-linked ClinGen curation for HNF1B.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-phenotype-rare-disease-20260906',
  steps: [
    {
      title: 'Resolve “renal cysts”',
      instruction: 'Resolve renal cyst to its HPO identifier.',
      namespace: 'hpo',
      tool: 'hpo_resolve_term',
      identifier: 'Renal cyst · HP:0000107',
      arguments: {
        query: 'renal cyst'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/ontology.py'
        },
        {
          label: 'HPO ontology term definitions',
          url: 'https://github.com/obophenotype/human-phenotype-ontology/blob/master/hp.obo'
        }
      ]
    },
    {
      title: 'Resolve “diabetes mellitus”',
      instruction: 'Resolve diabetes mellitus independently using the same HPO release.',
      namespace: 'hpo',
      tool: 'hpo_resolve_term',
      identifier: 'Diabetes mellitus · HP:0000819',
      arguments: {
        query: 'diabetes mellitus'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/ontology.py'
        },
        {
          label: 'HPO ontology term definitions',
          url: 'https://github.com/obophenotype/human-phenotype-ontology/blob/master/hp.obo'
        }
      ]
    },
    {
      title: 'Retrieve 129 renal-cyst gene associations',
      instruction:
        'Retrieve associations for the exact term, without descendant terms. The first page contains all 129 records.',
      namespace: 'hpo',
      tool: 'hpo_get_genes_for_phenotype',
      identifier: 'HP:0000107',
      arguments: {
        hpo_id: 'HP:0000107',
        include_descendants: false,
        limit: 200,
        offset: 0,
        response_mode: 'minimal'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/annotations.py'
        }
      ]
    },
    {
      title: 'Retrieve the first 200 diabetes gene associations',
      instruction:
        'Use the same exact-term scope. This page reports 222 total records and next_offset 200.',
      namespace: 'hpo',
      tool: 'hpo_get_genes_for_phenotype',
      identifier: 'HP:0000819',
      arguments: {
        hpo_id: 'HP:0000819',
        include_descendants: false,
        limit: 200,
        offset: 0,
        response_mode: 'minimal'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/annotations.py'
        }
      ]
    },
    {
      title: 'Complete the diabetes list and compare',
      instruction:
        'Fetch the remaining 22 records at offset 200. Compare the complete gene ID sets: 13 genes occur in both.',
      namespace: 'hpo',
      tool: 'hpo_get_genes_for_phenotype',
      identifier: 'HP:0000819',
      arguments: {
        hpo_id: 'HP:0000819',
        include_descendants: false,
        limit: 200,
        offset: 200,
        response_mode: 'minimal'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/annotations.py'
        }
      ]
    },
    {
      title: 'Resolve a separate gene of interest in ClinGen',
      instruction: 'Resolve HNF1B, one of the genes in the recorded overlap, in ClinGen.',
      namespace: 'clingen',
      tool: 'clingen_search_genes',
      identifier: 'HNF1B',
      arguments: {
        query: 'HNF1B'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/clingen-link/blob/09ead33761449e80df72cd2f76ee3fe1d25c1ad6/clingen_link/mcp/tools/genes.py'
        }
      ]
    },
    {
      title: 'Read gene–disease validity assertions',
      instruction: 'Read the returned gene–disease validity assertion and its source permalink.',
      namespace: 'clingen',
      tool: 'clingen_get_gene_validity',
      identifier: 'HNF1B',
      arguments: {
        gene_symbol: 'HNF1B',
        response_mode: 'standard'
      },
      inspect: [
        'Check identifiers, release metadata and the original source record in the captured response.'
      ],
      evidence: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/clingen-link/blob/09ead33761449e80df72cd2f76ee3fe1d25c1ad6/clingen_link/mcp/tools/validity.py'
        }
      ]
    }
  ],
  limitations: [
    'Shared phenotype associations identify research leads. The ClinGen classification applies to a gene–disease relationship, not a diagnosis or the pathogenicity of a specific variant.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'Reviewed tool definition',
        url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/ontology.py'
      },
      {
        label: 'Reviewed tool definition',
        url: 'https://github.com/berntpopp/hpo-link/blob/e2b24a3a2c36e80ebb9deab3fb69a97029b66efc/hpo_link/mcp/tools/annotations.py'
      },
      {
        label: 'Reviewed tool definition',
        url: 'https://github.com/berntpopp/clingen-link/blob/09ead33761449e80df72cd2f76ee3fe1d25c1ad6/clingen_link/mcp/tools/genes.py'
      },
      {
        label: 'Reviewed tool definition',
        url: 'https://github.com/berntpopp/clingen-link/blob/09ead33761449e80df72cd2f76ee3fe1d25c1ad6/clingen_link/mcp/tools/validity.py'
      }
    ],
    limitation:
      'Seven GeneFoundry tool calls executed through Claude Code 2.1.261; the complete HPO list intersection was independently recomputed from the captured responses.'
  },
  result: {
    summary:
      'The complete HPO lists contained 129 renal-cyst genes and 222 diabetes-mellitus genes. Their intersection contained 13 genes, including HNF1B.',
    tables: [
      {
        caption: 'Exact HPO terms · release 23 June 2026',
        columns: ['Phenotype', 'Associated genes'],
        rows: [
          ['Renal cyst · HP:0000107', '129'],
          ['Diabetes mellitus · HP:0000819', '222'],
          ['Shared by both lists', '13']
        ]
      },
      {
        caption: 'The 13 shared genes',
        columns: ['Gene'],
        rows: [
          ['APPL1'],
          ['GCK'],
          ['GLIS3'],
          ['HNF1A'],
          ['HNF1B'],
          ['HNF4A'],
          ['INS'],
          ['KCNJ11'],
          ['MKKS'],
          ['MT-CYB'],
          ['PAX4'],
          ['PEX1'],
          ['PEX6']
        ]
      },
      {
        caption: 'ClinGen gene–disease validity for HNF1B',
        columns: ['Field', 'Recorded value'],
        rows: [
          ['Disease', 'Renal cysts and diabetes syndrome'],
          ['Disease identifier', 'MONDO:0007669'],
          ['Classification', 'Definitive'],
          ['Inheritance', 'Autosomal dominant (AD)'],
          ['Expert panel', 'Monogenic Diabetes Gene Curation Expert Panel'],
          ['Classification date', '19 January 2021'],
          ['Source', 'Open ClinGen curation']
        ]
      }
    ],
    notes: [
      'Both HPO lists use include_descendants=false. The diabetes list required two pages (200 + 22); the overlap was calculated from complete lists.',
      'The ClinGen validity dataset identifies its version as 31 August 2026. Its source curation was classified in 2021; these dates describe different events.'
    ],
    sources: [
      {
        label: 'Renal cyst · HP:0000107',
        url: 'https://hpo.jax.org/browse/term/HP:0000107'
      },
      {
        label: 'Diabetes mellitus · HP:0000819',
        url: 'https://hpo.jax.org/browse/term/HP:0000819'
      },
      {
        label: 'Open ClinGen curation',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
