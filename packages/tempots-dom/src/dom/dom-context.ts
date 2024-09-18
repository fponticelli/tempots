import type { ProviderMark } from '../types/domain'

/**
 * `DOMContext` is an immutable class that represents the context of a DOM element.
 * It provides methods and properties to manipulate and interact with the DOM element.
 *
 * A reference in a DOMContext is to mark a position within a set of sibblings.
 * It is used to insert new elements before the reference.
 *
 * @public
 */
export interface DOMContext {
  // TODO
  readonly element: Element
  readonly isFirstLevel: boolean

  /**
   * Creates a new DOM element (eg: HTML or SVG) with the specified tag name and namespace and appends it to the current element.
   *
   * @param tagName - The tag name of the element to create.
   * @param namespace - The namespace URI to create the element in, or `undefined` to create a standard HTML element.
   * @returns The newly created element.
   */
  makeChildElement(tagName: string, namespace: string | undefined): DOMContext

  /**
   * Creates a new text node with the specified text content and appends it to the current element.
   * @param text - The text content for the new text node.
   * @returns A new `DOMContext` with a reference to the new text node.
   */
  makeChildText(text: string): DOMContext

  /**
   * Sets the text content of the current element.
   * @param text - The text content to set.
   */
  setText(text: string): void

  /**
   * Creates a new `DOMContext` with a reference to a newly created text node.
   * The text node is appended or inserted to the current `DOMContext`.
   * The new `DOMContext` with the reference is returned.
   */
  makeRef(): DOMContext

  /**
   * Creates a new `DOMContext` instance with a reference to a DOM element selected by the provided `selector`.
   * @param selector - The CSS selector for the target DOM element.
   * @returns A new `DOMContext` instance with a reference to the selected DOM element.
   */
  makePortal(selector: string): DOMContext

  /**
   * Creates a new `DOMContext` instance with the `isFirstLevel` property set to `true`.
   * @returns A new `DOMContext` instance with the `isFirstLevel` property set to `true`.
   */
  withFirstLevel(): DOMContext

  /** Creates a new DOMContext with the provided provider value.
   *
   * @param mark - The provider mark to associate the value with.
   * @param value - The value to set for the provider.
   * @returns A new DOMContext with the updated providers.
   */
  withProvider<T>(mark: ProviderMark<T>, value: T): DOMContext

  /**
   * Returns a new DOMContext instance with the specified providers merged into
   * the existing providers.
   *
   * @param providers - An object containing the providers to be merged into the existing providers.
   * @returns A new DOMContext instance with the merged providers.
   */
  withProviders(providers: {
    [K in ProviderMark<unknown>]: unknown
  }): DOMContext

  /**
   * Retrieves a provider for the given provider mark.
   *
   * @param mark - The provider mark to retrieve the provider for.
   * @returns The provider for the given mark.
   * @throws Throws `ProviderNotFoundError` if the provider for the given mark is not found.
   */
  getProvider<T>(mark: ProviderMark<T>): T

  clear(removeTree: boolean): void
}
