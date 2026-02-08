import { Item, ItemUrl, User } from '../types'

/**
 * Strip HTML tags from a string (simple regex-based approach for native).
 * Replaces DOMPurify + Marked from the DOM version.
 */
const stripHtmlTags = (s: string): string => {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>/gi, '\n')
    .replace(/<\/p>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const parseItemUrl = (s: string): ItemUrl => {
  if (s.indexOf('item?id=') >= 0) {
    return ItemUrl.internal
  } else {
    return ItemUrl.external(s)
  }
}

const parseItem = (json: Record<string, unknown>): Item => ({
  id: json.id as number,
  title: json.title as string | undefined,
  points: (json.points as number | null) ?? 0,
  user: (json.user as string | null) ?? '',
  time_ago: json.time_ago as string,
  url: parseItemUrl((json.url as string) ?? ''),
  domain: json.domain as string | undefined,
  comments_count: json.comments_count as number,
  comments: json.comments
    ? (json.comments as Record<string, unknown>[]).map(parseItem)
    : undefined,
  content: json.content
    ? stripHtmlTags(json.content as string)
    : undefined,
  type: json.type as string,
})

const parseUser = (json: Record<string, unknown>): User => ({
  id: json.id as string,
  karma: json.karma as number,
  created: json.created as string,
  about: json.about ? stripHtmlTags(json.about as string) : undefined,
})

export const decodeItem = (json: unknown): Item =>
  parseItem(json as Record<string, unknown>)

export const decodeFeed = (json: unknown): Item[] =>
  (json as Record<string, unknown>[]).map(parseItem)

export const decodeUser = (json: unknown): User =>
  parseUser(json as Record<string, unknown>)
