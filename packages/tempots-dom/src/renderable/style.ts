import type { NValue, Renderable } from '../types/domain'
import type { CSSStyles } from '../types/css-styles'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '@tempots/core'
import { Value } from '@tempots/core'
import { Merge } from './ensure'
import { domRenderable } from '../types/domain'

const staticStyle = (
  name: keyof CSSStyles | `--${string}`,
  value: string
): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    const original = ctx.getStyle(name as string)
    ctx.setStyle(name as string, value)
    return (removeTree: boolean) => {
      if (removeTree) {
        ctx.setStyle(name as string, original)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}

const signalStyle = (
  name: keyof CSSStyles | `--${string}`,
  signal: Signal<string>
): Renderable => {
  const r = domRenderable((ctx: DOMContext) => {
    const original = ctx.getStyle(name as string)
    const dispose = signal.on(v => ctx.setStyle(name as string, v))
    return (removeTree: boolean) => {
      dispose()
      if (removeTree) {
        ctx.setStyle(name as string, original)
      }
    }
  }) as Renderable & Record<string, unknown>
  r.kind = 'dynamic-attr'
  return r
}

/**
 * Helper function to create a style renderable from a value that could be static or a Signal.
 * Checks if the value is a Signal and delegates to the appropriate renderable creator.
 */
const createStyleRenderable = (
  name: keyof CSSStyles | `--${string}`,
  value: unknown
): Renderable => {
  if (Signal.is(value as Value<unknown>)) {
    return signalStyle(name, value as Signal<string>)
  } else {
    return staticStyle(name, value as string)
  }
}

export type StyleOptions = Merge<
  {
    [AN in keyof CSSStyles]: (value: NValue<string>) => Renderable
  },
  {
    variable: (name: `--${string}`, value: NValue<string>) => Renderable
  }
>

/**
 * A collection of functions to create style renderables.
 * @public
 */
export const style = new Proxy({} as StyleOptions, {
  /**
   * Creates a renderable component for the specified `style` property.
   *
   * @param _ - The target object.
   * @param name - The name of the CSS style property.
   * @returns The renderable component for the specified attribute.
   *
   */
  get: (_, name: keyof StyleOptions) => {
    if (name === 'variable') {
      return (name: `--${string}`, value: NValue<string>) =>
        createStyleRenderable(name, value)
    }
    return (value: NValue<string>) => createStyleRenderable(name, value)
  },
})
