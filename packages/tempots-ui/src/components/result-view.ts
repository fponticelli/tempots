import { TNode, Fragment, OnDispose, oneof, Signal, Value } from '@tempots/dom'
import { Result } from '@tempots/std/result'

export function ResultView<T, E>(
  result: Value<Result<T, E>>,
  options:
    | {
        success: (value: Signal<T>) => TNode
        failure?: (error: Signal<E>) => TNode
      }
    | ((value: Signal<T>) => TNode)
) {
  if (typeof options === 'function') {
    return ResultView(result, { success: options })
  }
  const fail =
    options.failure ??
    ((error: Signal<E>) =>
      Fragment(
        OnDispose(error.on(console.error)),
        error.map(error => `Error: ${error}`)
      ))
  const success = options.success
  return oneof.type(Signal.wrap(result), {
    Success: signal => success(signal.$.value),
    Failure: signal => fail(signal.$.error),
  })
}
