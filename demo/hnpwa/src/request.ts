/*
Copyright 2019 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DecodeResult } from 'partsing/core/result'
import { HttpError } from './http_error'
import { Feed } from './route'
import { decodeItem, decodeUser, decodeFeed } from './decoders'
import { Result } from '@tempots/std/result'

const RESET_CACHE_AFTER = 120000
const base = 'https://api.hnpwa.com'

const makeUrl = (path: string[]) => {
  return `${base}/${path.join('/')}`
}

const cache = new Map<string, unknown>()

const makeRequest = async <Out>(
  path: string[],
  parse: (input: unknown) => DecodeResult<unknown, Out, string>
): Promise<Result<Out, HttpError>> => {
  const endpoint = makeUrl(path)
  if (cache.has(endpoint)) {
    return cache.get(endpoint) as Result<Out, HttpError>
  } else {
    const output = await (async () => {
      const response = await fetch(endpoint)
      try {
        if (response.status === 200) {
          const json = await response.json()
          const result = parse(json)
          if (result.isSuccess()) {
            return Result.success(result.value)
          } else {
            return Result.failure(HttpError.badBody(result.failures.join(';')))
          }
        } else {
          return Result.failure(HttpError.badStatus(response.status))
        }
      } catch (e) {
        console.error(e)
        return Result.failure(HttpError.networkError)
      }
    })()
    cache.set(endpoint, output)
    setTimeout(() => {
      cache.delete(endpoint)
    }, RESET_CACHE_AFTER) // reset cache entry after elapsed time
    return output
  }
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
  item(id: number) {
    const path = ['v0', 'item', `${id}.json`]
    return makeRequest(path, decodeItem)
  },
  user(id: string) {
    const path = ['v0', 'user', `${id}.json`]
    return makeRequest(path, decodeUser)
  },
  feed(feed: Feed, page: number) {
    const name = feedName(feed)
    const path = ['v0', name, `${page}.json`]
    return makeRequest(path, decodeFeed)
  }
}
