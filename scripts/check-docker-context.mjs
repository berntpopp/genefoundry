// Isolated synthetic fixture proves Docker retains private evidence for validation only.
import { mkdtemp, mkdir, cp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
const directory = await mkdtemp(join(tmpdir(), 'genefoundry-context-'))
const image = 'genefoundry-context-' + randomUUID().slice(0, 8)
let built = false
try {
  await mkdir(join(directory, 'scripts'), { recursive: true })
  await mkdir(join(directory, 'docs/superpowers/execution/verification'), { recursive: true })
  for (const file of ['.dockerignore', 'scripts/validate-artifacts.mjs', 'scripts/prerender.mjs'])
    await cp(file, join(directory, file))
  await writeFile(join(directory, 'docs/should-not-enter.txt'), 'Non-build documentation')
  await writeFile(
    join(directory, 'docs/superpowers/execution/verification/synthetic.json'),
    JSON.stringify({ testFixture: true })
  )
  await writeFile(
    join(directory, 'docs/superpowers/execution/verification-ledger.json'),
    JSON.stringify({
      records: [
        {
          id: 'synthetic-review',
          kind: 'client',
          subjectId: 'codex',
          reviewedAt: '2026-09-05',
          evidencePath: 'docs/superpowers/execution/verification/synthetic.json'
        }
      ]
    })
  )
  await writeFile(
    join(directory, 'verify.mjs'),
    `import { validateEvidence } from './scripts/validate-artifacts.mjs';
import { access } from 'node:fs/promises';
await validateEvidence({clients:[{id:'codex',recipeState:'verified',recipeTest:{verificationId:'synthetic-review',testedAt:'2026-09-05'}}],workflows:[]});
let leaked=false; try { await access('docs/should-not-enter.txt'); leaked=true } catch {}
if(leaked) throw new Error('Unrelated documentation entered context');`
  )
  await writeFile(
    join(directory, 'Dockerfile'),
    'FROM node:24-alpine\nWORKDIR /fixture\nCOPY . .\nRUN node verify.mjs\n'
  )
  const result = spawnSync('docker', ['build', '-t', image, directory], { stdio: 'inherit' })
  if (result.status !== 0) throw new Error('Docker evidence context fixture failed')
  built = true
} finally {
  if (built) spawnSync('docker', ['image', 'rm', image], { stdio: 'inherit' })
  await rm(directory, { recursive: true, force: true })
}
