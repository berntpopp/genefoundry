import { expect, test } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startStaticServer } from '../../scripts/serve-static.mjs'

test('static mirror serves nested documents and preserves real errors', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'genefoundry-static-'))
  await mkdir(join(directory, 'sources/gnomad'), { recursive: true })
  await writeFile(join(directory, 'sources/gnomad/index.html'), '<h1>gnomAD</h1>')
  await writeFile(join(directory, '404.html'), '<h1>Page not found</h1>')
  const server = await startStaticServer({ outDir: directory, basePath: '/genefoundry/', port: 0 })
  try {
    const origin = 'http://127.0.0.1:' + server.address().port
    const page = await fetch(origin + '/genefoundry/sources/gnomad/')
    expect(page.status).toBe(200)
    expect(await page.text()).toContain('gnomAD')
    expect((await fetch(origin + '/sources/gnomad/')).status).toBe(404)
    expect((await fetch(origin + '/genefoundry/missing/')).status).toBe(404)
    expect((await fetch(origin + '/genefoundry/%ZZ/')).status).toBe(400)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await rm(directory, { recursive: true, force: true })
  }
})
