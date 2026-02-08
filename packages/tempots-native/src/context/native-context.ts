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

  readonly clear = (removeTree: boolean): void => {
    if (removeTree) {
      this.bridge.removeView(this.handle);
    }
  };

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

  readonly makeChildText = (text: string): NativeContext => {
    const textHandle = this.bridge.createTextView(
      text,
      this._isRef ? this._parentHandle! : this.handle,
      this._isRef ? this.handle : undefined,
    );
    return new NativeContext(this.bridge, textHandle, this._providers);
  };

  readonly setText = (text: string): void => {
    this.bridge.setTextContent(this.handle, text);
  };

  readonly getText = (): string => {
    return this.bridge.getTextContent(this.handle);
  };

  // --- BaseRenderContext (providers) ---

  readonly getProvider = <T>(
    mark: ProviderMark<T>,
  ): { value: T; onUse?: () => void } => {
    const entry = this._providers[mark as ProviderMark<unknown>];
    if (entry == null) {
      throw new ProviderNotFoundError(mark);
    }
    return { value: entry[0] as T, onUse: entry[1] };
  };

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
   */
  readonly setProp = (name: string, value: unknown): void => {
    this.bridge.setViewProp(this.handle, name, value);
  };

  /**
   * Sets multiple properties on the current view.
   */
  readonly setProps = (props: Record<string, unknown>): void => {
    this.bridge.setViewProps(this.handle, props);
  };

  /**
   * Sets style properties on the current view.
   */
  readonly setStyle = (styles: Record<string, unknown>): void => {
    this.bridge.setStyle(this.handle, styles);
  };
}
