// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never
