import { expect, test } from 'vitest'
import { filterSources } from '../../src/lib/catalog'
import { SERVERS } from '../../src/data/servers'
import type { SourceDetail } from '../../src/data/contracts'
const details = [{ namespace: 'hpo', aliases: ['rare phenotype'] }] as SourceDetail[]
test('search intersects category and resets in catalog order', () => {
  expect(filterSources(SERVERS, details, ' GNOMAD ', 'variant').map((s) => s.namespace)).toEqual([
    'gnomad'
  ])
  expect(filterSources(SERVERS, details, 'gnomad', 'literature')).toEqual([])
  expect(filterSources(SERVERS, details, '', 'all')).toEqual(SERVERS)
})
test('every token must match, including curated aliases', () => {
  expect(
    filterSources(SERVERS, details, 'rare phenotype', 'ontology').map((s) => s.namespace)
  ).toEqual(['hpo'])
  expect(filterSources(SERVERS, details, 'rare impossible', 'all')).toEqual([])
})
test('special characters stay literal and inputs are bounded', () => {
  expect(filterSources(SERVERS, details, '.*', 'all')).toEqual([])
  expect(filterSources(SERVERS, details, '<script>', 'all')).toEqual([])
  expect(() => filterSources(SERVERS, details, 'x'.repeat(10000), 'all')).not.toThrow()
})
