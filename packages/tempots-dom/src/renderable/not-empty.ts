import { Signal } from '../std/signal'
import { Renderable } from '../types/domain'
import { Empty } from './empty'
import { When } from './when'

export function NotEmpty<T>(
  signal: Signal<T[]>,
  display: Renderable,
  whenEmpty: Renderable = Empty
): Renderable {
  return When(
    signal.map(v => v.length > 0),
    display,
    whenEmpty
  )
}
