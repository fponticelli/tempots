import { Renderable } from "../types/renderable"
import { Clear } from "../types/clean"
import { IDOMContext } from "../types/idom-context"

export type OnFn<T> = (value: T) => void

export class OnImpl<T> implements Renderable {
  constructor(private name: string, private handler: OnFn<T>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    return ctx.createHandler(this.name, this.handler)
  }
}

export interface OnProps<T> {
  name: string
  handler: OnFn<T>
}

export function On<T>({ name, handler }: OnProps<T>): Renderable {
  return new OnImpl(name, handler)
}
