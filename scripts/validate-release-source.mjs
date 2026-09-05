#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const EXPECTED_ARGUMENTS = new Set([
  'revision',
  'tag',
  'main-ref',
  'associated-prs',
  'ci-runs',
  'security-runs'
])

function fail(message) {
  throw new Error(message)
}

function parseArguments(argv) {
  const values = new Map()

  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index]
    const value = argv[index + 1]
    if (!option?.startsWith('--') || value === undefined) {
      fail('arguments must be provided as --name value pairs')
    }
    const name = option.slice(2)
    if (!EXPECTED_ARGUMENTS.has(name) || values.has(name)) {
      fail(`unexpected or duplicate argument: ${option}`)
    }
    values.set(name, value)
  }

  for (const name of EXPECTED_ARGUMENTS) {
    if (!values.has(name)) fail(`missing required argument: --${name}`)
  }
  return Object.fromEntries(values)
}

function readArray(path, description) {
  let value
  try {
    value = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    fail(`${description} evidence is not valid JSON`)
  }
  if (!Array.isArray(value)) fail(`${description} evidence must be an array`)
  return value
}

function requireExactCurrentMain(revision, mainRef) {
  let currentMain
  try {
    currentMain = execFileSync('git', ['rev-parse', '--verify', mainRef], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    fail('current origin/main ref is unavailable')
  }
  if (currentMain !== revision) fail('revision is not exact current origin/main')
}

function requireMergedMain(pullRequests, revision) {
  const matchingPullRequests = pullRequests.filter(
    (pullRequest) =>
      pullRequest?.baseRefName === 'main' &&
      pullRequest?.state === 'MERGED' &&
      pullRequest?.mergeCommit?.oid === revision
  )
  if (matchingPullRequests.length === 0) {
    fail('revision lacks a merged pull request into main')
  }
}

function requireSuccessfulGate(runs, revision, gateName) {
  const exactRuns = runs
    .filter(
      (run) =>
        run?.headSha === revision &&
        run?.event === 'push' &&
        Number.isFinite(Date.parse(run?.createdAt))
    )
    .sort((left, right) => {
      const timeDifference = Date.parse(right.createdAt) - Date.parse(left.createdAt)
      return timeDifference || Number(right.databaseId ?? 0) - Number(left.databaseId ?? 0)
    })

  const latest = exactRuns[0]
  if (latest?.status !== 'completed' || latest?.conclusion !== 'success') {
    fail(`${gateName} gate is not successful for the revision`)
  }
}

try {
  const options = parseArguments(process.argv.slice(2))
  if (!/^[0-9a-f]{40}$/.test(options.revision)) fail('revision must be a full commit SHA')
  if (!/^v\d+\.\d+\.\d+$/.test(options.tag)) fail('tag must be a stable semantic version')
  if (options['main-ref'] !== 'refs/remotes/origin/main') {
    fail('main ref must be refs/remotes/origin/main')
  }

  requireExactCurrentMain(options.revision, options['main-ref'])
  requireMergedMain(readArray(options['associated-prs'], 'pull request'), options.revision)
  requireSuccessfulGate(readArray(options['ci-runs'], 'CI'), options.revision, 'CI')
  requireSuccessfulGate(
    readArray(options['security-runs'], 'Security'),
    options.revision,
    'Security'
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
