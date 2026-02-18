import type { CompiledTemplate, DynamicTextSlot, RenderableSlot } from './types'
import type { Clear } from '@tempots/core'
import type { DOMContext } from '../dom/dom-context'
import { BrowserContext } from '../dom/browser-context'

function walkPath(root: Node, path: number[]): Node {
  let current = root
  for (let i = 0; i < path.length; i++) {
    current = current.childNodes[path[i]]
  }
  return current
}

/**
 * Clone a compiled template and wire up dynamic bindings.
 *
 * Walks the clone BEFORE insertion to capture node references,
 * then inserts the clone (moving nodes to live DOM). The captured
 * JS references remain valid after insertion.
 *
 * @internal
 */
export function hydrateClone(
  template: CompiledTemplate,
  ctx: DOMContext,
  slots: readonly (DynamicTextSlot | RenderableSlot)[]
): Clear {
  const bc = ctx as BrowserContext
  const clone = template.fragment.cloneNode(true) as DocumentFragment

  // Capture top-level nodes for cleanup
  const topNodes: Node[] = Array.from(clone.childNodes)

  // Walk clone BEFORE insertion to capture slot node references
  const slotNodes: Node[] = new Array(template.slots.length)
  for (let i = 0; i < template.slots.length; i++) {
    slotNodes[i] = walkPath(clone, template.slots[i].path)
  }

  // Insert clone into live DOM (moves all children from fragment)
  bc.appendOrInsert(clone)

  // Hydrate slots
  const clears: Clear[] = []

  for (let i = 0; i < template.slots.length; i++) {
    const slotInfo = template.slots[i]
    const node = slotNodes[i]

    if (slotInfo.kind === 'dynamic-text') {
      // Wire signal -> text node directly (bypass makeChildText)
      const slot = slots[i] as DynamicTextSlot
      const textNode = node as Text
      textNode.textContent = slot.transform(slot.source.value)
      const dispose = slot.source.onChange((v: unknown) => {
        textNode.textContent = slot.transform(v)
      })
      clears.push(() => dispose())
    } else if (slotInfo.kind === 'dynamic-attr') {
      // Create context wrapping the cloned element, call render()
      const slot = slots[i] as RenderableSlot
      const elemCtx = new BrowserContext(
        bc.document,
        node as HTMLElement,
        undefined,
        bc.providers
      )
      clears.push(slot.render(elemCtx as DOMContext))
    } else {
      // slot: opaque renderable with comment placeholder
      // The renderable will create its own markers, so we remove
      // the template's comment after rendering to avoid duplicates.
      const slot = slots[i] as RenderableSlot
      const comment = node as Comment
      const markerCtx = new BrowserContext(
        bc.document,
        comment.parentNode as HTMLElement,
        comment,
        bc.providers
      )
      clears.push(slot.render(markerCtx as DOMContext))
      comment.remove()
    }
  }

  return (removeTree: boolean) => {
    for (let i = 0; i < clears.length; i++) {
      clears[i](removeTree)
    }
    if (removeTree) {
      for (let i = 0; i < topNodes.length; i++) {
        const node = topNodes[i]
        if (node.parentNode) node.parentNode.removeChild(node)
      }
    }
  }
}
