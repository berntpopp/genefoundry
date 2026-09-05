import { expect, test } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validateEvidence } from '../../scripts/validate-artifacts.mjs'

test('verified state needs real matching evidence and cannot escape its directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'genefoundry-evidence-'))
  const directory = join(root, 'docs/superpowers/execution')
  await mkdir(join(directory, 'verification'), { recursive: true })
  const record = {
    clients: [
      {
        id: 'codex',
        recipeState: 'verified',
        recipeTest: { verificationId: 'test-id', testedAt: '2026-09-05' }
      }
    ],
    workflows: []
  }
  const entry = {
    id: 'test-id',
    kind: 'client',
    subjectId: 'codex',
    reviewedAt: '2026-09-05',
    evidencePath: 'docs/superpowers/execution/verification/test.json'
  }
  const ledger = join(directory, 'verification-ledger.json')
  try {
    await writeFile(ledger, JSON.stringify({ records: [] }))
    await expect(validateEvidence(record, root)).rejects.toThrow('Missing or mismatched')
    await writeFile(ledger, JSON.stringify({ records: [entry] }))
    await expect(validateEvidence(record, root)).rejects.toThrow()
    await writeFile(
      join(directory, 'verification/test.json'),
      JSON.stringify({ fixture: 'Synthetic test evidence only' })
    )
    await expect(validateEvidence(record, root)).resolves.toBeUndefined()
    await writeFile(
      ledger,
      JSON.stringify({ records: [{ ...entry, evidencePath: '../private.json' }] })
    )
    await expect(validateEvidence(record, root)).rejects.toThrow('escapes')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
