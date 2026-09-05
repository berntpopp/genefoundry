import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { promisify } from 'node:util'
import { brotliCompress, gzip, constants } from 'node:zlib'

const brotli = promisify(brotliCompress)
const gzipBytes = promisify(gzip)
const formats = new Set(['.html', '.css', '.js', '.svg', '.json', '.webmanifest', '.xml', '.txt'])

export async function compressDirectory(outDir) {
  for (const entry of await readdir(outDir, { withFileTypes: true })) {
    const path = join(outDir, entry.name)
    if (entry.isDirectory()) await compressDirectory(path)
    else if (entry.isFile() && formats.has(extname(path))) {
      const bytes = await readFile(path)
      const [br, gz] = await Promise.all([
        brotli(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }),
        gzipBytes(bytes, { level: 9 })
      ])
      await Promise.all([writeFile(path + '.br', br), writeFile(path + '.gz', gz)])
    }
  }
}
