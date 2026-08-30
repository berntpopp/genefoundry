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
            submittedAt: '2026-08-10T07:59:00Z',
          },
        ],
        pageInfo: { hasPreviousPage: false },
      },
      state: 'MERGED',
    },
  ]
  const successfulRun = {
    conclusion: 'success',
    createdAt: '2026-08-10T08:01:00Z',
    databaseId: 1,
    event: 'push',
    headSha: revision,
    status: 'completed',
  }
  const paths = {
    pullRequests: join(workdir, 'pull-requests.json'),
    ciRuns: join(workdir, 'ci-runs.json'),
    securityRuns: join(workdir, 'security-runs.json'),
  }
  writeFileSync(paths.pullRequests, JSON.stringify(pullRequests))
  writeFileSync(paths.ciRuns, JSON.stringify(overrides.ciRuns ?? [successfulRun]))
  writeFileSync(
    paths.securityRuns,
    JSON.stringify(overrides.securityRuns ?? [successfulRun]),
  )
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
      paths.securityRuns,
    ],
    { encoding: 'utf8' },
  )
}

function ensureOriginMainRef() {
  const result = spawnSync(
    'git',
    ['rev-parse', '--verify', 'refs/remotes/origin/main'],
    { encoding: 'utf8' },
  )
  if (result.status === 0) return result.stdout.trim()

  const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  execFileSync('git', ['update-ref', 'refs/remotes/origin/main', head])
  return head
}

test('Vite exposes a Vite 8-compatible manual chunk function', () => {
  const manualChunks = viteConfig.build.rollupOptions.output.manualChunks

  assert.equal(typeof manualChunks, 'function')
  assert.equal(
    manualChunks('/workspace/node_modules/vue/dist/vue.runtime.esm-bundler.js'),
    'vue-vendor',
  )
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
        output,
      ],
      { encoding: 'utf8' },
    )

    assert.equal(result.status, 0, result.stderr)
    const manifest = JSON.parse(readFileSync(output, 'utf8'))
    assert.deepEqual(manifest, {
      data_requirements: { mode: 'none' },
      image: {
        digest: DIGEST,
        name: 'ghcr.io/berntpopp/genefoundry',
        platforms: [{ digest: DIGEST, platform: 'linux/amd64' }],
      },
      repository: 'berntpopp/genefoundry',
      release_assets: {
        'image-manifest.json': DIGEST,
        'sbom.spdx.json': `sha256:${SBOM_SHA256}`,
        'trivy-version.json': `sha256:${VERSION_SHA256}`,
        'trivy.json': `sha256:${SCAN_SHA256}`,
      },
      schema_version: 1,
      security_evidence: {
        database_updated_at: '2026-08-10T06:54:30.951906211Z',
        sbom_sha256: SBOM_SHA256,
        scanner: 'trivy',
        scanner_evidence_sha256: SCAN_SHA256,
        scanner_version: '0.70.0',
      },
      source: { revision: REVISION, tag: 'v0.1.0' },
      version: '0.1.0',
      workflow: {
        caller: 'berntpopp/genefoundry/.github/workflows/container-release.yml',
      },
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
      '/tmp/application-release-manifest.json',
    ],
    { encoding: 'utf8' },
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
      '/tmp/application-release-manifest.json',
    ],
    { encoding: 'utf8' },
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
      '/tmp/application-release-manifest.json',
    ],
    { encoding: 'utf8' },
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
          state: 'MERGED',
        },
      ],
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
          status: 'completed',
        },
      ],
    })
    const failedResult = validateReleaseSource(revision, failedSecurity)
    assert.notEqual(failedResult.status, 0)
    assert.match(failedResult.stderr, /Security gate is not successful/)
  } finally {
    rmSync(workdir, { recursive: true, force: true })
  }
})
