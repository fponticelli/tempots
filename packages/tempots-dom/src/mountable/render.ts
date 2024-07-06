import type { Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { getSelfOrParentElement, isElement } from '../dom/dom-utils'
import { clearSSR } from '../dom/ssr'

export function renderWithContext(node: Mountable, ctx: DOMContext) {
  const clear = node(ctx)
  return () => clear(true)
}

export function render(
  node: Mountable,
  parent: Node | string,
  { doc, clear }: { doc?: Document; clear?: boolean } = {}
) {
  const el =
    typeof parent === 'string'
      ? (doc ?? document).querySelector(parent)
      : parent
  if (el === null) {
    throw new Error(`Cannot find element by selector for render: ${parent}`)
  }
  if (clear && (doc ?? el.ownerDocument) != null) {
    clearSSR((doc ?? el.ownerDocument)!)
  }
  const element = getSelfOrParentElement(el)
  const ref = isElement(el) ? undefined : el
  const ctx = DOMContext.of(element, ref)
  return renderWithContext(node, ctx)
}
