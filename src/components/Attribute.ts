import { type DOMContext } from '../dom-context'
import { type Signal } from '../prop'
import { type Clear } from '../clean'
import { type Renderable } from '../renderable'
import { subscribeToSignal } from './Text'

export class AttributeImpl implements Renderable {
  constructor (private readonly name: string, private readonly value: Signal<string>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const [set, clear] = ctx.createAttribute(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface AttributeProps {
  name: string
  value: Signal<string>
}

export function Attribute ({ name, value }: AttributeProps): Renderable {
  return new AttributeImpl(name, value)
}
