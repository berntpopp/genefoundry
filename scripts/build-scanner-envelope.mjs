import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

// The deployment controller accepts scanner evidence only as a closed envelope
// that binds the native Trivy report to the exact image and source revision it
// was produced for. A bare native report is accepted solely for a frozen set of
// already-published releases, so every new release must carry the envelope and
// its `genefoundry-trivy-v2` wrapper summary.
const expectedImage = 'ghcr.io/berntpopp/genefoundry'
const policy = 'genefoundry-trivy-v2'
const digestPattern = /^sha256:[0-9a-f]{64}$/
const revisionPattern = /^[0-9a-f]{40}$/
const blockingSeverities = new Set(['CRITICAL', 'HIGH'])
const expectedOptions = new Set([
  '--digest',
  '--image',
  '--output',
  '--revision',
  '--scan',
  '--version'
])

function parseArguments(argv) {
  const options = {}
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index]
    const value = argv[index + 1]
    if (!name?.startsWith('--') || value === undefined || name in options) {
      throw new Error('arguments must be unique --name value pairs')
    }
    options[name] = value
  }
  return options
}

function requireMatch(value, pattern, label) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw new Error(`${label} is malformed`)
  }
}

function readJson(path, label) {
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    throw new Error(`${label} is not valid JSON`)
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${label} is not a JSON object`)
  }
  return parsed
}

function summarizeResults(scan) {
  const results = scan.Results
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('scan report has no results')
  }
  return results.map((result) => {
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
      throw new Error('scan result is not a JSON object')
    }
    if (typeof result.Target !== 'string' || !result.Target) {
      throw new Error('scan result names no target')
    }
    if (typeof result.Class !== 'string' || !result.Class) {
      throw new Error('scan result names no class')
    }
    const member = Object.hasOwn(result, 'Vulnerabilities')
    // A present-but-null member would be read as an absent list downstream;
    // refuse it here rather than publish evidence that cannot be revalidated.
    if (member && !Array.isArray(result.Vulnerabilities)) {
      throw new Error('scan result vulnerabilities are not a list')
    }
    return {
      class: result.Class,
      count: member ? result.Vulnerabilities.length : 0,
      target: result.Target,
      vulnerability_member: member
    }
  })
}

function countFixable(scan, severity) {
  let total = 0
  for (const result of scan.Results) {
    for (const vulnerability of result.Vulnerabilities ?? []) {
      if (
        vulnerability === null ||
        typeof vulnerability !== 'object' ||
        Array.isArray(vulnerability)
      ) {
        throw new Error('scan vulnerability is not a JSON object')
      }
      const fixedVersion = vulnerability.FixedVersion
      if (
        vulnerability.Severity === severity &&
        typeof fixedVersion === 'string' &&
        fixedVersion.trim()
      ) {
        total += 1
      }
    }
  }
  return total
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  const image = options['--image']
  const digest = options['--digest']
  const revision = options['--revision']
  const scanPath = options['--scan']
  const versionPath = options['--version']
  const output = options['--output']

  if (
    Object.keys(options).length !== expectedOptions.size ||
    Object.keys(options).some((option) => !expectedOptions.has(option))
  ) {
    throw new Error('unexpected or missing argument')
  }

  if (image !== expectedImage) {
    throw new Error(`image must be ${expectedImage}`)
  }
  requireMatch(digest, digestPattern, 'digest')
  requireMatch(revision, revisionPattern, 'revision')

  const scan = readJson(scanPath, 'scan report')
  const version = readJson(versionPath, 'scanner version evidence')

  if (Object.hasOwn(scan, 'schema_version') || Object.hasOwn(scan, 'scan')) {
    throw new Error('scan report is already an envelope')
  }
  if (scan.ArtifactName !== `release-gate:${revision}`) {
    throw new Error('scan report is not bound to the release gate image')
  }

  const results = summarizeResults(scan)
  const fixableCritical = countFixable(scan, 'CRITICAL')
  const fixableHigh = countFixable(scan, 'HIGH')
  if (fixableCritical !== 0 || fixableHigh !== 0) {
    throw new Error('scan report has fixable blocking vulnerabilities')
  }
  for (const result of scan.Results) {
    for (const vulnerability of result.Vulnerabilities ?? []) {
      if (!blockingSeverities.has(vulnerability.Severity)) {
        continue
      }
      if (typeof vulnerability.FixedVersion === 'string' && vulnerability.FixedVersion.trim()) {
        throw new Error('scan report has fixable blocking vulnerabilities')
      }
    }
  }

  const envelope = {
    scan,
    schema_version: 2,
    version,
    wrapper: {
      fixable_critical: fixableCritical,
      fixable_high: fixableHigh,
      image_ref: `${image}@${digest}`,
      policy,
      results,
      source_revision: revision
    }
  }

  mkdirSync(dirname(output), { recursive: true })
  const temporary = `${output}.tmp-${process.pid}`
  writeFileSync(temporary, `${JSON.stringify(envelope, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o644
  })
  renameSync(temporary, output)
}

main()
