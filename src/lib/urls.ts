import { SITE } from '../data/site'
function checkBase(base: string): void {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('Invalid website base')
}
function checkPath(path: string): void {
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    Array.from(path).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)
  )
    throw new Error('Expected a safe root-relative path')
  const pathname = path.split(/[?#]/)[0]!
  let decoded: string
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    throw new Error('Malformed path encoding')
  }
  if (
    /%|\\|\/\//.test(decoded) ||
    decoded.split('/').some((segment) => segment === '.' || segment === '..')
  )
    throw new Error('Unsafe path')
}
export function siteHref(path: string, basePath = SITE.basePath): string {
  checkBase(basePath)
  checkPath(path)
  return basePath + path.slice(1)
}
export function assetHref(path: string, basePath = SITE.basePath): string {
  return siteHref(path, basePath)
}
export function canonicalUrl(path: string): string {
  checkPath(path)
  return SITE.canonicalOrigin + path.split(/[?#]/)[0]
}
export function stripBase(pathname: string, basePath = SITE.basePath): string {
  checkBase(basePath)
  try {
    checkPath(pathname)
  } catch {
    return ''
  }
  if (basePath === '/') return pathname
  if (pathname === basePath.slice(0, -1)) return '/'
  return pathname.startsWith(basePath) ? '/' + pathname.slice(basePath.length) : ''
}
