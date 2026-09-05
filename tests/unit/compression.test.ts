import { expect, test } from 'vitest'
import { mkdtemp, readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { brotliDecompressSync, gunzipSync } from 'node:zlib'
import { compressDirectory } from '../../scripts/compress.mjs'

test('both compressed representations contain final bytes and do not recurse', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'genefoundry-compression-'))
  try {
    const html = '<h1>Complete source content &amp; evidence</h1>'.repeat(60)
    await writeFile(join(directory, 'index.html'), html)
    await writeFile(join(directory, 'image.png'), 'already compressed image')
    await compressDirectory(directory)
    await compressDirectory(directory)
    const original = await readFile(join(directory, 'index.html'))
    expect(gunzipSync(await readFile(join(directory, 'index.html.gz')))).toEqual(original)
    expect(brotliDecompressSync(await readFile(join(directory, 'index.html.br')))).toEqual(original)
    expect((await readdir(directory)).sort()).toEqual([
      'image.png',
      'index.html',
      'index.html.br',
      'index.html.gz'
    ])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
