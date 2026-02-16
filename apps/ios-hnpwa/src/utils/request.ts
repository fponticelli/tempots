import { HttpError } from './http-error'
import { Feed } from '../route'
import { decodeItem, decodeUser, decodeFeed } from './decoders'
import { Result } from './result'
import { Item, User } from '../types'

declare const fetch: (url: string, options?: { signal?: unknown }) => Promise<{
  status: number
  ok: boolean
  json: () => Promise<unknown>
  text: () => Promise<string>
}>
declare const setTimeout: (fn: () => void, ms: number) => number

const RESET_CACHE_AFTER = 120000
const base = 'https://api.hnpwa.com'

const makeUrl = (path: string[]) => `${base}/${path.join('/')}`

// Cache for completed successful responses only
const cache = new Map<string, Result<unknown, HttpError>>()

// Map to track in-flight requests for deduplication
const inFlightRequests = new Map<string, Promise<Result<unknown, HttpError>>>()

const makeRequest = async <Out>(
  path: string[],
  parse: (input: unknown) => Out,
): Promise<Result<Out, HttpError>> => {
  const endpoint = makeUrl(path)

  // Check if we have a cached successful result
  if (cache.has(endpoint)) {
    const cached = cache.get(endpoint)!
    if (Result.isSuccess(cached)) {
      return cached as Result<Out, HttpError>
    }
  }

  // Check if there's already an in-flight request for this endpoint
  if (inFlightRequests.has(endpoint)) {
    return inFlightRequests.get(endpoint) as Promise<Result<Out, HttpError>>
  }

  // Create the request promise
  const requestPromise = (async (): Promise<Result<Out, HttpError>> => {
    try {
      const response = await fetch(endpoint)

      if (response.status === 200) {
        const json = await response.json()
        try {
          const result = parse(json)
          const successResult = Result.success(result)
          // Only cache successful results
          cache.set(endpoint, successResult as Result<unknown, HttpError>)
          setTimeout(() => {
            cache.delete(endpoint)
          }, RESET_CACHE_AFTER)
          return successResult
        } catch {
          return Result.failure(HttpError.badBody('Failed to parse response'))
        }
      } else {
        return Result.failure(HttpError.badStatus(response.status))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return Result.failure(HttpError.networkError)
    } finally {
      // Remove from in-flight requests when done
      inFlightRequests.delete(endpoint)
    }
  })()

  // Track this request as in-flight
  inFlightRequests.set(
    endpoint,
    requestPromise as Promise<Result<unknown, HttpError>>
  )

  return requestPromise
}

const feedName = (feed: Feed) => {
  switch (feed) {
    case Feed.ask:
      return 'ask'
    case Feed.jobs:
      return 'jobs'
    case Feed.new:
      return 'newest'
    case Feed.top:
      return 'news'
    case Feed.show:
      return 'show'
    default:
      throw `unknown value ${feed}`
  }
}

export const Request = {
  item(id: number): Promise<Result<Item, HttpError>> {
    const path = ['v0', 'item', `${id}.json`]
    return makeRequest(path, decodeItem)
  },
  user(id: string): Promise<Result<User, HttpError>> {
    const path = ['v0', 'user', `${id}.json`]
    return makeRequest(path, decodeUser)
  },
  feed(feed: Feed, page: number): Promise<Result<Item[], HttpError>> {
    const name = feedName(feed)
    const path = ['v0', name, `${page}.json`]
    return makeRequest(path, decodeFeed)
  },
}
