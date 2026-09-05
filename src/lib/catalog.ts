import type { SourceDetail } from '../data/contracts'
import type { ServerCategory, ServerEntry } from '../data/servers'

export function filterSources(
  servers: readonly ServerEntry[],
  details: readonly SourceDetail[],
  query: string,
  category: ServerCategory | 'all'
): ServerEntry[] {
  const tokens = query.slice(0, 200).trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean)
  const aliases = new Map(details.map((detail) => [detail.namespace, detail.aliases]))
  return servers.filter((source) => {
    if (category !== 'all' && source.category !== category) return false
    const text = [
      source.source,
      source.namespace,
      source.domain,
      ...(aliases.get(source.namespace) ?? [])
    ]
      .join(' ')
      .toLocaleLowerCase('en')
    return tokens.every((token) => text.includes(token))
  })
}
