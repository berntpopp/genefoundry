#!/usr/bin/env node
/**
 * scripts/sync-fleet-provenance.mjs
 *
 * Validates and synchronizes canonical fleet provenance against the website catalog.
 * Guarantees that the landing page's server and tool counts never drift from the
 * router's federated backend reality.
 *
 * Usage:
 *   node scripts/sync-fleet-provenance.mjs --check
 *   node scripts/sync-fleet-provenance.mjs --fetch
 *   node scripts/sync-fleet-provenance.mjs --router-file ../genefoundry-router/genefoundry_router/data/fleet-provenance.json
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PROVENANCE_PATH = resolve(ROOT, 'src/data/fleet-provenance.json')
const SERVERS_PATH = resolve(ROOT, 'src/data/servers.ts')

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const shouldFetch = args.includes('--fetch')
const routerFileIdx = args.indexOf('--router-file')
const routerFile = routerFileIdx !== -1 ? args[routerFileIdx + 1] : null

async function getProvenancePayload() {
  if (routerFile) {
    console.log(`Reading provenance from local router file: ${routerFile}`)
    return JSON.parse(readFileSync(resolve(process.cwd(), routerFile), 'utf8'))
  }
  if (shouldFetch) {
    const url = process.env.GF_PROVENANCE_URL || 'https://genefoundry.org/api/fleet/provenance'
    console.log(`Fetching canonical provenance from: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch provenance from ${url}: HTTP ${response.status}`)
    }
    return await response.json()
  }
  return JSON.parse(readFileSync(PROVENANCE_PATH, 'utf8'))
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Provenance payload must be an object')
  }
  if (!payload.fleet || typeof payload.fleet !== 'object') {
    throw new Error('Provenance payload missing fleet object')
  }
  const { total_backends, total_tools } = payload.fleet
  if (typeof total_backends !== 'number' || typeof total_tools !== 'number') {
    throw new Error('fleet.total_backends and total_tools must be numbers')
  }
  if (!Array.isArray(payload.backends)) {
    throw new Error('fleet.backends must be an array')
  }
  if (payload.backends.length !== total_backends) {
    throw new Error(
      `fleet.total_backends (${total_backends}) != backends array length (${payload.backends.length})`
    )
  }
  const actualToolSum = payload.backends.reduce((sum, b) => sum + (b.tools?.length ?? 0), 0)
  if (actualToolSum !== total_tools) {
    throw new Error(`fleet.total_tools (${total_tools}) != sum of backend tools (${actualToolSum})`)
  }
  for (const b of payload.backends) {
    if (!b.namespace || typeof b.namespace !== 'string') {
      throw new Error(`Backend missing namespace: ${JSON.stringify(b)}`)
    }
    if (!Array.isArray(b.tools)) {
      throw new Error(`Backend ${b.namespace} missing tools array`)
    }
  }
  return { total_backends, total_tools, backends: payload.backends }
}

async function main() {
  const payload = await getProvenancePayload()
  const { total_backends, total_tools, backends } = validatePayload(payload)

  console.log(`Canonical fleet provenance: ${total_backends} backends, ${total_tools} tools.`)

  const serversModule = await import(SERVERS_PATH)
  const servers = serversModule.SERVERS
  const serverCount = serversModule.SERVER_COUNT
  const toolCount = serversModule.TOOL_COUNT

  const errors = []

  if (serverCount !== total_backends) {
    errors.push(`SERVER_COUNT (${serverCount}) !== provenance total_backends (${total_backends})`)
  }
  if (toolCount !== total_tools) {
    errors.push(`TOOL_COUNT (${toolCount}) !== provenance total_tools (${total_tools})`)
  }

  const backendMap = new Map(backends.map((b) => [b.namespace, b]))
  for (const server of servers) {
    const backend = backendMap.get(server.namespace)
    if (!backend) {
      errors.push(`Server ${server.namespace} in servers.ts is missing from fleet provenance`)
      continue
    }
    if (server.tools !== backend.tools.length) {
      errors.push(
        `Tool count mismatch for ${server.namespace}: servers.ts has ${server.tools}, provenance has ${backend.tools.length}`
      )
    }
  }

  for (const backend of backends) {
    if (!servers.some((s) => s.namespace === backend.namespace)) {
      errors.push(`Backend ${backend.namespace} in fleet provenance is missing from servers.ts`)
    }
  }

  for (let i = 0; i < servers.length - 1; i++) {
    if (servers[i].tools < servers[i + 1].tools) {
      errors.push(
        `Ordering violation: ${servers[i].namespace} (${servers[i].tools}) < ${servers[i + 1].namespace} (${servers[i + 1].tools})`
      )
    }
  }

  if (errors.length > 0) {
    console.error('Provenance alignment errors found:')
    for (const err of errors) console.error(` - ${err}`)
    process.exit(1)
  }

  if (!checkOnly && (shouldFetch || routerFile)) {
    const prettierConfig = await prettier.resolveConfig(PROVENANCE_PATH)
    const formatted = await prettier.format(JSON.stringify(payload, null, 2), {
      ...prettierConfig,
      filepath: PROVENANCE_PATH
    })
    writeFileSync(PROVENANCE_PATH, formatted, 'utf8')
    console.log(`Updated ${PROVENANCE_PATH} from source.`)
  }

  console.log('OK: Catalog inventory matches canonical fleet provenance with zero drift.')
}

main().catch((err) => {
  console.error(`Error: ${err.message}`)
  process.exit(1)
})
