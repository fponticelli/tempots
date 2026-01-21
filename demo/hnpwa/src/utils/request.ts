import { DecodeResult } from 'partsing/core/result'
import { HttpError } from './http-error'
import { Feed } from '../route'
import { decodeItem, decodeUser, decodeFeed } from './decoders'
import { Result } from './result'

const RESET_CACHE_AFTER = 120000
const base = 'https://api.hnpwa.com'

const makeUrl = (path: string[]) => {
  return `${base}/${path.join('/')}`
}

// Cache for completed successful responses only
const cache = new Map<string, Result<unknown, HttpError>>()

// Map to track in-flight requests for deduplication
const inFlightRequests = new Map<string, Promise<Result<unknown, HttpError>>>()

const makeRequest = async <Out>(
  path: string[],
  parse: (input: unknown) => DecodeResult<unknown, Out, string>,
  signal?: AbortSignal
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
      const response = await fetch(endpoint, { signal })

      if (response.status === 200) {
        const json = await response.json()
        const result = parse(json)
        if (result.isSuccess()) {
          const successResult = Result.success(result.value)
          // Only cache successful results
          cache.set(endpoint, successResult as Result<unknown, HttpError>)
          setTimeout(() => {
            cache.delete(endpoint)
          }, RESET_CACHE_AFTER)
          return successResult
        } else {
          return Result.failure(HttpError.badBody(result.failures.join(';')))
        }
      } else {
        return Result.failure(HttpError.badStatus(response.status))
      }
    } catch (e) {
      // Check if it was an abort error
      if (e instanceof DOMException && e.name === 'AbortError') {
        return Result.failure(HttpError.networkError)
      }
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
      throw `unkown value ${feed}`
  }
}

export const Request = {
  item(id: number, signal?: AbortSignal) {
    const path = ['v0', 'item', `${id}.json`]
    return makeRequest(path, decodeItem, signal)
  },
  user(id: string, signal?: AbortSignal) {
    const path = ['v0', 'user', `${id}.json`]
    return makeRequest(path, decodeUser, signal)
  },
  feed(feed: Feed, page: number, signal?: AbortSignal) {
    const name = feedName(feed)
    const path = ['v0', name, `${page}.json`]
    return makeRequest(path, decodeFeed, signal)
  },
}
