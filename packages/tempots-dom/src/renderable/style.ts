import type { Renderable } from '../types/domain'
import type { CSSStyles } from '../types/css-styles'
import { DOMContext } from '../dom/dom-context'
import { NValue, Signal } from '../std/signal'

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

export const style = new Proxy(
  {} as {
    [AN in keyof CSSStyles]: (value: NValue<string>) => Renderable
  },
  {
    get: (_, name: keyof CSSStyles) => {
      return (value: NValue<string>) => {
        if (Signal.is(value)) {
          return signalStyle(name, value as Signal<string>)
        } else {
          return staticStyle(name, value as string)
        }
      }
    },
  }
)
