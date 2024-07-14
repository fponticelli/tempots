import { Nothing } from './domain'

export type JSONPrimitive = string | boolean | number | Nothing
export interface JSONObject {
  [k: string]: JSONValue
}
export type JSONArray = JSONValue[]
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
