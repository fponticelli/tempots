export function strictEqual<A>(a: A, b: A): boolean {
  return a === b || (a !== a && b !== b)
}

export function deepEqual<A>(a: A, b: A): boolean {
  if (strictEqual(a, b)) return true
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

  const aIsDate = a instanceof Date
  const bIsDate = b instanceof Date
  if (aIsDate !== bIsDate) return false
  if (aIsDate) {
    const aDate: Date = a as never
    const bDate: Date = b as never
    return +aDate === +bDate
  }

  const aIsSet = a instanceof Set
  const bIsSet = b instanceof Set
  if (aIsSet !== bIsSet) return false
  if (aIsSet) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aSet: Set<any> = a as never
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bSet: Set<any> = b as never
    if (aSet.size !== bSet.size) return false
    const it = aSet.keys()

    while (true) {
      const curr = it.next()
      if (curr.done ?? false) break
      if (!bSet.has(curr.value)) return false
    }
    return true
  }

  const aIsMap = a instanceof Map
  const bIsMap = b instanceof Map
  if (aIsMap !== bIsMap) return false
  if (aIsMap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aMap: Map<any, any> = a as never
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bMap: Map<any, any> = b as never
    const aMapLength = aMap.size
    if (aMapLength !== bMap.size) return false
    const it = aMap.keys()

    while (true) {
      const curr = it.next()
      if (curr.done ?? false) break
      if (!deepEqual(aMap.get(curr.value), bMap.get(curr.value))) return false
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

export function looseEqual<T>(a: T, b: T): boolean {
  return a == b
}
