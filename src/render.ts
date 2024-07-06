import { DOMContext } from './dom-context'
import { type JSX, makeRenderable } from './jsx-runtime'
import { type Clean } from './clean'

export function render (renderable: JSX.DOMNode, element: HTMLElement): Clean {
  const ctx = DOMContext.of(element)
  const clear = makeRenderable(renderable).appendTo(ctx)
  return () => { clear(true) }
}
