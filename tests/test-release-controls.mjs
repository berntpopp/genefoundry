import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { test } from 'node:test'

import viteConfig from '../vite.config.js'

const DIGEST = `sha256:${'a'.repeat(64)}`
const REVISION = 'b'.repeat(40)
const SCAN_SHA256 = 'c'.repeat(64)
const VERSION_SHA256 = 'd'.repeat(64)
const SBOM_SHA256 = 'e'.repeat(64)

function writeReleaseAdmissionFixtures(workdir, revision, overrides = {}) {
  const finalHead = 'e'.repeat(40)
  const pullRequests = overrides.pullRequests ?? [
    {
      baseRefName: 'main',
      headRefOid: finalHead,
      mergeCommit: { oid: revision },
      mergedAt: '2026-08-10T08:00:00Z',
      number: 80,
      reviewDecision: 'APPROVED',
      reviews: {
        nodes: [
          {
            author: { login: 'reviewer' },
            commit: { oid: finalHead },
            state: 'APPROVED',
            submittedAt: '2026-08-10T07:59:00Z'
          }
        ],
        pageInfo: { hasPreviousPage: false }
      },
      state: 'MERGED'
    }
  ]
  const successfulRun = {
    conclusion: 'success',
    createdAt: '2026-08-10T08:01:00Z',
    databaseId: 1,
    event: 'push',
    headSha: revision,
    status: 'completed'
  }
  const paths = {
    pullRequests: join(workdir, 'pull-requests.json'),
    ciRuns: join(workdir, 'ci-runs.json'),
    securityRuns: join(workdir, 'security-runs.json')
  }
  writeFileSync(paths.pullRequests, JSON.stringify(pullRequests))
  writeFileSync(paths.ciRuns, JSON.stringify(overrides.ciRuns ?? [successfulRun]))
  writeFileSync(paths.securityRuns, JSON.stringify(overrides.securityRuns ?? [successfulRun]))
  return paths
}

function validateReleaseSource(revision, paths) {
  return spawnSync(
    process.execPath,
    [
      'scripts/validate-release-source.mjs',
      '--revision',
      revision,
      '--tag',
      'v0.1.0',
      '--main-ref',
      'refs/remotes/origin/main',
      '--associated-prs',
      paths.pullRequests,
      '--ci-runs',
      paths.ciRuns,
      '--security-runs',
      paths.securityRuns
    ],
    { encoding: 'utf8' }
  )
}

function ensureOriginMainRef() {
  const result = spawnSync('git', ['rev-parse', '--verify', 'refs/remotes/origin/main'], {
    encoding: 'utf8'
  })
  if (result.status === 0) return result.stdout.trim()

  const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  execFileSync('git', ['update-ref', 'refs/remotes/origin/main', head])
  return head
}

test('Vite exposes a Vite 8-compatible manual chunk function', () => {
  const config = viteConfig({ command: 'build', mode: 'production', isSsrBuild: false })
  const manualChunks = config.build.rollupOptions.output.manualChunks

  assert.equal(typeof manualChunks, 'function')
  assert.equal(
    manualChunks('/workspace/node_modules/vue/dist/vue.runtime.esm-bundler.js'),
    'vue-vendor'
  )
  assert.equal(
    manualChunks('/workspace/node_modules/@vue/runtime-core/dist/runtime-core.js'),
    'vue-vendor'
  )
  assert.equal(manualChunks('/workspace/node_modules/lucide-vue-next/dist/index.js'), undefined)
  assert.equal(manualChunks('/workspace/src/main.js'), undefined)
})

test('release manifest generator binds the image to source and version', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-release-manifest-'))
  const output = join(workdir, 'application-release-manifest.json')

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/generate-release-manifest.mjs',
        '--image',
        'ghcr.io/berntpopp/genefoundry',
        '--digest',
        DIGEST,
        '--revision',
        REVISION,
        '--tag',
        'v0.1.0',
        '--scanner-version',
        '0.70.0',
        '--database-updated-at',
        '2026-08-10T06:54:30.951906211Z',
        '--scanner-evidence-sha256',
        SCAN_SHA256,
        '--scanner-version-evidence-sha256',
        VERSION_SHA256,
        '--sbom-sha256',
        SBOM_SHA256,
        '--output',
        output
      ],
      { encoding: 'utf8' }
    )

    assert.equal(result.status, 0, result.stderr)
    const manifest = JSON.parse(readFileSync(output, 'utf8'))
    assert.deepEqual(manifest, {
      data_requirements: { mode: 'none', schema_compatibility: [] },
      image: {
        digest: DIGEST,
        name: 'ghcr.io/berntpopp/genefoundry',
        platforms: [{ digest: DIGEST, platform: 'linux/amd64' }]
      },
      mcp: null,
      repository: 'berntpopp/genefoundry',
      release_assets: {
        'image-manifest.json': DIGEST,
        'sbom.spdx.json': `sha256:${SBOM_SHA256}`,
        'trivy-version.json': `sha256:${VERSION_SHA256}`,
        'trivy.json': `sha256:${SCAN_SHA256}`
      },
      schema_version: 1,
      security_evidence: {
        database_updated_at: '2026-08-10T06:54:30.951906211Z',
        sbom_sha256: SBOM_SHA256,
        scanner: 'trivy',
        scanner_evidence_sha256: SCAN_SHA256,
        scanner_version: '0.70.0'
      },
      source: { revision: REVISION, tag: 'v0.1.0' },
      version: '0.1.0',
      workflow: {
        caller: 'berntpopp/genefoundry/.github/workflows/container-release.yml'
      }
    })
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('release manifest generator rejects a missing SBOM SHA-256', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/generate-release-manifest.mjs',
      '--image',
      'ghcr.io/berntpopp/genefoundry',
      '--digest',
      DIGEST,
      '--revision',
      REVISION,
      '--tag',
      'v0.1.0',
      '--scanner-version',
      '0.70.0',
      '--database-updated-at',
      '2026-08-10T06:54:30.951906211Z',
      '--scanner-evidence-sha256',
      SCAN_SHA256,
      '--scanner-version-evidence-sha256',
      VERSION_SHA256,
      '--output',
      '/tmp/application-release-manifest.json'
    ],
    { encoding: 'utf8' }
  )

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /unexpected or missing argument/)
})

test('release manifest generator rejects a malformed SBOM SHA-256', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/generate-release-manifest.mjs',
      '--image',
      'ghcr.io/berntpopp/genefoundry',
      '--digest',
      DIGEST,
      '--revision',
      REVISION,
      '--tag',
      'v0.1.0',
      '--scanner-version',
      '0.70.0',
      '--database-updated-at',
      '2026-08-10T06:54:30.951906211Z',
      '--scanner-evidence-sha256',
      SCAN_SHA256,
      '--scanner-version-evidence-sha256',
      VERSION_SHA256,
      '--sbom-sha256',
      'not-a-sha256',
      '--output',
      '/tmp/application-release-manifest.json'
    ],
    { encoding: 'utf8' }
  )

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /SBOM SHA-256 is malformed/)
})

test('release manifest generator rejects mutable or malformed coordinates', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/generate-release-manifest.mjs',
      '--image',
      'ghcr.io/berntpopp/genefoundry:latest',
      '--digest',
      'latest',
      '--revision',
      'main',
      '--tag',
      'latest',
      '--output',
      '/tmp/application-release-manifest.json'
    ],
    { encoding: 'utf8' }
  )

  assert.notEqual(result.status, 0)
})

test('release source accepts the exact current main merge with green gates without a review gate', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-release-source-'))
  const revision = ensureOriginMainRef()

  try {
    const paths = writeReleaseAdmissionFixtures(workdir, revision, {
      pullRequests: [
        {
          baseRefName: 'main',
          headRefOid: 'e'.repeat(40),
          mergeCommit: { oid: revision },
          mergedAt: '2026-08-10T08:00:00Z',
          number: 80,
          reviewDecision: null,
          reviews: { nodes: [], pageInfo: { hasPreviousPage: false } },
          state: 'MERGED'
        }
      ]
    })
    const result = validateReleaseSource(revision, paths)
    assert.equal(result.status, 0, result.stderr)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('release source rejects a non-current main revision', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-release-source-'))
  ensureOriginMainRef()
  const revision = 'f'.repeat(40)

  try {
    const paths = writeReleaseAdmissionFixtures(workdir, revision)
    const result = validateReleaseSource(revision, paths)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /revision is not exact current origin\/main/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('release source rejects a failed latest gate', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-release-source-'))
  const revision = ensureOriginMainRef()

  try {
    const failedSecurity = writeReleaseAdmissionFixtures(workdir, revision, {
      securityRuns: [
        {
          conclusion: 'failure',
          createdAt: '2026-08-10T08:02:00Z',
          databaseId: 2,
          event: 'push',
          headSha: revision,
          status: 'completed'
        }
      ]
    })
    const failedResult = validateReleaseSource(revision, failedSecurity)
    assert.notEqual(failedResult.status, 0)
    assert.match(failedResult.stderr, /Security gate is not successful/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

function nativeScanReport(revision, overrides = {}) {
  return {
    ArtifactID: `sha256:${'7'.repeat(64)}`,
    ArtifactName: `release-gate:${revision}`,
    ArtifactType: 'container_image',
    CreatedAt: '2026-09-06T07:26:09.045133Z',
    Metadata: {
      ImageID: `sha256:${'c'.repeat(64)}`,
      RepoTags: [`release-gate:${revision}`]
    },
    Results: [{ Class: 'os-pkgs', Target: 'release-gate (alpine 3.24.1)', Type: 'alpine' }],
    SchemaVersion: 2,
    ...overrides
  }
}

const SCANNER_VERSION_EVIDENCE = {
  Version: '0.70.0',
  VulnerabilityDB: {
    DownloadedAt: '2026-09-06T06:33:38.32418156Z',
    NextUpdate: '2026-09-07T01:00:31.976900338Z',
    UpdatedAt: '2026-09-06T01:00:31.976900695Z',
    Version: 2
  }
}

function buildScannerEnvelope(workdir, scan, extraArguments = []) {
  const scanPath = join(workdir, 'trivy.json')
  const versionPath = join(workdir, 'trivy-version.json')
  writeFileSync(scanPath, JSON.stringify(scan))
  writeFileSync(versionPath, JSON.stringify(SCANNER_VERSION_EVIDENCE))
  const result = spawnSync(
    process.execPath,
    [
      'scripts/build-scanner-envelope.mjs',
      '--scan',
      scanPath,
      '--version',
      versionPath,
      '--image',
      'ghcr.io/berntpopp/genefoundry',
      '--digest',
      DIGEST,
      '--revision',
      REVISION,
      '--output',
      scanPath,
      ...extraArguments
    ],
    { encoding: 'utf8' }
  )
  return { result, scanPath }
}

test('scanner envelope closes the native report over the exact image and revision', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const { result, scanPath } = buildScannerEnvelope(workdir, nativeScanReport(REVISION))

    assert.equal(result.status, 0, result.stderr)
    const envelope = JSON.parse(readFileSync(scanPath, 'utf8'))
    assert.deepEqual(Object.keys(envelope).sort(), ['scan', 'schema_version', 'version', 'wrapper'])
    assert.equal(envelope.schema_version, 2)
    assert.deepEqual(envelope.scan, nativeScanReport(REVISION))
    assert.deepEqual(envelope.version, SCANNER_VERSION_EVIDENCE)
    assert.deepEqual(envelope.wrapper, {
      fixable_critical: 0,
      fixable_high: 0,
      image_ref: `ghcr.io/berntpopp/genefoundry@${DIGEST}`,
      policy: 'genefoundry-trivy-v2',
      results: [
        {
          class: 'os-pkgs',
          count: 0,
          target: 'release-gate (alpine 3.24.1)',
          vulnerability_member: false
        }
      ],
      source_revision: REVISION
    })
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('scanner envelope records a present vulnerability member and its count', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const scan = nativeScanReport(REVISION, {
      Results: [
        {
          Class: 'os-pkgs',
          Target: 'release-gate (alpine 3.24.1)',
          Type: 'alpine',
          Vulnerabilities: [
            {
              InstalledVersion: '1.0.0',
              PkgName: 'demo',
              Severity: 'HIGH',
              VulnerabilityID: 'CVE-2026-0001'
            }
          ]
        }
      ]
    })
    const { result, scanPath } = buildScannerEnvelope(workdir, scan)

    assert.equal(result.status, 0, result.stderr)
    const envelope = JSON.parse(readFileSync(scanPath, 'utf8'))
    assert.deepEqual(envelope.wrapper.results, [
      {
        class: 'os-pkgs',
        count: 1,
        target: 'release-gate (alpine 3.24.1)',
        vulnerability_member: true
      }
    ])
    assert.equal(envelope.wrapper.fixable_high, 0)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('scanner envelope rejects a fixable blocking vulnerability', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const scan = nativeScanReport(REVISION, {
      Results: [
        {
          Class: 'os-pkgs',
          Target: 'release-gate (alpine 3.24.1)',
          Type: 'alpine',
          Vulnerabilities: [
            {
              FixedVersion: '1.0.1',
              InstalledVersion: '1.0.0',
              PkgName: 'demo',
              Severity: 'CRITICAL',
              VulnerabilityID: 'CVE-2026-0002'
            }
          ]
        }
      ]
    })
    const { result } = buildScannerEnvelope(workdir, scan)

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /fixable blocking vulnerabilities/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('scanner envelope rejects a report bound to another revision', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const { result } = buildScannerEnvelope(workdir, nativeScanReport('f'.repeat(40)))

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /not bound to the release gate image/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('scanner envelope refuses to wrap an already-wrapped report', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const { result } = buildScannerEnvelope(workdir, {
      scan: nativeScanReport(REVISION),
      schema_version: 2,
      version: SCANNER_VERSION_EVIDENCE
    })

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /already an envelope/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})

test('scanner envelope rejects an unexpected image coordinate', () => {
  const workdir = mkdtempSync(join(tmpdir(), 'genefoundry-scanner-envelope-'))

  try {
    const scanPath = join(workdir, 'trivy.json')
    const versionPath = join(workdir, 'trivy-version.json')
    writeFileSync(scanPath, JSON.stringify(nativeScanReport(REVISION)))
    writeFileSync(versionPath, JSON.stringify(SCANNER_VERSION_EVIDENCE))
    const result = spawnSync(
      process.execPath,
      [
        'scripts/build-scanner-envelope.mjs',
        '--scan',
        scanPath,
        '--version',
        versionPath,
        '--image',
        'ghcr.io/berntpopp/genefoundry:latest',
        '--digest',
        DIGEST,
        '--revision',
        REVISION,
        '--output',
        scanPath
      ],
      { encoding: 'utf8' }
    )

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /image must be ghcr\.io\/berntpopp\/genefoundry/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})
