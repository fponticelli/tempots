import { describe, expect, test, vi } from 'vitest'
import { computedOf, computedOfAsync, prop } from '../src'

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
      async (v) => {
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
      async (v) => {
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
      async (x, y) => {
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
      async (x, y) => {
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
      async () => {
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
      async (v) => {
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
      async (v) => {
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
      async (v) => {
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
      async (v) => {
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
})
