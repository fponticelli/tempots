import { describe, expect, test } from 'vitest'
import { DisposalScope } from '../src/std/disposal-scope'
import { prop, computed, effect, Prop, Computed } from '../src/std/signal'
import { untracked } from '../src/std/scope-stack'

describe('DisposalScope helper methods', () => {
  const sleep = () => new Promise(resolve => setTimeout(resolve, 0))

  describe('scope.prop()', () => {
    test('creates and tracks a prop signal', () => {
      const scope = new DisposalScope()
      const signal = scope.prop(42)

      expect(signal.value).toBe(42)
      expect(signal.isDisposed()).toBe(false)

      scope.dispose()
      expect(signal.isDisposed()).toBe(true)
    })

    test('works in async contexts', async () => {
      const scope = new DisposalScope()
      let signal: Prop<number> | null = null

      await Promise.resolve().then(() => {
        signal = scope.prop(100)
      })

      expect(signal!.value).toBe(100)
      expect(signal!.isDisposed()).toBe(false)

      scope.dispose()
      expect(signal!.isDisposed()).toBe(true)
    })

    test('does not double-track when called inside a scope context', () => {
      const scope = new DisposalScope()

      // Even if we're in an untracked context, scope.prop should still track
      const signal = untracked(() => scope.prop(50))

      expect(signal.value).toBe(50)

      scope.dispose()
      expect(signal.isDisposed()).toBe(true)
    })

    test('accepts custom equals function', () => {
      const scope = new DisposalScope()
      const signal = scope.prop(42, () => true) // always equal

      let callCount = 0
      signal.onChange(() => callCount++)

      signal.set(100)
      expect(callCount).toBe(0) // Should not notify because equals returns true

      scope.dispose()
    })
  })

  describe('scope.computed()', () => {
    test('creates and tracks a computed signal', () => {
      const scope = new DisposalScope()
      const source = prop(10)
      const derived = scope.computed(() => source.value * 2, [source])

      expect(derived.value).toBe(20)
      expect(derived.isDisposed()).toBe(false)

      scope.dispose()
      expect(derived.isDisposed()).toBe(true)

      // Clean up
      source.dispose()
    })

    test('works in async contexts', async () => {
      const scope = new DisposalScope()
      const source = prop(5)
      let derived: Computed<number> | null = null

      await Promise.resolve().then(() => {
        derived = scope.computed(() => source.value * 3, [source])
      })

      expect(derived!.value).toBe(15)

      scope.dispose()
      expect(derived!.isDisposed()).toBe(true)

      // Clean up
      source.dispose()
    })

    test('respects dependencies array', () => {
      const scope = new DisposalScope()
      const source1 = prop(10)
      const source2 = prop(20)
      let callCount = 0

      const derived = scope.computed(() => {
        callCount++
        return source1.value + source2.value
      }, [source1]) // Only depends on source1

      expect(derived.value).toBe(30)
      expect(callCount).toBe(1)

      source2.set(30) // Should not trigger recomputation
      expect(callCount).toBe(1)

      source1.set(15) // Should trigger recomputation
      expect(derived.value).toBe(45)
      expect(callCount).toBe(2)

      // Clean up
      scope.dispose()
      source1.dispose()
      source2.dispose()
    })

    test('accepts custom equals function', () => {
      const scope = new DisposalScope()
      const source = prop(10)

      // Just verify that the equals parameter is accepted and the signal works
      const derived = scope.computed(
        () => source.value * 2,
        [source],
        (a, b) => a === b
      )

      expect(derived.value).toBe(20)

      source.set(15)
      expect(derived.value).toBe(30)

      scope.dispose()
      source.dispose()
    })
  })

  describe('scope.effect()', () => {
    test('creates and tracks an effect', async () => {
      const scope = new DisposalScope()
      const source = prop(10)
      let callCount = 0

      scope.effect(() => {
        callCount++
        source.value
      }, [source])

      await sleep()
      expect(callCount).toBe(1)

      source.set(20)
      await sleep()
      expect(callCount).toBe(2)

      scope.dispose()

      // Effect should be disposed
      source.set(30)
      await sleep()
      expect(callCount).toBe(2)

      // Clean up
      source.dispose()
    })

    test('works in async contexts', async () => {
      const scope = new DisposalScope()
      const source = prop(5)
      let callCount = 0

      await Promise.resolve().then(() => {
        scope.effect(() => {
          callCount++
          source.value
        }, [source])
      })

      await sleep()
      expect(callCount).toBe(1)

      scope.dispose()

      source.set(10)
      await sleep()
      expect(callCount).toBe(1)

      // Clean up
      source.dispose()
    })

    test('respects signals array', async () => {
      const scope = new DisposalScope()
      const source1 = prop(10)
      const source2 = prop(20)
      let callCount = 0

      scope.effect(() => {
        callCount++
        source1.value
        source2.value
      }, [source1]) // Only listens to source1

      await sleep()
      expect(callCount).toBe(1)

      source2.set(30) // Should not trigger effect
      await sleep()
      expect(callCount).toBe(1)

      source1.set(15) // Should trigger effect
      await sleep()
      expect(callCount).toBe(2)

      // Clean up
      scope.dispose()
      source1.dispose()
      source2.dispose()
    })

    test('supports effect options', async () => {
      const scope = new DisposalScope()
      const source = prop(10)
      let callCount = 0

      scope.effect(
        () => {
          callCount++
          source.value
        },
        [source],
        { skipInitial: true }
      )

      await sleep()
      expect(callCount).toBe(0) // skipInitial should prevent initial call

      source.set(20)
      await sleep()
      expect(callCount).toBe(1)

      // Clean up
      scope.dispose()
      source.dispose()
    })
  })

  describe('scope.computedOf()', () => {
    test('creates and tracks a computed signal with curried signature', () => {
      const scope = new DisposalScope()
      const source1 = prop(10)
      const source2 = prop(20)

      const derived = scope.computedOf(source1, source2)((a, b) => a + b)

      expect(derived.value).toBe(30)

      scope.dispose()
      expect(derived.isDisposed()).toBe(true)

      // Clean up
      source1.dispose()
      source2.dispose()
    })

    test('works with mixed signals and literals', () => {
      const scope = new DisposalScope()
      const source = prop(10)

      const derived = scope.computedOf(source, 5)((a, b) => a + b)

      expect(derived.value).toBe(15)

      source.set(20)
      expect(derived.value).toBe(25)

      scope.dispose()
      source.dispose()
    })

    test('works in async contexts', async () => {
      const scope = new DisposalScope()
      const source = prop(10)
      let derived: Computed<number> | null = null

      await Promise.resolve().then(() => {
        derived = scope.computedOf(source, 2)((a, b) => a * b)
      })

      expect(derived!.value).toBe(20)

      scope.dispose()
      source.dispose()
    })
  })

  describe('scope.effectOf()', () => {
    test('creates and tracks an effect with curried signature', async () => {
      const scope = new DisposalScope()
      const source1 = prop(10)
      const source2 = prop(20)
      let lastSum = 0

      scope.effectOf(
        source1,
        source2
      )((a, b) => {
        lastSum = a + b
      })

      await sleep()
      expect(lastSum).toBe(30)

      source1.set(15)
      await sleep()
      expect(lastSum).toBe(35)

      scope.dispose()

      source2.set(30)
      await sleep()
      expect(lastSum).toBe(35) // Should not update after disposal

      // Clean up
      source1.dispose()
      source2.dispose()
    })

    test('works with mixed signals and literals', async () => {
      const scope = new DisposalScope()
      const source = prop(10)
      let result = 0

      scope.effectOf(
        source,
        5
      )((a, b) => {
        result = a + b
      })

      await sleep()
      expect(result).toBe(15)

      scope.dispose()
      source.dispose()
    })

    test('works in async contexts', async () => {
      const scope = new DisposalScope()
      const source = prop(10)
      let result = 0

      await Promise.resolve().then(() => {
        scope.effectOf(
          source,
          2
        )((a, b) => {
          result = a * b
        })
      })

      await sleep()
      expect(result).toBe(20)

      scope.dispose()
      source.dispose()
    })
  })
})
