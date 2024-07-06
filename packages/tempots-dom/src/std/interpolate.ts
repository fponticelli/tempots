export function numberInterpolate(start: number, end: number, delta: number) {
  return start + (end - start) * delta
}

const altCharCode = 'a'.charCodeAt(0)

export function stringInterpolate(start: string, end: string, delta: number) {
  const length = Math.max(start.length, end.length)
  let result = ''
  for (let i = 0; i < length; i++) {
    let a = start.charCodeAt(i)
    if (isNaN(a)) {
      a = altCharCode
    }
    let b = end.charCodeAt(i)
    if (isNaN(b)) {
      b = altCharCode
    }
    result += String.fromCharCode(a + (b - a) * delta)
  }
  return result
}

export function dateInterpolate(start: Date, end: Date, delta: number) {
  return new Date(start.getTime() + (end.getTime() - start.getTime()) * delta)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function endInterpolate<T>(_start: T, end: T, _delta: number) {
  return end
}

export function guessInterpolate<T>(
  value: T
): (start: T, end: T, delta: number) => T {
  if (typeof value === 'number') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return numberInterpolate as any
  } else if (typeof value === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return stringInterpolate as any
  } else if (value instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dateInterpolate as any
  } else {
    return endInterpolate
  }
}
