import { describe, test, expect, beforeEach } from 'vitest'
import { prop, computed, effect } from '../src/std/signal'
import { DisposalScope } from '../src/std/disposal-scope'
import { scopeStack, pushScope, popScope, scoped } from '../src/std/scope-stack'

describe('signal-auto-registration', () => {
  // Clear the stack before each test
  beforeEach(() => {
    scopeStack.length = 0
  })

  describe('prop() auto-registration', () => {
    test('prop() called inside a scope is tracked', () => {
      const scope = new DisposalScope()
      let signal: ReturnType<typeof prop> | null = null

      pushScope(scope)
      signal = prop(0)
      popScope()

      expect(signal.isDisposed()).toBe(false)

      scope.dispose()

      expect(signal.isDisposed()).toBe(true)
    })

    test('prop() called outside a scope is NOT tracked', () => {
      const signal = prop(0)

      expect(signal.isDisposed()).toBe(false)

      // Signal should still be alive since it wasn't tracked
      expect(signal.isDisposed()).toBe(false)

      // Clean up
      signal.dispose()
    })

    test('multiple prop() calls in same scope are all tracked', () => {
      const scope = new DisposalScope()
      let signal1: ReturnType<typeof prop> | null = null
      let signal2: ReturnType<typeof prop> | null = null
      let signal3: ReturnType<typeof prop> | null = null

      pushScope(scope)
      signal1 = prop(1)
      signal2 = prop(2)
      signal3 = prop(3)
      popScope()

      scope.dispose()

      expect(signal1.isDisposed()).toBe(true)
      expect(signal2.isDisposed()).toBe(true)
      expect(signal3.isDisposed()).toBe(true)
    })

    test('prop() in nested scopes tracks in innermost scope', () => {
      const outerScope = new DisposalScope()
      const innerScope = new DisposalScope()
      let outerSignal: ReturnType<typeof prop> | null = null
      let innerSignal: ReturnType<typeof prop> | null = null

      pushScope(outerScope)
      outerSignal = prop(1)

      pushScope(innerScope)
      innerSignal = prop(2)
      popScope()

      popScope()

      // Dispose inner scope - only innerSignal should be disposed
      innerScope.dispose()
      expect(innerSignal.isDisposed()).toBe(true)
      expect(outerSignal.isDisposed()).toBe(false)

      // Dispose outer scope - outerSignal should now be disposed
      outerScope.dispose()
      expect(outerSignal.isDisposed()).toBe(true)
    })
  })

  describe('computed() auto-registration', () => {
    test('computed() called inside a scope is tracked', () => {
      const scope = new DisposalScope()
      let source: ReturnType<typeof prop> | null = null
      let derived: ReturnType<typeof computed> | null = null

      pushScope(scope)
      source = prop(0)
      derived = computed(() => source!.value * 2, [source!])
      popScope()

      scope.dispose()

      expect(source!.isDisposed()).toBe(true)
      expect(derived!.isDisposed()).toBe(true)
    })

    test('computed() called outside a scope is NOT tracked', () => {
      const source = prop(0)
      const derived = computed(() => source.value * 2, [source])

      expect(derived.isDisposed()).toBe(false)

      // Clean up
      derived.dispose()
      source.dispose()
    })
  })

  describe('effect() auto-registration', () => {
    const sleep = () => new Promise(resolve => setTimeout(resolve, 0))

    test('effect() called inside a scope is tracked', async () => {
      const scope = new DisposalScope()
      let source: ReturnType<typeof prop> | null = null
      let callCount = 0

      pushScope(scope)
      source = prop(0)
      effect(() => {
        callCount++
        source!.value
      }, [source!])
      popScope()

      await sleep()
      expect(callCount).toBe(1)

      source!.set(1)
      await sleep()
      expect(callCount).toBe(2)

      scope.dispose()

      // Effect should be disposed, so changing source shouldn't trigger it
      source!.set(2)
      await sleep()
      expect(callCount).toBe(2)

      // Clean up
      source!.dispose()
    })

    test('effect() called outside a scope is NOT tracked', async () => {
      const source = prop(0)
      let callCount = 0

      const clear = effect(() => {
        callCount++
        source.value
      }, [source])

      await sleep()
      expect(callCount).toBe(1)

      // Clean up
      clear()
      source.dispose()
    })
  })

  describe('signal.map() auto-registration', () => {
    test('derived signals from .map() are tracked', () => {
      const scope = new DisposalScope()
      let source: ReturnType<typeof prop> | null = null
      let derived: ReturnType<(typeof prop<number>)['map']> | null = null

      pushScope(scope)
      source = prop(5)
      derived = source.map(x => x * 2)
      popScope()

      expect(source.isDisposed()).toBe(false)
      expect(derived.isDisposed()).toBe(false)

      scope.dispose()

      expect(source.isDisposed()).toBe(true)
      expect(derived.isDisposed()).toBe(true)
    })

    test('disposing scope disposes derived signals', () => {
      const scope = new DisposalScope()
      let source: ReturnType<typeof prop> | null = null
      let derived1: ReturnType<(typeof prop<number>)['map']> | null = null
      let derived2: ReturnType<(typeof prop<number>)['map']> | null = null

      pushScope(scope)
      source = prop(10)
      derived1 = source.map(x => x * 2)
      derived2 = derived1.map(x => x + 1)
      popScope()

      expect(source.isDisposed()).toBe(false)
      expect(derived1.isDisposed()).toBe(false)
      expect(derived2.isDisposed()).toBe(false)

      scope.dispose()

      expect(source.isDisposed()).toBe(true)
      expect(derived1.isDisposed()).toBe(true)
      expect(derived2.isDisposed()).toBe(true)
    })

    test('derived signals created outside scope are NOT tracked', () => {
      const source = prop(5)
      const derived = source.map(x => x * 2)

      expect(source.isDisposed()).toBe(false)
      expect(derived.isDisposed()).toBe(false)

      // Clean up
      derived.dispose()
      source.dispose()
    })

    test('chained map() calls are all tracked', () => {
      const scope = new DisposalScope()
      let source: ReturnType<typeof prop> | null = null
      let step1: ReturnType<(typeof prop<number>)['map']> | null = null
      let step2: ReturnType<(typeof prop<number>)['map']> | null = null
      let step3: ReturnType<(typeof prop<string>)['map']> | null = null

      pushScope(scope)
      source = prop(5)
      step1 = source.map(x => x * 2)
      step2 = step1.map(x => x + 10)
      step3 = step2.map(x => `Result: ${x}`)
      popScope()

      scope.dispose()

      expect(source.isDisposed()).toBe(true)
      expect(step1.isDisposed()).toBe(true)
      expect(step2.isDisposed()).toBe(true)
      expect(step3.isDisposed()).toBe(true)
    })
  })

  describe('scoped() integration', () => {
    const sleep = () => new Promise(resolve => setTimeout(resolve, 0))

    test('signals created in scoped() are disposed', () => {
      let signal: ReturnType<typeof prop> | null = null

      scoped(() => {
        signal = prop(0)
      })

      expect(signal!.isDisposed()).toBe(true)
    })

    test('computed created in scoped() is disposed', () => {
      let source: ReturnType<typeof prop> | null = null
      let derived: ReturnType<typeof computed> | null = null

      scoped(() => {
        source = prop(0)
        derived = computed(() => source!.value * 2, [source!])
      })

      expect(source!.isDisposed()).toBe(true)
      expect(derived!.isDisposed()).toBe(true)
    })

    test('effect created in scoped() is disposed before it runs', async () => {
      let source: ReturnType<typeof prop> | null = null
      let callCount = 0

      scoped(() => {
        source = prop(0)
        effect(() => {
          callCount++
          source!.value
        }, [source!])
      })

      // Effect is disposed immediately, so it never runs
      await sleep()
      expect(callCount).toBe(0)

      // Effect should be disposed, so changing source shouldn't trigger it
      source!.set(1)
      await sleep()
      expect(callCount).toBe(0)

      // Clean up
      source!.dispose()
    })
  })
})

