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
 * Represents a settled state in an asynchronous result.
 * @public
 */
export type Settled<V, E> = AsyncSuccess<V> | AsyncFailure<E>

/**
 * Represents a state in an asynchronous result that is not loading.
 * @public
 */
export type NonLoading<V, E> = NotAsked | Settled<V, E>

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
   * Executes side effects based on the state of the result.
   * Unlike `match`, all handlers are optional, allowing you to react only to specific states.
   * @param r - The result.
   * @param handlers - An object with optional handlers for each state.
   * @returns The result that was passed in, allowing for chaining.
   * @public
   */
  effect: <V, E>(
    r: AsyncResult<V, E>,
    handlers: {
      success?: (value: V) => void
      failure?: (error: E) => void
      loading?: (previousValue?: V) => void
      notAsked?: () => void
    }
  ): AsyncResult<V, E> => {
    switch (r.type) {
      case 'AsyncSuccess':
        handlers.success?.(r.value)
        break
      case 'AsyncFailure':
        handlers.failure?.(r.error)
        break
      case 'Loading':
        handlers.loading?.(r.previousValue)
        break
      case 'NotAsked':
        handlers.notAsked?.()
        break
    }
    return r
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

  /**
   * Maps the value of a successful `AsyncResult` to a new value using the provided function.
   * For other states (NotAsked, Loading, Failure), the state is preserved.
   * When mapping a Loading state with a previous value, the previous value is also mapped.
   * @param result - The `AsyncResult` to map.
   * @param fn - The mapping function to apply to the success value.
   * @returns A new `AsyncResult` with the mapped value if successful, otherwise the original state.
   * @public
   */
  map: <V, U, E>(
    result: AsyncResult<V, E>,
    fn: (value: V) => U
  ): AsyncResult<U, E> => {
    switch (result.type) {
      case 'AsyncSuccess':
        return AsyncResult.success(fn(result.value))
      case 'NotAsked':
        return AsyncResult.notAsked
      case 'AsyncFailure':
        return AsyncResult.failure(result.error)
      case 'Loading':
        return AsyncResult.loading(
          result.previousValue != null ? fn(result.previousValue) : undefined
        )
    }
  },

  /**
   * Maps the value of a successful `AsyncResult` to a new `AsyncResult` using the provided function.
   * This is useful for chaining operations that may also fail.
   * @param result - The `AsyncResult` to flat map.
   * @param fn - The mapping function that returns a new `AsyncResult`.
   * @returns The result of the mapping function if successful, otherwise the original state.
   * @public
   */
  flatMap: <V, U, E>(
    result: AsyncResult<V, E>,
    fn: (value: V) => AsyncResult<U, E>
  ): AsyncResult<U, E> => {
    switch (result.type) {
      case 'AsyncSuccess':
        return fn(result.value)
      case 'NotAsked':
        return AsyncResult.notAsked
      case 'AsyncFailure':
        return AsyncResult.failure(result.error)
      case 'Loading':
        return AsyncResult.loading()
    }
  },

  /**
   * Maps the error of a failed `AsyncResult` to a new error using the provided function.
   * For other states, the state is preserved.
   * @param result - The `AsyncResult` to map the error of.
   * @param fn - The mapping function to apply to the error.
   * @returns A new `AsyncResult` with the mapped error if failed, otherwise the original state.
   * @public
   */
  mapError: <V, E, F>(
    result: AsyncResult<V, E>,
    fn: (error: E) => F
  ): AsyncResult<V, F> => {
    switch (result.type) {
      case 'AsyncSuccess':
        return AsyncResult.success(result.value)
      case 'NotAsked':
        return AsyncResult.notAsked
      case 'AsyncFailure':
        return AsyncResult.failure(fn(result.error))
      case 'Loading':
        return AsyncResult.loading(result.previousValue)
    }
  },

  /**
   * Maps the error of a failed `AsyncResult` to a new `AsyncResult` using the provided function.
   * This allows recovery from errors by returning a new successful result.
   * @param result - The `AsyncResult` to recover from.
   * @param fn - The recovery function that returns a new `AsyncResult`.
   * @returns The result of the recovery function if failed, otherwise the original state.
   * @public
   */
  flatMapError: <V, E, F>(
    result: AsyncResult<V, E>,
    fn: (error: E) => AsyncResult<V, F>
  ): AsyncResult<V, F> => {
    switch (result.type) {
      case 'AsyncSuccess':
        return AsyncResult.success(result.value)
      case 'NotAsked':
        return AsyncResult.notAsked
      case 'AsyncFailure':
        return fn(result.error)
      case 'Loading':
        return AsyncResult.loading(result.previousValue)
    }
  },

  /**
   * Converts an `AsyncResult` to a `Result`, discarding the loading and not-asked states.
   * Returns `undefined` if the result is not settled (i.e., NotAsked or Loading).
   * @param result - The `AsyncResult` to convert.
   * @returns A `Result` if the `AsyncResult` is settled, otherwise `undefined`.
   * @public
   */
  toResult: <V, E>(
    result: AsyncResult<V, E>
  ): import('./result').Result<V, E> | undefined => {
    switch (result.type) {
      case 'AsyncSuccess':
        return { type: 'Success', value: result.value }
      case 'AsyncFailure':
        return { type: 'Failure', error: result.error }
      case 'NotAsked':
      case 'Loading':
        return undefined
    }
  },

  /**
   * Checks if the result is settled (either success or failure).
   * @param r - The result.
   * @returns `true` if the result is settled; otherwise, `false`.
   * @public
   */
  isSettled<V, E>(r: AsyncResult<V, E>): r is Settled<V, E> {
    return r.type === 'AsyncSuccess' || r.type === 'AsyncFailure'
  },

  /**
   * Recovers from a failure by providing an alternative value.
   * @param result - The `AsyncResult` to recover from.
   * @param fn - The function that provides an alternative value given the error.
   * @returns A successful `AsyncResult` with the alternative value if failed, otherwise the original state.
   * @public
   */
  recover: <V, E>(
    result: AsyncResult<V, E>,
    fn: (error: E) => V
  ): AsyncResult<V, never> => {
    switch (result.type) {
      case 'AsyncSuccess':
        return AsyncResult.success(result.value)
      case 'NotAsked':
        return AsyncResult.notAsked
      case 'AsyncFailure':
        return AsyncResult.success(fn(result.error))
      case 'Loading':
        return AsyncResult.loading(result.previousValue)
    }
  },

  /**
   * Applies a function wrapped in an `AsyncResult` to a value wrapped in an `AsyncResult`.
   * Useful for applying multiple arguments to a function in a safe way.
   * @param resultFn - The `AsyncResult` containing the function.
   * @param resultVal - The `AsyncResult` containing the value.
   * @returns A new `AsyncResult` with the result of applying the function to the value.
   * @public
   */
  ap: <V, U, E>(
    resultFn: AsyncResult<(v: V) => U, E>,
    resultVal: AsyncResult<V, E>
  ): AsyncResult<U, E> => {
    if (AsyncResult.isSuccess(resultFn) && AsyncResult.isSuccess(resultVal)) {
      return AsyncResult.success(resultFn.value(resultVal.value))
    } else if (AsyncResult.isFailure(resultFn)) {
      return AsyncResult.failure(resultFn.error)
    } else if (AsyncResult.isFailure(resultVal)) {
      return AsyncResult.failure(resultVal.error)
    } else if (
      AsyncResult.isLoading(resultFn) ||
      AsyncResult.isLoading(resultVal)
    ) {
      return AsyncResult.loading()
    } else {
      return AsyncResult.notAsked
    }
  },

  /**
   * Maps two `AsyncResult` values using a function.
   * @param r1 - The first `AsyncResult`.
   * @param r2 - The second `AsyncResult`.
   * @param fn - The function to apply to both values.
   * @returns A new `AsyncResult` with the result of applying the function to both values.
   * @public
   */
  map2: <V1, V2, U, E>(
    r1: AsyncResult<V1, E>,
    r2: AsyncResult<V2, E>,
    fn: (v1: V1, v2: V2) => U
  ): AsyncResult<U, E> => {
    if (AsyncResult.isSuccess(r1) && AsyncResult.isSuccess(r2)) {
      return AsyncResult.success(fn(r1.value, r2.value))
    } else if (AsyncResult.isFailure(r1)) {
      return AsyncResult.failure(r1.error)
    } else if (AsyncResult.isFailure(r2)) {
      return AsyncResult.failure(r2.error)
    } else if (AsyncResult.isLoading(r1) || AsyncResult.isLoading(r2)) {
      return AsyncResult.loading()
    } else {
      return AsyncResult.notAsked
    }
  },

  /**
   * Maps three `AsyncResult` values using a function.
   * @param r1 - The first `AsyncResult`.
   * @param r2 - The second `AsyncResult`.
   * @param r3 - The third `AsyncResult`.
   * @param fn - The function to apply to all three values.
   * @returns A new `AsyncResult` with the result of applying the function to all three values.
   * @public
   */
  map3: <V1, V2, V3, U, E>(
    r1: AsyncResult<V1, E>,
    r2: AsyncResult<V2, E>,
    r3: AsyncResult<V3, E>,
    fn: (v1: V1, v2: V2, v3: V3) => U
  ): AsyncResult<U, E> => {
    if (
      AsyncResult.isSuccess(r1) &&
      AsyncResult.isSuccess(r2) &&
      AsyncResult.isSuccess(r3)
    ) {
      return AsyncResult.success(fn(r1.value, r2.value, r3.value))
    } else if (AsyncResult.isFailure(r1)) {
      return AsyncResult.failure(r1.error)
    } else if (AsyncResult.isFailure(r2)) {
      return AsyncResult.failure(r2.error)
    } else if (AsyncResult.isFailure(r3)) {
      return AsyncResult.failure(r3.error)
    } else if (
      AsyncResult.isLoading(r1) ||
      AsyncResult.isLoading(r2) ||
      AsyncResult.isLoading(r3)
    ) {
      return AsyncResult.loading()
    } else {
      return AsyncResult.notAsked
    }
  },
}
