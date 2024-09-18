import {
  TNode,
  Fragment,
  OnDispose,
  Signal,
  Value,
  Renderable,
  OneOfType,
} from '@tempots/dom'
import { Result } from '@tempots/std'

/**
 * Represents the signal for a result.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value.
 * @public
 */
export type ResultViewOptions<T, E> = {
  /**
   * The function to render the view when the computation succeeds.
   * @param value - The signal for the success value.
   * @returns The rendered view.
   */
  success: (value: Signal<T>) => TNode
  /**
   * The function to render the view when the computation fails.
   * @param error - The signal for the error value.
   * @returns The rendered view.
   */
  failure?: (error: Signal<E>) => TNode
}

/**
 * Renders a view based on the result of a computation.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value.
 * @param result - The result of the computation.
 * @param options - The options for rendering the view.
 * @returns The rendered view.
 * @public
 */
export const ResultView = <T, E>(
  result: Value<Result<T, E>>,
  options: ResultViewOptions<T, E> | ((value: Signal<T>) => TNode)
): Renderable => {
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
  return OneOfType(Value.toSignal(result), {
    Success: signal => success(signal.$.value),
    Failure: signal => fail(signal.$.error),
  })
}
