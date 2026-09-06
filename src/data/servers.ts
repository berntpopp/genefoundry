/** Maintained website inventory, not live tool discovery or a service-availability measurement. */

export type ServerCategory =
  'variant' | 'gene-disease' | 'gene-protein' | 'expression-models' | 'literature' | 'ontology'

export interface CategoryMeta {
  id: ServerCategory
  label: string
  /** Semantic accessible category text class. */
  text: string
  /** Semantic category marker class. */
  dot: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'variant', label: 'Variants', text: 'category-text-variant', dot: 'category-dot-variant' },
  {
    id: 'gene-disease',
    label: 'Gene–disease',
    text: 'category-text-gene-disease',
    dot: 'category-dot-gene-disease'
  },
  {
    id: 'gene-protein',
    label: 'Genes & proteins',
    text: 'category-text-gene-protein',
    dot: 'category-dot-gene-protein'
  },
  {
    id: 'expression-models',
    label: 'Expression & models',
    text: 'category-text-expression-models',
    dot: 'category-dot-expression-models'
  },
  {
    id: 'literature',
    label: 'Literature',
    text: 'category-text-literature',
    dot: 'category-dot-literature'
  },
  {
    id: 'ontology',
    label: 'Ontologies',
    text: 'category-text-ontology',
    dot: 'category-dot-ontology'
  }
]

export interface ServerEntry {
  namespace: string
  domain: string
  source: string
  sourceUrl: string
  tools: number
  repo: string
  category: ServerCategory
  /** A representative federated tool name, e.g. `gnomad_search_genes`. */
  sampleTool: string
}

import provenanceJson from './fleet-provenance.json' with { type: 'json' }
import type { FleetProvenance } from './contracts.ts'

const provenance = provenanceJson as unknown as FleetProvenance

export const PROVENANCE_TOOL_COUNTS: Record<string, number> = Object.fromEntries(
  provenance.backends.map((b) => [b.namespace, b.tools.length])
)

function getToolCount(namespace: string): number {
  const count = PROVENANCE_TOOL_COUNTS[namespace]
  if (typeof count !== 'number') {
    throw new Error(`Missing tool count in fleet-provenance.json for backend: ${namespace}`)
  }
  return count
}

/** Ordered by tool count, matching the README catalog table and canonical fleet provenance. */
export const SERVERS: ServerEntry[] = [
  {
    namespace: 'pubtator',
    domain: 'Literature & entity annotation',
    source: 'PubTator3',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/research/pubtator3/',
    tools: getToolCount('pubtator'),
    repo: 'berntpopp/pubtator-link',
    category: 'literature',
    sampleTool: 'pubtator_search_literature'
  },
  {
    namespace: 'gnomad',
    domain: 'Variant, gene & population frequency',
    source: 'gnomAD',
    sourceUrl: 'https://gnomad.broadinstitute.org/',
    tools: getToolCount('gnomad'),
    repo: 'berntpopp/gnomad-link',
    category: 'variant',
    sampleTool: 'gnomad_search_genes'
  },
  {
    namespace: 'orphanet',
    domain: 'Rare disease ontology & associations',
    source: 'Orphadata',
    sourceUrl: 'https://www.orphadata.com/',
    tools: getToolCount('orphanet'),
    repo: 'berntpopp/orphanet-link',
    category: 'ontology',
    sampleTool: 'orphanet_resolve_disease'
  },
  {
    namespace: 'clingen',
    domain: 'Gene–disease curation',
    source: 'ClinGen',
    sourceUrl: 'https://clinicalgenome.org/',
    tools: getToolCount('clingen'),
    repo: 'berntpopp/clingen-link',
    category: 'gene-disease',
    sampleTool: 'clingen_get_gene_validity'
  },
  {
    namespace: 'hpo',
    domain: 'Phenotype ontology & associations',
    source: 'Human Phenotype Ontology',
    sourceUrl: 'https://hpo.jax.org/',
    tools: getToolCount('hpo'),
    repo: 'berntpopp/hpo-link',
    category: 'ontology',
    sampleTool: 'hpo_resolve_term'
  },
  {
    namespace: 'mavedb',
    domain: 'Variant-effect assay scores',
    source: 'MaveDB',
    sourceUrl: 'https://www.mavedb.org/',
    tools: getToolCount('mavedb'),
    repo: 'berntpopp/mavedb-link',
    category: 'variant',
    sampleTool: 'mavedb_search_score_sets'
  },
  {
    namespace: 'uniprot',
    domain: 'Protein function',
    source: 'UniProt',
    sourceUrl: 'https://www.uniprot.org/',
    tools: getToolCount('uniprot'),
    repo: 'berntpopp/uniprot-link',
    category: 'gene-protein',
    sampleTool: 'uniprot_find_proteins'
  },
  {
    namespace: 'mgi',
    domain: 'Mouse phenotype & models',
    source: 'MGI',
    sourceUrl: 'https://www.informatics.jax.org/',
    tools: getToolCount('mgi'),
    repo: 'berntpopp/mgi-link',
    category: 'expression-models',
    sampleTool: 'mgi_get_marker_phenotypes'
  },
  {
    namespace: 'genereviews',
    domain: 'Gene–disease literature',
    source: 'GeneReviews',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK1116/',
    tools: getToolCount('genereviews'),
    repo: 'berntpopp/genereviews-link',
    category: 'literature',
    sampleTool: 'genereviews_search_genereviews'
  },
  {
    namespace: 'mondo',
    domain: 'Disease ontology & cross-references',
    source: 'Mondo',
    sourceUrl: 'https://mondo.monarchinitiative.org/',
    tools: getToolCount('mondo'),
    repo: 'berntpopp/mondo-link',
    category: 'ontology',
    sampleTool: 'mondo_resolve_disease'
  },
  {
    namespace: 'clinpgx',
    domain: 'Pharmacogenomics & dosing guidelines',
    source: 'ClinPGx',
    sourceUrl: 'https://www.clinpgx.org/',
    tools: getToolCount('clinpgx'),
    repo: 'berntpopp/clinpgx-link',
    category: 'gene-disease',
    sampleTool: 'clinpgx_search_records'
  },
  {
    namespace: 'gencc',
    domain: 'Gene–disease curation',
    source: 'GenCC',
    sourceUrl: 'https://thegencc.org/',
    tools: getToolCount('gencc'),
    repo: 'berntpopp/gencc-link',
    category: 'gene-disease',
    sampleTool: 'gencc_resolve_identifier'
  },
  {
    namespace: 'metadome',
    domain: 'Protein tolerance landscapes',
    source: 'MetaDome',
    sourceUrl: 'https://stuart.radboudumc.nl/metadome/',
    tools: getToolCount('metadome'),
    repo: 'berntpopp/metadome-link',
    category: 'gene-protein',
    sampleTool: 'metadome_resolve_transcript'
  },
  {
    namespace: 'stringdb',
    domain: 'Protein–protein interaction networks',
    source: 'STRING',
    sourceUrl: 'https://string-db.org/',
    tools: getToolCount('stringdb'),
    repo: 'berntpopp/stringdb-link',
    category: 'gene-protein',
    sampleTool: 'stringdb_get_interaction_partners'
  },
  {
    namespace: 'gtex',
    domain: 'Tissue expression',
    source: 'GTEx Portal',
    sourceUrl: 'https://gtexportal.org/',
    tools: getToolCount('gtex'),
    repo: 'berntpopp/gtex-link',
    category: 'expression-models',
    sampleTool: 'gtex_get_median_expression_levels'
  },
  {
    namespace: 'hgnc',
    domain: 'Gene nomenclature',
    source: 'HGNC',
    sourceUrl: 'https://www.genenames.org/',
    tools: getToolCount('hgnc'),
    repo: 'berntpopp/hgnc-link',
    category: 'gene-protein',
    sampleTool: 'hgnc_resolve_symbol'
  },
  {
    namespace: 'panelapp',
    domain: 'Diagnostic gene panels & curation',
    source: 'PanelApp',
    sourceUrl: 'https://panelapp.genomicsengland.co.uk/',
    tools: getToolCount('panelapp'),
    repo: 'berntpopp/panelapp-link',
    category: 'gene-disease',
    sampleTool: 'panelapp_search_panels'
  },
  {
    namespace: 'autopvs1',
    domain: 'Variant ACMG PVS1',
    source: 'AutoPVS1',
    sourceUrl: 'https://autopvs1.bgi.com/',
    tools: getToolCount('autopvs1'),
    repo: 'berntpopp/autopvs1-link',
    category: 'variant',
    sampleTool: 'autopvs1_get_variant_pvs1_data'
  },
  {
    namespace: 'spliceai',
    domain: 'Splicing prediction',
    source: 'SpliceAI Lookup',
    sourceUrl: 'https://spliceailookup.broadinstitute.org/',
    tools: getToolCount('spliceai'),
    repo: 'berntpopp/spliceailookup-link',
    category: 'variant',
    sampleTool: 'spliceai_predict_splicing'
  },
  {
    namespace: 'vep',
    domain: 'Variant annotation & consequence',
    source: 'Ensembl VEP',
    sourceUrl: 'https://rest.ensembl.org/',
    tools: getToolCount('vep'),
    repo: 'berntpopp/vep-link',
    category: 'variant',
    sampleTool: 'vep_annotate_variant'
  },
  {
    namespace: 'clinvar',
    domain: 'Variant clinical significance',
    source: 'ClinVar',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/clinvar/',
    tools: getToolCount('clinvar'),
    repo: 'berntpopp/clinvar-link',
    category: 'variant',
    sampleTool: 'clinvar_get_variant'
  },
  {
    namespace: 'litvar',
    domain: 'Variant literature',
    source: 'LitVar2',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/research/litvar2/',
    tools: getToolCount('litvar'),
    repo: 'berntpopp/litvar-link',
    category: 'literature',
    sampleTool: 'litvar_get_variant_literature'
  }
]

export const SERVER_COUNT = SERVERS.length
export const TOOL_COUNT = SERVERS.reduce((sum, s) => sum + s.tools, 0)

export const HOSTED_ENDPOINT = 'https://genefoundry.org/mcp'
export const GITHUB_URL = 'https://github.com/berntpopp/genefoundry-router'
export const HEALTH_URL = 'https://genefoundry.org/health'
