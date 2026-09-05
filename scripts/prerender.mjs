import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'

export function pageOutputPath(outDir, pagePath) {
  if (pagePath !== '/404.html' && !/^\/(?:[a-z0-9-]+\/)*$/.test(pagePath)) {
    throw new Error('Unsafe public page path: ' + pagePath)
  }
  const root = resolve(outDir)
  const destination = resolve(
    root,
    '.' + pagePath,
    ...(pagePath === '/404.html' ? [] : ['index.html'])
  )
  if (!destination.startsWith(root + sep)) throw new Error('Output path escapes artifact')
  return destination
}

function xml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
      })[character]
  )
}

export async function prerender({ templatePath, serverEntry, outDir }) {
  const source = await import(pathToFileURL(resolve(serverEntry)).href)
  source.validatePublication()
  const template = await readFile(templatePath, 'utf8')
  for (const marker of ['<!--page-head-->', '<!--app-html-->']) {
    if (template.split(marker).length !== 2)
      throw new Error('Expected exactly one template marker ' + marker)
  }
  const pages = []
  for (const page of source.PAGES) {
    const body = await source.render(page)
    const html = template
      .replace('<!--page-head-->', () => source.pageHead(page))
      .replace('<!--app-html-->', () => body)
    const destination = pageOutputPath(outDir, page.path)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, html)
    pages.push({ ...page, hash: createHash('sha256').update(html).digest('hex') })
  }
  const canonicalOrigin = source.SITE.canonicalOrigin
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    source.PAGES.filter(
      (page) => page.indexable && page.kind !== 'not-found' && !source.SITE.isMirror
    )
      .map(
        (page) =>
          '<url><loc>' +
          xml(canonicalOrigin + page.path) +
          '</loc>' +
          (page.modifiedAt ? '<lastmod>' + xml(page.modifiedAt) + '</lastmod>' : '') +
          '</url>'
      )
      .join('\n') +
    '\n</urlset>\n'
  await writeFile(resolve(outDir, 'sitemap.xml'), sitemap)
  await writeFile(
    resolve(outDir, 'robots.txt'),
    'User-agent: *\nAllow: /\nSitemap: ' + canonicalOrigin + '/sitemap.xml\n'
  )
  await writeFile(
    resolve(outDir, 'llms.txt'),
    [
      '# GeneFoundry',
      '',
      'Biomedical data for your AI tools. One MCP connection.',
      '',
      source.SERVER_COUNT +
        ' catalog-listed biomedical MCP servers; ' +
        source.TOOL_COUNT +
        ' listed tools.',
      'Hosted endpoint: ' + source.HOSTED_ENDPOINT,
      'Browser sign-in required. Research use only. Not clinical decision support.',
      'Catalog inventory is not a measurement of live availability. Client guides state their verification status.',
      '',
      ...source.PAGES.filter((page) => page.indexable && page.kind !== 'not-found').map(
        (page) => '- [' + page.title + '](' + canonicalOrigin + page.path + '): ' + page.description
      )
    ].join('\n') + '\n'
  )
  // This validation record is kept outside the public artifact.
  await writeFile(
    resolve(outDir, '../.build/site-record.json'),
    JSON.stringify(
      {
        site: source.SITE,
        pages,
        serverCount: source.SERVER_COUNT,
        toolCount: source.TOOL_COUNT,
        clients: source.CLIENT_GUIDES.map(({ id, recipeState, recipeTest }) => ({
          id,
          recipeState,
          recipeTest
        })),
        workflows: source.WORKFLOWS.map(({ id, exampleKind, executionReviewId, review }) => ({
          id,
          exampleKind,
          executionReviewId,
          reviewedAt: review.reviewedAt
        })),
        faqs: source.FAQS
      },
      null,
      2
    )
  )
}
