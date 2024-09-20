import type { Clear, ProviderMark, Providers } from '../types/domain'
import { _makeGetter, _makeSetter } from './attr'
import { DOMContext } from './dom-context'
import { _removeDOMNode } from './dom-utils'
import { ProviderNotFoundError } from './errors'
import { HeadlessContext } from './headless-context'

/**
 * `DOMContext` is an immutable class that represents the context of a DOM element.
 * It provides methods and properties to manipulate and interact with the DOM element.
 *
 * A reference in a DOMContext is to mark a position within a set of sibblings.
 * It is used to insert new elements before the reference.
 *
 * @public
 */
export class BrowserContext implements DOMContext {
  /**
   * Creates a new `DOMContext` instance for the given `Element` and optional reference `Node`.
   *
   * @param element - The `HTMLElement` to create the `DOMContext` for.
   * @param ref - An optional reference `Node` to associate with the `DOMContext`.
   * @returns A new `DOMContext` instance.
   */
  static of(element: HTMLElement, ref?: Node | undefined): DOMContext {
    return new BrowserContext(element.ownerDocument, element, ref, {})
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
  readonly createElement = (
    tagName: string,
    namespace: string | undefined
  ): HTMLElement => {
    if (namespace !== undefined) {
      return this.document.createElementNS(namespace, tagName) as HTMLElement
    } else {
      return this.document.createElement(tagName)
    }
  }

  /**
   * Creates a new DOM element (eg: HTML or SVG) with the specified tag name and namespace and appends it to the current element.
   *
   * @param tagName - The tag name of the element to create.
   * @param namespace - The namespace URI to create the element in, or `undefined` to create a standard HTML element.
   * @returns The newly created element.
   */
  readonly makeChildElement = (
    tagName: string,
    namespace: string | undefined
  ): DOMContext => {
    const element = this.createElement(tagName, namespace) as HTMLElement
    this.appendOrInsert(element)
    return this.withElement(element)
  }

  /**
   * Creates a new text node with the specified text content.
   * @param text - The text content for the new text node.
   * @returns A new `Text` node with the specified text content.
   */
  readonly createText = (text: string): Text =>
    this.document.createTextNode(text)

  /**
   * Creates a new text node with the specified text content and appends it to the current element.
   * @param text - The text content for the new text node.
   * @returns A new `DOMContext` with a reference to the new text node.
   */
  readonly makeChildText = (text: string): DOMContext => {
    const textNode = this.createText(text)
    this.appendOrInsert(textNode)
    return this.withReference(textNode)
  }

  /**
   * Sets the text content of the current element.
   * @param text - The text content to set.
   */
  readonly setText = (text: string) => {
    this.reference!.nodeValue = text
  }

  /**
   * Gets the text content of the current element or text node.
   * @returns The text content of the current element or text node.
   */
  readonly getText = (): string => {
    return this.reference?.nodeValue ?? this.element.textContent ?? ''
  }

  /**
   * Creates a new `DOMContext` with a reference to a newly created text node.
   * The text node is appended or inserted to the current `DOMContext`.
   * The new `DOMContext` with the reference is returned.
   */
  readonly makeRef = (): DOMContext => {
    const ref = this.createText('')
    this.appendOrInsert(ref)
    return this.withReference(ref)
  }

  /**
   * Appends or inserts a child node to the element, depending on whether a reference node is provided.
   *
   * @param child - The child node to append or insert.
   */
  readonly appendOrInsert = (child: Node) => {
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
  readonly withElement = (element: HTMLElement): BrowserContext =>
    new BrowserContext(this.document, element, undefined, this.providers)

  /**
   * Creates a new `DOMContext` instance with a reference to a DOM element selected by the provided `selector`.
   * @param selector - The CSS selector for the target DOM element.
   * @returns A new `DOMContext` instance with a reference to the selected DOM element.
   */
  readonly makePortal = (selector: string): DOMContext => {
    const element = this.document.querySelector(selector) as HTMLElement | null
    if (element == null) {
      throw new Error(`Cannot find element by selector for portal: ${selector}`)
    }
    return this.withElement(element)
  }

  /**
   * Creates a new `DOMContext` instance with the specified reference.
   *
   * @param reference - The optional `Text` node to use as the reference for the new `DOMContext`.
   * @returns A new `DOMContext` instance with the specified reference.
   */
  readonly withReference = (reference: Text | undefined): DOMContext =>
    new BrowserContext(this.document, this.element, reference, this.providers)

  /**
   * Returns a new HTMLDOMContext instance with the specified providers merged into
   * the existing providers.
   *
   * @param providers - An object containing the providers to be merged into the existing providers.
   * @returns A new HTMLDOMContext instance with the merged providers.
   */
  readonly withProviders = (providers: {
    [K in ProviderMark<unknown>]: unknown
  }): DOMContext =>
    new BrowserContext(this.document, this.element, this.reference, {
      ...this.providers,
      ...providers,
    })

  /**
   * Retrieves a provider for the given provider mark.
   *
   * @param mark - The provider mark to retrieve the provider for.
   * @returns The provider for the given mark.
   * @throws Throws `ProviderNotFoundError` if the provider for the given mark is not found.
   */
  readonly getProvider = <T>(mark: ProviderMark<T>): T => {
    if (this.providers[mark] === undefined) {
      throw new ProviderNotFoundError(mark)
    }

    return this.providers[mark]! as T
  }

  readonly clear = (removeTree: boolean) => {
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
  readonly addClasses = (tokens: string[]) => {
    this.element.classList.add(...tokens)
  }

  /**
   * Removes classes from the element.
   * @param tokens - The class names to remove.
   */

  readonly removeClasses = (tokens: string[]) => {
    this.element.classList.remove(...tokens)
  }

  /**
   * Gets the classes of the element.
   * @returns The classes of the element.
   */
  readonly getClasses = (): string[] => {
    return Array.from(this.element.classList)
  }

  /**
   * Adds an event listener to the element.
   * @param event - The event to listen for.
   * @param listener - The listener to call when the event occurs.
   * @returns A function to remove the event listener.
   */
  readonly on = <E>(event: string, listener: (event: E) => void): Clear => {
    this.element.addEventListener(event, listener as EventListener)
    return (removeTree: boolean) => {
      if (removeTree) {
        this.element.removeEventListener(event, listener as EventListener)
      }
    }
  }

  /**
   * Returns `true` if the context is a browser DOM context.
   * @returns `true` if the context is a browser DOM context.
   */
  readonly isBrowserDOM = (): this is BrowserContext => true

  /**
   * Returns `true` if the context is a headless DOM context.
   * @returns `true` if the context is a headless DOM context.
   */
  readonly isHeadlessDOM = (): this is HeadlessContext => false

  /**
   * Sets the style of the element.
   * @param name - The name of the style to set.
   * @param value - The value of the style to set.
   */
  readonly setStyle = (name: string, value: string) => {
    this.element.style.setProperty(name, value)
  }

  /**
   * Gets the style of the element.
   * @param name - The name of the style to get.
   * @returns The value of the style.
   */
  readonly getStyle = (name: string) => {
    return this.element.style.getPropertyValue(name)
  }

  readonly makeAccessors = (name: string) => {
    return {
      get: _makeGetter(name, this.element),
      set: _makeSetter(name, this.element),
    }
  }
}
