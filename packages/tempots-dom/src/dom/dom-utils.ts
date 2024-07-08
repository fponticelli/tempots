/**
 * Removes the specified node from the DOM.
 *
 * @param node - The node to be removed from the DOM.
 */
export function removeDOMNode(node: Node) {
  const el = node as HTMLElement
  if (el && el.onblur) {
    el.onblur = null
  }
  if (!node || node.ownerDocument === undefined) return
  if (node.parentElement) {
    node.parentElement.removeChild(node)
  }
}

/**
 * Returns the given `node` if it is an `Element`, or the parent `Element` of
 * the given `node` if it is not an `Element`.
 *
 * @param node - The `Node` to get the `Element` for.
 * @returns The `Element` for the given `node`.
 */
export function getSelfOrParentElement(node: Node): Element {
  return isElement(node) ? node : node.parentElement!
}

/**
 * Determines if the given `Node` is an `Element`.
 *
 * @param node - The `Node` to check.
 * @returns `true` if the `node` is an `Element`, `false` otherwise.
 */
export function isElement(node: Node): node is Element {
  return node.nodeType === 1 // Node.ELEMENT_NODE
}