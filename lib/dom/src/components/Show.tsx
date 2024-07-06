/** @jsxImportSource .. */
import { Signal } from "../prop"
import { Renderable } from "../types/renderable"
import { JSX } from "../jsx"
import { Clear } from "../types/clean"
import { IDOMContext } from "../types/idom-context"
import { If } from "./If"
import { makeRenderable } from "../jsx-runtime"

export type Condition<T> =
  | Signal<T | null | undefined>
  | Signal<T | undefined>
  | Signal<T | null>
  | Signal<T>

export class ShowImpl<T> implements Renderable {
  constructor(private on: Condition<T>, private otherwise: JSX.DOMNode, private children: (value: Signal<NonNullable<T>>) => JSX.DOMNode) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const condition = this.on.map(v => v != null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = makeRenderable(<If is={condition} then={this.children(this.on as any)} otherwise={this.otherwise} />)
    return el.appendTo(ctx)
  }
}

export interface ShowProps<T> {
  when: Condition<T>
  otherwise?: JSX.DOMNode
  children?: (value: Signal<NonNullable<T>>) => JSX.DOMNode
}

export function Show<T>({ when, children, otherwise }: ShowProps<T>) {
  return new ShowImpl(when, otherwise, children ?? (() => <></>))
}
