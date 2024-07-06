import { IDOMContext } from "../types/idom-context"
import { Signal } from "../prop"
import { Clear } from "../types/clean"
import { Renderable } from "../types/renderable"
import { subscribeToSignal } from "./Text"

export class AttributeImpl implements Renderable {
  constructor(private name: string, private value: Signal<string>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const [set, clear] = ctx.createAttribute(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface AttributeProps {
  name: string
  value: Signal<string>
}

export function Attribute({ name, value }: AttributeProps): Renderable {
  return new AttributeImpl(name, value)
}
