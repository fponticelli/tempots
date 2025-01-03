import type { Renderable } from '../types/domain'
import type { HTMLEvents } from '../types/html-events'
import { DOMContext, HandlerOptions } from '../dom/dom-context'

const handler =
  <T extends Event>(
    name: string,
    handler: (event: T) => void,
    options?: HandlerOptions
  ): Renderable =>
  (ctx: DOMContext) =>
    ctx.on(name, handler, options)

/**
 * Attaches an event handler to the 'click' event that triggers when a checkbox is checked or unchecked.
 * @param fn - The callback function to be executed when the checkbox is clicked.
 * @alpha
 */
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

/**
 * Represents a collection of HTML event handlers that can be attached to an element.
 * @public
 */
export const on = new Proxy(
  {} as {
    [EN in keyof HTMLEvents]: (
      handler: (event: HTMLEvents[EN]) => void
    ) => Renderable
  },
  {
    /**
     * @param name - The name of the event handler.
     * @param fn - The function to call when the event is triggered.
     * @returns A `Renderable` function that adds the event listener to the element.
     */
    get: (_, name: keyof HTMLEvents) => {
      return (fn: (event: HTMLEvents[typeof name]) => void) => handler(name, fn)
    },
  }
)

/**
 * Creates an event handler that emits the value of an HTMLInputElement.
 *
 * @param fn - The callback function that will receive the emitted value.
 * @returns An event handler function that can be attached to an event listener.
 * @public
 */
export const emitValue = (fn: (text: string) => void) => {
  return (event: Event) => {
    const target = event.target as HTMLInputElement
    fn(target.value)
  }
}

/**
 * Calls the provided function with the value of an HTMLInputElement as a number.
 *
 * @param fn - The function to be called with the value as a number.
 * @returns A function that can be used as an event handler.
 * @public
 */
export const emitValueAsNumber = (fn: (num: number) => void) => {
  return (event: Event) => {
    const target = event.target as HTMLInputElement
    fn(target.valueAsNumber)
  }
}

/**
 * Converts the value of an HTML input element to a Date object and emits it using the provided callback function.
 * @param fn - The callback function to be called with the converted Date object.
 * @returns A function that can be used as an event handler for input events.
 * @public
 */
export const emitValueAsDate = (fn: (date: Date) => void) => {
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
}

/**
 * Emits the value of an HTMLInputElement as a Date object.
 * @param fn - The callback function to be called with the emitted Date object.
 * @returns The event handler function.
 * @public
 */
export const emitValueAsDateTime = (fn: (date: Date) => void) => {
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
}

/**
 * Calls the provided function with the checked value of the event target.
 * @param fn - The function to be called with the checked value.
 * @returns A function that takes an event and calls the provided function with the checked value of the event target.
 * @public
 */
export const emitChecked = (fn: (checked: boolean) => void) => {
  return (event: Event) => {
    const target = event.target as HTMLInputElement
    fn(target.checked)
  }
}

/**
 * Wraps a function to prevent the default behavior of an event before invoking it.
 * @param fn - The function to be wrapped.
 * @returns A new function that prevents the default behavior of the event and then invokes the original function.
 * @public
 */
export const emitPreventDefault = (fn: () => void) => {
  return (event: Event) => {
    event.preventDefault()
    fn()
  }
}

/**
 * Creates a new event handler that stops event propagation and invokes the provided function.
 * @param fn - The function to be invoked when the event is triggered.
 * @returns A new event handler function.
 * @public
 */
export const emitStopPropagation = (fn: () => void) => {
  return (event: Event) => {
    event.stopPropagation()
    fn()
  }
}

/**
 * Creates an event handler that stops immediate propagation of the event and invokes the provided function.
 * @param fn - The function to be invoked.
 * @returns The event handler function.
 * @public
 */
export const emitStopImmediatePropagation = (fn: () => void) => {
  return (event: Event) => {
    event.stopImmediatePropagation()
    fn()
  }
}
