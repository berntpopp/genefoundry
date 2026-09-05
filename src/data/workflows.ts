import type { Workflow } from './contracts'
import { VARIANT_EVIDENCE_WORKFLOW } from './workflows/variant-evidence'
import { PHENOTYPE_RARE_DISEASE_WORKFLOW } from './workflows/phenotype-rare-disease'

import { VARIANT_ANNOTATION_WORKFLOW } from './workflows/variant-annotation'
import { LITERATURE_REVIEW } from './workflows/literature-review'
import { REPORT_SUMMARY } from './workflows/report-summary'
import { GENE_VALIDITY_WORKFLOW } from './workflows/gene-validity'
import { ACMG_EVIDENCE_WORKFLOW } from './workflows/acmg-evidence'
import { ANIMAL_MODELS_WORKFLOW } from './workflows/animal-models'
import { TISSUE_EXPRESSION_WORKFLOW } from './workflows/tissue-expression'

export const FEATURED_WORKFLOWS: Workflow[] = [
  VARIANT_EVIDENCE_WORKFLOW,
  PHENOTYPE_RARE_DISEASE_WORKFLOW
]
export const WORKFLOWS: Workflow[] = [
  ...FEATURED_WORKFLOWS,
  VARIANT_ANNOTATION_WORKFLOW,
  LITERATURE_REVIEW,
  REPORT_SUMMARY,
  GENE_VALIDITY_WORKFLOW,
  ACMG_EVIDENCE_WORKFLOW,
  ANIMAL_MODELS_WORKFLOW,
  TISSUE_EXPRESSION_WORKFLOW
]
