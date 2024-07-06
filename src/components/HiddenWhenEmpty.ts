import { type Renderable } from '../renderable'
import { type DOMContext } from '../dom-context'
import { type Clear } from '../clean'

export class HiddenWhenEmptyImpl implements Renderable {
  appendTo (ctx: DOMContext): Clear {
    const initial = ctx.getStyle(':empty')
    ctx.setStyle(':empty', 'display: none')
    return (removeTree) => {
      if (removeTree) ctx.setStyle(':empty', initial)
    }
  }
}

export function HiddenWhenEmpty (): HiddenWhenEmptyImpl {
  return new HiddenWhenEmptyImpl()
}
