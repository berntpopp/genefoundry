import type { SiteConfig } from './contracts'
export const SITE: SiteConfig = {
  canonicalOrigin: 'https://genefoundry.org',
  basePath: import.meta.env.BASE_URL || '/',
  isMirror: (import.meta.env.BASE_URL || '/') !== '/',
  buildYear: Number(import.meta.env.VITE_BUILD_YEAR || '2026')
}
export const FEATURED_NAMESPACES: readonly string[] = [
  'gnomad',
  'clinvar',
  'clingen',
  'hpo',
  'uniprot',
  'pubtator'
]
