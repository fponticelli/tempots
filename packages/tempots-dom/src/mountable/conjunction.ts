import { Empty } from './empty'
import { Signal } from '../std/signal'
import { Child } from '../types/domain'
import { Position } from '../std/position'
import { oneof } from './oneof'

export const Conjunction = (
  separator: Child,
  options?: { lastSeparator?: Child; firstSeparator?: Child }
) => {
  return (pos: Signal<Position>) => {
    const firstSeparator = options?.firstSeparator ?? Empty
    const lastSeparator = options?.lastSeparator ?? Empty
    return oneof.value(
      pos.map(v => {
        if (v.isFirst) {
          return 'first'
        } else if (v.isLast) {
          return 'last'
        } else {
          return 'other'
        }
      }),
      {
        first: () => firstSeparator,
        last: () => lastSeparator,
        other: () => separator,
      }
    )
  }
}
