import { build } from 'vite'
import { rm, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { compressDirectory } from './compress.mjs'
import { validateArtifacts } from './validate-artifacts.mjs'

if (!['/', '/genefoundry/'].includes(process.env.VITE_BASE_URL)) {
  throw new Error('Production builds require VITE_BASE_URL=/ or VITE_BASE_URL=/genefoundry/')
}
process.env.VITE_BUILD_YEAR ||= String(new Date().getUTCFullYear())
await rm(resolve('.build/server'), { recursive: true, force: true })
await rm(resolve('dist'), { recursive: true, force: true })
await mkdir('.build', { recursive: true })
await build({ build: { ssr: 'src/entry-server.ts' } })
await build({ build: { ssr: false } })
await compressDirectory('dist')
await validateArtifacts({ outDir: 'dist', basePath: process.env.VITE_BASE_URL })
