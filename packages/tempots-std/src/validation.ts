import { Result } from './result'

/**
 * Represents a valid result.
 * @public
 */
export type Valid = {
  readonly type: 'valid'
}
/**
 * Represents an invalid value with an associated error.
 * @typeParam E - The type of the error.
 * @public
 */
export type Invalid<E> = {
  readonly type: 'invalid'
  readonly error: E
}

/**
 * Represents a type that can either be `Valid` or `Invalid`.
 * @typeParam E - The type of the error associated with an `Invalid` value.
 * @public
 */
export type Validation<E> = Valid | Invalid<E>

/**
 * Represents a promise that resolves to a `Validation` object.
 * @typeParam E - The type of the error value in the `Validation` object.
 * @public
 */
export type PromiseValidation<E> = PromiseLike<Validation<E>>

/**
 * Utility functions for working with `Validation` types.
 * @public
 */
export const Validation = {
  /**
   * Creates a valid `Validation`.
   * @returns A `Validation` that is `Valid`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valid: { type: 'valid' } satisfies Validation<any>,
  /**
   * Creates an invalid `Validation`.
   * @param error - The error associated with the invalid value.
   * @returns A `Validation` that is `Invalid`.
   */
  invalid<E>(error: E): Validation<E> {
    return { type: 'invalid', error }
  },
  /**
   * Checks if a `Validation` is `Valid`.
   * @param r - The `Validation` to check.
   * @returns `true` if the `Validation` is `Valid`, otherwise `false`.
   */
  isValid<E>(r: Validation<E>): r is Valid {
    return r.type === 'valid'
  },
  /**
   * Checks if a `Validation` is `Invalid`.
   * @param r - The `Validation` to check.
   * @returns `true` if the `Validation` is `Invalid`, otherwise `false`.
   */
  isInvalid<E>(r: Validation<E>): r is Invalid<E> {
    return r.type === 'invalid'
  },
  /**
   * Maps the value of a `Validation` to a new value.
   * @param r - The `Validation` to map.
   * @param valid - The mapping function for a valid value.
   * @param invalid - The mapping function for an invalid value.
   * @returns The mapped value.
   */
  match: <V, E>(
    r: Validation<E>,
    valid: () => V,
    invalid: (error: E) => V
  ): V => {
    if (Validation.isValid(r)) {
      return valid()
    } else {
      return invalid(r.error)
    }
  },
  /**
   * Maps the value of a `Validation` to a new `Validation`.
   * @param validation - The `Validation` to map.
   * @param value - The value to map.
   * @returns A new `Validation` with the mapped value.
   */
  toResult: <T, E>(validation: Validation<E>, value: T): Result<T, E> =>
    Validation.match(
      validation,
      () => Result.success<T>(value),
      (err: E) => Result.failure<E>(err)
    ),
  /**
   * Execute a function when the `Validation` is valid.
   *
   * @param r - The `Validation` to check.
   * @param apply - The function to execute when the `Validation` is valid.
   * @returns The `Validation` object.
   */
  whenValid: <E>(r: Validation<E>, apply: () => void): Validation<E> => {
    if (Validation.isValid(r)) {
      apply()
    }
    return r
  },
  /**
   * Execute a function when the `Validation` is invalid.
   *
   * @param r - The `Validation` to check.
   * @param apply - The function to execute when the `Validation` is invalid.
   * @returns The `Validation` object.
   */
  whenInvalid: <E>(r: Validation<E>, apply: (e: E) => void): Validation<E> => {
    if (Validation.isInvalid(r)) {
      apply(r.error)
    }
    return r
  },

  /**
   * Maps the error of an invalid `Validation` to a new error using the provided function.
   * For valid validations, the validation is preserved unchanged.
   * @param v - The `Validation` to map the error of.
   * @param f - The mapping function to apply to the error.
   * @returns A new `Validation` with the mapped error if invalid, otherwise the original valid.
   * @public
   */
  mapError: <E, F>(v: Validation<E>, f: (error: E) => F): Validation<F> => {
    if (v.type === 'invalid') {
      return Validation.invalid(f(v.error))
    } else {
      return v
    }
  },

  /**
   * Maps the error of an invalid `Validation` to a new `Validation` using the provided function.
   * This allows recovery from errors by returning a valid validation.
   * @param v - The `Validation` to recover from.
   * @param f - The recovery function that returns a new `Validation`.
   * @returns The result of the recovery function if invalid, otherwise the original valid.
   * @public
   */
  flatMapError: <E, F>(
    v: Validation<E>,
    f: (error: E) => Validation<F>
  ): Validation<F> => {
    if (v.type === 'invalid') {
      return f(v.error)
    } else {
      return v
    }
  },

  /**
   * Combines two validations. Both must be valid for the result to be valid.
   * If both are invalid, errors are combined using the provided function.
   * @param v1 - The first validation.
   * @param v2 - The second validation.
   * @param combineErrors - The function to combine two errors.
   * @returns A combined validation.
   * @public
   */
  combine: <E>(
    v1: Validation<E>,
    v2: Validation<E>,
    combineErrors: (e1: E, e2: E) => E
  ): Validation<E> => {
    if (Validation.isValid(v1) && Validation.isValid(v2)) {
      return Validation.valid
    } else if (Validation.isInvalid(v1) && Validation.isInvalid(v2)) {
      return Validation.invalid(combineErrors(v1.error, v2.error))
    } else if (Validation.isInvalid(v1)) {
      return v1
    } else {
      return v2
    }
  },

  /**
   * Combines multiple validations into a single validation.
   * All must be valid for the result to be valid.
   * Returns the first invalid validation if any.
   * @param validations - The validations to combine.
   * @returns A single validation that is valid only if all inputs are valid.
   * @public
   */
  all: <E>(validations: Validation<E>[]): Validation<E> => {
    for (const validation of validations) {
      if (Validation.isInvalid(validation)) {
        return validation
      }
    }
    return Validation.valid
  },

  /**
   * Combines multiple validations, accumulating all errors.
   * All must be valid for the result to be valid.
   * If any are invalid, all errors are collected into an array.
   * @param validations - The validations to combine.
   * @returns A validation that is valid only if all inputs are valid, otherwise contains all errors.
   * @public
   */
  allErrors: <E>(validations: Validation<E>[]): Validation<E[]> => {
    const errors: E[] = []
    for (const validation of validations) {
      if (Validation.isInvalid(validation)) {
        errors.push(validation.error)
      }
    }
    if (errors.length > 0) {
      return Validation.invalid(errors)
    }
    return Validation.valid
  },

  /**
   * Compares two validations for equality.
   * @param v1 - The first validation.
   * @param v2 - The second validation.
   * @param errorEquals - Optional custom equality function for errors. Defaults to strict equality.
   * @returns `true` if the validations are equal, `false` otherwise.
   * @public
   */
  equals: <E>(
    v1: Validation<E>,
    v2: Validation<E>,
    errorEquals: (e1: E, e2: E) => boolean = (e1, e2) => e1 === e2
  ): boolean => {
    if (v1.type === 'valid' && v2.type === 'valid') {
      return true
    } else if (v1.type === 'invalid' && v2.type === 'invalid') {
      return errorEquals(v1.error, v2.error)
    } else {
      return false
    }
  },

  /**
   * Recovers from an invalid validation by returning a valid validation.
   * @param v - The `Validation` to recover from.
   * @returns A valid validation regardless of the input.
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recover: <E>(_v: Validation<E>): Validation<never> => {
    return Validation.valid
  },

  /**
   * Gets the error if the validation is invalid, otherwise returns undefined.
   * @param v - The validation to get the error from.
   * @returns The error if invalid, otherwise undefined.
   * @public
   */
  getError: <E>(v: Validation<E>): E | undefined => {
    if (Validation.isInvalid(v)) {
      return v.error
    }
    return undefined
  },

  /**
   * Gets the error if the validation is invalid, otherwise returns the default value.
   * @param v - The validation to get the error from.
   * @param defaultError - The default error to return if valid.
   * @returns The error if invalid, otherwise the default error.
   * @public
   */
  getErrorOrElse: <E>(v: Validation<E>, defaultError: E): E => {
    if (Validation.isInvalid(v)) {
      return v.error
    }
    return defaultError
  },
}
