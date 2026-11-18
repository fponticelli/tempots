import { HYDRATION_NODE_PREFIX, HYDRATION_POSITION_ATTR } from '@tempots/dom'

type Kind = 'element' | 'text' | 'anchor'
type Entry = { kind: Kind; node: Node; order: number }
type Cursor = { entries: Entry[]; index: number }
type ParentState = {
  byOwner: Map<string, Cursor>
  next: Node | null
}

export class HydrationState {
  active = true
  private parents = new WeakMap<HTMLElement, ParentState>()
  private references = new WeakMap<Node, number>()

  constructor(private readonly removeMarkers: boolean) {}

  finish() {
    this.active = false
    this.parents = new WeakMap()
    this.references = new WeakMap()
  }

  private scan(parent: HTMLElement, index: number): ParentState {
    const state: ParentState = {
      byOwner: new Map(),
      next: parent.childNodes[index] ?? null,
    }

    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType === 1) {
        const element = node as Element
        const position = element.getAttribute(HYDRATION_POSITION_ATTR)
        if (position != null) this.add(state, position, 'element', element)
      } else if (
        node.nodeType === 8 &&
        (node as Comment).data.startsWith(HYDRATION_NODE_PREFIX)
      ) {
        const mark = node as Comment
        const data = mark.data.slice(HYDRATION_NODE_PREFIX.length)
        const kind = data.startsWith('anchor:')
          ? 'anchor'
          : data.startsWith('text:')
            ? 'text'
            : null
        if (kind === null) continue
        const position = data.slice(kind.length + 1)
        if (!/^(?:\d+)?:\d+$/.test(position)) continue

        if (kind === 'anchor') {
          this.add(state, position, kind, mark)
          if (this.removeMarkers) mark.data = ''
        } else {
          let text = mark.nextSibling
          if (text?.nodeType !== 3) {
            text = parent.ownerDocument.createTextNode('')
            parent.insertBefore(text, mark.nextSibling)
          }
          this.add(state, position, kind, text)
          if (this.removeMarkers) mark.remove()
        }
      }
    }

    for (const cursor of state.byOwner.values()) {
      cursor.entries.sort((a, b) => a.order - b.order)
    }
    this.parents.set(parent, state)
    return state
  }

  private add(state: ParentState, position: string, kind: Kind, node: Node) {
    const [owner, index] = position.split(':')
    const order = Number(index)
    let cursor = state.byOwner.get(owner)
    if (cursor === undefined) {
      cursor = { entries: [], index: 0 }
      state.byOwner.set(owner, cursor)
    }
    cursor.entries.push({ kind, node, order })
    if (kind === 'anchor') this.references.set(node, order)
  }

  isServerAnchor(node: Node) {
    return this.references.has(node)
  }

  take(
    parent: HTMLElement,
    reference: Node | undefined,
    startIndex: number,
    kind: Kind,
    matches: (node: Node) => boolean
  ): Node | undefined {
    if (!this.active) return
    const state = this.parents.get(parent) ?? this.scan(parent, startIndex)
    if (state.byOwner.size > 0) {
      const id = reference === undefined ? '' : this.references.get(reference)
      if (id === undefined) return
      const cursor = state.byOwner.get(String(id))
      const entry = cursor?.entries[cursor.index]
      if (cursor && entry?.kind === kind && matches(entry.node)) {
        cursor.index++
        return entry.node
      }
      return
    }

    // Legacy HTML can still be adopted with one cursor over all node types.
    for (
      let node = state.next;
      node !== null && node !== reference;
      node = node.nextSibling
    ) {
      if (matches(node)) {
        state.next = node.nextSibling
        return node
      }
    }
  }
}
