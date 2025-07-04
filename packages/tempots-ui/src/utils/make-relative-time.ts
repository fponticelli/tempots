import { computedOf, Value, prop, Signal } from '@tempots/dom'
import { interval } from '@tempots/std'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

const units = [
  {
    max: MINUTE * 90,
    value: MINUTE,
    name: 'minute',
    past: { singular: 'a minute ago', plural: '{} minutes ago' },
    future: { singular: 'in a minute', plural: 'in {} minutes' },
  },
  {
    max: HOUR * 36,
    value: HOUR,
    name: 'hour',
    past: { singular: 'an hour ago', plural: '{} hours ago' },
    future: { singular: 'in an hour', plural: 'in {} hours' },
  },
  {
    max: DAY * 10,
    value: DAY,
    name: 'day',
    past: { singular: 'yesterday', plural: '{} days ago' },
    future: { singular: 'tomorrow', plural: 'in {} days' },
  },
  {
    max: WEEK * 6,
    value: WEEK,
    name: 'week',
    past: { singular: 'last week', plural: '{} weeks ago' },
    future: { singular: 'in a week', plural: 'in {} weeks' },
  },
  {
    max: MONTH * 18,
    value: MONTH,
    name: 'month',
    past: { singular: 'last month', plural: '{} months ago' },
    future: { singular: 'in a month', plural: 'in {} months' },
  },
  {
    max: Infinity,
    value: YEAR,
    name: 'year',
    past: { singular: 'last year', plural: '{} years ago' },
    future: { singular: 'in a year', plural: 'in {} years' },
  },
]

function format(
  diff: number,
  divisor: number,
  singular: string,
  plural: string
): string {
  const val = Math.round(diff / divisor)
  if (val <= 1) {
    return singular
  } else {
    return plural.replace(
      '{}',
      val.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })
    )
  }
}

/**
 * Creates a signal that automatically updates with the current time at a specified frequency.
 * The signal will clean up its interval when disposed.
 *
 * @param frequency - Milliseconds between updates (defaults to 1000ms/1 second)
 * @returns A Value<Date> that updates with the current time at the specified frequency
 * @public
 */
export const nowSignal = (frequency: number = 1000): Signal<Date> => {
  const now = prop(new Date())
  const clear = interval(() => now.set(new Date()), frequency)
  now.onDispose(clear)
  return now
}

/**
 * Converts a time difference in milliseconds to a human-readable relative time string.
 *
 * @param diffInMillis - The time difference in milliseconds. Negative values indicate past times,
 *                       positive values indicate future times.
 * @returns A human-readable string representing the relative time difference:
 *          - For very recent times (< 1 minute): "just now" or "in a moment"
 *          - For other times: formatted strings like "2 minutes ago", "in 3 hours", "yesterday", etc.
 * @throws {Error} Should never throw due to the Infinity max value in units array
 * @public
 */
export const timeDiffToString = (diffInMillis: number): string => {
  const diff = Math.abs(diffInMillis)
  if (diff < MINUTE) {
    return diffInMillis < 0 ? 'just now' : 'in a moment'
  } else {
    for (const unit of units) {
      if (diff < unit.max) {
        return diffInMillis < 0
          ? format(diff, unit.value, unit.past.singular, unit.past.plural)
          : format(diff, unit.value, unit.future.singular, unit.future.plural)
      }
      /* c8 ignore next */
    }
    /* c8 ignore next 3 */
    throw new Error('unreachable')
  }
}

/**
 * Creates a signal that computes the time difference in milliseconds between a target date and a reference date.
 *
 * @param date - The target date to compare
 * @param options - Configuration options
 * @param options.now - Optional reference date signal (defaults to current time)
 * @param options.frequency - Update frequency in milliseconds when using default current time (defaults to 10000ms/10 seconds)
 * @returns A signal containing the time difference in milliseconds. Negative values indicate past times,
 *          positive values indicate future times. The signal will clean up its resources when disposed.
 * @public
 */
export const relativeTimeMillisSignal = (
  date: Value<Date>,
  { now, frequency = 10000 }: { now?: Value<Date>; frequency?: number } = {}
) => {
  const realNow =
    now != null
      ? Signal.is(now)
        ? now.derive()
        : prop(now)
      : nowSignal(frequency)

  const diff = computedOf(
    date,
    realNow
  )((date, now) => date.getTime() - now.getTime())
  diff.onDispose(() => Value.dispose(realNow))

  return diff
}

/**
 * Creates a signal that computes a human-readable relative time string between a target date and a reference date.
 *
 * @param date - The target date to compare
 * @param options - Configuration options
 * @param options.now - Optional reference date signal (defaults to current time)
 * @param options.frequency - Update frequency in milliseconds when using default current time (defaults to 10000ms/10 seconds)
 * @returns A signal containing a human-readable relative time string (e.g., "2 minutes ago", "in 3 hours").
 *          The signal will clean up its resources when disposed.
 * @public
 */
export const relativeTimeSignal = (
  date: Value<Date>,
  options: { now?: Value<Date>; frequency?: number } = {}
) => {
  const signal = relativeTimeMillisSignal(date, options)
  const diff = signal.map(timeDiffToString)
  diff.onDispose(signal.dispose)
  return diff
}

/**
 * Creates a signal that computes a human-readable relative time string between a target date and a reference date.
 *
 * @param date - The target date to compare
 * @param options - Configuration options
 * @param options.now - Optional reference date signal (defaults to current time)
 * @param options.frequency - Update frequency in milliseconds when using default current time (defaults to 10000ms/10 seconds)
 * @returns A signal containing a human-readable relative time string (e.g., "2 minutes ago", "in 3 hours").
 *          The signal will clean up its resources when disposed.
 * @deprecated Use makeRelativeTimeSignal instead
 * @public
 */
export const relativeTime = (
  date: Value<Date>,
  options: { now?: Value<Date>; frequency?: number } = {}
) => relativeTimeSignal(date, options)
