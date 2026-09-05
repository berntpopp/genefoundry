import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...env } })
    child.once('error', reject)
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    )
  })
}
await run(process.execPath, ['scripts/build-baseline.mjs'])
for (const base of ['root', 'mirror']) await access(`.build/artifacts/${base}/index.html`)
await run('npx', ['playwright', 'test'], { TEST_PHASE: 'dev' })
await run('npx', ['playwright', 'test'], { TEST_PHASE: 'static' })
await run('docker', ['info', '--format', '{{.ServerVersion}}'])
const unique = `genefoundry-test-${randomUUID().slice(0, 8)}`
let started = false
try {
  await run('docker', ['build', '-f', 'docker/Dockerfile', '-t', unique, '.'])
  await run('docker', ['run', '--rm', '--name', unique, '-d', '-p', '127.0.0.1:4180:8080', unique])
  started = true
  let ready = false
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:4180/health')
      if (response.ok) {
        ready = true
        break
      }
    } catch {
      /* container is starting */
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  if (!ready) throw new Error('Test nginx did not become ready')
  await run('docker', ['exec', unique, 'nginx', '-t'])
  await run('npx', ['playwright', 'test'], { TEST_PHASE: 'http' })
} finally {
  if (started)
    await run('docker', ['stop', unique]).catch((error) =>
      process.stderr.write(`${error.message}\n`)
    )
  await run('docker', ['image', 'rm', unique]).catch((error) =>
    process.stderr.write(`${error.message}\n`)
  )
}
