import type { SourceDetail } from './contracts'

export const SOURCE_DETAILS: SourceDetail[] = [
  {
    namespace: 'pubtator',
    summary:
      'Search biomedical literature and inspect machine-annotated entities and relations from PubTator3.',
    tasks: [
      'Find PubMed literature for a research question',
      'Follow an entity annotation back to the article'
    ],
    aliases: ['PubTator', 'PubMed', 'PMC', 'literature annotation'],
    identifiers: ['PubMed search text', 'PMID', 'PMCID', 'PubTator entity identifiers'],
    dataVersion: null,
    limitations: [
      'An extracted entity or relation is an annotation, not independent confirmation of an experimental finding.',
      'Full-text coverage depends on article access; publication reuse terms still apply.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/pubtator-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/pubtator-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'gnomad',
    summary:
      'Explore population variation, gene constraint and coverage through the listed gnomAD integration.',
    tasks: [
      'Resolve a gene before exploring population variation',
      'Compare a variant in the appropriate dataset and reference assembly',
      'Review coverage and filtering alongside allele counts'
    ],
    aliases: ['Genome Aggregation Database', 'population frequency', 'constraint', 'ExAC'],
    identifiers: [
      'Gene symbol or alias',
      'Ensembl gene identifier',
      'CHROM-POS-REF-ALT with reference assembly',
      'rsID resolved to a canonical variant identifier'
    ],
    dataVersion: null,
    limitations: [
      'Dataset and reference assembly must agree: the integration documents different query schemas for GRCh37 and GRCh38 releases.',
      'A gene lookup does not identify a specific allele. Resolve the complete variant before querying its frequency.',
      'Missing records, low coverage and filtered observations must not be interpreted as proof that a variant is absent from a population.',
      'This page includes no captured frequency response. Record the dataset version returned by your query; the deployed version has not been measured here.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/gnomad-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/gnomad-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'orphanet',
    summary:
      'Resolve rare disease concepts and explore Orphadata nomenclature, classifications and associations.',
    tasks: [
      'Resolve a disease name to an ORPHA code',
      'Review rare disease gene and phenotype associations'
    ],
    aliases: ['Orphanet', 'ORPHA', 'rare disease'],
    identifiers: [
      'Disease label or synonym',
      'ORPHA code',
      'External disease CURIE such as OMIM or MONDO'
    ],
    dataVersion: null,
    limitations: [
      'The integration reads a local index of English Orphadata knowledge files, whose release may differ from the current website.',
      'An association or cross-reference does not establish a diagnosis; retain the original disease concept and mapping context.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/orphanet-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/orphanet-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'clingen',
    summary:
      'Review ClinGen gene–disease validity, dosage, actionability and expert-panel evidence as distinct curation domains.',
    tasks: [
      'Find gene–disease validity curations',
      'Compare the scope of dosage and validity evidence'
    ],
    aliases: ['Clinical Genome Resource', 'gene validity', 'dosage sensitivity'],
    identifiers: ['Gene symbol or alias', 'HGNC identifier', 'MONDO disease identifier'],
    dataVersion: null,
    limitations: [
      'Different evidence domains have different review processes and identifiers. A validity classification is not a variant classification.',
      'The integration combines snapshot-backed domains; inspect source dates and expert-panel records before interpretation.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/clingen-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/clingen-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'hpo',
    summary:
      'Resolve phenotype terminology and explore the Human Phenotype Ontology hierarchy and curated associations.',
    tasks: [
      'Resolve a phenotype label or synonym to an HP identifier',
      'Explore parent and descendant terms',
      'Review disease and gene associations separately from ontology definitions'
    ],
    aliases: ['Human Phenotype Ontology', 'phenotype', 'HPOA'],
    identifiers: [
      'Phenotype label or synonym',
      'HP:NNNNNNN identifier',
      'External ontology CURIE supported by the resolver'
    ],
    dataVersion: null,
    limitations: [
      'HPO terms describe phenotypic abnormalities; a matching term or associated disease does not establish a diagnosis.',
      'The integration reads a pinned local ontology and annotation snapshot. Its loaded release may differ from the latest upstream release.',
      'Cross-ontology mappings have different predicates and may be ambiguous. Preserve the original wording and inspect the resolved term, obsolescence and mapping relationship.',
      'Gene associations may be derived through disease annotations; inspect that provenance rather than treating all edges as direct experimental findings.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/hpo-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/hpo-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'mavedb',
    summary:
      'Find multiplexed variant-effect experiments and inspect scores with their assay and calibration context.',
    tasks: [
      'Find score sets for a gene or experiment',
      'Read a variant score alongside its score-set calibration'
    ],
    aliases: ['MAVE', 'deep mutational scanning', 'functional assay'],
    identifiers: ['Score-set URN', 'Variant URN', 'Score-set URN together with HGVS notation'],
    dataVersion: null,
    limitations: [
      'A raw functional score has no universal pathogenicity threshold; calibration belongs to its score set.',
      'Each score set has its own reuse license, experimental system and measured effect.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/mavedb-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/mavedb-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'uniprot',
    summary:
      'Explore protein function, features and cross-references through the UniProt integration.',
    tasks: [
      'Find proteins with relevant annotations',
      'Inspect protein features and annotation evidence'
    ],
    aliases: ['UniProtKB', 'Swiss-Prot', 'protein function'],
    identifiers: ['UniProt accession', 'Gene symbol with organism context', 'Taxonomy identifier'],
    dataVersion: null,
    limitations: [
      'Distinguish reviewed and unreviewed entries and retain organism and isoform context.',
      'Broad SPARQL joins can be capped or rejected; a limited response is not a complete protein inventory.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/uniprot-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/uniprot-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'mgi',
    summary: 'Explore mouse genes, alleles and phenotypes from Mouse Genome Informatics.',
    tasks: [
      'Find phenotype records for a mouse marker',
      'Resolve human genes to documented mouse orthologs'
    ],
    aliases: ['Mouse Genome Informatics', 'mouse model', 'Mammalian Phenotype'],
    identifiers: [
      'Mouse gene symbol',
      'MGI identifier',
      'Human symbol or HGNC identifier for ortholog resolution'
    ],
    dataVersion: null,
    limitations: [
      'Mouse phenotype evidence is model-specific and is not a direct prediction of a human phenotype.',
      'The local index depends on bulk-report freshness; retain allele and genetic-background context.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/mgi-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/mgi-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'genereviews',
    summary:
      'Find expert-authored GeneReviews chapters and review passages in their chapter context.',
    tasks: [
      'Find a chapter by gene symbol',
      'Read a passage with its section and chapter citation'
    ],
    aliases: ['Gene Reviews', 'NCBI Bookshelf', 'gene disease review'],
    identifiers: [
      'Gene symbol',
      'NCBI Bookshelf NBK accession',
      'Passage identifier returned by the integration'
    ],
    dataVersion: null,
    limitations: [
      'Chapters have individual update dates; a passage does not replace the full review or establish current clinical guidance.',
      'GeneReviews text is copyrighted and has specific attribution and redistribution terms.'
    ],
    terms: [
      {
        label: 'GeneReviews copyright notice and usage disclaimer',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK138602/'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/genereviews-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'mondo',
    summary: 'Resolve disease terminology and inspect Mondo hierarchy and cross-ontology mappings.',
    tasks: [
      'Resolve a disease name to a MONDO concept',
      'Compare disease cross-references and mapping predicates'
    ],
    aliases: ['Mondo Disease Ontology', 'disease mapping', 'MONDO'],
    identifiers: ['Disease label or synonym', 'MONDO identifier', 'External disease CURIE'],
    dataVersion: null,
    limitations: [
      'A cross-reference may not assert exact equivalence; inspect its mapping predicate.',
      'The integration uses a local release index and can include obsolete concepts.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/mondo-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/mondo-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'clinpgx',
    summary:
      'Search curated pharmacogenomics datasets, gene-drug clinical annotations, CPIC and PharmGKB dosing guidelines, and variant-level drug responses.',
    tasks: [
      'Query gene-drug pairs and dosing guidelines (e.g. CYP2D6 and codeine)',
      'Search pharmacogenomic variant assertions and CPIC clinical recommendations',
      'Inspect curated snapshot datasets across drug response phenotypes'
    ],
    aliases: [
      'ClinPGx',
      'CPIC',
      'PharmGKB',
      'PharmCAT',
      'pharmacogenomics',
      'drug response',
      'dosing guidelines'
    ],
    identifiers: [
      'Gene symbol (e.g. CYP2D6, TPMT, DPYD)',
      'Drug name or RxNorm identifier',
      'CPIC guideline identifier',
      'Variant or star allele (e.g. *4, *5)'
    ],
    dataVersion: 'v0.1.0 snapshot (120 curated datasets) / 2026 live API',
    limitations: [
      'Dosing guidelines and clinical recommendations must be interpreted in the context of official CPIC/PharmGKB publications and institutional protocols.',
      'Curated snapshot datasets reflect the indexed release; live API queries supplement but depend on upstream ClinPGx availability.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/clinpgx-link#license'
      },
      {
        label: 'ClinPGx terms and data downloads',
        url: 'https://www.clinpgx.org/downloads'
      }
    ],
    review: {
      reviewedAt: '2026-09-06',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/clinpgx-link#readme'
        },
        {
          label: 'ClinPGx portal',
          url: 'https://www.clinpgx.org/'
        }
      ],
      limitation:
        'Editorial review of integration contracts and published v0.1.0 release; live queries depend on upstream availability.'
    }
  },
  {
    namespace: 'gencc',
    summary:
      'Compare submitted gene–disease validity assertions in the Gene Curation Coalition resource.',
    tasks: [
      'Resolve a gene or disease identifier',
      'Compare assertions from different submitting organizations'
    ],
    aliases: ['Gene Curation Coalition', 'gene disease validity'],
    identifiers: ['Gene symbol', 'HGNC identifier', 'MONDO or OMIM disease identifier'],
    dataVersion: null,
    limitations: [
      'Assertions from different submitters can disagree or use different disease scopes. Preserve the submitter, classification and date.',
      'A gene–disease assertion is not a classification of a particular variant.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/gencc-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/gencc-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'metadome',
    summary:
      'Explore protein tolerance landscapes and domain context for a resolved MetaDome transcript.',
    tasks: [
      'Resolve a gene to an analyzable transcript',
      'Inspect residue tolerance and homologous domain context'
    ],
    aliases: ['MetaDome', 'protein tolerance', 'Pfam'],
    identifiers: ['Gene symbol', 'Versioned Ensembl transcript identifier'],
    dataVersion: null,
    limitations: [
      'Transcript and dataset build determine which residues can be compared. Not every transcript is analyzable.',
      'Homologous-domain aggregates and residue-specific annotations are different evidence; tolerance does not establish pathogenicity.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/metadome-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/metadome-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'stringdb',
    summary: 'Explore STRING protein association networks and their supporting evidence channels.',
    tasks: [
      'Resolve protein identifiers with organism context',
      'Inspect interaction partners and network evidence'
    ],
    aliases: ['STRING', 'protein interaction', 'network'],
    identifiers: [
      'STRING protein identifier',
      'Gene symbol or synonym',
      'UniProt accession with organism context'
    ],
    dataVersion: null,
    limitations: [
      'A STRING association need not be a direct physical interaction; inspect evidence channels and scores.',
      'Network thresholds, species and response limits change the set of reported partners.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/stringdb-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/stringdb-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'gtex',
    summary:
      'Explore tissue-level expression and regulatory associations in open-access GTEx Portal data.',
    tasks: [
      'Compare median expression across tissues',
      'Resolve genes against the selected GTEx dataset'
    ],
    aliases: ['Genotype-Tissue Expression', 'tissue expression', 'eQTL'],
    identifiers: [
      'Gene symbol',
      'Versioned GENCODE/Ensembl gene identifier',
      'GTEx tissue identifier'
    ],
    dataVersion: null,
    limitations: [
      'Median tissue expression is an aggregate and does not describe an individual patient or cell type.',
      'Gene identifiers must match the selected dataset. Protected individual-level data are outside this integration’s documented scope.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/gtex-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/gtex-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'hgnc',
    summary:
      'Resolve approved human gene symbols, aliases and cross-references using HGNC nomenclature.',
    tasks: [
      'Reconcile an older symbol with the approved gene record',
      'Find external identifiers for a human gene'
    ],
    aliases: ['HUGO Gene Nomenclature Committee', 'gene symbol', 'gene naming'],
    identifiers: [
      'Approved gene symbol',
      'Previous or alias symbol',
      'HGNC identifier',
      'Supported external gene identifier'
    ],
    dataVersion: null,
    limitations: [
      'Aliases can be ambiguous and records can be withdrawn. Inspect match type and candidates before choosing a gene.',
      'A nomenclature match identifies a gene; it is not evidence for a disease relationship.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/hgnc-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/hgnc-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'panelapp',
    summary: 'Explore curated gene panels from Genomics England and PanelApp Australia.',
    tasks: [
      'Find a panel by disorder or name',
      'Compare gene membership and evidence confidence across panels'
    ],
    aliases: ['PanelApp UK', 'PanelApp Australia', 'gene panel'],
    identifiers: [
      'Panel name or disorder text',
      'Panel identifier with region',
      'Approved gene symbol'
    ],
    dataVersion: null,
    limitations: [
      'Panel identifiers are region-specific; retain the portal, panel version and sign-off context.',
      'Confidence categories and panel inclusion are curated evidence summaries, not a patient-specific diagnostic conclusion.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/panelapp-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/panelapp-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'autopvs1',
    summary:
      'Inspect AutoPVS1 loss-of-function evidence for sequence variants and copy-number changes.',
    tasks: [
      'Review the documented PVS1 flowchart for a resolved variant',
      'Keep variant coordinates and genome build with the evidence'
    ],
    aliases: ['PVS1', 'loss of function', 'null variant'],
    identifiers: [
      'CHROM-POS-REF-ALT for SNVs/indels',
      'CHROM-START-END-DEL or DUP for CNVs',
      'Explicit hg19 or hg38 genome build'
    ],
    dataVersion: null,
    limitations: [
      'PVS1 is one evidence criterion, not a complete variant classification. Transcript and disease mechanism matter.',
      'The integration documents an HTML-scraping dependency that can change without a versioned API contract.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/autopvs1-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/autopvs1-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'spliceai',
    summary:
      'Inspect predicted splice effects through SpliceAI Lookup, with model and consequence context.',
    tasks: [
      'Resolve a variant before requesting a splicing prediction',
      'Compare documented model outputs with transcript consequences'
    ],
    aliases: ['SpliceAI Lookup', 'Pangolin', 'splicing prediction'],
    identifiers: [
      'CHROM-POS-REF-ALT with genome build',
      'HGVS or rsID resolved to a canonical variant'
    ],
    dataVersion: null,
    limitations: [
      'Predicted splice effects are computational evidence and do not establish an experimentally observed effect.',
      'Models and annotations have separate terms; retain genome build, model context and submitted allele.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/spliceailookup-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/spliceailookup-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'vep',
    summary: 'Annotate sequence variants and inspect transcript consequences through Ensembl VEP.',
    tasks: [
      'Resolve equivalent variant representations',
      'Review consequences across affected transcripts'
    ],
    aliases: ['Variant Effect Predictor', 'Ensembl', 'variant annotation'],
    identifiers: [
      'HGVS notation',
      'rsID',
      'Genomic CHR-POS-REF-ALT',
      'SPDI or VCF representation supported by the recoder'
    ],
    dataVersion: null,
    limitations: [
      'Consequences depend on reference assembly, transcript and annotation release. Preserve these with the variant.',
      'A predicted consequence is not a pathogenicity classification; batch and response limits may omit detail.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/vep-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/vep-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'clinvar',
    summary:
      'Review submitted variant classifications, review status and condition context from ClinVar.',
    tasks: [
      'Resolve a variant to a ClinVar record',
      'Compare classifications, supporting submissions and review status',
      'Preserve variant and condition-specific accessions'
    ],
    aliases: ['NCBI ClinVar', 'clinical significance', 'VCV'],
    identifiers: ['VCV accession', 'VariationID', 'dbSNP rsID', 'HGVS expression', 'AlleleID'],
    dataVersion: null,
    limitations: [
      'ClinVar archives submitted classifications; it does not independently curate or change a classification without a submission.',
      'Conflicting submissions and different condition scopes can coexist. Review the supporting evidence, submitter and date rather than treating an aggregate label as a conclusion.',
      'The integration uses a local weekly-release index. The loaded snapshot and available fields can differ from the current ClinVar web record.',
      'VCV records aggregate by variant, while RCV records aggregate by variant–condition pair. Keep the relevant accession and reference sequence.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/clinvar-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/clinvar-link#readme'
        },
        {
          label: 'What is ClinVar?',
          url: 'https://www.ncbi.nlm.nih.gov/clinvar/intro/'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  },
  {
    namespace: 'litvar',
    summary: 'Find publications associated with genetic variants in NCBI LitVar2.',
    tasks: [
      'Resolve a variant before searching its literature',
      'Follow publication identifiers to the original articles'
    ],
    aliases: ['LitVar', 'LitVar2', 'variant literature'],
    identifiers: ['dbSNP rsID', 'Gene symbol', 'Protein notation supported by autocomplete'],
    dataVersion: null,
    limitations: [
      'A publication mentioning a variant may not provide evidence about that variant’s effect. Read the article and the variant context.',
      'Literature indexing and accessible text are incomplete; no result does not prove that no publication exists.'
    ],
    terms: [
      {
        label: 'Source terms and attribution in integration documentation',
        url: 'https://github.com/berntpopp/litvar-link#license'
      }
    ],
    review: {
      reviewedAt: '2026-09-05',
      sources: [
        {
          label: 'Integration documentation',
          url: 'https://github.com/berntpopp/litvar-link#readme'
        }
      ],
      limitation:
        'Editorial review of source and integration documentation; no hosted query or deployed data version was verified.'
    }
  }
]
