import type { ProviderMark } from "@tempots/core";
import type { BaseRenderContext, Providers } from "@tempots/render";
import { ProviderNotFoundError } from "@tempots/render";
import type { JSIBridge, NativeViewHandle } from "../bridge/jsi-bridge";

/**
 * Rendering context for native views.
 *
 * Implements `BaseRenderContext` using a `JSIBridge` to create and
 * manage native views. Each context holds a reference to a native
 * view handle and maintains an immutable provider chain.
 *
 * @public
 */
export class NativeContext implements BaseRenderContext {
  constructor(
    /** The JSI bridge for native operations. */
    readonly bridge: JSIBridge,
    /** Handle to the native view this context represents. */
    readonly handle: NativeViewHandle,
    /** Immutable chain of providers. */
    private readonly _providers: Providers = {} as Providers,
    /** Whether this context manages a ref (placeholder) node. */
    private readonly _isRef: boolean = false,
    /** Handle to the parent view (set when this is a ref context). */
    private readonly _parentHandle?: NativeViewHandle,
  ) {}

  // --- BaseRenderContext (HierarchicalContext) ---

  /**
   * Removes this view from the native view tree.
   * @param removeTree - If true, removes the view from its parent via the bridge
   */
  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      this.bridge.removeView(this.handle);
    }
  };

  /**
   * Creates a reference (marker) context.
   *
   * A ref context creates an invisible `__ref__` view that serves as an
   * insertion point. Child views created from a ref context are placed
   * in the ref's parent, positioned before the ref marker.
   *
   * @returns A new context representing the ref marker
   */
  makeRef(): this {
    // Create an invisible marker view (zero-size view)
    const refHandle = this.bridge.createView("__ref__", this.handle);
    return new NativeContext(
      this.bridge,
      refHandle,
      this._providers,
      true,
      this.handle, // remember the parent so children go into parent, before the ref
    ) as this;
  }

  // --- BaseRenderContext (text) ---

  /**
   * Creates a child text view with the given initial content.
   *
   * If this context is a ref context, the text view is inserted into
   * the ref's parent before the ref marker.
   *
   * @param text - The initial text content
   * @returns A new context for the text view
   */
  readonly makeChildText = (text: string): NativeContext => {
    const textHandle = this.bridge.createTextView(
      text,
      this._isRef ? this._parentHandle! : this.handle,
      this._isRef ? this.handle : undefined,
    );
    return new NativeContext(this.bridge, textHandle, this._providers);
  };

  /**
   * Updates the text content of this context's text view.
   * @param text - The new text content
   */
  readonly setText = (text: string): void => {
    this.bridge.setTextContent(this.handle, text);
  };

  /**
   * Reads the text content of this context's text view.
   * @returns The current text content
   */
  readonly getText = (): string => {
    return this.bridge.getTextContent(this.handle);
  };

  // --- BaseRenderContext (providers) ---

  /**
   * Retrieves a provider value from the context's provider chain.
   * @param mark - The provider mark to look up
   * @returns The provider value and optional onUse callback
   * @throws {ProviderNotFoundError} If the provider is not found
   */
  readonly getProvider = <T>(
    mark: ProviderMark<T>,
  ): { value: T; onUse?: () => void } => {
    const entry = this._providers[mark as ProviderMark<unknown>];
    if (entry == null) {
      throw new ProviderNotFoundError(mark);
    }
    return { value: entry[0] as T, onUse: entry[1] };
  };

  /**
   * Creates a new context with an additional provider value.
   *
   * Providers form an immutable chain: the original context is not
   * modified. Child contexts created from the returned context will
   * inherit the new provider.
   *
   * @param mark - The provider mark
   * @param value - The provider value
   * @param onUse - Optional callback invoked when the provider is consumed
   * @returns A new context with the provider set
   */
  readonly setProvider = <T>(
    mark: ProviderMark<T>,
    value: T,
    onUse: undefined | (() => void),
  ): NativeContext => {
    const newProviders = {
      ...this._providers,
      [mark as ProviderMark<unknown>]: [value, onUse],
    } as Providers;
    return new NativeContext(
      this.bridge,
      this.handle,
      newProviders,
      this._isRef,
      this._parentHandle,
    );
  };

  // --- Native-specific methods ---

  /**
   * Creates a child native view of the given type.
   *
   * If this context is a ref context, the child view is inserted into
   * the ref's parent before the ref marker.
   *
   * @param viewType - The native view type (e.g. 'View', 'Text', 'Image')
   * @returns A new context for the child view
   */
  readonly makeChildView = (viewType: string): NativeContext => {
    const childHandle = this.bridge.createView(
      viewType,
      this._isRef ? this._parentHandle! : this.handle,
      this._isRef ? this.handle : undefined,
    );
    return new NativeContext(this.bridge, childHandle, this._providers);
  };

  /**
   * Adds an event listener to the current view.
   * @param event - The event name
   * @param handler - The event handler
   * @returns A cleanup function to remove the listener
   */
  readonly on = <E>(event: string, handler: (e: E) => void): (() => void) => {
    return this.bridge.addEventListener(
      this.handle,
      event,
      handler as (e: unknown) => void,
    );
  };

  /**
   * Sets a property on the current view.
   * @param name - The property name
   * @param value - The property value
   */
  readonly setProp = (name: string, value: unknown): void => {
    this.bridge.setViewProp(this.handle, name, value);
  };

  /**
   * Sets multiple properties on the current view.
   * @param props - A record of property names to values
   */
  readonly setProps = (props: Record<string, unknown>): void => {
    this.bridge.setViewProps(this.handle, props);
  };

  /**
   * Sets style properties on the current view.
   * @param styles - A record of style properties to values
   */
  readonly setStyle = (styles: Record<string, unknown>): void => {
    this.bridge.setStyle(this.handle, styles);
  };

  /**
   * Moves a range of sibling views (from `startRef` to `endRef` inclusive)
   * before `targetRef`. All three refs must be children of the same parent.
   *
   * Used by `KeyedForEach` to reorder keyed items without recreating views.
   *
   * @param startRef - The context whose handle marks the start of the range.
   * @param endRef - The context whose handle marks the end of the range.
   * @param targetRef - The context before which the range will be inserted.
   */
  readonly moveRangeBefore = (
    startRef: BaseRenderContext,
    endRef: BaseRenderContext,
    targetRef: BaseRenderContext,
  ): void => {
    const start = (startRef as NativeContext).handle;
    const end = (endRef as NativeContext).handle;
    const target = (targetRef as NativeContext).handle;
    const parentHandle = this._isRef ? this._parentHandle! : this.handle;

    const children = this.bridge.getChildren(parentHandle);
    const startIdx = children.indexOf(start);
    const endIdx = children.indexOf(end);

    if (startIdx < 0 || endIdx < 0) return;

    // Move each handle in the range before target (in order preserves relative ordering)
    for (let i = startIdx; i <= endIdx; i++) {
      this.bridge.moveView(children[i], target);
    }
  };
}
