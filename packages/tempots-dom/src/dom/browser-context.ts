import type { Clear, ProviderMark, Providers } from '../types/domain'
import type { Primitive } from '@tempots/core'
import { _makeGetter, _makeSetter } from './attr'
import { DOMContext, HandlerOptions } from './dom-context'
import { _removeDOMNode } from './dom-utils'
import { ProviderNotFoundError } from './errors'
import { HeadlessContext } from './headless-context'

/**
 * Browser implementation of DOMContext for real DOM manipulation in web browsers.
 *
 * BrowserContext provides a comprehensive API for creating, manipulating, and managing
 * DOM elements in a browser environment. It handles element creation, text nodes,
 * event listeners, styling, and provider management while maintaining immutability
 * through context chaining.
 *
 * The context uses a reference system to track insertion points within sibling elements,
 * allowing precise control over where new elements are inserted in the DOM tree.
 *
 * @example
 * ```typescript
 * // Create a context for the document body
 * const ctx = BrowserContext.of(document.body, undefined, {})
 *
 * // Create child elements
 * const divCtx = ctx.makeChildElement('div', undefined)
 * const textCtx = divCtx.makeChildText('Hello, World!')
 *
 * // Add event listeners
 * divCtx.on('click', (event, ctx) => {
 *   console.log('Div clicked!', event.target)
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Working with providers
 * const themeProvider = makeProviderMark<string>('theme')
 * const ctxWithProvider = ctx.setProvider(themeProvider, 'dark', undefined)
 *
 * // Later retrieve the provider
 * const { value: theme } = ctxWithProvider.getProvider(themeProvider)
 * ```
 *
 * @example
 * ```typescript
 * // Portal to different DOM location
 * const modalCtx = ctx.makePortal('#modal-root')
 * const modalContent = modalCtx.makeChildElement('div', undefined)
 * ```
 *
 * @public
 */
export class BrowserContext implements DOMContext {
  /**
   * Creates a new `DOMContext` instance for the given `Element` and optional reference `Node`.
   *
   * @param element - The `HTMLElement` to create the `DOMContext` for.
   * @param ref - A reference `Node` to associate with the `DOMContext` or undefined .
   * @param providers - The providers to associate with the `DOMContext`.
   * @returns A new `DOMContext` instance.
   */
  static of(
    element: HTMLElement,
    ref: Node | undefined,
    providers: Providers
  ): DOMContext {
    return new BrowserContext(element.ownerDocument, element, ref, providers)
  }

  /**
   * Constructs a new `DOMContext` instance.
   *
   * @param document - The `Document` instance associated with this context.
   * @param element - The `Element` instance associated with this context.
   * @param reference - An optional `Node` instance that serves as a reference for this context.
   * @param providers - The `Providers` instance associated with this context.
   * @param isFirstLevel - A boolean value indicating whether this context is at the first level, meaning the outermost node in the generated DOM.
   */
  constructor(
    /**
     * The `Document` instance associated with this context.
     */
    readonly document: Document,
    /**
     * The `Element` instance associated with this context.
     */
    readonly element: HTMLElement,
    /**
     * An optional `Node` instance that serves as a reference for this context.
     */
    readonly reference: Node | undefined,
    /**
     * The `Providers` instance associated with this context.
     */
    readonly providers: Providers
  ) {}

  /**
   * Creates a new DOM element (eg: HTML or SVG) with the specified tag name and namespace.
   *
   * @param tagName - The tag name of the element to create.
   * @param namespace - The namespace URI to create the element in, or `undefined` to create a standard HTML element.
   * @returns The newly created element.
   */
  createElement(tagName: string, namespace: string | undefined): HTMLElement {
    if (namespace !== undefined) {
      return this.document.createElementNS(namespace, tagName) as HTMLElement
    } else {
      return this.document.createElement(tagName)
    }
  }

  /**
   * Creates a new child element and appends it to the current element, returning a new context.
   *
   * This method creates a new DOM element with the specified tag name and namespace,
   * appends it to the current element, and returns a new DOMContext focused on the
   * newly created child element. This is the primary method for building DOM trees.
   *
   * @example
   * ```typescript
   * // Create HTML elements
   * const divCtx = ctx.makeChildElement('div', undefined)
   * const spanCtx = divCtx.makeChildElement('span', undefined)
   *
   * // Create SVG elements
   * const svgCtx = ctx.makeChildElement('svg', 'http://www.w3.org/2000/svg')
   * const circleCtx = svgCtx.makeChildElement('circle', 'http://www.w3.org/2000/svg')
   * ```
   *
   * @param tagName - The tag name of the element to create (e.g., 'div', 'span', 'svg')
   * @param namespace - The namespace URI for the element, or undefined for HTML elements
   * @returns A new DOMContext focused on the newly created child element
   */
  makeChildElement(tagName: string, namespace: string | undefined): DOMContext {
    const element = this.createElement(tagName, namespace) as HTMLElement
    this.appendOrInsert(element)
    return this.withElement(element)
  }

  /**
   * Creates a new text node with the specified text content.
   * @param text - The text content for the new text node.
   * @returns A new `Text` node with the specified text content.
   */
  createText(text: Primitive): Text {
    return this.document.createTextNode(text as string)
  }

  /**
   * Creates a new text node with the specified text content and appends it to the current element.
   * @param text - The text content for the new text node. Primitives are coerced to strings by the DOM.
   * @returns A new `DOMContext` with a reference to the new text node.
   */
  makeChildText(text: Primitive): DOMContext {
    const textNode = this.createText(text)
    this.appendOrInsert(textNode)
    return this.withReference(textNode)
  }

  /**
   * Sets the text content of the current element.
   * @param text - The text content to set. Primitives are coerced to strings by the DOM.
   */
  setText(text: Primitive) {
    this.reference!.nodeValue = text as string
  }

  /**
   * Gets the text content of the current element or text node.
   * @returns The text content of the current element or text node.
   */
  getText(): string {
    return this.reference?.nodeValue ?? this.element.textContent ?? ''
  }

  /**
   * Creates a new `DOMContext` with a reference to a newly created Comment node.
   * The Comment node is appended or inserted to the current `DOMContext`.
   * The new `DOMContext` with the reference is returned.
   */
  makeRef(): DOMContext {
    const ref = this.document.createComment('')
    this.appendOrInsert(ref)
    return this.withReference(ref)
  }

  /**
   * Creates a lightweight Comment marker node and appends/inserts it.
   * Used as boundary references for keyed list items and conditional renderables.
   */
  makeMarker(): DOMContext {
    return this.makeRef()
  }

  /**
   * Appends or inserts a child node to the element, depending on whether a reference node is provided.
   *
   * @param child - The child node to append or insert.
   */
  appendOrInsert(child: Node) {
    if (this.reference === undefined) {
      this.element.appendChild(child)
    } else {
      this.element.insertBefore(child, this.reference)
    }
  }

  /**
   * Creates a new `DOMContext` instance with the provided `element`.
   * @param element - The DOM element to use in the new `DOMContext` instance.
   * @returns A new `DOMContext` instance with the provided `element`.
   */
  withElement(element: HTMLElement): BrowserContext {
    return new BrowserContext(
      element.ownerDocument ?? this.document,
      element,
      undefined,
      this.providers
    )
  }

  /**
   * Creates a portal to render content in a different part of the DOM tree.
   *
   * Portals allow you to render child components into a DOM node that exists outside
   * the parent component's DOM hierarchy. This is useful for modals, tooltips,
   * dropdowns, and other UI elements that need to break out of their container's
   * styling or z-index context.
   *
   * @example
   * ```typescript
   * // Portal to a modal container
   * const modalCtx = ctx.makePortal('#modal-root')
   * const modal = modalCtx.makeChildElement('div', undefined)
   *
   * // Add modal content
   * modal.makeChildText('This renders in #modal-root')
   * ```
   *
   * @example
   * ```typescript
   * // Portal to an existing element reference
   * const tooltipContainer = document.getElementById('tooltip-container')!
   * const tooltipCtx = ctx.makePortal(tooltipContainer)
   *
   * // Render tooltip content
   * const tooltip = tooltipCtx.makeChildElement('div', undefined)
   * tooltip.addClasses(['tooltip', 'tooltip-top'])
   * ```
   *
   * @example
   * ```typescript
   * // Portal for dropdown menu
   * const dropdownCtx = ctx.makePortal('body') // Render at body level
   * const dropdown = dropdownCtx.makeChildElement('div', undefined)
   * dropdown.addClasses(['dropdown-menu'])
   * dropdown.setStyle('position', 'absolute')
   * dropdown.setStyle('top', '100px')
   * dropdown.setStyle('left', '50px')
   * ```
   *
   * @param selector - CSS selector string or HTMLElement reference for the portal target
   * @returns A new DOMContext focused on the portal target element
   * @throws {Error} When the selector doesn't match any element in the document
   */
  makePortal(selector: string | HTMLElement): DOMContext {
    const element =
      typeof selector === 'string'
        ? (this.document.querySelector(selector) as HTMLElement | null)
        : selector
    if (element == null) {
      throw new Error(`Cannot find element by selector for portal: ${selector}`)
    }
    return this.withElement(element)
  }

  /**
   * Creates a new `DOMContext` instance with the specified reference.
   *
   * @param reference - The optional `Node` to use as the reference for the new `DOMContext`.
   * @returns A new `DOMContext` instance with the specified reference.
   */
  withReference(reference: Node | undefined): DOMContext {
    return new BrowserContext(
      this.document,
      this.element,
      reference,
      this.providers
    )
  }

  /**
   * Sets a provider for the given provider mark.
   *
   * @param mark - The provider mark to set the provider for.
   * @param value - The provider to set for the given mark.
   * @returns A new `DOMContext` instance with the specified provider.
   */
  setProvider<T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void)
  ): DOMContext {
    return new BrowserContext(this.document, this.element, this.reference, {
      ...this.providers,
      [mark]: [value, onUse],
    })
  }

  /**
   * Retrieves a provider for the given provider mark.
   *
   * @param mark - The provider mark to retrieve the provider for.
   * @returns The provider for the given mark.
   * @throws Throws `ProviderNotFoundError` if the provider for the given mark is not found.
   */
  getProvider<T>(mark: ProviderMark<T>) {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    const [value, onUse] = this.providers[mark]! as [
      T,
      undefined | (() => void),
    ]
    return { value, onUse }
  }

  clear(removeTree: boolean) {
    if (removeTree) {
      if (this.reference !== undefined) {
        _removeDOMNode(this.reference)
      } else {
        _removeDOMNode(this.element)
      }
    }
  }

  /**
   * Adds classes to the element.
   * @param tokens - The class names to add.
   */
  addClasses(tokens: string[]) {
    this.element.classList.add(...tokens)
  }

  /**
   * Removes classes from the element.
   * @param tokens - The class names to remove.
   */
  removeClasses(tokens: string[]) {
    this.element.classList.remove(...tokens)
  }

  /**
   * Gets the classes of the element.
   * @returns The classes of the element.
   */
  getClasses(): string[] {
    return Array.from(this.element.classList)
  }

  /**
   * Adds an event listener to the element.
   * @param event - The event to listen for.
   * @param listener - The listener to call when the event occurs.
   * @param options - The options for the event listener.
   * @returns A function to remove the event listener.
   */
  on<E>(
    event: string,
    listener: (event: E, ctx: BrowserContext) => void,
    options?: HandlerOptions
  ): Clear {
    const handler = (event: Event) => listener(event as E, this)
    this.element.addEventListener(event, handler, options)
    return (removeTree: boolean) => {
      if (removeTree) {
        this.element.removeEventListener(event, handler, options)
      }
    }
  }

  /**
   * Returns `true` if the context is a browser DOM context.
   * @returns `true` if the context is a browser DOM context.
   * @deprecated Use `isBrowser()` instead.
   */
  isBrowserDOM(): this is BrowserContext {
    return true
  }

  /**
   * Returns `true` if the context is a browser context.
   * @returns `true` if the context is a browser context.
   */
  isBrowser(): this is BrowserContext {
    return true
  }

  /**
   * Returns `true` if the context is a headless DOM context.
   * @returns `true` if the context is a headless DOM context.
   */
  isHeadlessDOM(): this is HeadlessContext {
    return false
  }

  /**
   * Returns `true` if the context is a headless context.
   * @returns `true` if the context is a headless context.
   */
  isHeadless(): this is HeadlessContext {
    return false
  }

  /**
   * Sets the style of the element.
   * @param name - The name of the style to set.
   * @param value - The value of the style to set.
   */
  setStyle(name: string, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.element.style[name as any] = value
  }

  /**
   * Gets the style of the element.
   * @param name - The name of the style to get.
   * @returns The value of the style.
   */
  getStyle(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.element.style[name as any]
  }

  makeAccessors(name: string) {
    return {
      get: _makeGetter(name, this.element),
      set: _makeSetter(name, this.element),
    }
  }

  getWindow() {
    return this.document.defaultView!
  }

  moveRangeBefore(
    startRef: DOMContext,
    endRef: DOMContext,
    targetRef: DOMContext
  ): void {
    const start = (startRef as BrowserContext).reference!
    const end = (endRef as BrowserContext).reference!
    const target = (targetRef as BrowserContext).reference!
    const parent = this.element

    let current: Node | null = start
    while (current !== null) {
      const next: Node | null = current.nextSibling
      parent.insertBefore(current, target)
      if (current === end) break
      current = next
    }
  }

  removeRange(startRef: DOMContext, endRef: DOMContext): void {
    const start = (startRef as BrowserContext).reference!
    const end = (endRef as BrowserContext).reference!
    const parent = this.element

    let current: Node | null = start
    while (current !== null) {
      const next: Node | null = current.nextSibling
      parent.removeChild(current)
      if (current === end) break
      current = next
    }
  }

  removeAllBefore(ref: DOMContext): void {
    const marker = (ref as BrowserContext).reference!
    const parent = this.element
    if (!parent.firstChild || parent.firstChild === marker) return
    const range = this.document.createRange()
    range.setStartBefore(parent.firstChild)
    range.setEndBefore(marker)
    range.deleteContents()
  }

  private _detachedParent: Node | null = null
  private _detachedNext: Node | null = null

  detach(): void {
    const el = this.element
    if (el.parentNode) {
      this._detachedParent = el.parentNode
      this._detachedNext = el.nextSibling
      el.remove()
    }
  }

  reattach(): void {
    if (this._detachedParent) {
      this._detachedParent.insertBefore(this.element, this._detachedNext)
      this._detachedParent = null
      this._detachedNext = null
    }
  }
}
