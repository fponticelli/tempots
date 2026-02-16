export type Success<V> = {
  readonly type: 'success'
  readonly value: V
}
export type Failure<E> = {
  readonly type: 'failure'
  readonly error: E
}

export type Result<V, E> = Success<V> | Failure<E>

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
}
