import { Signal } from "../prop";
import { Clear } from "../types/clean";
import { IDOMContext } from "../types/idom-context";
import { Renderable } from "../types/renderable";

export class TextContentImpl implements Renderable {
  constructor(private html: Signal<string> | Signal<string | undefined>) { }

  readonly appendTo = (ctx: IDOMContext): Clear => {
    const el = ctx.getElement()
    const previous = el.textContent
    el.textContent = this.html.get() ?? ""
    const cancel = this.html.subscribe(value => {
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
  html: Signal<string> | Signal<string | undefined>
}

export function TextContent({ html }: TextContentProps) {
  return new TextContentImpl(html)
}
