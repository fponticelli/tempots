/**
 * Opaque handle to a native view.
 * @public
 */
export type NativeViewHandle = number;

/**
 * TypeScript interface for the C++/ObjC/Kotlin JSI bridge.
 *
 * The native side exposes these functions via JSI so they can be
 * called synchronously from JavaScript. The actual implementation
 * lives in a separate native project.
 *
 * @public
 */
export interface JSIBridge {
  /** Create a native view of the given type under a parent. */
  createView(
    type: string,
    parent: NativeViewHandle,
    before?: NativeViewHandle,
  ): NativeViewHandle;

  /** Create a text view with initial content under a parent. */
  createTextView(
    text: string,
    parent: NativeViewHandle,
    before?: NativeViewHandle,
  ): NativeViewHandle;

  /** Remove a view from its parent and destroy it. */
  removeView(handle: NativeViewHandle): void;

  /** Move a view to a new position under the same parent, before the given sibling. */
  moveView(handle: NativeViewHandle, before: NativeViewHandle): void;

  /** Get the child view handles of a parent view, in order. */
  getChildren(parent: NativeViewHandle): NativeViewHandle[];

  /** Set a single property on a view. */
  setViewProp(handle: NativeViewHandle, name: string, value: unknown): void;

  /** Set multiple properties on a view at once. */
  setViewProps(handle: NativeViewHandle, props: Record<string, unknown>): void;

  /** Update the text content of a text view. */
  setTextContent(handle: NativeViewHandle, text: string): void;

  /** Read the text content of a text view. */
  getTextContent(handle: NativeViewHandle): string;

  /** Set style properties on a view. */
  setStyle(handle: NativeViewHandle, styles: Record<string, unknown>): void;

  /** Add an event listener to a view. Returns a cleanup function. */
  addEventListener(
    handle: NativeViewHandle,
    event: string,
    handler: (e: unknown) => void,
  ): () => void;

  /** Measure a view's layout. */
  measure(
    handle: NativeViewHandle,
  ): Promise<{ x: number; y: number; width: number; height: number }>;

  /** Schedule a callback on the next frame. */
  requestAnimationFrame(callback: () => void): number;

  /** Cancel a scheduled animation frame callback. */
  cancelAnimationFrame(id: number): void;
}
