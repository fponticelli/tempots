import { Signal } from '../prop'
import { type Renderable } from '../renderable'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'

export function subscribeToSignal<T> (
  prop: Signal<T>,
  listener: (value: T) => void,
  clear: Clear
): Clear {
  const unsubscribe = prop.subscribe(listener)
  return (removeTree: boolean) => {
    unsubscribe()
    clear(removeTree)
  }
}

export class TextImpl implements Renderable {
  constructor (private readonly text: Signal<string>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const [set, clear] = ctx.createText(this.text.get())
    return subscribeToSignal(this.text, set, clear)
  }
}

export type Primitive = string | number | boolean | Date

export interface TextProps {
  children?: Signal<Primitive | undefined> | Signal<Primitive> | Primitive
}

function propFromChildren (children: TextProps['children']): Signal<string> {
  if (children instanceof Signal) {
    return children.map((child) => {
      if (child == null) {
        return ''
      }
      return String(child)
    })
  }
  return new Signal(String(children))
}

export function Text ({ children }: TextProps): Renderable {
  const prop = propFromChildren(children)
  return new TextImpl(prop)
}
