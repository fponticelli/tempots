import type { Renderable } from '../types/domain'
import type { HTMLEvents } from '../types/html-events'
import { DOMContext } from '../dom/dom-context'

const handler =
  <T extends Event>(name: string, handler: (event: T) => void): Renderable =>
  (ctx: DOMContext) => {
    ctx.element.addEventListener(name, handler as (e: Event) => void)
    return (removeTree: boolean) => {
      if (removeTree) {
        ctx.element.removeEventListener(name, handler as (e: Event) => void)
      }
    }
  }

export const OnChecked = (fn: (event: boolean) => void) =>
  handler('click', (e: Event) => {
    e.preventDefault()
    const input = e.target as HTMLInputElement
    setTimeout(() => {
      const value = input.ownerDocument != null ? input?.checked : undefined
      if (value != null) {
        fn(!value)
      }
    }, 0)
  })

export const on = new Proxy(
  {} as {
    [EN in keyof HTMLEvents]: (
      handler: (event: HTMLEvents[EN]) => void
    ) => Renderable
  },
  {
    get: (_, name: keyof HTMLEvents) => {
      return (fn: (event: HTMLEvents[typeof name]) => void) => handler(name, fn)
    },
  }
)

export const emit = {
  value: (fn: (text: string) => void) => {
    return (event: Event) => {
      const target = event.target as HTMLInputElement
      fn(target.value)
    }
  },
  valueAsNumber: (fn: (num: number) => void) => {
    return (event: Event) => {
      const target = event.target as HTMLInputElement
      fn(target.valueAsNumber)
    }
  },
  valueAsDate: (fn: (date: Date) => void) => {
    return (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.value === '') {
        return // TODO do not emit?
      }
      const parts = target.value.split('-')
      const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2].substring(0, 2))
      )
      fn(date)
    }
  },
  valueAsDateTime: (fn: (date: Date) => void) => {
    return (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.value === '') {
        return // TODO do not emit?
      }
      const parts = target.value.split('T')
      const dateParts = parts[0].split('-')
      const date = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2])
      )
      const time = parts[1].split(':')
      date.setHours(Number(time[0]))
      date.setMinutes(Number(time[1]))
      date.setSeconds(Number(time[2]))
      fn(date)
    }
  },
  checked: (fn: (checked: boolean) => void) => {
    return (event: Event) => {
      const target = event.target as HTMLInputElement
      fn(target.checked)
    }
  },
  preventDefault: (fn: () => void) => {
    return (event: Event) => {
      event.preventDefault()
      fn()
    }
  },
  stopPropagation: (fn: () => void) => {
    return (event: Event) => {
      event.stopPropagation()
      fn()
    }
  },
  stopImmediatePropagation: (fn: () => void) => {
    return (event: Event) => {
      event.stopImmediatePropagation()
      fn()
    }
  },
}
