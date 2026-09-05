import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { parseArgs } from 'node:util'
import { chromium } from '@playwright/test'

const { values } = parseArgs({
  options: {
    url: { type: 'string', default: 'http://127.0.0.1:4182/' },
    output: { type: 'string', default: '.build/lighthouse' },
    record: { type: 'string', default: '.build/artifacts/root.record.json' }
  }
})
const record = JSON.parse(await readFile(values.record, 'utf8'))
const pages = record.pages.filter((page) => page.indexable)
await mkdir(values.output, { recursive: true })
const summary = []
for (const page of pages) {
  const output = `${values.output}/${page.path.replaceAll('/', '_') || 'home'}.json`
  const args = [
    '--yes',
    'lighthouse@13.4.0',
    new URL(page.path.replace(/^\//, ''), values.url).href,
    '--chrome-flags=--headless --no-sandbox',
    '--output=json',
    `--output-path=${output}`,
    '--quiet'
  ]
  await new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      stdio: 'inherit',
      env: { ...process.env, CHROME_PATH: chromium.executablePath() }
    })
    child.once('error', reject)
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse failed for ${page.path}: ${code}`))
    )
  })
  const report = JSON.parse(await readFile(output, 'utf8'))
  if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError))
  const row = {
    path: page.path,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)])
    ),
    lcpMs: report.audits['largest-contentful-paint'].numericValue,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    tbtMs: report.audits['total-blocking-time'].numericValue,
    failures: [
      ...new Set(
        Object.values(report.categories).flatMap((category) =>
          category.auditRefs
            .filter((ref) => ref.weight > 0 && report.audits[ref.id].score === 0)
            .map((ref) => ref.id)
        )
      )
    ]
  }
  summary.push(row)
  await writeFile(`${values.output}/summary.json`, JSON.stringify(summary, null, 2) + '\n')
  process.stdout.write(JSON.stringify(row) + '\n')
}
process.stdout.write(
  `Audited all ${summary.length} indexable routes. Error pages are checked by the HTTP suite.\n`
)
