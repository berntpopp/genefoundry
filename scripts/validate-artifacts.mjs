import { readFile, readdir, access, realpath } from 'node:fs/promises'
import { resolve, relative, sep, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { brotliDecompressSync, gunzipSync } from 'node:zlib'
import { parseArgs } from 'node:util'
import { pageOutputPath } from './prerender.mjs'

function requireValue(condition, message) {
  if (!condition) throw new Error(message)
}
const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export async function listFiles(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await listFiles(path)))
    else if (entry.isFile()) result.push(path)
    else throw new Error('Symlinks and special files are not public build artifacts: ' + path)
  }
  return result
}

export async function validateEvidence(record, projectRoot = process.cwd()) {
  const ledgerPath = resolve(projectRoot, 'docs/superpowers/execution/verification-ledger.json')
  const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'))
  requireValue(Array.isArray(ledger.records), 'Verification ledger must contain records')
  requireValue(
    new Set(ledger.records.map((item) => item.id)).size === ledger.records.length,
    'Duplicate verification IDs'
  )
  const required = [
    ...record.clients
      .filter((item) => item.recipeState === 'verified')
      .map((item) => ({
        id: item.recipeTest.verificationId,
        subjectId: item.id,
        kind: 'client',
        date: item.recipeTest.testedAt
      })),
    ...record.workflows
      .filter((item) => item.exampleKind === 'verified')
      .map((item) => ({
        id: item.executionReviewId,
        subjectId: item.id,
        kind: 'workflow',
        date: item.reviewedAt
      }))
  ]
  for (const item of required) {
    const evidence = ledger.records.find((entry) => entry.id === item.id)
    requireValue(
      evidence &&
        evidence.kind === item.kind &&
        evidence.subjectId === item.subjectId &&
        evidence.reviewedAt === item.date,
      'Missing or mismatched execution verification for ' + item.subjectId
    )
    const evidenceRoot = resolve(projectRoot, 'docs/superpowers/execution/verification')
    requireValue(
      typeof evidence.evidencePath === 'string' && !evidence.evidencePath.startsWith('/'),
      'Evidence path must be repository relative'
    )
    const path = resolve(projectRoot, evidence.evidencePath)
    requireValue(
      path.startsWith(evidenceRoot + sep) && extname(path) === '.json',
      'Evidence path escapes the sanitized JSON directory'
    )
    requireValue(
      (await realpath(path)).startsWith((await realpath(evidenceRoot)) + sep),
      'Evidence symlink escapes verification directory'
    )
    const value = JSON.parse(await readFile(path, 'utf8'))
    requireValue(
      value && typeof value === 'object' && !Array.isArray(value),
      'Execution evidence must be a JSON object'
    )
    requireValue(
      value.kind === item.kind &&
        value.subjectId === item.subjectId &&
        value.executedAt === item.date,
      'Execution evidence identity does not match ledger for ' + item.subjectId
    )
  }
}

export async function validateArtifacts({
  outDir,
  basePath,
  recordPath,
  projectRoot = process.cwd()
}) {
  requireValue(['/', '/genefoundry/'].includes(basePath), 'Invalid artifact base')
  const root = resolve(outDir)
  if (!recordPath) {
    recordPath = root + '.record.json'
    try {
      await access(recordPath)
    } catch {
      recordPath = resolve(projectRoot, '.build/site-record.json')
    }
  }
  const record = JSON.parse(await readFile(recordPath, 'utf8'))
  requireValue(record.site.basePath === basePath, 'Artifact record/base mismatch')
  await validateEvidence(record, projectRoot)
  const files = await listFiles(root)
  const expected = new Set(record.pages.map((page) => pageOutputPath(root, page.path)))
  const actual = files.filter((path) => path.endsWith('.html'))
  requireValue(
    actual.length === expected.size && actual.every((path) => expected.has(path)),
    'HTML files and page registry differ'
  )
  const contents = new Map()
  const titles = new Set()
  const descriptions = new Set()
  const sw = await readFile(resolve(root, 'sw.js'), 'utf8')
  for (const page of record.pages) {
    const path = pageOutputPath(root, page.path)
    const html = await readFile(path, 'utf8')
    contents.set(path, html)
    requireValue(
      createHash('sha256').update(html).digest('hex') === page.hash,
      'HTML changed after prerender: ' + page.path
    )
    requireValue((html.match(/<h1(?:\s|>)/g) || []).length === 1, 'Expected one H1: ' + page.path)
    requireValue(
      (html.match(/<title>/g) || []).length === 1 &&
        html.includes('<title>' + escapeHtml(page.title) + '</title>'),
      'Wrong title: ' + page.path
    )
    requireValue(
      (html.match(/name="description"/g) || []).length === 1,
      'Expected one description: ' + page.path
    )
    requireValue(
      !titles.has(page.title) && !descriptions.has(page.description),
      'Duplicate title/description: ' + page.path
    )
    titles.add(page.title)
    descriptions.add(page.description)
    requireValue(
      html.includes('href="' + record.site.canonicalOrigin + page.path + '"'),
      'Missing canonical: ' + page.path
    )
    const indexable = page.indexable && !record.site.isMirror && page.kind !== 'not-found'
    requireValue(
      html.includes(
        'name="robots" content="' + (indexable ? 'index,follow' : 'noindex,follow') + '"'
      ),
      'Wrong indexing directive: ' + page.path
    )
    requireValue(
      !/data-development-fixture|GENEFOUNDRY_DEVELOPMENT_FIXTURE|<!--app-html-->|<!--page-head-->/.test(
        html
      ),
      'Unfinished publication content: ' + page.path
    )
    for (const match of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )) {
      const schema = JSON.parse(match[1])
      if (schema['@type'] === 'FAQPage') {
        requireValue(schema.mainEntity.length === record.faqs.length, 'FAQ schema count differs')
        for (const item of schema.mainEntity) {
          requireValue(
            record.faqs.some(
              (faq) => faq.question === item.name && faq.answer === item.acceptedAnswer.text
            ),
            'FAQ schema does not match data'
          )
          const body = html.slice(html.indexOf('<body>'))
          requireValue(
            body.includes(escapeHtml(item.name)) &&
              body.includes(escapeHtml(item.acceptedAnswer.text)),
            'FAQ is absent from readable HTML'
          )
        }
      }
    }
    if (page.kind !== 'not-found') {
      requireValue(
        sw.includes(createHash('md5').update(html).digest('hex')),
        'Service worker has stale/missing HTML revision: ' + page.path
      )
    }
  }
  requireValue(
    !sw.includes('404.html'),
    'Service worker must not precache or fall back to the error document'
  )
  for (const [file, html] of contents) {
    for (const match of html.matchAll(/\b(?:href|src|action)="([^"]*)"/g)) {
      const attribute = decode(match[1])
      if (!attribute || /^(?:https?:|mailto:|tel:|data:)/.test(attribute)) continue
      requireValue(!attribute.startsWith('//'), 'Protocol-relative local asset/link')
      const relativeDocument = relative(root, file).split(sep).join('/')
      const documentUrl = new URL(basePath + relativeDocument, 'https://artifact.invalid')
      const url = new URL(attribute, documentUrl)
      requireValue(url.pathname.startsWith(basePath), 'Link escapes deployment base: ' + attribute)
      let localPath = decodeURIComponent(url.pathname.slice(basePath.length))
      if (!localPath || localPath.endsWith('/')) localPath += 'index.html'
      const destination = resolve(root, localPath)
      requireValue(destination.startsWith(root + sep), 'Local link escapes output')
      await access(destination).catch(() => {
        throw new Error('Broken local link in ' + file + ': ' + attribute)
      })
      if (url.hash && destination.endsWith('.html')) {
        const target = contents.get(destination) || (await readFile(destination, 'utf8'))
        requireValue(
          target.includes('id="' + escapeHtml(decodeURIComponent(url.hash.slice(1))) + '"'),
          'Broken fragment: ' + attribute
        )
      }
    }
  }
  for (const path of files) {
    if (path.endsWith('.gz') || path.endsWith('.br')) {
      const original = await readFile(path.slice(0, -3))
      const compressed = await readFile(path)
      const decoded = path.endsWith('.gz')
        ? gunzipSync(compressed)
        : brotliDecompressSync(compressed)
      requireValue(original.equals(decoded), 'Stale compression: ' + path)
    } else if (/\.(html|js|json|txt|xml)$/.test(path)) {
      const text = await readFile(path, 'utf8')
      requireValue(
        !text.includes('docs/superpowers/execution/') && !text.includes('/home/bernt-popp/'),
        'Private evidence path in public artifact: ' + path
      )
    }
  }
  const manifest = JSON.parse(await readFile(resolve(root, 'manifest.webmanifest'), 'utf8'))
  requireValue(
    manifest.scope === basePath && manifest.start_url === basePath,
    'Manifest base mismatch'
  )
  requireValue(
    manifest.description.includes(String(record.serverCount)) &&
      manifest.description.includes(String(record.toolCount)),
    'Manifest inventory is stale'
  )
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8')
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]))
  const wanted = record.pages
    .filter((page) => page.indexable && !record.site.isMirror && page.kind !== 'not-found')
    .map((page) => record.site.canonicalOrigin + page.path)
  requireValue(
    JSON.stringify(locations) === JSON.stringify(wanted),
    'Sitemap does not match the page registry'
  )
  console.log('Validated ' + record.pages.length + ' static documents at base ' + basePath)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { dir: { type: 'string', default: 'dist' }, base: { type: 'string', default: '/' } }
  })
  await validateArtifacts({ outDir: values.dir, basePath: values.base })
}
