import { type DOMContext } from '../dom-context'
import { type Signal } from '../prop'
import { type Clear } from '../clean'
import { type Renderable } from '../renderable'
import { subscribeToSignal } from './Text'

export class BooleanAttributeImpl implements Renderable {
  constructor (private readonly name: string, private readonly value: Signal<boolean>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const [set, clear] = ctx.createBooleanAttribute(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface BooleanAttributeProps {
  name: string
  value: Signal<boolean>
}

export function BooleanAttribute ({ name, value }: BooleanAttributeProps): Renderable {
  return new BooleanAttributeImpl(name, value)
}
