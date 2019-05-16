import { DOMTemplate } from './template'
import { DOMContext } from './context'
import { View } from '../core/view'
import { DOMStaticNodeView, DOMDynamicNodeView } from './node_view'
import { UnwrappedLiteralValue, UnwrappedDerivedValue } from '../core/value'
import { DOMTextValue } from './value'

const renderLiteral = <State>(ctx: DOMContext<never>, value: UnwrappedLiteralValue<string>): View<State> => {
  const node = ctx.doc.createTextNode(value || '')
  const view = new DOMStaticNodeView(node, [])
  ctx.append(node)
  return view
}

const renderFunction = <State>(
  ctx: DOMContext<never>,
  state: State,
  map: UnwrappedDerivedValue<State, string>
): View<State> => {
  const node = ctx.doc.createTextNode(map(state) || '')
  const f = (state: State) => {
    const newContent = map(state) || ''
    // TODO, is this optimization worth it?
    if (node.textContent !== newContent) node.textContent = newContent
  }
  const view = new DOMDynamicNodeView(node, [], f)
  ctx.append(node)
  return view
}

export class DOMText<State, Action> implements DOMTemplate<State, Action> {
  constructor(readonly content: DOMTextValue<State>) {}

  render(ctx: DOMContext<Action>, state: State): View<State> {
    if (typeof this.content === 'function') {
      return renderFunction(ctx, state, this.content)
    } else {
      return renderLiteral(ctx, this.content)
    }
  }
}

export const text = <State, Action>(content: DOMTextValue<State>) => new DOMText<State, Action>(content)
