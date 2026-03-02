import type { HTMLAttributes } from '../types/html-attributes'
import type { Renderable, SplitNValue } from '../types/domain'
import type { AriaAttributes } from '../types/aria-attributes'
import { Signal, createSelector } from '@tempots/core'
import { DOMContext } from '../dom/dom-context'
import { SVGAttributes } from '../types/svg-attributes'
import { Value } from '@tempots/core'
import { MathMLAttributes } from '../types/mathml-attributes'
import { domRenderable } from '../types/domain'

// Cache for selectedClass tokens — avoids re-splitting the same activeClass string per row
const _tokensCache = new Map<string, string[]>()
function _getTokens(activeClass: string): string[] {
  let tokens = _tokensCache.get(activeClass)
  if (tokens === undefined) {
    tokens = activeClass.split(' ').filter(s => s.length > 0)
    _tokensCache.set(activeClass, tokens)
  }
  return tokens
}

const staticClassName = (value: string[]): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    ctx.addClasses(value)
    return (removeTree: boolean) => {
      if (removeTree) {
        ctx.removeClasses(value)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'static-attr'
  r.name = 'class'
  r.value = value.join(' ')
  return r
}

const signalClassName = (signal: Signal<string>): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    let previous: string[] = []
    // Use noAutoDispose because we're explicitly managing the lifecycle in the returned clear function
    const clear = signal.on(
      v => {
        const next = (v ?? '').split(' ').filter(v => v.length > 0)
        // classList.add/remove are idempotent, so no need for Set-based diffing
        if (previous.length > 0) ctx.removeClasses(previous)
        if (next.length > 0) ctx.addClasses(next)
        previous = next
      },
      { noAutoDispose: true }
    )
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        ctx.removeClasses(previous)
      }
      previous = []
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}

const staticAttributeRenderable = <T>(name: string, value: T): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    const { get, set } = ctx.makeAccessors(name)
    const original = get()
    set(value)
    return (removeTree: boolean) => {
      if (removeTree) {
        set(original)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'static-attr'
  r.name = name
  r.value = String(value)
  return r
}

const signalAttributeRenderable = <T>(
  name: string,
  signal: Signal<T>
): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    const { get, set } = ctx.makeAccessors(name)
    const original = get()
    // Use noAutoDispose because we're explicitly managing the lifecycle in the returned clear function
    const clear = signal.on(set, { noAutoDispose: true })
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        set(original)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}

/**
 * Helper function to create an attribute renderable from a value that could be static or a Signal.
 * Checks if the value is a Signal and delegates to the appropriate renderable creator.
 */
const createAttributeRenderable = (
  name: string,
  value: unknown
): Renderable => {
  if (Signal.is(value as Value<unknown>)) {
    return signalAttributeRenderable(name, value as Signal<unknown>)
  } else {
    return staticAttributeRenderable(name, value)
  }
}

/**
 * Creates a renderable for an HTML attribute with the specified name and value.
 *
 * This is the functional equivalent of using `attr[name](value)` with a dynamic attribute name.
 *
 * The `class` attribute is special and can be used multiple times on the same element.
 * Multiple class values will be merged together.
 *
 * @param name - The name of the attribute.
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the attribute.
 * @example
 * ```ts
 * const button = html.button(
 *   Attr('type', 'button'),
 *   Attr('disabled', disabledSignal),
 *   // Multiple class attributes
 *   Attr('class', 'btn btn-primary'),
 *   Attr('class', 'active'),  // Both classes will be applied
 *   // ...
 * )
 * ```
 * @public
 */
export const Attr = (name: string, value: unknown): Renderable => {
  // Special handling for class attribute
  if (name === 'class') {
    if (Signal.is(value as Value<string>)) {
      return signalClassName(value as Signal<string>)
    } else {
      return staticClassName(
        /* c8 ignore next */
        ((value ?? '') as string).split(' ').filter(v => v.length > 0)
      )
    }
  }
  return createAttributeRenderable(name, value)
}

/**
 * The `attr` object allows to create any HTML attribute. Either a literal value
 * or `Signal<?>` can be passed as a value. The type of the value is inferred
 * from the attribute name.
 *
 * @example
 * ```ts
 * const button = html.button(
 *   attr.type('button'),
 *   attr.disabled(disabled), // where disabled is a `Signal<boolean>`
 *   // ...
 * )
 * ```
 * @public
 */
export const attr = new Proxy(
  {} as {
    [A in keyof HTMLAttributes]: (
      value: SplitNValue<HTMLAttributes[A]>
    ) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified attribute.
     *
     * Generally using multiple attributes with the same name is not recommended.
     * `class` is the exception and can be used multiple times.
     *
     * @param _ - The target object.
     * @param name - The name of the attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get:
      (_, name: keyof HTMLAttributes) =>
      (value: SplitNValue<HTMLAttributes[typeof name]>) =>
        Attr(name, value),
  }
)

/**
 * Creates a renderable for a data attribute with the specified name and value.
 *
 * This is an alias for `dataAttr(name, value)` that accepts `unknown` values.
 *
 * @param name - The name of the data attribute (without the 'data-' prefix).
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the data attribute.
 * @example
 * ```ts
 * const button = html.button(
 *   DataAttr('myinfo', 'something'), // maps to the `data-myinfo` attribute
 * )
 * ```
 * @public
 */
export const DataAttr = (name: string, value: unknown): Renderable =>
  createAttributeRenderable(`data-${name}`, value)

/**
 * Creates a renderable for a `data-` attribute with the specified name and value.
 *
 * @param name - The name of the data attribute (without the 'data-' prefix).
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the data attribute.
 * @example
 * ```ts
 * const button = html.button(
 *   dataAttr('myinfo', 'something'), // maps to the `data-myinfo` attribute
 * )
 * ```
 * @public
 */
export const dataAttr = (name: string, value: Value<string>): Renderable =>
  DataAttr(name, value)

/**
 * Creates a renderable for an ARIA attribute with the specified name and value.
 *
 * This is the functional equivalent of using `aria[name](value)` with a dynamic attribute name.
 *
 * @param name - The name of the ARIA attribute (without the 'aria-' prefix).
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the ARIA attribute.
 * @example
 * ```ts
 * const button = html.button(
 *   Aria('label', 'Click me!'), // maps to the `aria-label` attribute
 *   Aria('pressed', pressedSignal), // maps to the `aria-pressed` attribute
 * )
 * ```
 * @public
 */
export const Aria = (name: string, value: unknown): Renderable =>
  createAttributeRenderable(`aria-${name}`, value)

/**
 * An object that provides a convenient way to create mountable attributes for ARIA properties.
 *
 * The type of the value is inferred from the attribute name.
 *
 * @example
 * ```ts
 * const button = html.button(
 *   aria.label('Click me!'), // maps to the `aria-label` attribute
 *   // maps to the `aria-pressed` attribute where pressed is a `Signal<boolean>`
 *   aria.pressed(pressed)
 * )
 * ```
 * @public
 */
export const aria = new Proxy(
  {} as {
    [A in keyof AriaAttributes]: (
      value: SplitNValue<AriaAttributes[A]>
    ) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `aria-?` attribute.
     *
     * @param _ - The target object.
     * @param name - The name of the aria attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get:
      (_, name: keyof AriaAttributes) =>
      (value: SplitNValue<AriaAttributes[typeof name]>) =>
        Aria(name, value),
  }
)

/**
 * Creates a renderable for an SVG attribute with the specified name and value.
 *
 * This is the functional equivalent of using `svgAttr[name](value)` with a dynamic attribute name.
 *
 * @param name - The name of the SVG attribute.
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the SVG attribute.
 * @example
 * ```ts
 * const circle = svg.circle(
 *   SVGAttr('cx', 50),
 *   SVGAttr('cy', 50),
 *   SVGAttr('r', radiusSignal),
 * )
 * ```
 * @public
 */
export const SVGAttr = (name: string, value: unknown): Renderable =>
  createAttributeRenderable(name, value)

/**
 * An object that provides a convenient way to create mountable attributes for
 * SVG elements.
 *
 * @example
 * ```ts
 * const svg = html.svg(
 *  svgAttr.width(100),
 *  svgAttr.height(height), // where height is a `Signal<number>`
 * // ...
 * )
 * ```
 * @public
 */
export const svgAttr = new Proxy(
  {} as {
    [S in keyof SVGAttributes]: (
      value: SplitNValue<SVGAttributes[S]>
    ) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `svg` attribute.
     *
     * @param _ - The target object.
     * @param name - The name of the SVG attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get:
      (_, name: keyof SVGAttributes) =>
      (value: SplitNValue<SVGAttributes[typeof name]>) =>
        SVGAttr(name, value),
  }
)

/**
 * Creates a renderable for a MathML attribute with the specified name and value.
 *
 * This is the functional equivalent of using `mathAttr[name](value)`.
 *
 * @param name - The name of the MathML attribute.
 * @param value - The value of the attribute (can be a literal or Signal).
 * @returns A renderable that sets the MathML attribute.
 * @example
 * ```ts
 * const mi = math.mi(
 *   MathAttr('mathvariant', 'bold'),
 *   MathAttr('mathsize', sizeSignal),
 * )
 * ```
 * @public
 */
export const MathAttr = (name: string, value: unknown): Renderable =>
  createAttributeRenderable(name, value)

/**
 * An object that provides attribute functions for MathML tags.
 *
 * @example
 * ```ts
 * const math = html.math(
 *  mathAttr.mathvariant('bold'),
 *  mathAttr.mathsize(size), // where size is a `Signal<number>`
 * // ...
 * )
 * ```
 * @public
 */
export const mathAttr = new Proxy(
  {} as {
    [M in keyof MathMLAttributes]: (
      value: SplitNValue<MathMLAttributes[M]>
    ) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `math` attribute.
     *
     * @param name - The name of the Math attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get:
      (_, name: keyof MathMLAttributes) =>
      (value: SplitNValue<MathMLAttributes[typeof name]>) =>
        MathAttr(name, value),
  }
)

const _selectorCache = new WeakMap<
  Signal<unknown>,
  (key: unknown) => Signal<boolean>
>()

function _getOrCreateSelector<T>(
  source: Signal<T>,
  equals?: (a: T, b: T) => boolean
): (key: T) => Signal<boolean> {
  let selector = _selectorCache.get(source as Signal<unknown>) as
    | ((key: T) => Signal<boolean>)
    | undefined
  if (!selector) {
    selector = createSelector(source, equals)
    _selectorCache.set(
      source as Signal<unknown>,
      selector as (key: unknown) => Signal<boolean>
    )
  }
  return selector
}

/**
 * Creates a renderable that toggles a CSS class based on O(1) selection matching.
 *
 * Instead of creating a `computed` per row that re-evaluates when the source changes
 * (O(n) for n rows), this uses `createSelector` from `@tempots/core` to only update
 * the two rows that actually change (the previously selected and newly selected).
 *
 * A shared selector is automatically created per source signal and cached via WeakMap.
 *
 * @param source - The signal containing the currently selected value.
 * @param key - The static key to compare against (e.g., the row's ID).
 * @param activeClass - The CSS class(es) to toggle (space-separated). Defaults to `'danger'`.
 * @param equals - Optional equality function. Defaults to `===`.
 * @returns A renderable that adds/removes the class based on selection state.
 *
 * @example
 * ```ts
 * const selected = prop(0)
 * html.tr(
 *   selectedClass(selected, item.id, 'danger'),
 *   // ...
 * )
 * ```
 * @public
 */
export const selectedClass = <T>(
  source: Signal<T>,
  key: T,
  activeClass: string = 'danger',
  equals?: (a: T, b: T) => boolean
): Renderable => {
  const tokens = _getTokens(activeClass)
  const r = domRenderable((ctx: DOMContext) => {
    const isSelected = _getOrCreateSelector(source, equals)
    const selectedSignal = isSelected(key)

    const clear = selectedSignal.on(
      selected => {
        if (selected) ctx.addClasses(tokens)
        else ctx.removeClasses(tokens)
      },
      { noAutoDispose: true }
    )

    return (removeTree: boolean) => {
      clear()
      if (removeTree) ctx.removeClasses(tokens)
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}
