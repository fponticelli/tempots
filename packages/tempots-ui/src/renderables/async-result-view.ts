import {
  TNode,
  Empty,
  Fragment,
  OnUnmount,
  oneof,
  signal,
  Signal,
  Value,
} from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

export function AsyncResultView<T, E>(
  result: Value<AsyncResult<T, E>>,
  options:
    | {
        success: (value: Signal<T>) => TNode
        failure?: (error: Signal<E>) => TNode
        notAsked?: () => TNode
        loading?: (previousValue: Signal<T | undefined>) => TNode
      }
    | ((value: Signal<T>) => TNode)
) {
  if (typeof options === 'function') {
    return AsyncResultView(result, { success: options })
  }
  const fail =
    options.failure ??
    ((error: Signal<E>) =>
      Fragment(
        OnUnmount(error.on(console.error)),
        error.map(error => `Error: ${error}`)
      ))
  const success = options.success
  const loading = options.loading ?? (() => Empty)
  const notAsked = options.notAsked ?? (() => Empty)
  return oneof.type(Signal.wrap(result), {
    AsyncSuccess: s => success(s.$.value),
    AsyncFailure: e => fail(e.$.error),
    Loading: s =>
      loading(s.$.previousValue ?? signal<T | undefined>(undefined)),
    NotAsked: notAsked,
  })
}
