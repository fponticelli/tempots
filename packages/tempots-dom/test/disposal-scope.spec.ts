import { describe, test, expect, vi } from 'vitest'
import { DisposalScope } from '../src/std/disposal-scope'
import { prop } from '../src/std/signal'

describe('DisposalScope', () => {
  describe('track()', () => {
    test('tracking a signal adds it to the scope', () => {
      const scope = new DisposalScope()
      const signal = prop(0)

      scope.track(signal)

      // Signal should be tracked (we'll verify via dispose)
      expect(scope.disposed).toBe(false)
    })

    test('tracking multiple signals', () => {
      const scope = new DisposalScope()
      const signal1 = prop(0)
      const signal2 = prop(1)
      const signal3 = prop(2)

      scope.track(signal1)
      scope.track(signal2)
      scope.track(signal3)

      expect(scope.disposed).toBe(false)
    })

    test('tracking the same signal twice is idempotent', () => {
      const scope = new DisposalScope()
      const signal = prop(0)

      scope.track(signal)
      scope.track(signal) // Should not throw

      expect(scope.disposed).toBe(false)
    })

    test('tracking a disposed signal throws error', () => {
      const scope = new DisposalScope()
      const signal = prop(0)
      signal.dispose()

      expect(() => scope.track(signal)).toThrow()
    })

    test('tracking in a disposed scope throws error', () => {
      const scope = new DisposalScope()
      scope.dispose()

      const signal = prop(0)
      expect(() => scope.track(signal)).toThrow()
    })
  })

  describe('dispose()', () => {
    test('dispose() calls dispose() on all tracked signals', () => {
      const scope = new DisposalScope()
      const signal1 = prop(0)
      const signal2 = prop(1)

      scope.track(signal1)
      scope.track(signal2)

      expect(signal1.isDisposed()).toBe(false)
      expect(signal2.isDisposed()).toBe(false)

      scope.dispose()

      expect(signal1.isDisposed()).toBe(true)
      expect(signal2.isDisposed()).toBe(true)
    })

    test('dispose() clears the signal set', () => {
      const scope = new DisposalScope()
      const signal = prop(0)

      scope.track(signal)
      scope.dispose()

      // After disposal, tracking new signals should still throw
      const newSignal = prop(1)
      expect(() => scope.track(newSignal)).toThrow()
    })

    test('dispose() is idempotent', () => {
      const scope = new DisposalScope()
      const signal = prop(0)

      scope.track(signal)

      scope.dispose()
      scope.dispose() // Should not throw
      scope.dispose() // Should not throw

      expect(signal.isDisposed()).toBe(true)
    })

    test('disposed property returns true after disposal', () => {
      const scope = new DisposalScope()

      expect(scope.disposed).toBe(false)

      scope.dispose()

      expect(scope.disposed).toBe(true)
    })
  })

  describe('onDispose()', () => {
    test('registers a callback to be called on disposal', () => {
      const scope = new DisposalScope()
      const callback = vi.fn()

      scope.onDispose(callback)

      expect(callback).not.toHaveBeenCalled()

      scope.dispose()

      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('registers multiple callbacks', () => {
      const scope = new DisposalScope()
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      const callback3 = vi.fn()

      scope.onDispose(callback1)
      scope.onDispose(callback2)
      scope.onDispose(callback3)

      scope.dispose()

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback3).toHaveBeenCalledTimes(1)
    })

    test('callbacks are called in registration order', () => {
      const scope = new DisposalScope()
      const order: number[] = []

      scope.onDispose(() => order.push(1))
      scope.onDispose(() => order.push(2))
      scope.onDispose(() => order.push(3))

      scope.dispose()

      expect(order).toEqual([1, 2, 3])
    })

    test('callbacks are called before signals are disposed', () => {
      const scope = new DisposalScope()
      const signal = prop(42)
      scope.track(signal)

      let signalValueInCallback: number | undefined

      scope.onDispose(() => {
        signalValueInCallback = signal.value
      })

      scope.dispose()

      expect(signalValueInCallback).toBe(42)
      expect(signal.isDisposed()).toBe(true)
    })

    test('callbacks are not called multiple times on repeated dispose()', () => {
      const scope = new DisposalScope()
      const callback = vi.fn()

      scope.onDispose(callback)

      scope.dispose()
      scope.dispose()
      scope.dispose()

      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('registering callback in disposed scope throws error', () => {
      const scope = new DisposalScope()
      scope.dispose()

      expect(() => scope.onDispose(() => {})).toThrow()
    })

    test('callback errors do not prevent other callbacks from running', () => {
      const scope = new DisposalScope()
      const callback1 = vi.fn()
      const callback2 = vi.fn(() => {
        throw new Error('Test error')
      })
      const callback3 = vi.fn()

      scope.onDispose(callback1)
      scope.onDispose(callback2)
      scope.onDispose(callback3)

      // dispose() should not throw even if a callback throws
      expect(() => scope.dispose()).not.toThrow()

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback3).toHaveBeenCalledTimes(1)
    })

    test('works with both signals and callbacks', () => {
      const scope = new DisposalScope()
      const signal = prop(0)
      const callback = vi.fn()

      scope.track(signal)
      scope.onDispose(callback)

      expect(signal.isDisposed()).toBe(false)
      expect(callback).not.toHaveBeenCalled()

      scope.dispose()

      expect(signal.isDisposed()).toBe(true)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
