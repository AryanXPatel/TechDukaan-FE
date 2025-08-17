import type { SearchResponse, MeiliSearch } from "meilisearch"

let client: MeiliSearch | null = null

export function getMeiliClient() {
  if (client) return client
  const host = process.env.NEXT_PUBLIC_MEILI_URL
  const apiKey = process.env.NEXT_PUBLIC_MEILI_API_KEY
  if (!host) return null
  // dynamic import to avoid bundling when not configured
  // @ts-ignore
  const Meili = (require as any)("meilisearch")
  client = new Meili.MeiliSearch({ host, apiKey })
  return client
}

export type MeiliResult<T> = SearchResponse<T>
