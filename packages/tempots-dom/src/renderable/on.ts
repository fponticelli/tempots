import type { Renderable } from '../types/domain'
import type { HTMLEvents } from '../types/html-events'
import { DOMContext, HandlerOptions } from '../dom/dom-context'
import { domRenderable } from '../types/domain'

const handler = <T extends Event>(
  name: string,
  handler: (event: T, ctx: DOMContext) => void,
  options?: HandlerOptions
): Renderable =>
  domRenderable((ctx: DOMContext) => ctx.on(name, handler, options))

/**
 * Attaches an event handler to the 'click' event that triggers when a checkbox is checked or unchecked.
 * @param fn - The callback function to be executed when the checkbox is clicked.
 * @alpha
 */
export const OnChecked = (fn: (event: boolean, ctx: DOMContext) => void) =>
  handler('click', (e: Event, ctx: DOMContext) => {
    e.preventDefault()
    const input = e.target as HTMLInputElement
    setTimeout(() => {
      const value = input.ownerDocument != null ? input?.checked : undefined
      if (value != null) {
        fn(!value, ctx)
      }
    }, 0)
  })

/**
 * Provides type-safe event handlers for all HTML events.
 *
 * The `on` object is a proxy that provides access to all standard HTML events with proper
 * TypeScript typing. Each event handler receives the native event object and the DOM context.
 *
 * @example
 * ```typescript
 * // Basic click handler
 * html.button(
 *   on.click((event, ctx) => {
 *     console.log('Button clicked!', event.target)
 *   }),
 *   'Click me'
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Input event with value extraction
 * const text = prop('')
 *
 * html.input(
 *   attr.value(text),
 *   on.input((event) => {
 *     text.value = (event.target as HTMLInputElement).value
 *   })
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Multiple event handlers on same element
 * html.div(
 *   on.mouseenter(() => console.log('Mouse entered')),
 *   on.mouseleave(() => console.log('Mouse left')),
 *   on.click(() => console.log('Clicked')),
 *   'Hover and click me'
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Keyboard event handling
 * html.input(
 *   on.keydown((event) => {
 *     if (event.key === 'Enter') {
 *       console.log('Enter pressed!')
 *       event.preventDefault()
 *     }
 *   })
 * )
 * ```
 *
 * @public
 */
export const on = new Proxy(
  {} as {
    [EN in keyof HTMLEvents]: (
      handler: (event: HTMLEvents[EN], ctx: DOMContext) => void
    ) => Renderable
  },
  {
    /**
     * @param name - The name of the event handler.
     * @param fn - The function to call when the event is triggered.
     * @returns A `Renderable` function that adds the event listener to the element.
     */
    get: (_, name: keyof HTMLEvents) => {
      return (fn: (event: HTMLEvents[typeof name], ctx: DOMContext) => void) =>
        handler(name, fn)
    },
  }
)

/**
 * Options for event handlers.
 *
 * @public
 */
export type EmitOptions = {
  preventDefault?: boolean
  stopPropagation?: boolean
  stopImmediatePropagation?: boolean
}

/**
 * Creates an event handler that calls the provided function with the event as an argument.
 * @param fn - The function to call when the event is triggered.
 * @returns An event handler function that can be used with event listeners.
 * @public
 */
export const emit =
  (fn: (event: Event) => void, options?: EmitOptions) => (event: Event) => {
    if (options?.preventDefault === true) {
      event.preventDefault()
    }
    if (options?.stopPropagation === true) {
      event.stopPropagation()
    }
    if (options?.stopImmediatePropagation === true) {
      event.stopImmediatePropagation()
    }
    fn(event)
  }

/**
 * Creates an event handler that extracts and emits the target element from an event.
 *
 * @example
 * ```typescript
 * html.input(
 *   on.input(emitTarget((input) => {
 *     console.log('Input value:', input.value)
 *   }))
 * )
 * ```
 *
 * @param fn - Callback function that receives the target element
 * @returns Event handler function that can be used with event listeners
 * @public
 */
export const emitTarget = <EL extends HTMLElement>(
  fn: (element: EL, event: Event) => void,
  options?: EmitOptions
) =>
  emit((event: Event) => {
    const target = event.target as EL
    fn(target, event)
  }, options)

/**
 * Creates an event handler that extracts and emits the string value from an input element.
 *
 * This utility simplifies handling input events by automatically extracting the value
 * from the target element and passing it to your callback function.
 *
 * @example
 * ```typescript
 * const name = prop('')
 *
 * html.input(
 *   attr.value(name),
 *   on.input(emitValue(value => name.value = value))
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With textarea
 * const description = prop('')
 *
 * html.textarea(
 *   attr.value(description),
 *   on.input(emitValue(value => {
 *     description.value = value
 *     console.log('Description updated:', value)
 *   }))
 * )
 * ```
 *
 * @param fn - Callback function that receives the input element's string value
 * @returns Event handler function that can be used with event listeners
 * @public
 */
export const emitValue = (
  fn: (text: string, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget(
    (target: HTMLInputElement, event: Event) => fn(target.value, event),
    options
  )

/**
 * Creates an event handler that extracts and emits the numeric value from an input element.
 *
 * This utility automatically converts the input's value to a number using the browser's
 * built-in `valueAsNumber` property, which handles number inputs correctly and returns
 * `NaN` for invalid numeric values.
 *
 * @example
 * ```typescript
 * const age = prop(0)
 *
 * html.input(
 *   attr.type('number'),
 *   attr.value(age.map(String)),
 *   on.input(emitValueAsNumber(value => {
 *     if (!isNaN(value)) {
 *       age.value = value
 *     }
 *   }))
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With range input
 * const volume = prop(50)
 *
 * html.input(
 *   attr.type('range'),
 *   attr.min('0'),
 *   attr.max('100'),
 *   attr.value(volume.map(String)),
 *   on.input(emitValueAsNumber(value => volume.value = value))
 * )
 * ```
 *
 * @param fn - Callback function that receives the input element's numeric value (may be NaN)
 * @returns Event handler function that can be used with event listeners
 * @public
 */
export const emitValueAsNumber = (
  fn: (num: number, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget(
    (target: HTMLInputElement, event: Event) => fn(target.valueAsNumber, event),
    options
  )

/**
 * Converts the value of an HTML input element to a Date object and emits it using the provided callback function.
 * @param fn - The callback function to be called with the converted Date object.
 * @returns A function that can be used as an event handler for input events.
 * @public
 */
export const emitValueAsDate = (
  fn: (date: Date, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget((target: HTMLInputElement, event: Event) => {
    if (target.value === '') {
      return // TODO do not emit?
    }
    const parts = target.value.split('-')
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2].substring(0, 2))
    )
    fn(date, event)
  }, options)

/**
 * Converts the value of an HTML input element to a Date object or null and emits it using the provided callback function.
 * @param fn - The callback function to be called with the converted Date object or null.
 * @returns A function that can be used as an event handler for input events.
 * @public
 */
export const emitValueAsNullableDate = (
  fn: (date: Date | null, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget((target: HTMLInputElement, event: Event) => {
    if (target.value === '') {
      fn(null, event)
      return
    }
    const parts = target.value.split('-')
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2].substring(0, 2))
    )
    fn(date, event)
  }, options)

/**
 * Emits the value of an HTMLInputElement as a Date object.
 * @param fn - The callback function to be called with the emitted Date object.
 * @returns The event handler function.
 * @public
 */
export const emitValueAsDateTime = (
  fn: (date: Date, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget((target: HTMLInputElement, event: Event) => {
    if (target.value === '') {
      return
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
    fn(date, event)
  }, options)

/**
 * Emits the value of an HTMLInputElement as a Date object or null.
 * @param fn - The callback function to be called with the emitted Date object or null.
 * @returns The event handler function.
 * @public
 */
export const emitValueAsNullableDateTime = (
  fn: (date: Date | null, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget((target: HTMLInputElement, event: Event) => {
    if (target.value === '') {
      fn(null, event)
      return
    }
    const parts = target.value.split('T')
    if (parts.length !== 2) {
      fn(null, event)
      return
    }
    const dateParts = parts[0]!.split('-')
    const date = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    )
    const time = parts[1]!.split(':')
    /* c8 ignore next */
    date.setHours(Number(time[0] ?? 0))
    date.setMinutes(Number(time[1] ?? 0))
    date.setSeconds(Number(time[2] ?? 0))
    fn(date, event)
  }, options)

/**
 * Creates an event handler that extracts and emits the checked state from a checkbox or radio input.
 *
 * This utility simplifies handling checkbox and radio button state changes by automatically
 * extracting the `checked` property from the target element.
 *
 * @example
 * ```typescript
 * const isEnabled = prop(false)
 *
 * html.input(
 *   attr.type('checkbox'),
 *   attr.checked(isEnabled),
 *   on.change(emitChecked(checked => isEnabled.value = checked))
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With radio buttons
 * const selectedOption = prop('')
 *
 * html.div(
 *   html.label(
 *     html.input(
 *       attr.type('radio'),
 *       attr.name('option'),
 *       attr.value('A'),
 *       on.change(emitChecked(checked => {
 *         if (checked) selectedOption.value = 'A'
 *       }))
 *     ),
 *     'Option A'
 *   ),
 *   html.label(
 *     html.input(
 *       attr.type('radio'),
 *       attr.name('option'),
 *       attr.value('B'),
 *       on.change(emitChecked(checked => {
 *         if (checked) selectedOption.value = 'B'
 *       }))
 *     ),
 *     'Option B'
 *   )
 * )
 * ```
 *
 * @param fn - Callback function that receives the input element's checked state
 * @returns Event handler function that can be used with event listeners
 * @public
 */
export const emitChecked = (
  fn: (checked: boolean, event: Event) => void,
  options?: EmitOptions
) =>
  emitTarget((target: HTMLInputElement, event: Event) => {
    fn(target.checked, event)
  }, options)
