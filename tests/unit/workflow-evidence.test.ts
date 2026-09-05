import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { WORKFLOWS } from '../../src/data/workflows'
import type { WorkflowId } from '../../src/data/contracts'

const workflow = (id: WorkflowId) => WORKFLOWS.find((entry) => entry.id === id)!
const capture = (id: string) =>
  JSON.parse(
    readFileSync(
      new URL(`../../docs/superpowers/execution/verification/${id}-20260906.json`, import.meta.url),
      'utf8'
    )
  )

test('expression rows join genes and tissues by identity rather than response order', () => {
  const result = workflow('tissue-expression').result!
  const genes = capture('tissue-expression').calls[0].result.genes as {
    geneSymbol: string
    gencodeId: string
    datasetId: string
    unit: string
    tissues: { tissue: string; median: number; n: number }[]
  }[]
  const tissues = ['Kidney_Cortex', 'Kidney_Medulla', 'Pancreas']
  for (const [symbol, ...values] of result.tables[0]!.rows) {
    const gene = genes.find((entry) => entry.geneSymbol === symbol)!
    expect(gene.datasetId).toBe('gtex_v10')
    expect(gene.unit).toBe('TPM')
    expect(values.map(Number)).toEqual(
      tissues.map((id) => gene.tissues.find((t) => t.tissue === id)!.median)
    )
    expect(result.tables[1]!.rows.find((row) => row[0] === symbol)?.[1]).toBe(gene.gencodeId)
    for (const [index, id] of tissues.entries()) {
      expect(result.tables[0]!.columns[index + 1]).toContain(
        `n = ${gene.tissues.find((t) => t.tissue === id)!.n}`
      )
    }
  }
})

test('ACMG worksheet does not convert a failed population lookup into absence evidence', () => {
  const calls = capture('acmg-evidence').calls
  const frequency = calls.find((entry: { call: { name: string } }) =>
    entry.call.name.endsWith('gnomad_get_variant_frequencies')
  )
  expect(frequency.isError).toBe(true)
  expect(frequency.result.error_code).toBe('not_found')
  const rows = workflow('acmg-evidence').result!.tables[1]!.rows
  expect(rows.find((row) => row[0] === 'PM2')?.[1]).toBe('Unassigned')
  expect(rows.find((row) => row[0] === 'PVS1')?.[1]).toContain('not independently assigned')
  expect(rows.find((row) => row[0] === 'Overall classification')?.[1]).toBe('Not assigned')
})

test('literature findings have abstract text behind every cited study', () => {
  const evidence = capture('literature-review').calls[1].result
  const result = workflow('literature-review').result!
  for (const source of result.sources) {
    const pmid = source.url.match(/\/(\d+)\/$/)![1]!
    expect(evidence.coverage_by_pmid[pmid]).toBe('abstract_only')
    const passages = evidence.passages.filter(
      (item: { pmid: string; section: string }) => item.pmid === pmid && item.section !== 'title'
    )
    expect(passages.length).toBeGreaterThan(0)
    expect(passages.some((item: { text: { text: string } }) => item.text.text.length > 200)).toBe(
      true
    )
  }
  expect(workflow('literature-review').review.limitation).toContain(
    'full-text methods and figures were not reviewed'
  )
})

test('annotation retains the two source coordinate spellings and MANE transcript version', () => {
  const evidence = capture('variant-annotation')
  const clinvar = evidence.calls[2].result
  const vep = evidence.calls[4].result.variants[0]
  const table = workflow('variant-annotation').result!.tables[0]!.rows
  expect(table.find((row) => row[0] === 'VEP VCF spelling')?.[1]).toBe(vep.variant_id)
  const coordinate = clinvar.coordinates.find(
    (item: { assembly: string }) => item.assembly === 'GRCh38'
  )
  expect(table.find((row) => row[0] === 'ClinVar VCF spelling')?.[1]).toBe(
    `${coordinate.chromosome}-${coordinate.position_vcf}-${coordinate.reference_allele_vcf}-${coordinate.alternate_allele_vcf}`
  )
  expect(workflow('variant-annotation').result!.tables[1]!.rows[0]![1]).toContain(
    vep.transcript_consequences.find((item: { mane_select: string }) => item.mane_select)
      ?.mane_select
  )
})
