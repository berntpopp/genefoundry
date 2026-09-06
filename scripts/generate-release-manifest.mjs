import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const expectedImage = 'ghcr.io/berntpopp/genefoundry'
const digestPattern = /^sha256:[0-9a-f]{64}$/
const evidenceSha256Pattern = /^[0-9a-f]{64}$/
const revisionPattern = /^[0-9a-f]{40}$/
const tagPattern = /^v(\d+)\.(\d+)\.(\d+)$/
const expectedOptions = new Set([
  '--database-updated-at',
  '--digest',
  '--image',
  '--output',
  '--revision',
  '--sbom-sha256',
  '--scanner-evidence-sha256',
  '--scanner-version',
  '--scanner-version-evidence-sha256',
  '--tag'
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

function main() {
  const options = parseArguments(process.argv.slice(2))
  const image = options['--image']
  const digest = options['--digest']
  const revision = options['--revision']
  const tag = options['--tag']
  const output = options['--output']
  const scannerVersion = options['--scanner-version']
  const databaseUpdatedAt = options['--database-updated-at']
  const scannerEvidenceSha256 = options['--scanner-evidence-sha256']
  const sbomSha256 = options['--sbom-sha256']
  const scannerVersionEvidenceSha256 = options['--scanner-version-evidence-sha256']

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
  requireMatch(tag, tagPattern, 'tag')
  requireMatch(scannerEvidenceSha256, evidenceSha256Pattern, 'scanner evidence SHA-256')
  requireMatch(sbomSha256, evidenceSha256Pattern, 'SBOM SHA-256')
  requireMatch(
    scannerVersionEvidenceSha256,
    evidenceSha256Pattern,
    'scanner version evidence SHA-256'
  )
  if (scannerVersion !== '0.70.0') {
    throw new Error('scanner version must be 0.70.0')
  }
  if (typeof databaseUpdatedAt !== 'string' || Number.isNaN(Date.parse(databaseUpdatedAt))) {
    throw new Error('database update timestamp is malformed')
  }
  if (!output) {
    throw new Error('output is required')
  }

  // The deployment controller recomputes the manifest's canonical digest from
  // its parsed model, so every schema field has to be explicit: a static site
  // has no MCP surface (`mcp: null`) and no data requirements
  // (`schema_compatibility: []`), stated the way the fleet's manifests state them.
  const manifest = {
    data_requirements: { mode: 'none', schema_compatibility: [] },
    image: {
      digest,
      name: image,
      platforms: [{ digest, platform: 'linux/amd64' }]
    },
    mcp: null,
    repository: 'berntpopp/genefoundry',
    release_assets: {
      'image-manifest.json': digest,
      'sbom.spdx.json': `sha256:${sbomSha256}`,
      'trivy-version.json': `sha256:${scannerVersionEvidenceSha256}`,
      'trivy.json': `sha256:${scannerEvidenceSha256}`
    },
    schema_version: 1,
    security_evidence: {
      database_updated_at: databaseUpdatedAt,
      sbom_sha256: sbomSha256,
      scanner: 'trivy',
      scanner_evidence_sha256: scannerEvidenceSha256,
      scanner_version: scannerVersion
    },
    source: { revision, tag },
    version: tag.slice(1),
    workflow: {
      caller: 'berntpopp/genefoundry/.github/workflows/container-release.yml'
    }
  }

  mkdirSync(dirname(output), { recursive: true })
  const temporary = `${output}.tmp-${process.pid}`
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o644
  })
  renameSync(temporary, output)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
