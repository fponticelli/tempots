import type { HTMLAttributes } from '../types/html-attributes'
import type { Renderable, SplitNValue } from '../types/domain'
import type { AriaAttributes } from '../types/aria-attributes'
import { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { SVGAttributes } from '../types/svg-attributes'
import { Value } from '../std/value'
import { MathMLAttributes } from '../types/mathml-attributes'

const staticClassName =
  (value: string[]): Renderable =>
  (ctx: DOMContext) => {
    ctx.addClasses(value)
    return (removeTree: boolean) => {
      if (removeTree) {
        ctx.removeClasses(value)
      }
    }
  }

const signalClassName =
  (signal: Signal<string>): Renderable =>
  (ctx: DOMContext) => {
    let previous: string[] = []
    const clear = signal.on(v => {
      ctx.removeClasses(previous)
      previous = (v ?? '').split(' ').filter(v => v.length > 0)
      ctx.addClasses(previous)
    })
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        ctx.removeClasses(previous)
      }
      previous.length = 0
    }
  }

const staticAttributeRenderable = <T>(name: string, value: T) => {
  return (ctx: DOMContext) => {
    const { get, set } = ctx.makeAccessors(name)
    const original = get()
    set(value)
    return (removeTree: boolean) => {
      if (removeTree) {
        set(original)
      }
    }
  }
}

const signalAttributeRenderable = <T>(name: string, signal: Signal<T>) => {
  return (ctx: DOMContext) => {
    const { get, set } = ctx.makeAccessors(name)
    const original = get()
    const clear = signal.on(set)
    return (removeTree: boolean) => {
      clear()
      if (removeTree) {
        set(original)
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
      value: SplitNValue<HTMLAttributes[A]>
    ) => Renderable
  } & {
    set: (name: string, value: SplitNValue<string>) => Renderable
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
    get: (_, name: keyof HTMLAttributes | 'set') => {
      if (name === 'class') {
        return (value: SplitNValue<HTMLAttributes[typeof name]>) => {
          if (Signal.is(value as Value<string>)) {
            return signalClassName(value as Signal<string>)
          } else {
            return staticClassName(
              /* c8 ignore next */
              ((value ?? '') as string).split(' ').filter(v => v.length > 0)
            )
          }
        }
      } else if (name === 'set') {
        return (name: string, value: SplitNValue<string>) => {
          if (Signal.is(value as Value<string>)) {
            return signalAttributeRenderable(name, value as Signal<string>)
          } else {
            return staticAttributeRenderable(name, value as string)
          }
        }
      } else {
        return (value: SplitNValue<HTMLAttributes[typeof name]>) => {
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
  } & {
    set: (name: string, value: Value<string>) => Renderable
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
      if (name === 'set') {
        return (name: string, value: Value<string>) => {
          if (Signal.is(value)) {
            return signalAttributeRenderable(
              `data-${name}`,
              value as Signal<string>
            )
          } else {
            return staticAttributeRenderable(`data-${name}`, value as string)
          }
        }
      }
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
      value: SplitNValue<AriaAttributes[A]>
    ) => Renderable
  } & {
    set: (name: string, value: Value<string>) => Renderable
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
    get: (_, name: keyof AriaAttributes | 'set') => {
      if (name === 'set') {
        return (name: string, value: Value<string>) => {
          if (Signal.is(value)) {
            return signalAttributeRenderable(
              `aria-${name}`,
              value as Signal<string>
            )
          } else {
            return staticAttributeRenderable(`aria-${name}`, value as string)
          }
        }
      }
      return (value: SplitNValue<AriaAttributes[typeof name]>) => {
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
  } & {
    set: (name: string, value: Value<string>) => Renderable
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
    get: (_, name: keyof SVGAttributes | 'set') => {
      if (name === 'set') {
        return (name: string, value: Value<string>) => {
          if (Signal.is(value)) {
            return signalAttributeRenderable(name, value as Signal<string>)
          } else {
            return staticAttributeRenderable(name, value as string)
          }
        }
      }
      return (value: SplitNValue<SVGAttributes[typeof name]>) => {
        if (Signal.is(value as Value<SVGAttributes[typeof name]>)) {
          return signalAttributeRenderable(
            name,
            value as Signal<SVGAttributes[typeof name]>
          )
        } else {
          return staticAttributeRenderable(
            name,
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
    get: (_, name: keyof MathMLAttributes) => {
      return (value: SplitNValue<MathMLAttributes[typeof name]>) => {
        if (Signal.is(value as Value<MathMLAttributes[typeof name]>)) {
          return signalAttributeRenderable(
            name,
            value as Signal<MathMLAttributes[typeof name]>
          )
        } else {
          return staticAttributeRenderable(
            name,
            value as MathMLAttributes[typeof name]
          )
        }
      }
    },
  }
)
