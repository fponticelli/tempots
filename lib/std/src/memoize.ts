export function memoize<T>(f: () => T) {
  let value: T | undefined = undefined
  return () => {
    if (value === undefined) {
      value = f()
    }
    return value
  }
}
