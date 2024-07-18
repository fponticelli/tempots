import type { HTMLAttributes } from '../types/html-attributes'
import type { MathMLTags } from '../types/mathml-tags'
import type { Renderable } from '../types/domain'
import type { AriaAttributes } from '../types/aria-attributes'
import { Signal, Value, type NValue } from '../std/signal'
import { makeGetter, makeSetter } from '../dom/attr'
import { DOMContext } from '../dom/dom-context'
import { SVGAttributes } from '../types/svg-attributes'
import { maybeAddAttributeTracker, maybeAddClassTracker } from '../dom/ssr'

const staticClassName =
  (value: string[]): Renderable =>
  (ctx: DOMContext) => {
    maybeAddClassTracker(ctx)
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
    maybeAddClassTracker(ctx)
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
  const setter = makeSetter(name)
  const getter = makeGetter(name)
  return (ctx: DOMContext) => {
    maybeAddAttributeTracker(ctx, name)
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
  const setter = makeSetter(name)
  const getter = makeGetter(name)
  return (ctx: DOMContext) => {
    maybeAddAttributeTracker(ctx, name)
    const original = getter(ctx.element)
    signal.on(v => setter(ctx.element, v))
    return (removeTree: boolean) => {
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
 * @remarks
 * @example
 * ```ts
 * const button = html.button(
 *   attr.type('button'),
 *   attr.disabled(disabled), // where disabled is a `Signal<boolean>`
 *   // ...
 * )
 * ```
 */
export const attr = new Proxy(
  {} as {
    [A in keyof HTMLAttributes]: (
      value: NValue<HTMLAttributes[A]>
    ) => Renderable
  },
  {
    get: (_, name: keyof HTMLAttributes) => {
      if (name === 'class') {
        return (value: NValue<HTMLAttributes[typeof name]>) => {
          if (Signal.is(value)) {
            return signalClassName(value as Signal<string>)
          } else {
            return staticClassName(
              ((value ?? '') as string).split(' ').filter(v => v.length > 0)
            )
          }
        }
      } else {
        return (value: NValue<HTMLAttributes[typeof name]>) => {
          if (Signal.is(value)) {
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

export const dataAttr = new Proxy(
  {} as {
    [A in string]: (value: Value<string>) => Renderable
  },
  {
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
 * @remarks
 * @example
 * ```ts
 * const button = html.button(
 *   aria.label('Click me!'),
 *   aria.pressed(pressed), // where pressed is a `Signal<boolean>`
 *   // ...
 * )
 * ```
 */
export const aria = new Proxy(
  {} as {
    [A in keyof AriaAttributes]: (
      value: NValue<AriaAttributes[A]>
    ) => Renderable
  },
  {
    get: (_, name: keyof AriaAttributes) => {
      return (value: NValue<AriaAttributes[typeof name]>) => {
        if (Signal.is(value)) {
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
 * Example
 * ```ts
 * const svg = html.svg(
 *  svgAttr.width(100),
 *  svgAttr.height(height), // where height is a `Signal<number>`
 * // ...
 * )
 */
export const svgAttr = new Proxy(
  {} as {
    [S in keyof SVGAttributes]: (value: NValue<SVGAttributes[S]>) => Renderable
  },
  {
    get: (_, name: keyof SVGAttributes) => {
      return (value: NValue<SVGAttributes[typeof name]>) => {
        if (Signal.is(value)) {
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
 * @remarks
 * @example
 * ```ts
 * const math = html.math(
 *  mathAttr.mathvariant('bold'),
 *  mathAttr.mathsize(size), // where size is a `Signal<number>`
 * // ...
 * )
 */
export const mathAttr = new Proxy(
  {} as {
    [M in keyof MathMLTags]: (value: NValue<MathMLTags[M]>) => Renderable
  },
  {
    get: (_, name: keyof MathMLTags) => {
      return (value: NValue<MathMLTags[typeof name]>) => {
        if (Signal.is(value)) {
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
