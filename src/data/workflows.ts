import type { Workflow } from './contracts'

export const WORKFLOWS: Workflow[] = [
  {
    id: 'variant-evidence',
    title: 'What do gnomAD and ClinVar show for HNF1B?',
    summary: 'One question brings together gene constraint and five source-linked variant records.',
    prompt:
      'Use GeneFoundry to look up HNF1B in gnomAD on GRCh38. Show its gene-level constraint metrics, then get five ClinVar variants sorted by review status. Include variant names, classifications, review stars and links to the original records.',
    outcome:
      'HNF1B gene constraint from gnomAD alongside five ClinVar variant records, with source links and release information.',
    exampleKind: 'verified',
    executionReviewId: 'workflow-hnf1b-20260905',
    steps: [
      {
        title: 'Confirm the gene',
        instruction:
          'Search the exact HNF1B symbol in the GRCh38 reference. Check the match before using the gene in later calls.',
        namespace: 'gnomad',
        tool: 'gnomad_search_genes',
        identifier: 'HNF1B',
        arguments: {
          query: 'HNF1B',
          reference_genome: 'GRCh38',
          limit: 5
        },
        inspect: [
          'Confirm symbol and ensembl_id, and look for an exact_symbol match_quality.',
          'Keep alternative matches separate; do not silently choose the first ambiguous result.'
        ],
        evidence: [
          {
            label: 'Reviewed tool definition',
            url: 'https://github.com/berntpopp/gnomad-link/blob/6922250c0d87f57378b7d8bafb18c7ff95e1ae87/gnomad_link/mcp/tools/search.py'
          }
        ]
      },
      {
        title: 'Read gene-level constraint',
        instruction:
          'Request the resolved gene’s constraint and coordinate context. These describe the gene, not the pathogenicity of a particular allele.',
        namespace: 'gnomad',
        tool: 'gnomad_get_gene_details',
        identifier: 'ENSG00000275410 · GRCh38',
        arguments: {
          gene: 'ENSG00000275410',
          reference_genome: 'GRCh38',
          response_mode: 'compact'
        },
        inspect: [
          'Record the gene identifier, coordinates, canonical transcript and available pLI / observed-to-expected loss-of-function metrics.',
          'Mark missing values and retain dataset metadata if supplied. Do not turn a missing score into zero.'
        ],
        evidence: [
          {
            label: 'Reviewed tool definition',
            url: 'https://github.com/berntpopp/gnomad-link/blob/6922250c0d87f57378b7d8bafb18c7ff95e1ae87/gnomad_link/mcp/tools/genes.py'
          }
        ]
      },
      {
        title: 'Choose variant records to read next',
        instruction:
          'Request five records sorted by review status. Open their source records and choose a specific allele for a subsequent variant-level investigation.',
        namespace: 'clinvar',
        tool: 'clinvar_get_variants_by_gene',
        identifier: 'HNF1B · first 5 records',
        arguments: {
          gene_symbol: 'HNF1B',
          sort: 'stars_desc',
          limit: 5,
          offset: 0,
          response_mode: 'compact'
        },
        inspect: [
          'For each row, keep the VCV accession, classification, star rating, condition context and source citation/link.',
          'Check total_count, has_more and next_offset: five rows are a starting sample, not the complete gene inventory.',
          'Before a later population-frequency lookup, resolve that exact allele and its reference assembly. Gene constraint cannot stand in for allele frequency.'
        ],
        evidence: [
          {
            label: 'Reviewed tool definition',
            url: 'https://github.com/berntpopp/clinvar-link/blob/b16f6ffd336fda734f6d58cf0b0603107a787fe8/clinvar_link/mcp/tools/genes.py'
          }
        ]
      }
    ],
    limitations: [
      'Gene-level constraint and submitted ClinVar classifications are different evidence. This result does not classify a new variant or establish a diagnosis.'
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/gnomad-link/blob/6922250c0d87f57378b7d8bafb18c7ff95e1ae87/gnomad_link/mcp/tools/search.py'
        },
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/gnomad-link/blob/6922250c0d87f57378b7d8bafb18c7ff95e1ae87/gnomad_link/mcp/tools/genes.py'
        },
        {
          label: 'Reviewed tool definition',
          url: 'https://github.com/berntpopp/clinvar-link/blob/b16f6ffd336fda734f6d58cf0b0603107a787fe8/clinvar_link/mcp/tools/genes.py'
        }
      ],
      limitation:
        'Three GeneFoundry tool calls executed through Claude Code 2.1.261. The tables summarize the captured source responses.'
    },
    result: {
      summary:
        'GeneFoundry resolved HNF1B to ENSG00000275410 and returned gene constraint from gnomAD 4.1.1. The ClinVar query returned five of 933 HNF1B records, sorted by review status.',
      tables: [
        {
          caption: 'HNF1B gene constraint · gnomAD 4.1.1 · GRCh38',
          columns: ['Metric', 'Recorded value'],
          rows: [
            ['Loss-of-function observed / expected', '0.130 (upper bound 0.234)'],
            ['pLI', '1.000']
          ]
        },
        {
          caption: 'First five ClinVar records · release 31 August 2026',
          columns: [
            'Variant on NM_000458.4',
            'Submitted classification',
            'Review stars',
            'Source record'
          ],
          rows: [
            ['c.529C>T (p.Arg177Ter)', 'pathogenic', '2 / 4', 'VCV000012635'],
            ['c.301G>T (p.Glu101Ter)', 'pathogenic', '2 / 4', 'VCV000012638'],
            ['c.826C>T (p.Arg276Ter)', 'pathogenic', '2 / 4', 'VCV000012640'],
            ['c.544+1G>A', 'likely pathogenic', '2 / 4', 'VCV000012643'],
            ['c.544+1G>T', 'pathogenic', '2 / 4', 'VCV000012644']
          ]
        }
      ],
      notes: [
        'Constraint values are rounded from the response: 8 observed loss-of-function variants versus 61.689 expected. These are gene-level metrics, not an allele frequency.',
        'All five listed records had “criteria provided, multiple submitters, no conflicts” review status. Five rows are a sample; the response reports more records.'
      ],
      sources: [
        {
          label: 'gnomAD HNF1B gene record',
          url: 'https://gnomad.broadinstitute.org/gene/ENSG00000275410?dataset=gnomad_r4'
        },
        {
          label: 'VCV000012635',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12635/'
        },
        {
          label: 'VCV000012638',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12638/'
        },
        {
          label: 'VCV000012640',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12640/'
        },
        {
          label: 'VCV000012643',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12643/'
        },
        {
          label: 'VCV000012644',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/12644/'
        }
      ],
      executedAt: '2026-09-05',
      client: 'Claude Code 2.1.261'
    }
  },
  {
    id: 'phenotype-rare-disease',
    title: 'Which genes link renal cysts and diabetes?',
    summary:
      'Two phenotype searches found 13 shared genes. A ClinGen lookup added curated evidence for HNF1B.',
    prompt:
      'Use GeneFoundry to find genes associated with renal cyst and diabetes mellitus in HPO, using exact terms without descendants. Retrieve every page and show the genes shared by both lists. Then check the ClinGen gene–disease validity evidence for HNF1B and link to the original curation.',
    outcome:
      'The overlap between two complete HPO gene lists, plus a source-linked ClinGen curation for HNF1B.',
    exampleKind: 'verified',
    executionReviewId: 'workflow-phenotype-20260905',
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
      reviewedAt: '2026-09-05',
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
      executedAt: '2026-09-05',
      client: 'Claude Code 2.1.261'
    }
  }
]
