// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Edit<V, I, E> {
  abstract readonly type: 'Input' | 'Error' | 'Value'
}

export class Input<I> extends Edit<never, I, never> {
  override readonly type = 'Input' as const
  constructor(readonly input: I) {
    super()
  }
}

export class Error<I, E> extends Edit<never, I, E> {
  override readonly type = 'Error' as const
  constructor(readonly input: I, readonly error: E) {
    super()
  }
}

export class Value<V> extends Edit<V, never, never> {
  override readonly type = 'Value' as const
  constructor(readonly value: V) {
    super()
  }
}

export type Validate<V, I, E> = (
  input: Input<I> | Error<I, E>
) => Error<I, E> | Value<V>
