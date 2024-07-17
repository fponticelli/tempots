import { Maybe } from './domain'

/**
 * Represents the state when a result has not been requested yet.
 */
export interface NotAsked {
  type: 'NotAsked'
}
/**
 * Represents a loading state in an asynchronous result.
 */
export interface Loading<V> {
  type: 'Loading'
  previousValue?: V
}
/**
 * Represents a successful result.
 * @template V The type of the value.
 */
export interface Success<V> {
  type: 'Success'
  value: V
}
/**
 * Represents a failure result.
 * @template E - The type of the error.
 */
export interface Failure<E> {
  type: 'Failure'
  error: E
}

/**
 * Represents the result of an asynchronous operation that can be in one of the following states:
 * - `NotAsked`: The operation has not been requested yet.
 * - `Loading`: The operation is currently in progress.
 * - `Success`: The operation has completed successfully and contains a value of type `V`.
 * - `Failure`: The operation has completed with an error and contains an error of type `E`.
 *
 * @typeparam V The type of the value on success.
 * @typeparam E The type of the error on failure.
 */
export type AsyncResult<V, E> = NotAsked | Loading<V> | Success<V> | Failure<E>

/**
 * A set of utility functions for working with `AsyncResult`.
 */
export const AsyncResult = {
  /**
   * Creates a loading state.
   * @param previousValue The previous value.
   * @returns A loading state.
   */
  notAsked: { type: 'NotAsked' } satisfies AsyncResult<never, never>,
  /**
   * Creates a loading state.
   * @param previousValue The previous value.
   * @returns A loading state.
   */
  loading<V>(previousValue: Maybe<V> = undefined): AsyncResult<V, never> {
    return { type: 'Loading', previousValue }
  },
  /**
   * Creates a successful state.
   * @param value The value.
   * @returns A successful state.
   */
  success<V>(value: V): AsyncResult<V, never> {
    return { type: 'Success', value }
  },
  /**
   * Creates a failure state.
   * @param error The error.
   * @returns A failure state.
   */
  failure<E>(error: E): AsyncResult<never, E> {
    return { type: 'Failure', error }
  },
  /**
   * Checks if the result is a success.
   * @param r The result.
   * @returns `true` if the result is a success; otherwise, `false`.
   */
  isSuccess<V, E>(r: AsyncResult<V, E>): r is Success<V> {
    return r.type === 'Success'
  },
  /**
   * Checks if the result is a failure.
   * @param r The result.
   * @returns `true` if the result is a failure; otherwise, `false`.
   */
  isFailure<V, E>(r: AsyncResult<V, E>): r is Failure<E> {
    return r.type === 'Failure'
  },
  /**
   * Checks if the result is a not-asked.
   * @param r The result.
   * @returns `true` if the result is not-asked; otherwise, `false`.
   */
  isNotAsked<V, E>(r: AsyncResult<V, E>): r is NotAsked {
    return r.type === 'NotAsked'
  },
  /**
   * Checks if the result is a loading.
   * @param r The result.
   * @returns `true` if the result is loading; otherwise, `false`.
   */
  isLoading<V, E>(r: AsyncResult<V, E>): r is Loading<V> {
    return r.type === 'Loading'
  },
  /**
   * Gets the value if the result is a success; otherwise, returns the alternative value.
   * @param r The result.
   * @param alt The alternative value.
   * @returns The value if the result is a success; otherwise, the alternative value.
   */
  getOrElse<V, E>(r: AsyncResult<V, E>, alt: V): V {
    return AsyncResult.isSuccess(r) ? r.value : alt
  },
  /**
   * Gets the value if the result is a success; otherwise, returns the value from the alternative function.
   * @param r The result.
   * @param altf The alternative function.
   * @returns The value if the result is a success; otherwise, the value from the alternative
   * function.
   */
  getOrElseLazy<V, E>(r: AsyncResult<V, E>, altf: () => V): V {
    return AsyncResult.isSuccess(r) ? r.value : altf()
  },
  /**
   * Gets the value if the result is a success; otherwise, returns `null`.
   * @param r The result.
   * @returns The value if the result is a success; otherwise, `null`.
   */
  getOrNull<V, E>(r: AsyncResult<V, E>): V | null {
    return AsyncResult.isSuccess(r) ? r.value : null
  },
  /**
   * Gets the value if the result is a success; otherwise, returns `undefined`.
   * @param r The result.
   * @returns The value if the result is a success; otherwise, `undefined`.
   */
  getOrUndefined<V, E>(r: AsyncResult<V, E>): Maybe<V> {
    return AsyncResult.isSuccess(r) ? r.value : undefined
  },
  /**
   * Based on the state of the result, it picks the appropriate function to call and returns the result.
   * @param success The function to call if the result is a success.
   * @param failure The function to call if the result is a failure.
   * @param loading The function to call if the result is loading.
   * @param notAsked The function to call if the result is not-asked.
   * @returns The result of calling the appropriate function based on the state of the result.
   */
  match: <V1, V2, E>(
    r: AsyncResult<V1, E>,
    {
      success,
      failure,
      loading,
      notAsked = loading,
    }: {
      success: (value: V1) => V2
      failure: (error: E) => V2
      loading: (previousValue?: V1) => V2
      notAsked: () => V2
    }
  ): V2 => {
    if (AsyncResult.isSuccess(r)) {
      return success(r.value)
    } else if (AsyncResult.isFailure(r)) {
      return failure(r.error)
    } else if (AsyncResult.isNotAsked(r)) {
      return notAsked()
    } else {
      return loading(r.previousValue)
    }
  },
  /**
   * When the result is a success, it applies the function to the value.
   *
   * @param r The result.
   * @param apply The function to apply.
   * @returns The result that was passed in.
   */
  whenSuccess: <V, E>(
    r: AsyncResult<V, E>,
    apply: (v: V) => void
  ): AsyncResult<V, E> => {
    if (AsyncResult.isSuccess(r)) {
      apply(r.value)
    }
    return r
  },
  /**
   * When the result is a failure, it applies the function to the error.
   *
   * @param r The result.
   * @param apply The function to apply.
   * @returns The result that was passed in.
   */
  whenFailure: <V, E>(
    r: AsyncResult<V, E>,
    apply: (e: E) => void
  ): AsyncResult<V, E> => {
    if (AsyncResult.isFailure(r)) {
      apply(r.error)
    }
    return r
  },
}
