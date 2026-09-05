import type { Workflow } from '../contracts'

export const ANIMAL_MODELS_WORKFLOW: Workflow = {
  id: 'animal-models',
  title: 'Which Pax2 mouse models have kidney phenotypes?',
  summary:
    'Find annotated renal phenotypes, then keep the allele, genotype and genetic background together.',
  prompt:
    'Use GeneFoundry to find mouse Pax2 models with renal or urinary phenotypes in MGI. Resolve the mouse marker, retrieve 30 phenotype annotations, and look up the alleles. Compare a heterozygous and homozygous Pax2 mutation, preserving genotype IDs, genetic backgrounds and source references. State whether the response is complete and whether conditional models are included.',
  outcome:
    'A source-linked comparison of annotated Pax2 genotypes, with allele types and explicit coverage limits.',
  exampleKind: 'verified',
  executionReviewId: 'workflow-animal-models-20260906',
  steps: [
    {
      title: 'Resolve the mouse marker',
      instruction:
        'Look up Pax2 and verify the current mouse symbol and human ortholog before collecting model annotations.',
      namespace: 'mgi',
      tool: 'mgi_get_marker',
      identifier: 'Pax2 → MGI:97486',
      arguments: { query: 'Pax2', response_mode: 'standard' },
      inspect: [
        'Confirm MGI:97486, mouse symbol Pax2 and human ortholog PAX2 / HGNC:8616.',
        'Keep the mouse GRCm39 coordinates distinct from human variant coordinates.'
      ],
      evidence: [
        { label: 'MGI Pax2 gene record', url: 'https://www.informatics.jax.org/marker/MGI:97486' }
      ]
    },
    {
      title: 'Retrieve renal annotations with their genotypes',
      instruction:
        'Filter to the renal/urinary system. Read phenotype annotations as statements about the specified genotype and background, rather than about every mouse carrying a Pax2 allele.',
      namespace: 'mgi',
      tool: 'mgi_get_marker_phenotypes',
      identifier: 'Pax2 · renal/urinary system · first 30 annotations',
      arguments: {
        query: 'Pax2',
        mp_system: 'renal/urinary system',
        response_mode: 'full',
        limit: 30
      },
      inspect: [
        'Keep mp_id, allelic_composition, genotype_id, genetic_background and pubmed_id together.',
        'The response returns 30 of 68 matching annotations. Multiple annotations can describe the same genotype; these are not 68 independent models.',
        'Read scope and excludes_conditional_genotypes before interpreting a missing phenotype.'
      ],
      evidence: [
        {
          label: 'MGI connector tools and data scope',
          url: 'https://github.com/berntpopp/mgi-link#readme'
        },
        {
          label: 'Pax2 heterozygous genotype',
          url: 'https://www.informatics.jax.org/allele/genoview/MGI:3694692'
        }
      ]
    },
    {
      title: 'Check how the alleles were made',
      instruction:
        'Join each selected phenotype row to the allele inventory by MGI allele ID. Distinguish a targeted null allele from a spontaneous mutation before choosing records to read next.',
      namespace: 'mgi',
      tool: 'mgi_get_marker_alleles',
      identifier: 'Pax2 · 21 recorded alleles',
      arguments: { query: 'Pax2', limit: 50, response_mode: 'compact' },
      inspect: [
        'For each allele, retain allele_id, allele_type, attributes and available PubMed references.',
        'The returned inventory has 21 alleles and is not truncated. Being listed does not mean a mouse line is available or suitable for a particular experiment.'
      ],
      evidence: [
        { label: 'Pax2 tm1Pgr allele', url: 'https://www.informatics.jax.org/allele/MGI:1857673' },
        { label: 'Pax2 1Neu allele', url: 'https://www.informatics.jax.org/allele/MGI:1857114' }
      ]
    }
  ],
  limitations: [
    'This connector’s phenotype report covers single-locus, non-conditional genotypes. It excludes conditional/Cre-driven and multi-genic models; consult MGI for those records.',
    'An annotated mouse phenotype supports model discovery. It does not validate a human candidate variant or establish that a selected model reproduces a patient’s disease.'
  ],
  review: {
    reviewedAt: '2026-09-06',
    sources: [
      { label: 'MGI Pax2 gene record', url: 'https://www.informatics.jax.org/marker/MGI:97486' },
      {
        label: 'MGI connector tools and data scope',
        url: 'https://github.com/berntpopp/mgi-link#readme'
      }
    ],
    limitation:
      'Three GeneFoundry calls executed through Claude Code 2.1.261 · Claude Opus 5. The table selects four annotations from the first 30 of 68 returned renal-system matches.'
  },
  result: {
    summary:
      'MGI resolved Pax2 to MGI:97486 and returned 30 of 68 renal/urinary annotations. The selected rows show why zygosity and genetic background belong next to the phenotype.',
    tables: [
      {
        caption: 'Selected renal annotations · one row per genotype–phenotype observation',
        columns: [
          'Allelic composition',
          'Annotated phenotype',
          'Genetic background',
          'Genotype / reference'
        ],
        rows: [
          [
            'Pax2<tm1Pgr>/Pax2<+>',
            'Decreased nephron number · MP:0011290',
            'Involves 129S1/Sv × 129X1/SvJ',
            'MGI:3694692 · PMID:8575306'
          ],
          [
            'Pax2<tm1Pgr>/Pax2<tm1Pgr>',
            'Absent kidney · MP:0000520',
            'Involves 129S1/Sv × 129X1/SvJ',
            'MGI:2677317 · PMID:8575306'
          ],
          [
            'Pax2<1Neu>/Pax2<+>',
            'Abnormal kidney development · MP:0000527',
            'Involves 102 × C57BL/6',
            'MGI:3841044 · PMID:14603255'
          ],
          [
            'Pax2<1Neu>/Pax2<1Neu>',
            'Abnormal kidney development · MP:0000527',
            'Involves 102 × C3H',
            'MGI:3841029 · PMID:8943028'
          ]
        ]
      },
      {
        caption: 'Allele records for those genotypes',
        columns: ['Allele', 'MGI identifier', 'Recorded type'],
        rows: [
          ['Pax2<tm1Pgr>', 'MGI:1857673', 'Targeted · null/knockout'],
          ['Pax2<1Neu>', 'MGI:1857114', 'Spontaneous']
        ]
      }
    ],
    notes: [
      'The first two rows use the same recorded mixed background but different allelic compositions. The two 1Neu rows have different recorded backgrounds as well as different zygosity; they are not a controlled comparison.',
      'These selected annotations do not report penetrance, effect size, age or sex. Open the genotype records and cited experiments before interpreting severity or selecting a model.',
      'Thirty rows are a bounded sample. A complete renal query would need a larger limit while retaining the renal/urinary filter.'
    ],
    sources: [
      { label: 'Pax2 gene · MGI:97486', url: 'https://www.informatics.jax.org/marker/MGI:97486' },
      {
        label: 'tm1Pgr heterozygote · MGI:3694692',
        url: 'https://www.informatics.jax.org/allele/genoview/MGI:3694692'
      },
      {
        label: 'tm1Pgr homozygote · MGI:2677317',
        url: 'https://www.informatics.jax.org/allele/genoview/MGI:2677317'
      },
      {
        label: '1Neu heterozygote · MGI:3841044',
        url: 'https://www.informatics.jax.org/allele/genoview/MGI:3841044'
      },
      {
        label: '1Neu homozygote · MGI:3841029',
        url: 'https://www.informatics.jax.org/allele/genoview/MGI:3841029'
      },
      { label: 'Experiment · PMID:8575306', url: 'https://pubmed.ncbi.nlm.nih.gov/8575306/' },
      { label: 'Experiment · PMID:14603255', url: 'https://pubmed.ncbi.nlm.nih.gov/14603255/' },
      { label: 'Experiment · PMID:8943028', url: 'https://pubmed.ncbi.nlm.nih.gov/8943028/' }
    ],
    executedAt: '2026-09-06',
    client: 'Claude Code 2.1.261 · Claude Opus 5'
  }
}
