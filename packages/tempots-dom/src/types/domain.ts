import { DOMContext } from '../dom/dom-context'
import { type Value } from '../std/signal'

export type Renderable = (ctx: DOMContext) => Clear

export type TNode = Renderable | Value<string> | undefined | null | Renderable[]
export type Clear = (removeTree: boolean) => void

export type ProviderMark<T> = symbol & { readonly __type: T }
export type Providers = Record<ProviderMark<unknown>, unknown>

export interface Size {
  readonly width: number
  readonly height: number
}
