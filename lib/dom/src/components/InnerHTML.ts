import { Signal } from "../prop";
import { Clear } from "../types/clean";
import { IDOMContext } from "../types/idom-context";
import { Renderable } from "../types/renderable";

export class InnerHTMLImpl implements Renderable {
  constructor(private html: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const el = ctx.getElement()
    const previous = el.innerHTML
    el.innerHTML = this.html.get() ?? ""
    const cancel = this.html.subscribe(value => {
      el.innerHTML = value ?? ''
    })
    return (removeTree: boolean) => {
      cancel()
      if (removeTree) {
        el.innerHTML = previous
      }
    }
  }
}

export interface InnerHTMLProps {
  html: Signal<string> | Signal<string | undefined>
}

export function InnerHTML({ html }: InnerHTMLProps) {
  return new InnerHTMLImpl(html)
}
