import { describe, test, expect } from 'vitest'
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
})

