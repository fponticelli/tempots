import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { withViewTransition } from '../src/utils/view-transition'

describe('view-transition.ts', () => {
  let originalStartViewTransition: typeof document.startViewTransition

  beforeEach(() => {
    vi.clearAllMocks()
    // Store the original method
    originalStartViewTransition = document.startViewTransition
  })

  afterEach(() => {
    // Restore the original method
    document.startViewTransition = originalStartViewTransition
  })

  describe('withViewTransition', () => {
    it('should be a function', () => {
      expect(typeof withViewTransition).toBe('function')
    })

    it('should call document.startViewTransition when available', () => {
      const mockStartViewTransition = vi.fn()
      document.startViewTransition = mockStartViewTransition

      const callback = vi.fn()
      withViewTransition(callback)

      expect(mockStartViewTransition).toHaveBeenCalledWith(callback)
      expect(callback).not.toHaveBeenCalled() // Should be called by startViewTransition, not directly
    })

    it('should call callback directly when document.startViewTransition is not available', () => {
      // Remove the startViewTransition method
      document.startViewTransition = undefined as any

      const callback = vi.fn()
      withViewTransition(callback)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should call callback directly when document.startViewTransition is null', () => {
      // Set startViewTransition to null
      document.startViewTransition = null as any

      const callback = vi.fn()
      withViewTransition(callback)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle callback that returns a value', () => {
      document.startViewTransition = undefined as any

      const callback = vi.fn(() => 'test-return-value')
      withViewTransition(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      // The function doesn't return the callback result, it's void
    })

    it('should handle callback that throws an error', () => {
      document.startViewTransition = undefined as any

      const callback = vi.fn(() => {
        throw new Error('Test error')
      })

      expect(() => withViewTransition(callback)).toThrow('Test error')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should work with async callbacks when startViewTransition is available', () => {
      const mockStartViewTransition = vi.fn()
      document.startViewTransition = mockStartViewTransition

      const asyncCallback = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async-result'
      })

      withViewTransition(asyncCallback)

      expect(mockStartViewTransition).toHaveBeenCalledWith(asyncCallback)
    })

    it('should work with async callbacks when startViewTransition is not available', async () => {
      document.startViewTransition = undefined as any

      const asyncCallback = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async-result'
      })

      withViewTransition(asyncCallback)

      expect(asyncCallback).toHaveBeenCalledTimes(1)
      // The function doesn't return the callback result, it's void
    })

    it('should handle empty callback', () => {
      document.startViewTransition = undefined as any

      const callback = vi.fn()
      withViewTransition(callback)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle callback with side effects', () => {
      document.startViewTransition = undefined as any

      let sideEffect = false
      const callback = vi.fn(() => {
        sideEffect = true
      })

      withViewTransition(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(sideEffect).toBe(true)
    })
  })
})
