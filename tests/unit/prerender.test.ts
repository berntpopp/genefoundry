import { expect, test } from 'vitest'
import { pageOutputPath, inlineStylesheets } from '../../scripts/prerender.mjs'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('prerendered root and mirror pages contain CSS without a blocking request', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'genefoundry-styles-'))
  try {
    await mkdir(join(directory, 'assets'))
    const css = 'body{color:#222}h1{font-family:Archivo}'
    await writeFile(join(directory, 'assets/style-hash.css'), css)
    for (const base of ['/', '/genefoundry/']) {
      const html = `<head><link rel="stylesheet" crossorigin href="${base}assets/style-hash.css"></head>`
      expect(await inlineStylesheets(html, directory, base)).toBe(
        `<head><style>${css}</style></head>`
      )
      await expect(
        inlineStylesheets(html.replace('assets/style-hash.css', '../outside.css'), directory, base)
      ).rejects.toThrow('Unsafe stylesheet')
    }
    await writeFile(join(directory, 'assets/style-hash.css'), '</style><script>bad()</script>')
    await expect(
      inlineStylesheets(
        '<link rel="stylesheet" crossorigin href="/assets/style-hash.css">',
        directory,
        '/'
      )
    ).rejects.toThrow('Unsafe stylesheet content')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('only finite safe route shapes can be mapped into the output directory', () => {
  expect(pageOutputPath('/tmp/site-output', '/sources/gnomad/')).toBe(
    '/tmp/site-output/sources/gnomad/index.html'
  )
  expect(pageOutputPath('/tmp/site-output', '/404.html')).toBe('/tmp/site-output/404.html')
  expect(() => pageOutputPath('/tmp/site-output', '/../private/')).toThrow()
  expect(() => pageOutputPath('/tmp/site-output', '/%2e%2e/private/')).toThrow()
  expect(() => pageOutputPath('/tmp/site-output', '//outside/')).toThrow()
})
