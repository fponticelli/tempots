import { Signal } from "../prop"
import { JSX } from "../jsx"
import { AnyKey } from "./OneOf"

export interface EntriesProps<T> {
  of: Signal<T>
  children?: (key: keyof T, value: Signal<T[typeof key]>) => JSX.DOMNode
}

// <Entries ofs={obj}>{(key, value) => <dt>key:</dt><dd>{value.toText()}</dd>}</For>
export function Entries<T extends Record<AnyKey, unknown>>({
  of,
  children: makeRenderable
}: EntriesProps<T>) {
  return 10
}

