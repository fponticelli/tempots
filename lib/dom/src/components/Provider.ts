import { Clear } from "../types/clean"
import { IDOMContext, ProviderMark } from "../types/idom-context"
import { Renderable } from "../types/renderable"
import { JSX } from "../jsx"
import { makeRenderable } from "../jsx-runtime"

export class ProviderImpl<T> implements Renderable {
  constructor(private readonly mark: ProviderMark<T>, private readonly provider: T, private readonly children: JSX.DOMNode) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const newCtx = ctx.withProvider(this.mark, this.provider)
    const clear = makeRenderable(this.children).appendTo(newCtx)
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        clear(removeTree)
      })
    }
  }
}

export interface ProviderProps<T> {
  mark: ProviderMark<T>
  value: T
  children?: JSX.DOMNode
}

export function Provider<T>({ mark, value, children }: ProviderProps<T>): JSX.DOMNode {
  return new ProviderImpl(mark, value, children)
}

export class ConsumerImpl<T> implements Renderable {
  constructor(private readonly mark: ProviderMark<T>, private readonly children: (provider: T) => JSX.DOMNode) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const provider = ctx.getProvider(this.mark) as T
    if (provider === undefined) {
      throw new Error("No provider found for mark")
    }
    const clear = makeRenderable(this.children(provider)).appendTo(ctx)
    return (removeTree: boolean) => {
      clear(removeTree)
    }
  }
}

export interface ConsumerProps<T> {
  mark: ProviderMark<T>
  children?: (provider: T) => JSX.DOMNode
}

export function Consumer<T>({ mark, children }: ConsumerProps<T>): JSX.DOMNode {
  return new ConsumerImpl(mark, children ?? (() => []))
}

