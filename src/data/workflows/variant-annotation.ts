import type { Workflow } from '../contracts'

export const VARIANT_ANNOTATION_WORKFLOW: Workflow = {
  id: 'variant-annotation',
  title: 'What does CFTR p.Phe508del change?',
  summary:
    'Normalize an allele, compare transcript consequences and separate VEP annotation from ClinVar classification.',
  prompt:
    'Use GeneFoundry to annotate NM_000492.4:c.1521_1523del in CFTR on GRCh38. Show the returned VCF, genomic HGVS and SPDI representations. Identify the MANE Select transcript, consequence term and protein change, then compare one alternative transcript. Find the matching ClinVar record and report its classification, review status and transcript version separately. Flag identifier or normalization differences before joining records; do not turn VEP impact labels into an ACMG classification.',
  outcome:
    'A source-linked allele annotation table, a MANE-versus-alternative transcript comparison and the independently labeled ClinVar assertion.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-variant-annotation-20260906',
  steps: [
    {
      title: 'Annotate the transcript HGVS',
      instruction:
        'Start with the supplied transcript version and explicit GRCh38 assembly. VEP returns an allele representation and a prioritized transcript.',
      namespace: 'vep',
      tool: 'vep_annotate_variant',
      identifier: 'NM_000492.4:c.1521_1523del',
      arguments: {
        variant: 'NM_000492.4:c.1521_1523del',
        assembly: 'GRCh38',
        response_mode: 'compact'
      },
      inspect: [
        'Retain the assembly and full transcript version. The compact transcript is representative; inspect the full response to confirm MANE status.'
      ],
      evidence: [
        {
          label: 'Ensembl VEP',
          url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
        }
      ]
    },
    {
      title: 'Locate the ClinVar record',
      instruction:
        'The exact versioned HGVS lookup found no indexed record. Search the gene and cDNA change, then inspect the returned accession.',
      namespace: 'clinvar',
      tool: 'clinvar_search_variants',
      identifier: 'CFTR \u00b7 c.1521_1523del',
      arguments: {
        query: 'c.1521_1523del',
        gene_symbol: 'CFTR',
        limit: 5,
        response_mode: 'compact',
        request_id: 'genefoundry-cftr-f508del-clinvar-03'
      },
      inspect: [
        'Confirm the gene and protein change before following the accession; a search hit is not an allele-identity guarantee.'
      ],
      evidence: [
        {
          label: 'VCV000007105',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/7105/'
        }
      ]
    },
    {
      title: 'Read the source classification',
      instruction:
        'Retrieve the matched ClinVar accession and preserve its transcript version, assembly, review status and coordinates.',
      namespace: 'clinvar',
      tool: 'clinvar_get_variant',
      identifier: 'VCV000007105',
      arguments: {
        identifier: 'VCV000007105',
        id_type: 'vcv',
        response_mode: 'standard',
        request_id: 'genefoundry-cftr-f508del-clinvar-04'
      },
      inspect: [
        'Keep ClinVar classification separate from a VEP consequence or impact label. Compare the actual coordinates rather than equating accession labels alone.'
      ],
      evidence: [
        {
          label: 'VCV000007105',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/7105/'
        }
      ]
    },
    {
      title: 'Record alternative representations',
      instruction:
        'Ask the Variant Recoder for genomic HGVS, SPDI and VCF spellings using the original transcript HGVS.',
      namespace: 'vep',
      tool: 'vep_recode_variant',
      identifier: 'NM_000492.4:c.1521_1523del',
      arguments: {
        variants: ['NM_000492.4:c.1521_1523del'],
        assembly: 'GRCh38',
        fields: 'hgvsg,spdi,vcf_string'
      },
      inspect: [
        'Do not mix zero-based SPDI positions, VCF anchor positions and HGVS deletion coordinates. Keep the reference accession.'
      ],
      evidence: [
        {
          label: 'Ensembl Variant Recoder',
          url: 'https://www.ensembl.org/info/docs/tools/vep/recoder/index.html'
        }
      ]
    },
    {
      title: 'Confirm the relevant transcript',
      instruction:
        'Inspect the full VEP annotation for MANE Select and one alternative protein-coding transcript.',
      namespace: 'vep',
      tool: 'vep_annotate_variant',
      identifier: 'GRCh38 \u00b7 7-117559591-TCTT-T',
      arguments: {
        variant: '7-117559591-TCTT-T',
        assembly: 'GRCh38',
        response_mode: 'full'
      },
      inspect: [
        'Read MANE status from the returned fields, not from the first row. Different transcript isoforms can give different protein numbering.'
      ],
      evidence: [
        {
          label: 'Ensembl VEP',
          url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
        }
      ]
    }
  ],
  limitations: [
    'One small deletion on one assembly is shown; structural variants and other reference assemblies need their own supported queries.',
    'Consequence terms describe predicted sequence effects. MODERATE is a VEP impact category, not an ACMG evidence strength or a clinical classification.',
    'ClinVar and VEP returned different VCF spellings. Preserve their provenance and normalize against the same reference before automated record matching.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'VCV000007105',
        url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/7105/'
      },
      {
        label: 'Ensembl VEP',
        url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
      },
      {
        label: 'Ensembl Variant Recoder',
        url: 'https://www.ensembl.org/info/docs/tools/vep/recoder/index.html'
      },
      {
        label: 'MANE transcript comparison',
        url: 'https://www.ncbi.nlm.nih.gov/refseq/MANE/'
      }
    ],
    limitation:
      'Actual MCP queries, with a bounded transcript selection. The exact ClinVar HGVS lookup required reformulation; no patient-level interpretation or independent variant classification was performed.'
  },
  result: {
    summary:
      'VEP returned an in-frame deletion and confirmed NM_000492.4 as MANE Select. The same gene and cDNA-change search found ClinVar VCV000007105, labeled pathogenic with a practice-guideline review status. These are separate annotation and classification outputs.',
    tables: [
      {
        caption: 'Allele identity and coordinate conventions',
        columns: ['Field', 'Returned value'],
        rows: [
          ['Input', 'NM_000492.4:c.1521_1523del'],
          ['Assembly', 'GRCh38'],
          ['VEP VCF spelling', '7-117559591-TCTT-T'],
          ['Genomic HGVS', 'NC_000007.14:g.117559592_117559594del'],
          ['SPDI', 'NC_000007.14:117559591:CTT:'],
          ['ClinVar VCF spelling', '7-117559590-ATCT-A']
        ]
      },
      {
        caption: 'One allele, two transcript annotations',
        columns: ['Transcript', 'Context', 'Consequence', 'Protein change'],
        rows: [
          [
            'ENST00000003084.11',
            'MANE Select: NM_000492.4',
            'inframe_deletion',
            'ENSP00000003084.6:p.Phe508del'
          ],
          [
            'ENST00000426809.5',
            'Alternative protein-coding transcript',
            'inframe_deletion',
            'ENSP00000389119.1:p.Phe478del'
          ]
        ]
      },
      {
        caption: 'ClinVar assertion, reported separately',
        columns: ['Field', 'Returned value'],
        rows: [
          ['Record', 'VCV000007105'],
          ['Record name', 'NM_000492.3(CFTR):c.1521_1523del (p.Phe508del)'],
          ['Aggregate classification', 'Pathogenic'],
          ['Review status', 'Practice guideline \u00b7 4 stars'],
          ['Source last evaluated', 'Mar 03, 2004']
        ]
      }
    ],
    notes: [
      'The ClinVar record uses NM_000492.3 in its name, whereas VEP marks NM_000492.4 as MANE Select. The direct versioned ClinVar lookup returned no match; a gene-plus-change search located the accession.',
      'VEP and ClinVar coordinate spellings differ. HGVS, SPDI and VCF use different conventions; retain both source representations and normalize before an automated join.',
      'The ClinVar classification is an aggregate record label. Review condition-specific assertions before applying it to a particular disorder.',
      'The transcript table selects two returned protein-coding annotations, not the entire VEP transcript list. No ACMG criteria are assigned here.',
      'ClinVar release: 31 August 2026. Its release date and star rating do not mean that every assertion was reevaluated recently. VEP supplies retrieval provenance but no upstream release number in this response.'
    ],
    sources: [
      {
        label: 'VCV000007105',
        url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/7105/'
      },
      {
        label: 'Ensembl VEP',
        url: 'https://www.ensembl.org/info/docs/tools/vep/index.html'
      },
      {
        label: 'Ensembl Variant Recoder',
        url: 'https://www.ensembl.org/info/docs/tools/vep/recoder/index.html'
      },
      {
        label: 'MANE transcript comparison',
        url: 'https://www.ncbi.nlm.nih.gov/refseq/MANE/'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
