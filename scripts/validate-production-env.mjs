#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const path = process.argv[2]
if (!path || process.argv.length !== 3) {
  console.error('usage: validate-production-env.mjs <env-file>')
  process.exit(1)
}

let contents
try {
  contents = readFileSync(path, 'utf8')
} catch {
  console.error(`cannot read production environment file: ${path}`)
  process.exit(1)
}

const values = contents
  .split(/\r?\n/u)
  .filter((line) => line.startsWith('GENEFOUNDRY_IMAGE_SHA256='))
  .map((line) => line.slice('GENEFOUNDRY_IMAGE_SHA256='.length))

if (values.length !== 1 || !/^[0-9a-f]{64}$/.test(values[0])) {
  console.error('GENEFOUNDRY_IMAGE_SHA256 must be one exact 64-character lowercase hex digest')
  process.exit(1)
}
