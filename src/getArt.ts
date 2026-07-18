import { Response } from './types'

const fields = ['id', '_score', 'image_id', 'title', 'artist_display']

// The search endpoint only allows paging through the first 1000 results
// (page * limit <= 1000). A limit of 100 keeps the reachable range at 10 pages
// and avoids the "Invalid number of results" 403 for higher page numbers.
export const PAGE_LIMIT = 10

export const artFetcher = async (
  search: string = '',
  page = 1,
  signal?: AbortSignal,
) => {
  /*It is always best practice to use `URLSearchParams` to avoid injecting vulnerability in URLs
    that address more sensitive endpoints
    `URLSearchParams` handles encoding for you. Never build query strings with template literals.
    */
  const params = new URLSearchParams({
    q: search,
    fields: fields.join(','),
    page: String(page),
    limit: String(PAGE_LIMIT),
  })
  const url = `https://api.artic.edu/api/v1/artworks/search?${params}`
  const res = await fetch(url, { signal })
  /*`fetch` only rejects on network failure — a 500 response is still a resolved promise. 
    `r.json()` on a 500's HTML error page will throw a cryptic parse error, not "the server had a problem."
    */
  if (!res.ok) throw new Error(`Search failed: ${res.status} ${res.statusText}`)
  const json: unknown = await res.json()
  if (!json || typeof json !== 'object' || !Array.isArray((json as any).data)) {
    throw new Error('Unexpected API response shape')
  }
  return json as Response
}
