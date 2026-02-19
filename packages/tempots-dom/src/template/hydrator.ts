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
 * Optimizations vs naive approach:
 * - Pre-allocated topNodes array (no Array.from) — minimal allocation
 * - Pre-allocated clears array — saves dynamic resizing
 * - Dynamic-text onChange stored directly as Clear — no wrapper closure
 *
 * Returns `{ clear, startCtx }` where startCtx is a DOMContext whose
 * reference is the first top-level node of the clone. This lets
 * KeyedForEach skip creating a separate Comment start marker.
 *
 * @internal
 */
export function hydrateClone(
  template: CompiledTemplate,
  ctx: DOMContext,
  slots: readonly (DynamicTextSlot | RenderableSlot)[]
): { clear: Clear; startCtx: DOMContext } {
  const bc = ctx as BrowserContext
  const clone = template.fragment.cloneNode(true) as DocumentFragment

  // Capture all top-level nodes before insertion (fragment empties after insert).
  // Opaque slot comments may be removed during hydration; their parentNode
  // becomes null and the clear function skips them gracefully.
  const numTopNodes = template.topNodeCount
  const topNodes = new Array<Node>(numTopNodes)
  let child = clone.firstChild
  for (let i = 0; i < numTopNodes; i++) {
    topNodes[i] = child!
    child = child!.nextSibling
  }

  // Walk slot paths BEFORE insertion (fragment is empty after insertion)
  const numSlots = template.slots.length
  const slotNodes = new Array<Node>(numSlots)
  for (let i = 0; i < numSlots; i++) {
    slotNodes[i] = walkPath(clone, template.slots[i].path)
  }

  // Insert clone into live DOM (moves all children from fragment)
  bc.appendOrInsert(clone)

  // Single-pass hydration (after insertion — opaque slots need live DOM parent)
  const clears = new Array<Clear>(numSlots)

  for (let i = 0; i < numSlots; i++) {
    const slotInfo = template.slots[i]
    const node = slotNodes[i]

    if (slotInfo.kind === 'dynamic-text') {
      // Wire signal -> text node directly (bypass makeChildText).
      // Store onChange result directly as Clear — no wrapper closure needed.
      // Node removal is handled by topNodes cleanup below.
      const slot = slots[i] as DynamicTextSlot
      const textNode = node as Text
      textNode.textContent = slot.transform(slot.source.value)
      clears[i] = slot.source.onChange((v: unknown) => {
        textNode.textContent = slot.transform(v)
      }) as Clear
    } else if (slotInfo.kind === 'dynamic-attr') {
      // Create context wrapping the cloned element, call render()
      const slot = slots[i] as RenderableSlot
      const elemCtx = new BrowserContext(
        bc.document,
        node as HTMLElement,
        undefined,
        bc.providers
      )
      clears[i] = slot.render(elemCtx as DOMContext)
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
      clears[i] = slot.render(markerCtx as DOMContext)
      comment.remove()
    }
  }

  // startCtx wraps the first top-level node — used as the range start
  // for moveRangeBefore, replacing the separate Comment start marker.
  const startCtx = new BrowserContext(
    bc.document,
    bc.element,
    topNodes[0],
    bc.providers
  )

  return {
    clear: (removeTree: boolean) => {
      for (let i = 0; i < numSlots; i++) {
        clears[i](removeTree)
      }
      if (removeTree) {
        // Remove template-owned top-level nodes.
        // Nodes removed during hydration (opaque slot comments) have
        // parentNode === null and are safely skipped.
        for (let i = 0; i < numTopNodes; i++) {
          const node = topNodes[i]
          if (node.parentNode) node.parentNode.removeChild(node)
        }
      }
    },
    startCtx,
  }
}
