import type { JSIBridge, NativeViewHandle } from './jsi-bridge'

/**
 * In-memory node for the mock bridge tree.
 * @public
 */
export interface MockNode {
  readonly handle: NativeViewHandle
  readonly type: string
  text: string
  readonly props: Record<string, unknown>
  readonly styles: Record<string, unknown>
  readonly children: MockNode[]
  readonly listeners: Map<string, ((e: unknown) => void)[]>
  parent: MockNode | null
}

/**
 * In-memory mock implementation of JSIBridge for testing.
 *
 * Maintains a tree of MockNodes that can be inspected in tests.
 *
 * @public
 */
export class MockBridge implements JSIBridge {
  private _nextHandle = 0
  private readonly _nodes = new Map<NativeViewHandle, MockNode>()
  private _rafId = 0

  /**
   * Global event target node (handle 0).
   *
   * Used by lifecycle signals (app state, keyboard, dimensions) to
   * listen for app-level events that are not tied to a specific view.
   */
  readonly global: MockNode

  /** The root node of the mock tree. */
  readonly root: MockNode

  constructor() {
    this.global = this._createNode('__global__')
    this.root = this._createNode('root')
  }

  private _createNode(type: string): MockNode {
    const handle = this._nextHandle++
    const node: MockNode = {
      handle,
      type,
      text: '',
      props: {},
      styles: {},
      children: [],
      listeners: new Map(),
      parent: null,
    }
    this._nodes.set(handle, node)
    return node
  }

  private _getNode(handle: NativeViewHandle): MockNode {
    const node = this._nodes.get(handle)
    if (!node) {
      throw new Error(`MockBridge: node ${handle} not found`)
    }
    return node
  }

  createView(
    type: string,
    parent: NativeViewHandle,
    before?: NativeViewHandle
  ): NativeViewHandle {
    const parentNode = this._getNode(parent)
    const node = this._createNode(type)
    node.parent = parentNode

    if (before != null) {
      const beforeNode = this._getNode(before)
      const idx = parentNode.children.indexOf(beforeNode)
      if (idx >= 0) {
        parentNode.children.splice(idx, 0, node)
      } else {
        parentNode.children.push(node)
      }
    } else {
      parentNode.children.push(node)
    }

    return node.handle
  }

  createTextView(
    text: string,
    parent: NativeViewHandle,
    before?: NativeViewHandle
  ): NativeViewHandle {
    const handle = this.createView('__text__', parent, before)
    const node = this._getNode(handle)
    node.text = text
    return handle
  }

  removeView(handle: NativeViewHandle): void {
    const node = this._getNode(handle)
    if (node.parent) {
      const idx = node.parent.children.indexOf(node)
      if (idx >= 0) {
        node.parent.children.splice(idx, 1)
      }
      node.parent = null
    }
    this._nodes.delete(handle)
  }

  moveView(handle: NativeViewHandle, before: NativeViewHandle): void {
    const node = this._getNode(handle)
    const beforeNode = this._getNode(before)
    const parent = node.parent
    if (!parent) {
      throw new Error('MockBridge: cannot move a root node')
    }

    // Remove from current position
    const idx = parent.children.indexOf(node)
    if (idx >= 0) {
      parent.children.splice(idx, 1)
    }

    // Insert before target
    const beforeIdx = parent.children.indexOf(beforeNode)
    if (beforeIdx >= 0) {
      parent.children.splice(beforeIdx, 0, node)
    } else {
      parent.children.push(node)
    }
  }

  getChildren(parent: NativeViewHandle): NativeViewHandle[] {
    const node = this._getNode(parent)
    return node.children.map(c => c.handle)
  }

  setViewProp(handle: NativeViewHandle, name: string, value: unknown): void {
    const node = this._getNode(handle)
    ;(node.props as Record<string, unknown>)[name] = value
  }

  setViewProps(handle: NativeViewHandle, props: Record<string, unknown>): void {
    const node = this._getNode(handle)
    Object.assign(node.props, props)
  }

  setTextContent(handle: NativeViewHandle, text: string): void {
    const node = this._getNode(handle)
    node.text = text
  }

  getTextContent(handle: NativeViewHandle): string {
    return this._getNode(handle).text
  }

  setStyle(handle: NativeViewHandle, styles: Record<string, unknown>): void {
    const node = this._getNode(handle)
    Object.assign(node.styles, styles)
  }

  addEventListener(
    handle: NativeViewHandle,
    event: string,
    handler: (e: unknown) => void
  ): () => void {
    const node = this._getNode(handle)
    let handlers = node.listeners.get(event)
    if (!handlers) {
      handlers = []
      node.listeners.set(event, handlers)
    }
    handlers.push(handler)

    return () => {
      const list = node.listeners.get(event)
      if (list) {
        const idx = list.indexOf(handler)
        if (idx >= 0) list.splice(idx, 1)
      }
    }
  }

  measure(
    handle: NativeViewHandle
  ): Promise<{ x: number; y: number; width: number; height: number }> {
    this._getNode(handle) // validate it exists
    return Promise.resolve({ x: 0, y: 0, width: 100, height: 50 })
  }

  requestAnimationFrame(callback: () => void): number {
    const id = ++this._rafId
    setTimeout(callback, 16)
    return id
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cancelAnimationFrame(_id: number): void {
    // no-op in mock
  }

  // --- Test helpers ---

  /** Get a node by its handle. */
  getNode(handle: NativeViewHandle): MockNode | undefined {
    return this._nodes.get(handle)
  }

  /** Dispatch a synthetic event to a node. */
  dispatchEvent(
    handle: NativeViewHandle,
    event: string,
    data: unknown = {}
  ): void {
    const node = this._getNode(handle)
    const handlers = node.listeners.get(event)
    if (handlers) {
      for (const h of handlers) {
        h(data)
      }
    }
  }

  /** Collect all text from the tree (depth-first). */
  collectText(handle?: NativeViewHandle): string {
    const node = handle != null ? this._getNode(handle) : this.root
    if (node.type === '__text__') {
      return node.text
    }
    return node.children.map(c => this.collectText(c.handle)).join('')
  }
}
