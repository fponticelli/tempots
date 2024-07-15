import { Empty } from './empty'
import { Signal } from '../std/signal'
import { TNode } from '../types/domain'
import { Position } from '../std/position'
import { oneof } from './oneof'

export const Conjunction = (
  separator: TNode,
  options?: { lastSeparator?: TNode; firstSeparator?: TNode }
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
