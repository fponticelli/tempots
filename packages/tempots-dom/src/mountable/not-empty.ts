import { Signal } from '../std/signal'
import { Mountable } from '../types/domain'
import { Empty } from './empty'
import { When } from './when'

export function NotEmpty<T>(
  signal: Signal<T[]>,
  display: Mountable,
  whenEmpty: Mountable = Empty
): Mountable {
  return When(
    signal.map(v => v.length > 0),
    display,
    whenEmpty
  )
}
