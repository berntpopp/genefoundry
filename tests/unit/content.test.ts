import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { CLIENT_GUIDES } from '../../src/data/clients'
import { WORKFLOWS } from '../../src/data/workflows'
import { SOURCE_DETAILS } from '../../src/data/source-details'
import { SERVERS } from '../../src/data/servers'
import { PAGES } from '../../src/data/pages'
import { validateContent } from '../../src/lib/validation'
const input = {
  servers: SERVERS,
  details: SOURCE_DETAILS,
  clients: CLIENT_GUIDES,
  workflows: WORKFLOWS,
  pages: PAGES
}
test('publication content has complete reviewed joins and safe claims', () => {
  expect(() => validateContent(input, { publication: true })).not.toThrow()
  expect(SOURCE_DETAILS).toHaveLength(21)
  for (const detail of SOURCE_DETAILS) {
    expect(detail.tasks.length).toBeGreaterThan(0)
    expect(detail.identifiers.length).toBeGreaterThan(0)
    expect(detail.terms.length).toBeGreaterThan(0)
  }
})
test('documentation-only guides cannot expose an executable recipe', () => {
  expect(CLIENT_GUIDES).toHaveLength(7)
  for (const guide of CLIENT_GUIDES) {
    if (guide.recipeState === 'documentation-only') {
      expect(guide.code).toBeNull()
      expect(guide.recipeTest).toBeNull()
      expect(guide.steps.length).toBeGreaterThan(0)
    } else {
      expect(guide.code.trim()).not.toBe('')
      if (guide.recipeState === 'verified')
        expect(guide.recipeTest.verificationId.trim()).not.toBe('')
      else expect(guide.recipeTest).toBeNull()
    }
  }
})
test('illustrations never assert that an execution occurred', () => {
  expect(WORKFLOWS.map((w) => w.id).sort()).toEqual(['phenotype-rare-disease', 'variant-evidence'])
  for (const workflow of WORKFLOWS) {
    if (workflow.exampleKind === 'illustrative') expect(workflow.executionReviewId).toBeNull()
  }
})
test('invalid review dates, duplicate IDs and absent joins block publication', () => {
  expect(() =>
    validateContent({ ...input, details: SOURCE_DETAILS.slice(1) }, { publication: true })
  ).toThrow()
  expect(() =>
    validateContent(
      { ...input, clients: [...CLIENT_GUIDES, CLIENT_GUIDES[0]!] },
      { publication: true }
    )
  ).toThrow()
  expect(() =>
    validateContent(
      {
        ...input,
        details: SOURCE_DETAILS.map((d, i) =>
          i ? d : { ...d, review: { ...d.review, reviewedAt: 'not-a-date' } }
        )
      },
      { publication: true }
    )
  ).toThrow()
  expect(() =>
    validateContent(
      { ...input, pages: PAGES.filter((p) => p.path !== '/connect/codex/') },
      { publication: true }
    )
  ).toThrow()
})

test('worked examples contain reusable prompts and source-backed inputs to inspect', () => {
  for (const workflow of WORKFLOWS) {
    expect(workflow.prompt.length).toBeGreaterThan(100)
    expect(workflow.outcome.length).toBeGreaterThan(40)
    expect(workflow.steps.every((step) => step.tool && step.arguments && step.inspect.length)).toBe(
      true
    )
    for (const step of workflow.steps) {
      expect(step.evidence.some((link) => link.url.includes('/blob/'))).toBe(true)
    }
  }
  const phenotype = WORKFLOWS.find((w) => w.id === 'phenotype-rare-disease')!
  expect(
    phenotype.steps
      .filter((step) => step.tool === 'hpo_get_genes_for_phenotype')
      .map((step) => step.arguments?.hpo_id)
  ).toEqual(['HP:0000107', 'HP:0000819', 'HP:0000819'])
  const variant = WORKFLOWS.find((w) => w.id === 'variant-evidence')!
  expect(
    variant.steps.find((step) => step.tool === 'clinvar_get_variants_by_gene')?.arguments
  ).toMatchObject({ gene_symbol: 'HNF1B', limit: 5, sort: 'stars_desc' })
})

test('published workflow calls and results match the captured execution evidence', () => {
  for (const workflow of WORKFLOWS) {
    const name = workflow.id === 'variant-evidence' ? 'hnf1b' : 'phenotype'
    const evidence = JSON.parse(
      readFileSync(
        new URL(
          `../../docs/superpowers/execution/verification/${name}-20260905.json`,
          import.meta.url
        ),
        'utf8'
      )
    )
    expect(workflow.exampleKind).toBe('verified')
    expect(workflow.result?.client).toBe(evidence.client)
    expect(workflow.result?.executedAt).toBe(evidence.executedAt)
    expect(workflow.steps).toHaveLength(evidence.calls.length)
    for (const [index, step] of workflow.steps.entries()) {
      const call = evidence.calls[index].call
      expect(step.tool).toBe(
        call.arguments.name ?? call.name.replace('mcp__claude_ai_genefoundry__', '')
      )
      expect(step.arguments).toEqual(
        call.arguments.name ? call.arguments.arguments : call.arguments
      )
      expect(evidence.calls[index].result.success).toBe(true)
    }
    if (workflow.id === 'variant-evidence') {
      const raw = evidence.calls[2].result.results
      expect(workflow.result?.tables[1]?.rows.map((row) => row[3])).toEqual(
        raw.map((row: { vcv_accession: string }) => row.vcv_accession)
      )
      expect(workflow.result?.tables[1]?.rows.map((row) => row[1])).toEqual(
        raw.map((row: { classification: string }) => row.classification.replaceAll('_', ' '))
      )
      expect(workflow.result?.tables[0]?.rows[0]?.[1]).toContain(
        evidence.calls[1].result.gnomad_constraint.oe_lof.toFixed(3)
      )
    } else {
      const renal = evidence.calls[2].result.genes as {
        ncbi_gene_id: string
        gene_symbol: string
      }[]
      const diabetes = [...evidence.calls[3].result.genes, ...evidence.calls[4].result.genes] as {
        ncbi_gene_id: string
        gene_symbol: string
      }[]
      expect(renal).toHaveLength(evidence.calls[2].result.total)
      expect(diabetes).toHaveLength(evidence.calls[3].result.total)
      const diabetesIds = new Set(diabetes.map((gene) => gene.ncbi_gene_id))
      const intersection = renal
        .filter((gene) => diabetesIds.has(gene.ncbi_gene_id))
        .map((gene) => gene.gene_symbol)
        .sort()
      expect(intersection).toHaveLength(13)
      expect(workflow.result?.tables[1]?.rows.map((row) => row[0])).toEqual(intersection)
      expect(workflow.result?.tables[2]?.rows.find((row) => row[0] === 'Classification')?.[1]).toBe(
        evidence.calls[6].result.records[0].classification
      )
    }
  }
})
