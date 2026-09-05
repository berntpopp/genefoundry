import { expect, test } from 'vitest'
import { pageHead, serializeSchema, schemaFor } from '../../src/lib/metadata'
import type { PageDefinition } from '../../src/data/contracts'

test('metadata safely escapes authored content without changing the canonical', () => {
  const page: PageDefinition = {
    kind: 'about',
    path: '/about/',
    title: 'A "quoted" <title>',
    description: '</script><img src=x onerror=alert(1)>',
    indexable: true
  }
  const head = pageHead(page)
  expect(head).not.toContain('<img src=x')
  expect(head).toContain('https://genefoundry.org/about/')
  expect(head).toContain('&lt;title&gt;')
  expect(head.match(/<title>/g)).toHaveLength(1)
  expect(serializeSchema({ value: '</script><script>alert(1)</script>' })).not.toContain('<')
  expect(JSON.parse(serializeSchema({ value: '</script>' })).value).toBe('</script>')
})

test('not-found metadata never invites indexing', () => {
  expect(
    pageHead({
      kind: 'not-found',
      path: '/404.html',
      title: 'Page not found',
      description: 'Find a source or return home.',
      indexable: false
    })
  ).toContain('noindex,follow')
})

test('FAQ schema appears only where the visible FAQ is rendered', () => {
  const common = { title: 'Example', description: 'Example page', indexable: true }
  expect(
    schemaFor({ ...common, kind: 'home', path: '/' }).some(
      (schema) => '@type' in schema && schema['@type'] === 'FAQPage'
    )
  ).toBe(false)
  expect(
    schemaFor({ ...common, kind: 'limitations', path: '/limitations/' }).some(
      (schema) => '@type' in schema && schema['@type'] === 'FAQPage'
    )
  ).toBe(true)
})

test('source breadcrumbs reflect the public source directory hierarchy', () => {
  const page = {
    kind: 'source' as const,
    namespace: 'gnomad',
    path: '/sources/gnomad/',
    title: 'gnomAD | GeneFoundry',
    description: 'gnomAD population data.',
    indexable: true
  }
  const breadcrumb = schemaFor(page).find(
    (schema) => '@type' in schema && schema['@type'] === 'BreadcrumbList'
  )
  expect(breadcrumb).toMatchObject({
    itemListElement: [
      { position: 1, name: 'GeneFoundry', item: 'https://genefoundry.org/' },
      { position: 2, name: 'Sources', item: 'https://genefoundry.org/sources/' },
      { position: 3, name: page.title, item: 'https://genefoundry.org/sources/gnomad/' }
    ]
  })
})

test('production content is indexable while error documents stay excluded', () => {
  expect(
    pageHead({
      kind: 'home',
      path: '/',
      title: 'GeneFoundry',
      description: 'Biomedical sources.',
      indexable: true
    })
  ).toContain('name="robots" content="index,follow"')
  expect(
    pageHead({
      kind: 'not-found',
      path: '/404.html',
      title: 'Missing',
      description: 'Page not found.',
      indexable: false
    })
  ).toContain('name="robots" content="noindex,follow"')
})
