import {
  DOMContext,
  Signal,
  prop,
  TNode,
  Size,
  renderableOfTNode,
  WithBrowserCtx,
  BrowserContext,
  getWindow,
  OnDispose,
} from '@tempots/dom'
import { nearEqual } from '@tempots/std'

/**
 * Represents a rectangle with position and dimensions.
 *
 * A Rect defines a rectangular area in 2D space with a position (left, top)
 * and dimensions (width, height). It provides convenient methods for accessing
 * computed properties like right, bottom, center, and size.
 *
 * @example
 * ```typescript
 * // Create a rectangle using the constructor
 * const rect1 = new Rect(10, 20, 100, 50);
 *
 * // Create a rectangle using the static factory method
 * const rect2 = Rect.of({ left: 10, top: 20, width: 100, height: 50 });
 *
 * // Access computed properties
 * console.log(rect1.right);   // 110 (left + width)
 * console.log(rect1.bottom);  // 70 (top + height)
 * console.log(rect1.center);  // { x: 60, y: 45 }
 *
 * // Compare rectangles
 * const areEqual = rect1.equals(rect2); // true
 * ```
 *
 * @public
 */
export class Rect {
  /**
   * Creates a new Rect instance using an object with optional properties.
   *
   * This factory method provides a convenient way to create rectangles with
   * default values for any unspecified properties.
   *
   * @param options - Object containing rectangle properties
   * @param options.left - The x-coordinate of the left edge (default: 0)
   * @param options.top - The y-coordinate of the top edge (default: 0)
   * @param options.width - The width of the rectangle (default: 0)
   * @param options.height - The height of the rectangle (default: 0)
   * @returns A new Rect instance
   *
   * @example
   * ```typescript
   * // Create a rectangle at origin with no size
   * const emptyRect = Rect.of({});
   *
   * // Create a rectangle with only position
   * const positioned = Rect.of({ left: 10, top: 20 });
   *
   * // Create a rectangle with all properties
   * const fullRect = Rect.of({ left: 10, top: 20, width: 100, height: 50 });
   * ```
   */
  static of({
    left = 0,
    top = 0,
    width = 0,
    height = 0,
  }: {
    left?: number
    top?: number
    width?: number
    height?: number
  }): Rect {
    return new Rect(left, top, width, height)
  }

  /**
   * Creates a new Rect instance.
   *
   * @param left - The x-coordinate of the left edge
   * @param top - The y-coordinate of the top edge
   * @param width - The width of the rectangle
   * @param height - The height of the rectangle
   *
   * @example
   * ```typescript
   * const rect = new Rect(10, 20, 100, 50);
   * console.log(rect.left);   // 10
   * console.log(rect.top);    // 20
   * console.log(rect.width);  // 100
   * console.log(rect.height); // 50
   * ```
   */
  constructor(
    /** The x-coordinate of the left edge of the rectangle */
    readonly left: number,
    /** The y-coordinate of the top edge of the rectangle */
    readonly top: number,
    /** The width of the rectangle */
    readonly width: number,
    /** The height of the rectangle */
    readonly height: number
  ) {}

  /**
   * Gets the x-coordinate of the right edge of the rectangle.
   *
   * @returns The right edge position (left + width)
   *
   * @example
   * ```typescript
   * const rect = new Rect(10, 20, 100, 50);
   * console.log(rect.right); // 110
   * ```
   */
  get right() {
    return this.left + this.width
  }

  /**
   * Gets the y-coordinate of the bottom edge of the rectangle.
   *
   * @returns The bottom edge position (top + height)
   *
   * @example
   * ```typescript
   * const rect = new Rect(10, 20, 100, 50);
   * console.log(rect.bottom); // 70
   * ```
   */
  get bottom() {
    return this.top + this.height
  }

  /**
   * Gets the center point of the rectangle.
   *
   * @returns An object with x and y coordinates of the center point
   *
   * @example
   * ```typescript
   * const rect = new Rect(10, 20, 100, 50);
   * const center = rect.center;
   * console.log(center.x); // 60 (left + width/2)
   * console.log(center.y); // 45 (top + height/2)
   * ```
   */
  get center() {
    return {
      x: this.left + this.width / 2,
      y: this.top + this.height / 2,
    }
  }

  /**
   * Gets the size dimensions of the rectangle.
   *
   * @returns An object containing width and height properties
   *
   * @example
   * ```typescript
   * const rect = new Rect(10, 20, 100, 50);
   * const size = rect.size;
   * console.log(size.width);  // 100
   * console.log(size.height); // 50
   * ```
   */
  get size() {
    return { width: this.width, height: this.height }
  }

  /**
   * Compares this rectangle with another rectangle for equality.
   *
   * Uses near-equality comparison for floating-point precision tolerance.
   * Two rectangles are considered equal if all their corresponding properties
   * (left, top, width, height) are nearly equal within a small tolerance.
   *
   * @param other - The rectangle to compare with
   * @returns True if the rectangles are equal, false otherwise
   *
   * @example
   * ```typescript
   * const rect1 = new Rect(10, 20, 100, 50);
   * const rect2 = new Rect(10, 20, 100, 50);
   * const rect3 = new Rect(10.00000001, 20, 100, 50); // Very close values
   *
   * console.log(rect1.equals(rect2)); // true
   * console.log(rect1.equals(rect3)); // true (within tolerance)
   * ```
   */
  readonly equals = (other: Rect) => {
    return (
      nearEqual(this.left, other.left) &&
      nearEqual(this.top, other.top) &&
      nearEqual(this.width, other.width) &&
      nearEqual(this.height, other.height)
    )
  }
}

/**
 * Gets the absolute rectangle of an element relative to the document.
 *
 * This function calculates the element's position relative to the entire document
 * (including scroll offset), rather than just the viewport. It combines the element's
 * bounding client rectangle with the current scroll position to provide absolute
 * coordinates.
 *
 * @param el - The DOM element to get the absolute rectangle for
 * @returns A Rect instance representing the element's absolute position and size
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const absoluteRect = getAbsoluteRect(element);
 *
 * console.log(absoluteRect.left);   // Absolute x position in document
 * console.log(absoluteRect.top);    // Absolute y position in document
 * console.log(absoluteRect.width);  // Element width
 * console.log(absoluteRect.height); // Element height
 * ```
 *
 * @public
 */
export function getAbsoluteRect(el: Element) {
  const rect = el.getBoundingClientRect()
  return Rect.of({
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  })
}

/**
 * Creates a renderable function that monitors the size of an element and provides it as a signal.
 *
 * @param fn - The renderable function that receives the size signal and returns a TNode.
 * @returns A function that takes a DOMContext and returns a renderable function.
 * @public
 */
export const ElementRect = (fn: (rect: Signal<Rect>) => TNode) =>
  WithBrowserCtx((ctx: BrowserContext) => {
    const { element } = ctx
    const rect = prop(getAbsoluteRect(element))
    const clear = renderableOfTNode(fn(rect))(ctx)
    const onResize = () => {
      rect.set(Rect.of(getAbsoluteRect(element)))
    }
    let observer: ResizeObserver
    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(onResize)
      observer.observe(element)
    }
    return OnDispose((removeTree: boolean) => {
      observer?.disconnect()
      clear(removeTree)
    })
  })

/**
 * Creates a renderable function that monitors the size of an element and provides it as a signal.
 *
 * @param fn - The renderable function that receives the size signal and returns a TNode.
 * @returns A function that takes a DOMContext and returns a renderable function.
 * @deprecated use ElementRect instead
 * @public
 */
export const ElementSize = (fn: (size: Signal<Rect>) => TNode) =>
  ElementRect(fn)

/**
 * Creates a renderable function that monitors the window size and invokes the provided function with the current size.
 * @param fn - The function to be invoked with the current window size.
 * @returns A renderable function that monitors the window size.
 * @public
 */
export const WindowSize =
  (fn: (size: Signal<Size>) => TNode) => (ctx: DOMContext) => {
    const win = getWindow()
    const size = prop({
      width: win?.innerWidth ?? 0,
      height: win?.innerHeight ?? 0,
    })
    const clear = renderableOfTNode(fn(size))(ctx)
    const onResize = () => {
      size.set({
        width: win?.innerWidth ?? 0,
        height: win?.innerHeight ?? 0,
      })
    }
    win?.addEventListener('resize', onResize)
    return (removeTree: boolean) => {
      win?.removeEventListener('resize', onResize)
      clear(removeTree)
    }
  }
