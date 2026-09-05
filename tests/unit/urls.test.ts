import { expect, test } from 'vitest'
import { siteHref, assetHref, canonicalUrl, stripBase } from '../../src/lib/urls'
test('internal URLs preserve the deployment base, query and fragment', () => {
  expect(siteHref('/sources/gnomad/', '/genefoundry/')).toBe('/genefoundry/sources/gnomad/')
  expect(siteHref('/#connect', '/genefoundry/')).toBe('/genefoundry/#connect')
  expect(assetHref('/fonts/archivo.woff2', '/genefoundry/')).toBe(
    '/genefoundry/fonts/archivo.woff2'
  )
  expect(canonicalUrl('/sources/?q=hpo#results')).toBe('https://genefoundry.org/sources/')
  expect(stripBase('/genefoundry/connect/codex/', '/genefoundry/')).toBe('/connect/codex/')
  expect(stripBase('/sources/', '/genefoundry/')).toBe('')
})
test('URL helpers reject unsafe paths and bases before normalization', () => {
  for (const path of [
    '//example.org/',
    'https://evil.test/',
    '/../mcp',
    '/%2e%2e/mcp',
    '/a/../b',
    '/a\\b',
    '/a/%2f../b'
  ])
    expect(() => siteHref(path, '/')).toThrow()
  for (const base of ['foo', '//host/', '/../', '/a//b/'])
    expect(() => siteHref('/', base)).toThrow()
})
