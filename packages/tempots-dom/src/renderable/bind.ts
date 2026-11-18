import { Prop, type Signal } from '@tempots/core'
import { Renderable } from '../types/domain'
import type { HTMLEvents } from '../types/html-events'
import { attr } from './attribute'
import { Fragment } from './fragment'
import {
  emitValue,
  emitValueAsDate,
  emitValueAsDateTime,
  emitValueAsNumber,
  on,
  OnChecked,
} from './on'
import { WithScope } from './shared'

/**
 * The source for an input binding. A Prop receives edits directly. With a
 * signal and callback, the caller decides how to apply edits.
 * @public
 */
export type InputBinding<T> =
  | Prop<T>
  | {
      value: Signal<T>
      onValueChange: (value: T) => void
    }

const isPropBinding = <T>(binding: InputBinding<T>): binding is Prop<T> =>
  Prop.is<unknown>(binding)

const resolveBinding = <T>(binding: InputBinding<T>) =>
  isPropBinding(binding)
    ? { value: binding, onValueChange: (value: T) => binding.set(value) }
    : binding

const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear()
  if (!(year >= 1)) return ''

  const pad = (part: number) => String(part).padStart(2, '0')
  const day = `${String(year).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  if (seconds === 0 && milliseconds === 0) return `${day}T${time}`

  const fraction =
    milliseconds === 0
      ? ''
      : `.${String(milliseconds).padStart(3, '0').replace(/0+$/, '')}`
  return `${day}T${time}:${pad(seconds)}${fraction}`
}

/**
 * Binds a date to an input element and reports edits.
 * Changes to the input element will update the property but will only be
 * affected by day changes and ignore time changes.
 * @param binding - A date prop or a signal and change callback.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindDate = (
  binding: InputBinding<Date>,
  handler: keyof HTMLEvents = 'input'
): Renderable => {
  const { value, onValueChange } = resolveBinding(binding)
  return Fragment(
    attr.valueAsDate(value),
    on[handler](emitValueAsDate(v => onValueChange(v)))
  )
}

/**
 * Binds a date to a `datetime-local` input and reports edits in local time.
 * @param binding - A date prop or a signal and change callback.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindDateTime = (
  binding: InputBinding<Date>,
  handler: keyof HTMLEvents = 'input'
): Renderable => {
  const { value, onValueChange } = resolveBinding(binding)
  return WithScope(() =>
    Fragment(
      attr.value(value.map(formatLocalDateTime)),
      on[handler](emitValueAsDateTime(v => onValueChange(v)))
    )
  )
}

/**
 * Binds a number to an input element and reports edits.
 * @param binding - A number prop or a signal and change callback.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindNumber = (
  binding: InputBinding<number>,
  handler: keyof HTMLEvents = 'input'
): Renderable => {
  const { value, onValueChange } = resolveBinding(binding)
  return Fragment(
    attr.valueAsNumber(value),
    on[handler](emitValueAsNumber(v => onValueChange(v)))
  )
}

/**
 * Binds a string value to an input element and reports edits.
 * @param binding - A string prop or a signal and change callback.
 * @param handler - The event handler to use (default: 'input').
 * @returns A Renderable.
 * @public
 */
export const BindText = (
  binding: InputBinding<string>,
  handler: keyof HTMLEvents = 'input'
): Renderable => {
  const { value, onValueChange } = resolveBinding(binding)
  return Fragment(
    attr.value(value),
    on[handler](emitValue(v => onValueChange(v)))
  )
}

/**
 * Binds the checked state of an input element and reports toggles.
 * @param binding - A boolean prop or a signal and change callback.
 * @returns A Renderable.
 * @public
 */
export const BindChecked = (binding: InputBinding<boolean>): Renderable => {
  const { value, onValueChange } = resolveBinding(binding)
  return Fragment(
    attr.checked(value),
    OnChecked(v => onValueChange(v))
  )
}
