import type { Workflow } from '../contracts'

export const VARIANT_EVIDENCE_WORKFLOW: Workflow = {
  id: 'variant-evidence',
  title: 'What do gnomAD and ClinVar show for HNF1B?',
  summary: 'One question brings together gene constraint and five source-linked variant records.',
  prompt:
    'Use GeneFoundry to look up HNF1B in gnomAD on GRCh38. Show its gene-level constraint metrics, then get five ClinVar variants sorted by review status. Include variant names, classifications, review stars and links to the original records.',
  outcome:
    'HNF1B gene constraint from gnomAD alongside five ClinVar variant records, with source links and release information.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-variant-evidence-20260906',
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
    reviewedAt: '2026-09-06',
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
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
