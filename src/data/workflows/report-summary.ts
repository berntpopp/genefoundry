import type { Workflow } from '../contracts'

export const REPORT_SUMMARY: Workflow = {
  id: 'report-summary',
  title: 'Draft a source-backed HNF1B gene summary',
  summary:
    'GeneReviews passages and ClinGen curation become a concise report draft that separates HNF1B-related disease from the broader 17q12 deletion syndrome.',
  prompt:
    'Use GeneFoundry to draft a short HNF1B gene summary for a research report. Check GeneReviews and ClinGen, cover the renal and diabetes associations, and distinguish intragenic HNF1B variants from the broader 17q12 deletion syndrome. Cite the supporting chapter and curation. Do not make a patient diagnosis or classify an individual variant.',
  outcome:
    'A citable gene-level summary with an explicit distinction between single-gene and deletion-syndrome evidence.',
  steps: [
    {
      title: 'Find chapters mentioning HNF1B',
      instruction:
        'Search the live GeneReviews index by gene symbol; three chapter PubMed IDs were returned.',
      namespace: 'genereviews',
      tool: 'genereviews_search_genereviews',
      identifier: 'HNF1B',
      arguments: {
        gene_symbol: 'HNF1B',
        retmax: 20
      },
      inspect: ['Resolve chapter identifiers from actual results before retrieving content.'],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    },
    {
      title: 'Locate relevant chapter passages',
      instruction:
        'Search the renal, diabetes and genetic context; matching passages identify the 17q12 deletion chapter NBK401562.',
      namespace: 'genereviews',
      tool: 'genereviews_search_passages',
      identifier: 'HNF1B',
      arguments: {
        q: 'HNF1B renal cysts diabetes 17q12 deletion',
        gene: 'HNF1B',
        mode: 'full',
        limit: 8,
        sections: ['summary', 'clinical_features', 'molecular_genetics']
      },
      inspect: [
        'Read passage text and source identifiers; retain chapter and corpus version metadata.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    },
    {
      title: 'Check the single-gene curation',
      instruction: 'Retrieve the HNF1B gene–disease validity record from ClinGen.',
      namespace: 'clingen',
      tool: 'clingen_get_gene_validity',
      identifier: 'HNF1B',
      arguments: {
        gene_symbol: 'HNF1B',
        response_mode: 'compact'
      },
      inspect: ['Confirm disease, classification, mode of inheritance and original curation link.'],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/clingen-link/blob/09ead33761449e80df72cd2f76ee3fe1d25c1ad6/README.md'
        }
      ]
    },
    {
      title: 'Check summary availability',
      instruction:
        'The chapter-section endpoint returned no summary passages and explicitly directed the caller to the chapter abstract.',
      namespace: 'genereviews',
      tool: 'genereviews_get_chapter_section',
      identifier: 'HNF1B',
      arguments: {
        nbk_id: 'NBK401562',
        section: 'summary'
      },
      inspect: [
        'An empty section is not evidence; recover content through the documented abstract endpoint.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    },
    {
      title: 'Read diabetes and clinical context',
      instruction: 'Retrieve focused clinical passages from the identified chapter.',
      namespace: 'genereviews',
      tool: 'genereviews_search_passages',
      identifier: 'HNF1B',
      arguments: {
        q: 'maturity-onset diabetes of the young MODY onset insulin pancreatic hypoplasia',
        nbk_id: 'NBK401562',
        sections: ['clinical_features'],
        mode: 'full',
        limit: 3
      },
      inspect: [
        'Keep deletion-cohort observations separate from claims about intragenic variants.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    },
    {
      title: 'Read the molecular-genetics section',
      instruction:
        'Retrieve the complete section to preserve the distinction between HNF1B haploinsufficiency and contributions from other deleted genes.',
      namespace: 'genereviews',
      tool: 'genereviews_get_chapter_section',
      identifier: 'HNF1B',
      arguments: {
        nbk_id: 'NBK401562',
        section: 'molecular_genetics'
      },
      inspect: [
        'Check the complete section rather than relying on a search excerpt that ends mid-sentence.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    },
    {
      title: 'Recover the chapter abstract',
      instruction: 'Retrieve the live PubMed abstract for the confirmed chapter PMID.',
      namespace: 'genereviews',
      tool: 'genereviews_get_abstract',
      identifier: 'HNF1B',
      arguments: {
        pmid: '27929632'
      },
      inspect: [
        'Check the title matches NBK401562 and use actual abstract content instead of the missing summary section.'
      ],
      evidence: [
        {
          label: 'Reviewed tool documentation',
          url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
        }
      ]
    }
  ],
  limitations: [
    'This is a gene-level research summary. A definitive gene–disease relationship does not classify a particular variant or establish a diagnosis in a patient.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      {
        label: 'GeneReviews · NBK401562',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK401562/'
      },
      {
        label: 'ClinGen HNF1B curation',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
      },
      {
        label: 'GeneReviews abstract · PMID 27929632',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27929632/'
      },
      {
        label: 'GeneReviews tool documentation',
        url: 'https://github.com/berntpopp/genereviews-link/blob/bc27e40da4028a116a547b5f98a51a48891a5af5/README.md'
      }
    ],
    limitation:
      'Draft paraphrased from retrieved chapter content and the actual ClinGen record. The indexed chapter metadata and live Bookshelf revision date differ.'
  },
  result: {
    summary:
      'HNF1B haploinsufficiency is associated with kidney, urogenital and endocrine abnormalities. Pathogenic variants within HNF1B cause renal cysts and diabetes syndrome, including kidney and urinary-tract malformations and MODY5. The recurrent 17q12 deletion includes HNF1B and additional genes; its broader phenotype should not be attributed to HNF1B alone.',
    tables: [
      {
        caption: 'Evidence supporting the report draft',
        columns: ['Topic', 'Source-backed finding', 'Source'],
        rows: [
          [
            'Gene–disease validity',
            'Definitive association with renal cysts and diabetes syndrome; autosomal dominant inheritance. Curated 19 January 2021.',
            'ClinGen HNF1B curation'
          ],
          [
            'Renal and endocrine association',
            'The molecular-genetics section links HNF1B haploinsufficiency to kidney, urogenital and endocrine abnormalities.',
            'GeneReviews · NBK401562'
          ],
          [
            'Deletion-syndrome context',
            'The chapter describes variable renal, diabetes and neurodevelopmental manifestations of 17q12 deletion syndrome.',
            'GeneReviews abstract · PMID 27929632'
          ],
          [
            'Scope of the evidence',
            'Other genes in the deleted interval likely contribute to neurodevelopmental features; deletion-syndrome observations cannot all be assigned to HNF1B.',
            'GeneReviews · NBK401562'
          ]
        ]
      }
    ],
    notes: [
      'GeneReviews®: University of Washington, Seattle; chapter NBK401562. Retrieved corpus metadata lists 6 February 2025; the live Bookshelf page lists a later revision, 14 August 2025. Consult the linked chapter for current wording.',
      'The indexed summary section was empty. The recorded workflow recovered the live chapter abstract and used the available molecular-genetics and clinical passages.'
    ],
    sources: [
      {
        label: 'GeneReviews · NBK401562',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK401562/'
      },
      {
        label: 'ClinGen HNF1B curation',
        url: 'https://search.clinicalgenome.org/kb/gene-validity/CGGV:assertion_4174ea0a-6901-4070-ad93-d92614fd55c0-2021-01-19T170000.000Z'
      },
      {
        label: 'GeneReviews abstract · PMID 27929632',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27929632/'
      }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  },
  exampleKind: 'verified',
  executionReviewId: 'workflow-report-summary-20260906'
}
