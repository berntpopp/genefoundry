// Reproduce the recorded pre-modernization worker in an isolated temporary checkout.
import { spawnSync } from 'node:child_process'
import { access, mkdtemp, cp, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
const baseline = '53d6ce27f1c60c2fb0422b2f05f9752e3dce8b77'
let present = true
try {
  await access('.build/baseline/sw.js')
} catch {
  present = false
}
if (!present) {
  const temporary = await mkdtemp(join(tmpdir(), 'genefoundry-baseline-'))
  function run(command, args, cwd = process.cwd()) {
    const child = spawnSync(command, args, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, VITE_BASE_URL: '/genefoundry/' }
    })
    if (child.status !== 0) throw new Error('Baseline command failed: ' + command)
  }
  try {
    const archive = join(temporary, 'baseline.tar')
    run('git', ['archive', '--format=tar', '--output', archive, baseline])
    run('tar', ['-xf', archive, '-C', temporary])
    run('npm', ['ci'], temporary)
    run('npm', ['run', 'build'], temporary)
    await mkdir('.build', { recursive: true })
    await cp(join(temporary, 'dist'), resolve('.build/baseline'), { recursive: true })
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
