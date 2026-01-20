import { AsyncResult } from './async-result'
import { Maybe } from './domain'
import { Validation } from './validation'

/**
 * Represents a successful result.
 * @typeParam V - The type of the value.
 * @public
 */
export type Success<V> = {
  readonly type: 'Success'
  readonly value: V
}
/**
 * Represents a failure result.
 * @typeParam E - The type of the error.
 * @public
 */
export type Failure<E> = {
  readonly type: 'Failure'
  readonly error: E
}

/**
 * Represents a result that can either be a success or a failure.
 * @typeParam V - The type of the value in case of success.
 * @typeParam E - The type of the error in case of failure.
 * @public
 */
export type Result<V, E> = Success<V> | Failure<E>

/**
 * Represents a promise that resolves to a `Result` type.
 * @typeParam V - The type of the value contained in the `Result`.
 * @typeParam E - The type of the error contained in the `Result`.
 * @public
 */
export type PromiseResult<V, E> = PromiseLike<Result<V, E>>

/**
 * Utility functions for working with `Result` types.
 * @public
 */
export const Result = {
  /**
   * Creates a successful `Result`.
   * @param value - The value to wrap in a `Success` type.
   * @returns A `Result` that is a `Success`.
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success<V>(value: V): Result<V, any> {
    return { type: 'Success', value }
  },
  /**
   * Creates a failure `Result`.
   * @param error - The error to wrap in a `Failure` type.
   * @returns A `Result` that is a `Failure`.
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  failure<E>(error: E): Result<any, E> {
    return { type: 'Failure', error }
  },
  /**
   * Maps the value of a `Result` to a new value.
   * @param r - The `Result` to map.
   * @param f - The mapping function.
   * @returns A new `Result` with the mapped value.
   * @public
   */
  map: <V1, V2, E>(r: Result<V1, E>, f: (value: V1) => V2): Result<V2, E> => {
    if (r.type === 'Success') {
      return Result.success(f(r.value))
    } else {
      return r
    }
  },
  /**
   * Maps the value of a `Result` to a new `Result`.
   * @param r - The `Result` to map.
   * @param f - The mapping function.
   * @returns A new `Result` with the mapped value.
   * @public
   */
  flatMap: <V1, V2, E>(
    r: Result<V1, E>,
    f: (value: V1) => Result<V2, E>
  ): Result<V2, E> => {
    if (r.type === 'Success') {
      return f(r.value)
    } else {
      return r
    }
  },
  /**
   * Converts a `Result` to an `AsyncResult`.
   * @param r - The `Result` to convert.
   * @returns An `AsyncResult` that is equivalent to the input `Result`.
   * @public
   */
  toAsync<V, E>(r: Result<V, E>): AsyncResult<V, E> {
    return Result.match<V, AsyncResult<V, E>, E>(
      r,
      (v: V) => AsyncResult.success(v),
      (e: E) => AsyncResult.failure(e)
    )
  },
  /**
   * Converts a `Result` to a `Validation`.
   * @param r - The `Result` to convert.
   * @returns A `Validation` that is equivalent to the input `Result`.
   * @public
   */
  toValidation<V, E>(r: Result<V, E>): Validation<E> {
    return Result.match<V, Validation<E>, E>(
      r,
      () => Validation.valid,
      (e: E) => Validation.invalid(e)
    )
  },
  /**
   * Checks if a `Result` is a success.
   * @param r - The `Result` to check.
   * @returns `true` if the `Result` is a `Success`, `false` otherwise.
   * @public
   */
  isSuccess<V, E>(r: Result<V, E>): r is Success<V> {
    return r.type === 'Success'
  },
  /**
   * Checks if a `Result` is a failure.
   * @param r - The `Result` to check.
   * @returns `true` if the `Result` is a `Failure`, `false` otherwise.
   * @public
   */
  isFailure<V, E>(r: Result<V, E>): r is Failure<E> {
    return r.type === 'Failure'
  },
  /**
   * Gets the value of a `Result` if it is a `Success`, otherwise returns the provided default value.
   * @param r - The `Result` to get the value from.
   * @param alt - The default value to return if the `Result` is a `Failure`.
   * @returns The value of the `Result` if it is a `Success`, otherwise the default value.
   * @public
   */
  getOrElse<V, E>(r: Result<V, E>, alt: V): V {
    return Result.isSuccess(r) ? r.value : alt
  },
  /**
   * Gets the value of a `Result` if it is a `Success`, otherwise returns the result of the provided function.
   * @param r - The `Result` to get the value from.
   * @param altf - The function to call if the `Result` is a `Failure`.
   * @returns The value of the `Result` if it is a `Success`, otherwise the result of the function.
   * @public
   */
  getOrElseLazy<V, E>(r: Result<V, E>, altf: () => V): V {
    return Result.isSuccess(r) ? r.value : altf()
  },
  /**
   * Gets the value of a `Result` if it is a `Success`, otherwise returns `null`.
   * @param r - The `Result` to get the value from.
   * @returns The value of the `Result` if it is a `Success`, otherwise `null`.
   * @public
   */
  getOrNull<V, E>(r: Result<V, E>): V | null {
    return Result.isSuccess(r) ? r.value : null
  },
  /**
   * Gets the value of a `Result` if it is a `Success`, otherwise returns `undefined`.
   * @param r - The `Result` to get the value from.
   * @returns The value of the `Result` if it is a `Success`, otherwise `undefined`.
   * @public
   */
  getOrUndefined<V, E>(r: Result<V, E>): Maybe<V> {
    return Result.isSuccess(r) ? r.value : undefined
  },
  /**
   * Gets the value of a `Result` if it is a `Success`, otherwise it throws the error contained in the `Failure`.
   * @param r - The `Result` to get the value from.
   * @returns The value of the `Result` if it is a `Success`.
   */
  getUnsafe: <V, E>(r: Result<V, E>): V => {
    if (Result.isSuccess(r)) {
      return r.value
    } else {
      throw r.error
    }
  },
  /**
   * Based on the state of the result, it picks the appropriate function to call and returns the result.
   * @param success - The function to call if the result is a success.
   * @param failure - The function to call if the result is a failure.
   * @returns The result of calling the appropriate function based on the state of the result.
   * @public
   */
  match: <V1, V2, E>(
    r: Result<V1, E>,
    success: (value: V1) => V2,
    failure: (error: E) => V2
  ): V2 => {
    if (Result.isSuccess(r)) {
      return success(r.value)
    } else {
      return failure(r.error)
    }
  },
  /**
   * Calls the provided function if the result is a success.
   * @param apply - The function to call if the result is a success.
   * @returns A function that takes a `Result` and calls the provided function if the result is a success.
   * @public
   */
  whenSuccess: <V, E>(r: Result<V, E>, apply: (v: V) => void): Result<V, E> => {
    if (Result.isSuccess(r)) {
      apply(r.value)
    }
    return r
  },
  whenFailure: <V, E>(r: Result<V, E>, apply: (e: E) => void): Result<V, E> => {
    if (Result.isFailure(r)) {
      apply(r.error)
    }
    return r
  },
  /**
   * Combines two results into a single result.
   * @param r1 - The first result.
   * @param r2 - The second result.
   * @param combineV - The function to combine two values.
   * @param combineE - The function to combine two errors.
   * @returns The combined result.
   * @public
   */
  combine: <V, E>(
    r1: Result<V, E>,
    r2: Result<V, E>,
    combineV: (v1: V, v2: V) => V,
    combineE: (e1: E, e2: E) => E
  ): Result<V, E> =>
    Result.match<V, Result<V, E>, E>(
      r1,
      (v1: V) =>
        Result.match<V, Result<V, E>, E>(
          r2,
          (v2: V) => Result.success<V>(combineV(v1, v2)),
          (e2: E) => Result.failure<E>(e2)
        ),
      (e1: E) =>
        Result.match<V, Result<V, E>, E>(
          r2,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (_: V) => Result.failure<E>(e1),
          (e2: E) => Result.failure<E>(combineE(e1, e2))
        )
    ),
  /**
   * Compares two results for equality.
   * @param r1 - The first result.
   * @param r2 - The second result.
   * @param options - The options to use for comparison. By default, uses strict equality.
   * @returns `true` if the results are equal, `false` otherwise.
   */
  equals: <V, E>(
    r1: Result<V, E>,
    r2: Result<V, E>,
    options: {
      valueEquals: (v1: V, v2: V) => boolean
      errorEquals: (e1: E, e2: E) => boolean
    } = {
      valueEquals: (v1: V, v2: V): boolean => v1 === v2,
      errorEquals: (e1: E, e2: E): boolean => e1 === e2,
    }
  ): boolean => {
    if (r1.type === 'Success' && r2.type === 'Success') {
      return options.valueEquals(r1.value, r2.value)
    } else if (r1.type === 'Failure' && r2.type === 'Failure') {
      return options.errorEquals(r1.error, r2.error)
    } else {
      return false
    }
  },
  /**
   * Combines multiple results into a single result.
   * @param results - The results to combine.
   * @returns A single result that is a success if all the input results are successes, otherwise a failure.
   */
  all: <V, E>(results: Result<V, E>[]): Result<V[], E> => {
    const values: V[] = []
    for (const result of results) {
      if (Result.isSuccess(result)) {
        values.push(result.value)
      } else {
        return result
      }
    }
    return Result.success(values)
  },

  /**
   * Maps the error of a failed `Result` to a new error using the provided function.
   * For success results, the result is preserved unchanged.
   * @param r - The `Result` to map the error of.
   * @param f - The mapping function to apply to the error.
   * @returns A new `Result` with the mapped error if failed, otherwise the original success.
   * @public
   */
  mapError: <V, E, F>(r: Result<V, E>, f: (error: E) => F): Result<V, F> => {
    if (r.type === 'Failure') {
      return Result.failure(f(r.error))
    } else {
      return r
    }
  },

  /**
   * Maps the error of a failed `Result` to a new `Result` using the provided function.
   * This allows recovery from errors by returning a new successful result.
   * @param r - The `Result` to recover from.
   * @param f - The recovery function that returns a new `Result`.
   * @returns The result of the recovery function if failed, otherwise the original success.
   * @public
   */
  flatMapError: <V, E, F>(
    r: Result<V, E>,
    f: (error: E) => Result<V, F>
  ): Result<V, F> => {
    if (r.type === 'Failure') {
      return f(r.error)
    } else {
      return r
    }
  },

  /**
   * Recovers from a failure by providing an alternative value.
   * @param r - The `Result` to recover from.
   * @param f - The function that provides an alternative value given the error.
   * @returns A successful `Result` with the alternative value if failed, otherwise the original success.
   * @public
   */
  recover: <V, E>(r: Result<V, E>, f: (error: E) => V): Result<V, never> => {
    if (r.type === 'Failure') {
      return { type: 'Success', value: f(r.error) }
    } else {
      return r
    }
  },

  /**
   * Applies a function wrapped in a `Result` to a value wrapped in a `Result`.
   * Useful for applying multiple arguments to a function in a safe way.
   * @param resultFn - The `Result` containing the function.
   * @param resultVal - The `Result` containing the value.
   * @returns A new `Result` with the result of applying the function to the value.
   * @public
   */
  ap: <V, U, E>(
    resultFn: Result<(v: V) => U, E>,
    resultVal: Result<V, E>
  ): Result<U, E> => {
    if (Result.isSuccess(resultFn) && Result.isSuccess(resultVal)) {
      return Result.success(resultFn.value(resultVal.value))
    } else if (Result.isFailure(resultFn)) {
      return Result.failure(resultFn.error)
    } else {
      return Result.failure((resultVal as Failure<E>).error)
    }
  },

  /**
   * Maps two `Result` values using a function.
   * @param r1 - The first `Result`.
   * @param r2 - The second `Result`.
   * @param f - The function to apply to both values.
   * @returns A new `Result` with the result of applying the function to both values.
   * @public
   */
  map2: <V1, V2, U, E>(
    r1: Result<V1, E>,
    r2: Result<V2, E>,
    f: (v1: V1, v2: V2) => U
  ): Result<U, E> => {
    if (Result.isSuccess(r1) && Result.isSuccess(r2)) {
      return Result.success(f(r1.value, r2.value))
    } else if (Result.isFailure(r1)) {
      return Result.failure(r1.error)
    } else {
      return Result.failure((r2 as Failure<E>).error)
    }
  },

  /**
   * Maps three `Result` values using a function.
   * @param r1 - The first `Result`.
   * @param r2 - The second `Result`.
   * @param r3 - The third `Result`.
   * @param f - The function to apply to all three values.
   * @returns A new `Result` with the result of applying the function to all three values.
   * @public
   */
  map3: <V1, V2, V3, U, E>(
    r1: Result<V1, E>,
    r2: Result<V2, E>,
    r3: Result<V3, E>,
    f: (v1: V1, v2: V2, v3: V3) => U
  ): Result<U, E> => {
    if (Result.isSuccess(r1) && Result.isSuccess(r2) && Result.isSuccess(r3)) {
      return Result.success(f(r1.value, r2.value, r3.value))
    } else if (Result.isFailure(r1)) {
      return Result.failure(r1.error)
    } else if (Result.isFailure(r2)) {
      return Result.failure(r2.error)
    } else {
      return Result.failure((r3 as Failure<E>).error)
    }
  },

  /**
   * Converts a Promise to a Result.
   * @param p - The Promise to convert.
   * @returns A Promise that resolves to a Result.
   * @public
   */
  ofPromise: async <V>(p: Promise<V>): Promise<Result<V, Error>> => {
    try {
      const v = await p
      return Result.success(v)
    } catch (e) {
      return Result.failure(e instanceof Error ? e : new Error(String(e)))
    }
  },

  /**
   * Swaps the success and failure values of a Result.
   * A success becomes a failure with the value as the error,
   * and a failure becomes a success with the error as the value.
   * @param r - The Result to swap.
   * @returns A new Result with swapped success and failure.
   * @public
   */
  swap: <V, E>(r: Result<V, E>): Result<E, V> => {
    if (Result.isSuccess(r)) {
      return Result.failure(r.value)
    } else {
      return Result.success(r.error)
    }
  },

  /**
   * Converts a nullable value to a Result.
   * @param value - The nullable value.
   * @param error - The error to use if the value is null or undefined.
   * @returns A Result containing the value if not null/undefined, otherwise a failure.
   * @public
   */
  fromNullable: <V, E>(value: V | null | undefined, error: E): Result<V, E> => {
    if (value == null) {
      return Result.failure(error)
    } else {
      return Result.success(value)
    }
  },

  /**
   * Converts a nullable value to a Result using a lazy error function.
   * @param value - The nullable value.
   * @param errorFn - The function to call to get the error if the value is null or undefined.
   * @returns A Result containing the value if not null/undefined, otherwise a failure.
   * @public
   */
  fromNullableLazy: <V, E>(
    value: V | null | undefined,
    errorFn: () => E
  ): Result<V, E> => {
    if (value == null) {
      return Result.failure(errorFn())
    } else {
      return Result.success(value)
    }
  },

  /**
   * Wraps a function that may throw into a function that returns a Result.
   * @param f - The function that may throw.
   * @returns A function that returns a Result instead of throwing.
   * @public
   */
  tryCatch: <V>(f: () => V): Result<V, Error> => {
    try {
      return Result.success(f())
    } catch (e) {
      return Result.failure(e instanceof Error ? e : new Error(String(e)))
    }
  },
}
