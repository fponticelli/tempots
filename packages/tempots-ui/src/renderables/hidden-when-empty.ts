import { OnDispose, WithElement, Renderable } from '@tempots/dom'

const marker = 'data-tempo-hidden-when-empty'
const styles = new WeakMap<Node, { style: HTMLStyleElement; uses: number }>()

/**
 * Hides the element while it has no content.
 *
 * @public
 */
export const HiddenWhenEmpty: Renderable = WithElement(el => {
  const { ownerDocument } = el
  const root = el.getRootNode()
  const target =
    root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in root
      ? root
      : ownerDocument.head

  let entry = styles.get(target)
  if (entry === undefined) {
    const style = ownerDocument.createElement('style')
    style.textContent = `[${marker}]:empty { display: none; }`
    target.appendChild(style)
    entry = { style, uses: 0 }
    styles.set(target, entry)
  }

  const hadMarker = el.hasAttribute(marker)
  el.toggleAttribute(marker, true)
  entry.uses++
  let disposed = false
  return OnDispose(() => {
    if (disposed) return
    disposed = true
    el.toggleAttribute(marker, hadMarker)
    if (--entry.uses === 0) {
      entry.style.remove()
      styles.delete(target)
    }
  })
})
