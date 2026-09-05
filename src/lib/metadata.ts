import type { PageDefinition } from '../data/contracts'
import { SITE } from '../data/site'
import { FAQS } from '../data/faq'
import { canonicalUrl } from './urls'

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]!
  )
}

export function serializeSchema(value: object): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function schemaFor(page: PageDefinition): object[] {
  if (page.kind === 'not-found') return []
  const canonical = canonicalUrl(page.path)
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': canonical + '#webpage',
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': SITE.canonicalOrigin + '/#website' },
      ...(page.modifiedAt ? { dateModified: page.modifiedAt } : {})
    }
  ]
  if (page.kind === 'home') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': SITE.canonicalOrigin + '/#website',
      name: 'GeneFoundry',
      url: SITE.canonicalOrigin + '/'
    })
  } else {
    const parent =
      page.kind === 'source'
        ? { name: 'Sources', path: '/sources/' }
        : page.kind === 'client'
          ? { name: 'Client guides', path: '/connect/' }
          : page.kind === 'workflow'
            ? { name: 'Worked examples', path: '/workflows/' }
            : null
    const trail = [
      { name: 'GeneFoundry', item: SITE.canonicalOrigin + '/' },
      ...(parent ? [{ name: parent.name, item: canonicalUrl(parent.path) }] : []),
      { name: page.title, item: canonical }
    ]
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        ...entry
      }))
    })
  }
  if (page.kind === 'limitations') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer }
      }))
    })
  }
  return schemas
}

export function pageHead(page: PageDefinition): string {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const canonical = escapeHtml(canonicalUrl(page.path))
  const image = escapeHtml(SITE.canonicalOrigin + '/og-image.png')
  const indexable = page.indexable && !SITE.isMirror && page.kind !== 'not-found'
  return [
    '<title>' + title + '</title>',
    '<meta name="description" content="' + description + '">',
    '<meta name="robots" content="' + (indexable ? 'index,follow' : 'noindex,follow') + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="GeneFoundry">',
    '<meta property="og:title" content="' + title + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:image" content="' + image + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="GeneFoundry — biomedical MCP source catalog and client setup guides.">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + title + '">',
    '<meta name="twitter:description" content="' + description + '">',
    '<meta name="twitter:image" content="' + image + '">',
    ...schemaFor(page).map(
      (schema) => '<script type="application/ld+json">' + serializeSchema(schema) + '</script>'
    )
  ].join('\n')
}
