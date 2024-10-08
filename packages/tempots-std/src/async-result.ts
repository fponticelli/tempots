import { Maybe } from './domain'

/**
 * Represents the state when a result has not been requested yet.
 * @public
 */
export type NotAsked = {
  readonly type: 'NotAsked'
}
/**
 * Represents a loading state in an asynchronous result.
 * @public
 */
export type Loading<V> = {
  readonly type: 'Loading'
  readonly previousValue?: V
}
/**
 * Represents a successful result.
 * @typeParam V - The type of the value.
 * @public
 */
export type AsyncSuccess<V> = {
  readonly type: 'AsyncSuccess'
  readonly value: V
}
/**
 * Represents a failure result.
 * @typeParam E - - The type of the error.
 * @public
 */
export type AsyncFailure<E> = {
  readonly type: 'AsyncFailure'
  readonly error: E
}

/**
 * Represents the result of an asynchronous operation that can be in one of the following states:
 * - `NotAsked`: The operation has not been requested yet.
 * - `Loading`: The operation is currently in progress.
 * - `Success`: The operation has completed successfully and contains a value of type `V`.
 * - `Failure`: The operation has completed with an error and contains an error of type `E`.
 *
 * @typeParam V - The type of the value on success.
 * @typeParam E - The type of the error on failure.
 * @public
 */
export type AsyncResult<V, E> =
  | NotAsked
  | Loading<V>
  | AsyncSuccess<V>
  | AsyncFailure<E>

/**
 * A set of utility functions for working with `AsyncResult`.
 * @public
 */
export const AsyncResult = {
  /**
   * Creates a loading state.
   * @param previousValue - The previous value.
   * @returns A loading state.
   * @public
   */
  notAsked: { type: 'NotAsked' } satisfies AsyncResult<never, never>,
  /**
   * Creates a loading state.
   * @param previousValue - The previous value.
   * @returns A loading state.
   * @public
   */
  loading<V>(previousValue: Maybe<V> = undefined): AsyncResult<V, never> {
    return { type: 'Loading', previousValue }
  },
  /**
   * Creates a successful state.
   * @param value - The value.
   * @returns A successful state.
   * @public
   */
  success<V>(value: V): AsyncResult<V, never> {
    return { type: 'AsyncSuccess', value }
  },
  /**
   * Creates a failure state.
   * @param error - The error.
   * @returns A failure state.
   * @public
   */
  failure<E>(error: E): AsyncResult<never, E> {
    return { type: 'AsyncFailure', error }
  },
  /**
   * Checks if the result is a success.
   * @param r - The result.
   * @returns `true` if the result is a success; otherwise, `false`.
   * @public
   */
  isSuccess<V, E>(r: AsyncResult<V, E>): r is AsyncSuccess<V> {
    return r.type === 'AsyncSuccess'
  },
  /**
   * Checks if the result is a failure.
   * @param r - The result.
   * @returns `true` if the result is a failure; otherwise, `false`.
   * @public
   */
  isFailure<V, E>(r: AsyncResult<V, E>): r is AsyncFailure<E> {
    return r.type === 'AsyncFailure'
  },
  /**
   * Checks if the result is a not-asked.
   * @param r - The result.
   * @returns `true` if the result is not-asked; otherwise, `false`.
   * @public
   */
  isNotAsked<V, E>(r: AsyncResult<V, E>): r is NotAsked {
    return r.type === 'NotAsked'
  },
  /**
   * Checks if the result is a loading.
   * @param r - The result.
   * @returns `true` if the result is loading; otherwise, `false`.
   * @public
   */
  isLoading<V, E>(r: AsyncResult<V, E>): r is Loading<V> {
    return r.type === 'Loading'
  },
  /**
   * Gets the value if the result is a success; otherwise, returns the alternative value.
   * @param r - The result.
   * @param alt - The alternative value.
   * @returns The value if the result is a success; otherwise, the alternative value.
   * @public
   */
  getOrElse<V, E>(r: AsyncResult<V, E>, alt: V): V {
    return AsyncResult.isSuccess(r) ? r.value : alt
  },
  /**
   * Gets the value if the result is a success; otherwise, returns the value from the alternative function.
   * @param r - The result.
   * @param altf - The alternative function.
   * @returns The value if the result is a success; otherwise, the value from the alternative
   * @public
   * function.
   */
  getOrElseLazy<V, E>(r: AsyncResult<V, E>, altf: () => V): V {
    return AsyncResult.isSuccess(r) ? r.value : altf()
  },
  /**
   * Gets the value if the result is a success; otherwise, returns `null`.
   * @param r - The result.
   * @returns The value if the result is a success; otherwise, `null`.
   * @public
   */
  getOrNull<V, E>(r: AsyncResult<V, E>): V | null {
    return AsyncResult.isSuccess(r) ? r.value : null
  },
  /**
   * Gets the value if the result is a success; otherwise, returns `undefined`.
   * @param r - The result.
   * @returns The value if the result is a success; otherwise, `undefined`.
   * @public
   */
  getOrUndefined<V, E>(r: AsyncResult<V, E>): Maybe<V> {
    return AsyncResult.isSuccess(r) ? r.value : undefined
  },
  /**
   * Gets the value of a `AsyncResult` if it is a `Success`, otherwise it throws the error contained in the `Failure`.
   * @param r - The `AsyncResult` to get the value from.
   * @returns The value of the `AsyncResult` if it is a `Success`.
   */
  getUnsafe: <V, E>(r: AsyncResult<V, E>): V => {
    if (AsyncResult.isSuccess(r)) {
      return r.value
    } else if (AsyncResult.isFailure(r)) {
      throw r.error
    } else {
      throw new Error('Cannot get value from a not-asked or loading result')
    }
  },
  /**
   * Based on the state of the result, it picks the appropriate function to call and returns the result.
   * @param success - The function to call if the result is a success.
   * @param failure - The function to call if the result is a failure.
   * @param loading - The function to call if the result is loading.
   * @param notAsked - The function to call if the result is not-asked.
   * @returns The result of calling the appropriate function based on the state of the result.
   * @public
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
   * @param r - The result.
   * @param apply - The function to apply.
   * @returns The result that was passed in.
   * @public
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
   * @param r - The result.
   * @param apply - The function to apply.
   * @returns The result that was passed in.
   * @public
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
  /**
   * Compares two results for equality.
   * @param r1 - The first result.
   * @param r2 - The second result.
   * @param options - The options to use for comparison. By default, uses strict equality.
   * @returns `true` if the results are equal, `false` otherwise.
   */
  equals: <V, E>(
    r1: AsyncResult<V, E>,
    r2: AsyncResult<V, E>,
    options: {
      valueEquals: (v1: V, v2: V) => boolean
      errorEquals: (e1: E, e2: E) => boolean
    } = {
      valueEquals: (v1: V, v2: V): boolean => v1 === v2,
      errorEquals: (e1: E, e2: E): boolean => e1 === e2,
    }
  ): boolean => {
    if (r1.type === 'AsyncSuccess' && r2.type === 'AsyncSuccess') {
      return options.valueEquals(r1.value, r2.value)
    } else if (r1.type === 'AsyncFailure' && r2.type === 'AsyncFailure') {
      return options.errorEquals(r1.error, r2.error)
    } else if (r1.type === 'Loading' && r2.type === 'Loading') {
      return options.valueEquals(r1.previousValue!, r2.previousValue!)
    } else if (r1.type === 'NotAsked' && r2.type === 'NotAsked') {
      return true
    } else {
      return false
    }
  },
  /**
   * Combines multiple results into a single result.
   * @param results - The results to combine.
   * @returns A single result that is a success if all the input results are successes, otherwise a failure.
   */
  all: <V, E>(results: AsyncResult<V, E>[]): AsyncResult<V[], E> => {
    const values: V[] = []
    for (const result of results) {
      if (AsyncResult.isSuccess(result)) {
        values.push(result.value)
      } else {
        return result as AsyncResult<V[], E>
      }
    }
    return AsyncResult.success(values)
  },

  /**
   * Converts a Promise to an AsyncResult.
   * @param p - The Promise to convert.
   * @returns A Promise that resolves to an AsyncResult.
   */
  ofPromise: async <V>(p: Promise<V>): Promise<AsyncResult<V, Error>> => {
    try {
      const v = await p
      return AsyncResult.success(v)
    } catch (e) {
      return AsyncResult.failure(e instanceof Error ? e : new Error(String(e)))
    }
  },
}
