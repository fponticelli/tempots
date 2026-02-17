import type { HierarchicalContext, ProviderMark } from "@tempots/core";

/**
 * Represents a collection of providers.
 * The keys of the record are ProviderMark types, and the values are of unknown type.
 * @public
 */
export type Providers = Record<
  ProviderMark<unknown>,
  [unknown, undefined | (() => void)]
>;

/**
 * Base interface for rendering contexts that support text nodes and providers.
 *
 * This extends `HierarchicalContext` from `@tempots/core` with the minimal
 * set of methods needed by shared renderables (text handling and provider chain).
 *
 * Platform-specific contexts (DOM, Native, etc.) extend this interface with
 * their own methods for element creation, styling, events, etc.
 *
 * @public
 */
export interface BaseRenderContext extends HierarchicalContext {
  /**
   * Creates a new text node with the specified text content and appends it
   * to the current context.
   * @param text - The text content for the new text node.
   * @returns A new context with a reference to the new text node.
   */
  makeChildText(text: string): BaseRenderContext;

  /**
   * Sets the text content of the current text node.
   * @param text - The text content to set.
   */
  setText(text: string): void;

  /**
   * Gets the text content of the current element or text node.
   * @returns The text content.
   */
  getText(): string;

  /**
   * Retrieves a provider for the given provider mark.
   *
   * @param mark - The provider mark to retrieve the provider for.
   * @returns The provider value and optional onUse callback.
   * @throws Throws `ProviderNotFoundError` if the provider is not found.
   */
  getProvider<T>(mark: ProviderMark<T>): { value: T; onUse?: () => void };

  /**
   * Sets a provider for the given provider mark.
   *
   * @param mark - The provider mark to set the provider for.
   * @param value - The provider value to set.
   * @param onUse - Optional callback invoked when the provider is used.
   * @returns A new context with the provider set.
   */
  setProvider<T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void),
  ): BaseRenderContext;

  /**
   * Moves a range of sibling nodes (from `startRef` to `endRef` inclusive)
   * before `targetRef`. All three refs must be children of the same parent.
   *
   * Used by `KeyedForEach` to reorder keyed items without recreating DOM nodes.
   *
   * @param startRef - The context whose reference marks the start of the range.
   * @param endRef - The context whose reference marks the end of the range.
   * @param targetRef - The context before which the range will be inserted.
   */
  moveRangeBefore(
    startRef: BaseRenderContext,
    endRef: BaseRenderContext,
    targetRef: BaseRenderContext,
  ): void;
}
