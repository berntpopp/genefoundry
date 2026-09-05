import { expect, test } from 'vitest'
import { pageOutputPath } from '../../scripts/prerender.mjs'

test('only finite safe route shapes can be mapped into the output directory', () => {
  expect(pageOutputPath('/tmp/site-output', '/sources/gnomad/')).toBe(
    '/tmp/site-output/sources/gnomad/index.html'
  )
  expect(pageOutputPath('/tmp/site-output', '/404.html')).toBe('/tmp/site-output/404.html')
  expect(() => pageOutputPath('/tmp/site-output', '/../private/')).toThrow()
  expect(() => pageOutputPath('/tmp/site-output', '/%2e%2e/private/')).toThrow()
  expect(() => pageOutputPath('/tmp/site-output', '//outside/')).toThrow()
})
