import { getPage, PAGES } from '../data/pages'
import { stripBase } from './urls'

/** Resolve the same finite route for server rendering and browser hydration. */
export function resolvePage(pathname: string) {
  const path = stripBase(pathname).replace(/\/index\.html$/, '/')
  const page = getPage(path) ?? PAGES.find((entry) => entry.kind === 'not-found')
  if (!page) throw new Error('The page registry must include a not-found document')
  return page
}
