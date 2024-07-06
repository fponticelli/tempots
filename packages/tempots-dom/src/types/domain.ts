import { DOMContext } from '../dom/dom-context'
import { type Value } from '../std/signal'

export type Mountable = (ctx: DOMContext) => Clear

export type Child = Mountable | Value<string> | undefined | null | Mountable[]
export type Clear = (removeTree: boolean) => void

export type ProviderMark<T> = symbol & { readonly __type: T }
export type Providers = Record<ProviderMark<unknown>, unknown>

export interface Size {
  readonly width: number
  readonly height: number
}
