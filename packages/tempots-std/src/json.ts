export type JSONPrimitive = string | boolean | number | null | undefined
export interface JSONObject {
  [k: string]: JSONValue
}
export type JSONArray = JSONValue[]
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
