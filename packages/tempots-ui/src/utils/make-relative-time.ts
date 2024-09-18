import { makeComputedOf, Prop, Value, makeProp, Signal } from '@tempots/dom'

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

export function timeDiffToString(diffInMillis: number): string {
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
    }
    throw new Error('unreachable')
  }
}

export const makeRelativeTime = (date: Value<Date>, now?: Value<Date>) => {
  const realNow =
    now != null
      ? Signal.is(now)
        ? now.map(v => v)
        : makeProp(now)
      : makeProp(new Date())

  const diff = makeComputedOf(
    date,
    realNow
  )((date, now) => {
    const diff = date.getTime() - now.getTime()
    return timeDiffToString(diff)
  })

  const intervalId = Prop.is(realNow)
    ? setInterval(() => realNow.set(new Date()), 5000)
    : undefined

  diff.onDispose(() => {
    if (intervalId != null) {
      clearInterval(intervalId)
    }
    realNow.dispose()
  })

  return diff
}
