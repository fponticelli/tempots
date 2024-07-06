import { type Signal } from '../prop'
import { type Renderable } from '../renderable'
import { type Clear } from '../clean'
import { subscribeToSignal } from './Text'
import { type DOMContext } from '../dom-context'

export class PropertyImpl<T> implements Renderable {
  constructor (private readonly name: string, private readonly value: Signal<T>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const [set, clear] = ctx.createProperty(this.name, this.value.get())
    return subscribeToSignal(this.value, set, clear)
  }
}

export interface PropertyProps<T> {
  name: string
  value: Signal<T>
}

export function Property<T> ({ name, value }: PropertyProps<T>): Renderable {
  return new PropertyImpl(name, value)
}
