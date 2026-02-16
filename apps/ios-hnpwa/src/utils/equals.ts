export function deepEqual<A>(a: A, b: A): boolean {
  if (a === b || (a !== a && b !== b)) return true
  if (a == null || b == null) return false
  const aIsArr = Array.isArray(a)
  const bIsArr = Array.isArray(b)

  if (aIsArr !== bIsArr) return false
  if (aIsArr) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aArr: never[] = a as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bArr: never[] = b as any
    const aLength = aArr.length
    if (aLength !== bArr.length) return false
    for (let i = 0; i < aLength; i++) {
      if (!deepEqual(aArr[i], bArr[i])) return false
    }
    return true
  }

  const aIsObj = typeof a === 'object'
  const bIsObj = typeof b === 'object'
  if (aIsObj !== bIsObj) return false
  if (aIsObj) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aObj: any = a
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bObj: any = b
    const aFields = Object.keys(aObj)
    const bFields = Object.keys(bObj)
    const aLength = aFields.length

    if (aLength !== bFields.length) return false

    for (let i = 0; i < aLength; i++) {
      const field = aFields[i]
      if (!Object.prototype.hasOwnProperty.call(bObj, field)) return false
      if (!deepEqual(aObj[field], bObj[field])) return false
    }

    return true
  }

  return false
}
