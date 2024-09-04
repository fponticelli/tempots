import type { HTMLAttributes } from '../types/html-attributes'
import type { MathMLTags } from '../types/mathml-tags'
import type { NValue, Renderable } from '../types/domain'
import type { AriaAttributes } from '../types/aria-attributes'
import { Signal } from '../std/signal'
import { _makeGetter, _makeSetter } from '../dom/attr'
import { DOMContext } from '../dom/dom-context'
import { SVGAttributes } from '../types/svg-attributes'
import { _maybeAddAttributeTracker, _maybeAddClassTracker } from '../dom/ssr'
import { Value } from '../std/value'

const staticClassName =
  (value: string[]): Renderable =>
  (ctx: DOMContext) => {
    _maybeAddClassTracker(ctx)
    ctx.element.classList.add(...value)
    return (removeTree: boolean) => {
      if (removeTree) {
        ctx.element.classList.remove(...value)
      }
    }
  }

const signalClassName =
  (signal: Signal<string>): Renderable =>
  (ctx: DOMContext) => {
    _maybeAddClassTracker(ctx)
    const element = ctx.element
    let previous: string[] = []
    const clear = signal.on(v => {
      previous.forEach(p => element.classList.remove(p))
      previous = (v ?? '').split(' ').filter(v => v.length > 0)
      element.classList.add(...previous)
    })
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        previous.forEach(p => element.classList.remove(p))
      }
      previous.length = 0
    }
  }

const staticAttributeRenderable = <T>(name: string, value: T) => {
  const setter = _makeSetter(name)
  const getter = _makeGetter(name)
  return (ctx: DOMContext) => {
    _maybeAddAttributeTracker(ctx, name)
    const original = getter(ctx.element)
    setter(ctx.element, value)
    return (removeTree: boolean) => {
      if (removeTree) {
        setter(ctx.element, original)
      }
    }
  }
}

const signalAttributeRenderable = <T>(name: string, signal: Signal<T>) => {
  const setter = _makeSetter(name)
  const getter = _makeGetter(name)
  return (ctx: DOMContext) => {
    _maybeAddAttributeTracker(ctx, name)
    const original = getter(ctx.element)
    const clear = signal.on(v => setter(ctx.element, v))
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        setter(ctx.element, original)
      }
    }
  }
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
      value: NValue<HTMLAttributes[A]>
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
    get: (_, name: keyof HTMLAttributes) => {
      if (name === 'class') {
        return (value: NValue<HTMLAttributes[typeof name]>) => {
          if (Signal.is(value as Value<string>)) {
            return signalClassName(value as Signal<string>)
          } else {
            return staticClassName(
              ((value ?? '') as string).split(' ').filter(v => v.length > 0)
            )
          }
        }
      } else {
        return (value: NValue<HTMLAttributes[typeof name]>) => {
          if (Signal.is(value as Value<HTMLAttributes[typeof name]>)) {
            return signalAttributeRenderable(
              name,
              value as Signal<HTMLAttributes[typeof name]>
            )
          } else {
            return staticAttributeRenderable(
              name,
              value as HTMLAttributes[typeof name]
            )
          }
        }
      }
    },
  }
)

/**
 * The `data` object allows to create any `data-` attributes. Either a literal value
 * or `Signal<string>` can be passed as a value.
 *
 * @example
 * ```ts
 * const button = html.button(
 *   dataAttr.myinfo('something'), // maps to the `data-myinfo` attribute
 * )
 * ```
 * @public
 */
export const dataAttr = new Proxy(
  {} as {
    [A in string]: (value: Value<string>) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `data-?` attribute.
     *
     * @param _ - The target object.
     * @param name - The name of the data attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get: (_, name: string) => {
      return (value: Value<string>) => {
        if (Signal.is(value)) {
          return signalAttributeRenderable(
            `data-${name}`,
            value as Signal<string>
          )
        } else {
          return staticAttributeRenderable(`data-${name}`, value as string)
        }
      }
    },
  }
)

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
      value: NValue<AriaAttributes[A]>
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
    get: (_, name: keyof AriaAttributes) => {
      return (value: NValue<AriaAttributes[typeof name]>) => {
        if (Signal.is(value as Value<AriaAttributes[typeof name]>)) {
          return signalAttributeRenderable(
            `aria-${name}`,
            value as Signal<AriaAttributes[typeof name]>
          )
        } else {
          return staticAttributeRenderable(
            `aria-${name}`,
            value as AriaAttributes[typeof name]
          )
        }
      }
    },
  }
)

const dashedName = (name: string) =>
  name.replace(/([A-Z])/g, '-$1').toLowerCase()

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
    [S in keyof SVGAttributes]: (value: NValue<SVGAttributes[S]>) => Renderable
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
    get: (_, name: keyof SVGAttributes) => {
      return (value: NValue<SVGAttributes[typeof name]>) => {
        const dasherized = dashedName(name)
        if (Signal.is(value as Value<SVGAttributes[typeof name]>)) {
          return signalAttributeRenderable(
            dasherized,
            value as Signal<SVGAttributes[typeof name]>
          )
        } else {
          return staticAttributeRenderable(
            dasherized,
            value as SVGAttributes[typeof name]
          )
        }
      }
    },
  }
)

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
    [M in keyof MathMLTags]: (value: NValue<MathMLTags[M]>) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `math` attribute.
     *
     * @param name - The name of the Math attribute.
     * @returns The renderable component for the specified attribute.
     *
     */
    get: (_, name: keyof MathMLTags) => {
      return (value: NValue<MathMLTags[typeof name]>) => {
        if (Signal.is(value as Value<MathMLTags[typeof name]>)) {
          return signalAttributeRenderable(
            name,
            value as Signal<MathMLTags[typeof name]>
          )
        } else {
          return staticAttributeRenderable(
            name,
            value as MathMLTags[typeof name]
          )
        }
      }
    },
  }
)
