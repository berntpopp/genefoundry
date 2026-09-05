import { createServer } from 'node:http'
import { readFile, stat, realpath } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
}
const backend =
  /^\/(mcp|authorize|token|register|consent|auth|\.well-known|health|metrics|docs|redoc|openapi\.json)(?:\/|$)/

export async function startStaticServer({
  outDir,
  basePath = '/',
  port = 4176,
  backendSentinels = false
}) {
  if (!['/', '/genefoundry/'].includes(basePath)) throw new Error('Invalid static base')
  const root = await realpath(resolve(outDir))
  const server = createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Cache-Control', 'no-cache')
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405)
      response.end()
      return
    }
    let pathname
    try {
      pathname = decodeURIComponent((request.url || '/').split('?')[0])
    } catch {
      response.writeHead(400)
      response.end()
      return
    }
    if (pathname.includes('\0') || pathname.split('/').includes('..') || pathname.includes('\\')) {
      response.writeHead(400)
      response.end()
      return
    }
    if (backendSentinels && backend.test(pathname)) {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('GENEFOUNDRY_NETWORK_SENTINEL:' + pathname)
      return
    }
    let file
    let status = 200
    try {
      if (!pathname.startsWith(basePath)) throw new Error('Outside base')
      file = resolve(root, pathname.slice(basePath.length))
      if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside output')
      const details = await stat(file)
      if (details.isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(301, { Location: pathname + '/' })
          response.end()
          return
        }
        file = resolve(file, 'index.html')
      }
      if (!(await realpath(file)).startsWith(root + sep)) throw new Error('Outside real output')
      await stat(file)
    } catch {
      status = 404
      file = resolve(root, '404.html')
    }
    try {
      const bytes = await readFile(file)
      response.writeHead(status, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'Content-Length': bytes.length
      })
      response.end(request.method === 'HEAD' ? undefined : bytes)
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('Page not found')
    }
  })
  await new Promise((resolveReady, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolveReady)
  })
  return server
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      dir: { type: 'string', default: 'dist' },
      base: { type: 'string', default: '/' },
      port: { type: 'string', default: '4176' },
      'backend-sentinels': { type: 'boolean', default: false }
    }
  })
  await startStaticServer({
    outDir: values.dir,
    basePath: values.base,
    port: Number(values.port),
    backendSentinels: values['backend-sentinels']
  })
  console.log('Static artifact listening on http://127.0.0.1:' + values.port + values.base)
}
