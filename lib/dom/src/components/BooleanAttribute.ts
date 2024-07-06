import { IDOMContext } from "../types/idom-context"
import { Signal } from "../prop"
import { Clear } from "../types/clean"
import { Renderable } from "../types/renderable"
import { subscribeToSignal } from "./Text"

export class BooleanAttributeImpl implements Renderable {
  constructor(private name: string, private value: Signal<boolean>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const [set, clear] = ctx.createBooleanAttribute(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface BooleanAttributeProps {
  name: string
  value: Signal<boolean>
}

export function BooleanAttribute({ name, value }: BooleanAttributeProps): Renderable {
  return new BooleanAttributeImpl(name, value)
}
