import type { ProviderMark, Providers } from '../types/domain'
import { DOMContext } from './dom-context'
import { _removeDOMNode } from './dom-utils'

/**
 * `DOMContext` is an immutable class that represents the context of a DOM element.
 * It provides methods and properties to manipulate and interact with the DOM element.
 *
 * A reference in a DOMContext is to mark a position within a set of sibblings.
 * It is used to insert new elements before the reference.
 *
 * @public
 */
export class HTMLDOMContext implements DOMContext {
  /**
   * Creates a new `DOMContext` instance for the given `Element` and optional reference `Node`.
   *
   * @param element - The `Element` to create the `DOMContext` for.
   * @param ref - An optional reference `Node` to associate with the `DOMContext`.
   * @returns A new `DOMContext` instance.
   */
  static of(element: Element, ref?: Node | undefined): DOMContext {
    return new HTMLDOMContext(element.ownerDocument, element, ref, {}, true)
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
    readonly element: Element,
    /**
     * An optional `Node` instance that serves as a reference for this context.
     */
    readonly reference: Node | undefined,
    /**
     * The `Providers` instance associated with this context.
     */
    readonly providers: Providers,
    /**
     * A boolean value indicating whether this context is at the first level, meaning the outermost node in the generated
     */
    readonly isFirstLevel: boolean
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
  ): Element => {
    if (namespace !== undefined) {
      return this.document.createElementNS(namespace, tagName)
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
    const element = this.createElement(tagName, namespace)
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
  readonly withElement = (element: Element): DOMContext =>
    new HTMLDOMContext(this.document, element, undefined, this.providers, false)

  /**
   * Creates a new `DOMContext` instance with the `isFirstLevel` property set to `true`.
   * @returns A new `DOMContext` instance with the `isFirstLevel` property set to `true`.
   */
  readonly withFirstLevel = (): DOMContext =>
    new HTMLDOMContext(
      this.document,
      this.element,
      this.reference,
      this.providers,
      true
    )

  /**
   * Creates a new `DOMContext` instance with the specified reference.
   *
   * @param reference - The optional `Text` node to use as the reference for the new `DOMContext`.
   * @returns A new `DOMContext` instance with the specified reference.
   */
  readonly withReference = (reference: Text | undefined): DOMContext =>
    new HTMLDOMContext(
      this.document,
      this.element,
      reference,
      this.providers,
      this.isFirstLevel
    )

  /** Creates a new HTMLDOMContext with the provided provider value.
   *
   * @param mark - The provider mark to associate the value with.
   * @param value - The value to set for the provider.
   * @returns A new HTMLDOMContext with the updated providers.
   */
  readonly withProvider = <T>(mark: ProviderMark<T>, value: T): DOMContext =>
    new HTMLDOMContext(
      this.document,
      this.element,
      this.reference,
      {
        ...this.providers,
        [mark]: value,
      },
      this.isFirstLevel
    )

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
    new HTMLDOMContext(
      this.document,
      this.element,
      this.reference,
      {
        ...this.providers,
        ...providers,
      },
      this.isFirstLevel
    )

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
}

/**
 * Error thrown when a provider is not found.
 *
 * @public
 */
export class ProviderNotFoundError extends Error {
  constructor(mark: ProviderMark<unknown>) {
    super(`Provider not found: ${mark.description}`)
  }
}
