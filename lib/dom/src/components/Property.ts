import { Signal } from "../prop"
import { Renderable } from "../types/renderable"
import { Clear } from "../types/clean"
import { subscribeToSignal } from "./Text"
import { IDOMContext } from "../types/idom-context"

export class PropertyImpl<T> implements Renderable {
  constructor(private name: string, private value: Signal<T>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const [set, clear] = ctx.createProperty(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface PropertyProps<T> {
  name: string
  value: Signal<T>
}

export function Property<T>({ name, value }: PropertyProps<T>): Renderable {
  return new PropertyImpl(name, value)
}

