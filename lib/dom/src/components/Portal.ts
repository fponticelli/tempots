import { render } from '../render'
import { Clear } from '../types/clean'
import { IDOMContext } from '../types/idom-context'
import { Renderable } from '../types/renderable'
import { JSX } from '../jsx'
import { makeRenderable } from '../jsx-runtime'

export class PortalImpl implements Renderable {
  constructor(
    private readonly selector: string,
    private readonly children: JSX.DOMNode
  ) { }
  appendTo(ctx: IDOMContext): Clear {
    const element = ctx.getDocument().querySelector(this.selector)
    if (element === null) {
      throw new Error(`Cannot find element by selector: ${this.selector}`)
    }
    return render(makeRenderable(this.children), element as HTMLElement)
  }
}

export interface PortalProps {
  selector: string
  children?: JSX.DOMNode
}

export function Portal(props: PortalProps): JSX.DOMNode {
  return new PortalImpl(props.selector, props.children)
}
