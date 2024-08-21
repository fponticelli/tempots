import type { NValue, Renderable } from '../types/domain'
import type { CSSStyles } from '../types/css-styles'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '../std/signal'
import { Value } from '../std/value'

const staticStyle =
  (name: keyof CSSStyles, value: string) => (ctx: DOMContext) => {
    const element = ctx.element as HTMLElement
    const original = element.style.getPropertyValue(name as string)
    element.style.setProperty(name as string, value)
    return (removeTree: boolean) => {
      if (removeTree) {
        element.style.setProperty(name as string, original)
      }
    }
  }

const signalStyle =
  (name: keyof CSSStyles, signal: Signal<string>) => (ctx: DOMContext) => {
    const element = ctx.element as HTMLElement
    const original = element.style.getPropertyValue(name as string)
    signal.on(v => element.style.setProperty(name as string, v))
    return (removeTree: boolean) => {
      if (removeTree) {
        element.style.setProperty(name as string, original)
      }
    }
  }

/**
 * A collection of functions to create style renderables.
 * @public
 */
export const style = new Proxy(
  {} as {
    [AN in keyof CSSStyles]: (value: NValue<string>) => Renderable
  },
  {
    /**
     * Creates a renderable component for the specified `style` property.
     *
     * @param _ - The target object.
     * @param name - The name of the CSS style property.
     * @returns The renderable component for the specified attribute.
     *
     */
    get: (_, name: keyof CSSStyles) => {
      return (value: NValue<string>) => {
        if (Signal.is(value as Value<string>)) {
          return signalStyle(name, value as Signal<string>)
        } else {
          return staticStyle(name, value as string)
        }
      }
    },
  }
)
