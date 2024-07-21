export type Success<V> = {
  readonly type: 'success'
  readonly value: V
}
export type Failure<E> = {
  readonly type: 'failure'
  readonly error: E
}

export type Result<V, E> = Success<V> | Failure<E>

export type PromiseResult<V, E> = PromiseLike<Result<V, E>>

export const Result = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success<V>(value: V): Result<V, any> {
    return { type: 'success', value }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  failure<E>(error: E): Result<any, E> {
    return { type: 'failure', error }
  },
  map: <V1, V2, E>(r: Result<V1, E>, f: (value: V1) => V2): Result<V2, E> => {
    if (r.type === 'success') {
      return Result.success(f(r.value))
    } else {
      return r
    }
  },
  flatMap: <V1, V2, E>(
    r: Result<V1, E>,
    f: (value: V1) => Result<V2, E>
  ): Result<V2, E> => {
    if (r.type === 'success') {
      return f(r.value)
    } else {
      return r
    }
  },
  isSuccess<V, E>(r: Result<V, E>): r is Success<V> {
    return r.type === 'success'
  },
  isFailure<V, E>(r: Result<V, E>): r is Failure<E> {
    return r.type === 'failure'
  },
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
}
