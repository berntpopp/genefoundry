import { spawnSync } from 'node:child_process'
import { mkdir, cp, rm, copyFile } from 'node:fs/promises'

await mkdir('.build/artifacts', { recursive: true })
for (const [name, base] of [
  ['root', '/'],
  ['mirror', '/genefoundry/']
]) {
  const result = spawnSync(process.execPath, ['scripts/build.mjs'], {
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE_URL: base }
  })
  if (result.status !== 0) throw new Error(name + ' build failed')
  const destination = '.build/artifacts/' + name
  await rm(destination, { recursive: true, force: true })
  await cp('dist', destination, { recursive: true })
  await copyFile('.build/site-record.json', destination + '.record.json')
}
