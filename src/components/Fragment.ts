import { type Renderable } from '../renderable'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type JSX } from '../jsx'
import { makeRenderables } from '../jsx-runtime'

export class FragmentImpl implements Renderable {
  constructor (private readonly children: Renderable[]) { }
  readonly appendTo = (ctx: DOMContext): Clear => {
    const clears = this.children.map(child => child.appendTo(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => { clear(removeTree) })
    }
  }
}

export function Fragment ({ children }: { children: JSX.DOMNode }): Renderable {
  return new FragmentImpl(makeRenderables(children))
}
