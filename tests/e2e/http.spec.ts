import { expect, test } from '@playwright/test'

test('nginx serves documents and true missing-path responses', async ({ request }) => {
  expect((await request.get('/sources/gnomad/')).status()).toBe(200)
  const trailingSlash = await request.get('/sources/gnomad', { maxRedirects: 0 })
  expect(trailingSlash.status()).toBe(301)
  // Behind the edge proxy the container only knows its own name and port, so an
  // absolute redirect would send visitors to an unreachable http://…:8080 URL.
  expect(trailingSlash.headers()['location']).toBe('/sources/gnomad/')
  for (const path of ['/not-a-real-page/', '/assets/missing.js', '/health-nonsense']) {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
    expect(await response.text()).toContain('Page not found')
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
  }
  const health = await request.get('/health')
  expect(health.status()).toBe(200)
  expect(await health.text()).toBe('OK\n')
})

test('changing resources revalidate and fingerprinted assets are immutable', async ({
  request
}) => {
  for (const path of [
    '/',
    '/sources/gnomad/',
    '/sw.js',
    '/manifest.webmanifest',
    '/og-image.png'
  ]) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).toBe('no-cache')
    expect(response.headers()['content-security-policy']).toContain("script-src 'self'")
  }
  const html = await (await request.get('/')).text()
  const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)![1]
  expect((await request.get(asset)).headers()['cache-control']).toContain('immutable')
})

test('gzip and Brotli serve exactly the current document', async ({ request }) => {
  const plain = await request.get('/sources/gnomad/', {
    headers: { 'Accept-Encoding': 'identity' }
  })
  const gzip = await request.get('/sources/gnomad/', { headers: { 'Accept-Encoding': 'gzip' } })
  const brotli = await request.get('/sources/gnomad/', { headers: { 'Accept-Encoding': 'br' } })
  expect(gzip.headers()['content-encoding']).toBe('gzip')
  expect(brotli.headers()['content-encoding']).toBe('br')
  // Playwright decodes Content-Encoding; compare the delivered representations.
  expect(await gzip.body()).toEqual(await plain.body())
  expect(await brotli.body()).toEqual(await plain.body())
})
