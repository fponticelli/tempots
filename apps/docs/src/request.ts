import { Result, success, failure } from 'tempo-std/lib/result'
import { JSONValue } from 'tempo-std/lib/json'

export type HttpError = { kind: 'HttpError'; message: string }

const cache = new Map<string, Promise<Result<string, HttpError>>>()

export const loadText = (
  path: string
): Promise<Result<string, HttpError>> => {
  if (cache.has(path)) {
    return cache.get(path)!
  }

  const promise = fetch(path)
    .then(r => r.text())
    .then(v => success<string, HttpError>(v))
    .catch(e => failure<string, HttpError>({ kind: 'HttpError', message: String(e) }))

  cache.set(path, promise)

  return promise
}

export const loadJson = async (
  path: string
): Promise<Result<JSONValue, HttpError>> => {
  try {
    const response = await fetch(path)
    return success(await response.json())
  } catch (e) {
    return failure({ kind: 'HttpError', message: String(e) })
  }
}
