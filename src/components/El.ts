import { type DOMContext } from '../dom-context'
import { type Clear } from '../clean'
import { type Renderable } from '../renderable'
import { type JSX } from '../jsx'
import { makeRenderables } from '../jsx-runtime'

export class ElImpl implements Renderable {
  constructor (private readonly tagName: string, private readonly children: Renderable[]) { }
  readonly appendTo = (ctx: DOMContext): Clear => {
    const newCtx = ctx.makeElement(this.tagName)
    const clears = this.children.map(child => child.appendTo(newCtx))
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        clears.forEach(clear => { clear(false) })
      })
    }
  }
}

export interface ElProps {
  tagName: string
  children?: JSX.DOMNode
}

export function El ({ tagName, children }: ElProps): Renderable {
  return new ElImpl(tagName, makeRenderables(children))
}
