import { JSONValue } from '@tempots/std/json'
import { Result } from '@tempots/std/result'

export type HttpError = { kind: 'HttpError'; message: string }

const cache = new Map<string, Promise<Result<string, HttpError>>>()

export const loadText = (path: string): Promise<Result<string, HttpError>> => {
  if (cache.has(path)) {
    return cache.get(path)!
  }

  const promise = fetch(path)
    .then(r => r.text())
    .then(v => Result.success<string>(v))
    .catch(e =>
      Result.failure<HttpError>({
        kind: 'HttpError',
        message: String(e),
      })
    )

  cache.set(path, promise)

  return promise
}

export const loadJson = async (
  path: string
): Promise<Result<JSONValue, HttpError>> => {
  try {
    const response = await fetch(path)
    return Result.success(await response.json())
  } catch (e) {
    return Result.failure({ kind: 'HttpError', message: String(e) })
  }
}
