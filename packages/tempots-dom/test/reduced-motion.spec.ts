import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createReducedMotionSignal, ReducedMotion } from '../src'

describe('createReducedMotionSignal', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  test('returns false when matchMedia reports no preference', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const signal = createReducedMotionSignal()
    expect(signal.get()).toBe(false)
    signal.dispose()
  })

  test('returns true when matchMedia reports reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const signal = createReducedMotionSignal()
    expect(signal.get()).toBe(true)
    signal.dispose()
  })

  test('updates when preference changes', () => {
    let changeHandler: ((e: { matches: boolean }) => void) | null = null
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
        changeHandler = handler
      }),
      removeEventListener: vi.fn(),
    })
    const signal = createReducedMotionSignal()
    expect(signal.get()).toBe(false)

    changeHandler!({ matches: true })
    expect(signal.get()).toBe(true)

    changeHandler!({ matches: false })
    expect(signal.get()).toBe(false)

    signal.dispose()
  })

  test('removes listener on dispose', () => {
    const removeEventListener = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    })
    const signal = createReducedMotionSignal()
    signal.dispose()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('ReducedMotion provider', () => {
  test('has a provider mark', () => {
    expect(ReducedMotion.mark).toBeDefined()
  })

  test('create returns a signal and dispose function', () => {
    const result = ReducedMotion.create(undefined, {} as any)
    expect(result.value).toBeDefined()
    expect(result.dispose).toBeInstanceOf(Function)
    result.dispose()
  })
})
