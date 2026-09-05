import { expect, test } from 'vitest'
import { validateContent } from '../../src/lib/validation'
import { SERVERS } from '../../src/data/servers'
import { SOURCE_DETAILS } from '../../src/data/source-details'
import { CLIENT_GUIDES } from '../../src/data/clients'
import { WORKFLOWS } from '../../src/data/workflows'
import { PAGES, getPage } from '../../src/data/pages'
const input = () =>
  structuredClone({
    servers: SERVERS,
    details: SOURCE_DETAILS,
    clients: CLIENT_GUIDES,
    workflows: WORKFLOWS,
    pages: PAGES
  })
test('published data joins one detail per source, all clients and workflows, and unique routes', () => {
  expect(() => validateContent(input(), { publication: true })).not.toThrow()
  expect(PAGES.filter((p) => p.indexable)).toHaveLength(
    SERVERS.length + CLIENT_GUIDES.length + WORKFLOWS.length + 7
  )
  expect(getPage('/unknown/')).toBeUndefined()
})
test('publication rejects missing detail, duplicate route and unsupported verification claims', () => {
  const missing = input()
  missing.details.pop()
  expect(() => validateContent(missing, { publication: true })).toThrow()
  const duplicate = input()
  duplicate.pages.push(duplicate.pages[0]!)
  expect(() => validateContent(duplicate, { publication: true })).toThrow()
  const forged = input()
  Object.assign(forged.clients[0]!, { recipeState: 'verified', code: 'sample', recipeTest: null })
  expect(() => validateContent(forged, { publication: true })).toThrow()
  const invalidDate = input()
  invalidDate.details[0]!.review.reviewedAt = '2026-02-30'
  expect(() => validateContent(invalidDate, { publication: true })).toThrow()
})

const validResult = WORKFLOWS[0]!.result!
test.each([
  undefined,
  {},
  { ...validResult, summary: '' },
  { ...validResult, client: '' },
  { ...validResult, executedAt: '2026-02-30' },
  { ...validResult, sources: [] },
  { ...validResult, notes: [undefined] },
  { ...validResult, tables: [] },
  { ...validResult, tables: [{ caption: 'Evidence', columns: ['Value'], rows: [['a', 'b']] }] },
  { ...validResult, tables: [{ caption: 'Evidence', columns: ['Value'], rows: [[undefined]] }] }
])('publication rejects malformed verified result %#', (result) => {
  const malformed = input()
  Object.assign(malformed.workflows[0]!, { result })
  expect(() => validateContent(malformed, { publication: true })).toThrow()
})
