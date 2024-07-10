import {
  Child,
  Empty,
  Fragment,
  OnDispose,
  oneof,
  signal,
  Signal,
  Value,
} from '@tempots/dom'
import { AsyncResult } from '@tempots/std/async-result'

export function AsyncResultView<T, E>(
  result: Value<AsyncResult<T, E>>,
  options:
    | {
        success: (value: Signal<T>) => Child
        failure?: (error: Signal<E>) => Child
        notAsked?: () => Child
        loading?: (previousValue: Signal<T | undefined>) => Child
      }
    | ((value: Signal<T>) => Child)
) {
  if (typeof options === 'function') {
    return AsyncResultView(result, { success: options })
  }
  const fail =
    options.failure ??
    ((error: Signal<E>) =>
      Fragment(
        OnDispose(error.on(console.error)),
        error.map(error => `Error: ${error}`)
      ))
  const success = options.success
  const loading = options.loading ?? (() => Empty)
  const notAsked = options.notAsked ?? (() => Empty)
  return oneof.type(Signal.wrap(result), {
    Success: s => success(s.$.value),
    Failure: s => fail(s.$.error),
    Loading: s =>
      loading(s.$.previousValue ?? signal<T | undefined>(undefined)),
    NotAsked: notAsked,
  })
}
