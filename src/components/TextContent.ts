import { type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'

export class TextContentImpl implements Renderable {
  constructor (private readonly value: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    const el = ctx.getElement()
    const previous = el.textContent
    el.textContent = this.value.get() ?? ''
    const cancel = this.value.subscribe(value => {
      el.textContent = value ?? ''
    })
    return (removeTree: boolean) => {
      cancel()
      if (removeTree) {
        el.textContent = previous
      }
    }
  }
}

export interface TextContentProps {
  value: Signal<string> | Signal<string | undefined>
}

export function TextContent ({ value }: TextContentProps): TextContentImpl {
  return new TextContentImpl(value)
}
