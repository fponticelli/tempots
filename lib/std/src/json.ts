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

import { Result } from './result'

export type JSONPrimitive = string | boolean | number | null
export interface JSONObject {
  [k: string]: JSONValue
}
export type JSONArray = JSONValue[]
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

export function deserialize(s: string): Result<JSONValue, string> {
  try {
    return Result.success(JSON.parse(s))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return Result.failure(e.message)
  }
}

export function makeSerializer(options: {
  minified?: boolean
  whitelist?: string[]
}) {
  return function serialize(v: JSONValue): string {
    return JSON.stringify(
      v,
      options.whitelist,
      options.minified === false ? undefined : 2
    )
  }
}

export function serialize(v: JSONValue): string {
  return JSON.stringify(v, null, 2)
}

export function serializeMinified(v: JSONValue): string {
  return JSON.stringify(v)
}
