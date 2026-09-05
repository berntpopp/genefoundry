export function pageUrl(baseURL: string | undefined, relativePath = ''): string {
  if (!baseURL || relativePath.startsWith('/'))
    throw new Error('Use an explicit base and relative page path')
  return new URL(relativePath, baseURL).href
}
