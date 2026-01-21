import { describe, expect, test, vi } from 'vitest'
import { computedOf, computedOfAsync, computedOfAsyncGenerator, prop } from '../src'

describe('computedOf', () => {
  test('should compute from a single signal', () => {
    const s = prop(2)
    const computed = computedOf(s)((v) => v * 2)
    expect(computed.value).toBe(4)
    s.set(3)
    expect(computed.value).toBe(6)
  })

  test('should compute from multiple signals', () => {
    const a = prop(2)
    const b = prop(3)
    const computed = computedOf(a, b)((x, y) => x + y)
    expect(computed.value).toBe(5)
    a.set(10)
    expect(computed.value).toBe(13)
    b.set(20)
    expect(computed.value).toBe(30)
  })

  test('should compute from mixed signals and literals', () => {
    const s = prop(2)
    const literal = 10
    const computed = computedOf(s, literal)((x, y) => x * y)
    expect(computed.value).toBe(20)
    s.set(5)
    expect(computed.value).toBe(50)
  })

  test('should work with three signals', () => {
    const a = prop(1)
    const b = prop(2)
    const c = prop(3)
    const computed = computedOf(a, b, c)((x, y, z) => x + y + z)
    expect(computed.value).toBe(6)
    a.set(10)
    expect(computed.value).toBe(15)
    b.set(20)
    expect(computed.value).toBe(33)
    c.set(30)
    expect(computed.value).toBe(60)
  })

  test('should work with only literals', () => {
    const computed = computedOf(2, 3)((x, y) => x * y)
    expect(computed.value).toBe(6)
  })
})

describe('computedOfAsync', () => {
  test('should return alt value initially while async resolves', async () => {
    const s = prop(2)
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return v * 2
      },
      0 // alt value
    )
    // Initially returns alt
    expect(computed.value).toBe(0)
    // Wait for async to resolve
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(4)
  })

  test('should update when dependency changes', async () => {
    const s = prop(2)
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return v * 2
      },
      0
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(4)
    s.set(5)
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(10)
  })

  test('should compute from multiple signals', async () => {
    const a = prop(2)
    const b = prop(3)
    const computed = computedOfAsync(a, b)(
      async (x, y, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return x + y
      },
      0
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(5)
    a.set(10)
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(13)
  })

  test('should compute from mixed signals and literals', async () => {
    const s = prop(2)
    const literal = 10
    const computed = computedOfAsync(s, literal)(
      async (x, y, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return x * y
      },
      0
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(20)
  })

  test('should use recover function on error', async () => {
    const s = prop(2)
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        throw new Error('test error')
      },
      0,
      (error) => {
        expect(error).toBeInstanceOf(Error)
        return -1
      }
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(-1)
  })

  test('should use custom equality function', async () => {
    const s = prop(1)
    const spy = vi.fn()
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return { doubled: v * 2 }
      },
      { doubled: 0 },
      undefined,
      (a, b) => a.doubled === b.doubled
    )
    computed.on(spy)
    await new Promise((r) => setTimeout(r, 50))
    // Initial alt + resolved value
    expect(spy).toHaveBeenCalledTimes(2)
    // Set to same computed value
    s.set(1)
    await new Promise((r) => setTimeout(r, 50))
    // equality check should prevent extra calls
    expect(spy).toHaveBeenCalledTimes(2)
    // Set to different computed value
    s.set(2)
    await new Promise((r) => setTimeout(r, 50))
    expect(spy).toHaveBeenCalledTimes(3)
  })

  test('should work with props', async () => {
    const p = prop(5)
    const computed = computedOfAsync(p)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return v * 3
      },
      0
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(15)
    p.set(10)
    await new Promise((r) => setTimeout(r, 50))
    expect(computed.value).toBe(30)
  })

  test('should handle rapid updates correctly', async () => {
    const s = prop(1)
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 20))
        return v * 2
      },
      0
    )
    // Rapid updates
    s.set(2)
    s.set(3)
    s.set(4)
    // Wait for all to settle
    await new Promise((r) => setTimeout(r, 100))
    // Should have the final value
    expect(computed.value).toBe(8)
  })

  test('should notify listeners when async resolves', async () => {
    const s = prop(2)
    const spy = vi.fn()
    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        await new Promise((r) => setTimeout(r, 10))
        return v * 2
      },
      0
    )
    computed.on(spy)
    // First call with alt value
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(0, undefined)
    await new Promise((r) => setTimeout(r, 50))
    // Second call with resolved value
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith(4, 0)
  })

  test('should provide abortSignal that aborts on dependency change', async () => {
    const s = prop(1)
    let abortCount = 0

    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => resolve(v * 2), 50)
          abortSignal.addEventListener('abort', () => {
            abortCount++
            clearTimeout(timeout)
            reject(new Error('Aborted'))
          })
        })
      },
      0,
      () => -1 // recover on abort
    )

    expect(computed.value).toBe(0)

    // Change value before async completes to trigger abort
    await new Promise((r) => setTimeout(r, 10))
    s.set(2)

    await new Promise((r) => setTimeout(r, 100))
    expect(abortCount).toBeGreaterThanOrEqual(1) // At least one abort occurred
    expect(computed.value).toBe(4) // 2 * 2
  })

  test('should abort previous request when dependency changes rapidly', async () => {
    const s = prop(1)
    let abortCount = 0

    const computed = computedOfAsync(s)(
      async (v, { abortSignal }) => {
        abortSignal.addEventListener('abort', () => abortCount++)
        await new Promise((r) => setTimeout(r, 30))
        return v * 2
      },
      0
    )

    // Rapid changes
    s.set(2)
    s.set(3)
    s.set(4)

    await new Promise((r) => setTimeout(r, 100))
    expect(abortCount).toBeGreaterThanOrEqual(1) // Aborts occurred
    expect(computed.value).toBe(8) // 4 * 2
  })
})

describe('computedOfAsyncGenerator', () => {
  test('should return alt value initially', async () => {
    const s = prop(2)
    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        yield v
        yield v * 2
      },
      0
    )
    expect(computed.value).toBe(0)
    await new Promise((r) => setTimeout(r, 10))
    expect(computed.value).toBe(4) // 2 * 2
  })

  test('should yield multiple values', async () => {
    const s = prop(2)
    const yielded: number[] = []

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        yield v
        yield v * 2
        yield v * 3
      },
      0
    )

    computed.on((v) => yielded.push(v))

    await new Promise((r) => setTimeout(r, 10))
    expect(yielded).toContain(0) // alt
    expect(yielded).toContain(2)
    expect(yielded).toContain(4)
    expect(yielded).toContain(6)
    expect(computed.value).toBe(6)
  })

  test('should work with multiple dependencies', async () => {
    const a = prop(2)
    const b = prop(3)
    const yielded: number[] = []

    const computed = computedOfAsyncGenerator(a, b)(
      async function* (x, y, { abortSignal }) {
        yield x + y
        yield (x + y) * 2
      },
      0
    )

    computed.on((v) => yielded.push(v))

    await new Promise((r) => setTimeout(r, 10))
    expect(yielded).toContain(5) // 2 + 3
    expect(yielded).toContain(10) // (2 + 3) * 2
    expect(computed.value).toBe(10)
  })

  test('should work with mixed signals and literals', async () => {
    const s = prop(2)
    const literal = 10

    const computed = computedOfAsyncGenerator(s, literal)(
      async function* (x, y, { abortSignal }) {
        yield x * y
      },
      0
    )

    await new Promise((r) => setTimeout(r, 10))
    expect(computed.value).toBe(20)
  })

  test('should abort previous generator on dependency change', async () => {
    const s = prop(1)
    let abortCount = 0
    const yielded: number[] = []

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        abortSignal.addEventListener('abort', () => abortCount++)
        yield v
        await new Promise((r) => setTimeout(r, 50))
        yield v * 10 // Should not be reached if aborted
      },
      0
    )

    computed.on((v) => yielded.push(v))

    await new Promise((r) => setTimeout(r, 10))
    expect(yielded).toContain(1)

    // Change value before generator completes
    s.set(2)

    await new Promise((r) => setTimeout(r, 10))
    expect(yielded).toContain(2)
    expect(abortCount).toBeGreaterThanOrEqual(1) // At least one abort occurred

    await new Promise((r) => setTimeout(r, 60))
    expect(computed.value).toBe(20) // 2 * 10
    expect(yielded).not.toContain(10) // First generator's second yield was skipped
  })

  test('should use recover function on error', async () => {
    const s = prop(2)

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        yield v
        throw new Error('test error')
      },
      0,
      () => -1
    )

    expect(computed.value).toBe(0)
    await new Promise((r) => setTimeout(r, 10))
    expect(computed.value).toBe(-1)
  })

  test('should use custom equality function', async () => {
    const s = prop(1)
    const spy = vi.fn()

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        yield { v }
        yield { v } // Same value, should not trigger with custom equals
        yield { v: v + 1 }
      },
      { v: 0 },
      undefined,
      (a, b) => a.v === b.v
    )

    computed.on(spy)

    await new Promise((r) => setTimeout(r, 10))
    // alt (0) + first yield (1) + third yield (2) = 3 updates
    // The duplicate { v: 1 } should not trigger an additional update
    expect(spy).toHaveBeenCalledTimes(3)
    expect(computed.value).toEqual({ v: 2 })
  })

  test('should handle delayed yields', async () => {
    const s = prop(2)
    const yielded: number[] = []

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        yield v
        await new Promise((r) => setTimeout(r, 10))
        yield v * 2
        await new Promise((r) => setTimeout(r, 10))
        yield v * 3
      },
      0
    )

    computed.on((v) => yielded.push(v))

    await new Promise((r) => setTimeout(r, 5))
    expect(yielded).toContain(2)

    await new Promise((r) => setTimeout(r, 40))
    expect(yielded).toContain(4)
    expect(yielded).toContain(6)
    expect(computed.value).toBe(6)
  })

  test('should handle rapid dependency changes', async () => {
    const s = prop(1)
    let abortCount = 0

    const computed = computedOfAsyncGenerator(s)(
      async function* (v, { abortSignal }) {
        abortSignal.addEventListener('abort', () => abortCount++)
        yield v
        await new Promise((r) => setTimeout(r, 20))
        yield v * 10
      },
      0
    )

    // Rapid changes
    s.set(2)
    s.set(3)
    s.set(4)
    s.set(5)

    await new Promise((r) => setTimeout(r, 50))

    // Only the last generator should complete
    expect(computed.value).toBe(50) // 5 * 10
    expect(abortCount).toBeGreaterThanOrEqual(1) // Aborts occurred
  })
})
