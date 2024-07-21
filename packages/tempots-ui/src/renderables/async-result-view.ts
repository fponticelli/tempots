import {
  TNode,
  Empty,
  Fragment,
  OnUnmount,
  useSignal,
  Signal,
  Value,
  OneOfType,
  Renderable,
} from '@tempots/dom'
import { AsyncResult } from '@tempots/std'

/**
 * Represents the options for rendering an asynchronous result view.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value.
 * @public
 */
export type AsyncResultViewOptions<T, E> = {
  /**
   * The function to render the view when the operation succeeds.
   * @param value - The value of the success result.
   * @returns The rendered view.
   * @public
   */
  success: (value: Signal<T>) => TNode
  /**
   * The function to render the view when the operation fails.
   * @param error - The error of the failure result.
   * @returns The rendered view.
   * @public
   */
  failure?: (error: Signal<E>) => TNode
  /**
   * The function to render the view when the operation is not requested yet.
   * @returns The rendered view.
   * @public
   */
  notAsked?: () => TNode
  /**
   * The function to render the view when the operation is in progress.
   * @param previousValue - The previous value.
   * @returns The rendered view.
   * @public
   */
  loading?: (previousValue: Signal<T | undefined>) => TNode
}

/**
 * Renders the view based on the result of an asynchronous operation.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value.
 * @param result - The result of the asynchronous operation.
 * @param options - The options object or a function that returns a TNode.
 * @returns The rendered view.
 * @public
 */
export const AsyncResultView = <T, E>(
  result: Value<AsyncResult<T, E>>,
  options: AsyncResultViewOptions<T, E> | ((value: Signal<T>) => TNode)
): Renderable => {
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
  return OneOfType(Signal.wrap(result), {
    AsyncSuccess: s => success(s.$.value),
    AsyncFailure: e => fail(e.$.error),
    Loading: s =>
      loading(s.$.previousValue ?? useSignal<T | undefined>(undefined)),
    NotAsked: notAsked,
  })
}
