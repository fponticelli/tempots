import type { Child, Mountable } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal, computed } from '../std/signal'
import { Position } from '../std/position'
import { Repeat } from './repeat'
import { Fragment } from './fragment'
import { childToMountable } from './element'
import { oneof } from './oneof'
import { Empty } from './empty'
import { OnDispose } from './ondispose'

export const ForEach = <T>(
  signal: Signal<T[]>,
  item: (value: Signal<T>, position: Signal<Position>) => Child,
  separator?: (pos: Signal<Position>) => Child
): Mountable => {
  if (separator != null) {
    return ForEach(signal, (v, p) => {
      const last = p.map(v => (v.isLast ? 'last' : 'other'))
      return Fragment([
        OnDispose(() => last.dispose()),
        childToMountable(item(v, p)),
        oneof.value(last, {
          last: () => Empty,
          other: () => separator(p),
        }),
      ])
    })
  } else {
    return (ctx: DOMContext) => {
      const times = signal.map(arr => arr.length)
      return Repeat(times, pos => {
        const value = computed(
          () => signal.value[pos.value.index],
          [pos, signal]
        )
        return Fragment(
          OnDispose(() => value.dispose()),
          childToMountable(item(value, pos))
        )
      })(ctx)
    }
  }
}