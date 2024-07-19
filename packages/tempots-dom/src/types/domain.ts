import { DOMContext } from '../dom/dom-context'
import type { Signal } from '../std/signal'

export type Renderable = (ctx: DOMContext) => Clear

export type TNode = Renderable | Value<string> | undefined | null | Renderable[]
export type Clear = (removeTree: boolean) => void

export type ProviderMark<T> = symbol & { readonly __type: T }
export type Providers = Record<ProviderMark<unknown>, unknown>

export interface Size {
  readonly width: number
  readonly height: number
}

export type Value<T> = Signal<T> | T
export type NValue<T> =
  | Value<T>
  | Value<T | null>
  | Value<T | undefined>
  | Value<T | null | undefined>
  | null
  | undefined

export type GetValueType<T> = T extends Signal<infer V> ? V : T

export type RemoveSignals<
  T extends Record<string | number | symbol, Value<unknown>>,
  K extends (string | number | symbol) & keyof T = keyof T,
> = {
  [k in K]: GetValueType<T[k]>
}
