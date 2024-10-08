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
}
