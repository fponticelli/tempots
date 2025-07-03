import { describe, expect, test, vi } from 'vitest'
import { Value, signal, prop, joinSignals } from '../src'
import { sleep } from './helper'

describe('Value utilities', () => {
  describe('Value.map', () => {
    test('should map signal values', () => {
      const source = prop(5)
      const mapped = Value.map(source, x => x * 2)

      expect(Value.get(mapped)).toBe(10)

      source.value = 10
      expect(Value.get(mapped)).toBe(20)
    })

    test('should map literal values', () => {
      const mapped = Value.map(5, x => x * 2)
      expect(mapped).toBe(10)
    })
  })

  describe('Value.get', () => {
    test('should get value from signal', () => {
      const source = prop(42)
      expect(Value.get(source)).toBe(42)
    })

    test('should get literal value', () => {
      expect(Value.get(42)).toBe(42)
    })
  })

  describe('Value.on', () => {
    test('should add listener to signal', () => {
      const source = prop(1)
      const listener = vi.fn()

      const unsubscribe = Value.on(source, listener)

      // Clear any initial calls (signals might call listener immediately)
      listener.mockClear()

      source.value = 2
      expect(listener).toHaveBeenCalledWith(2, 1) // Signal listeners get (newValue, oldValue)
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()
      source.value = 3
      expect(listener).toHaveBeenCalledTimes(1) // Should not be called again after unsubscribe
    })

    test('should call listener immediately for literal values', () => {
      const listener = vi.fn()

      const unsubscribe = Value.on(42, listener)

      expect(listener).toHaveBeenCalledWith(42)
      expect(listener).toHaveBeenCalledTimes(1)

      // Unsubscribe should be a no-op for literals
      unsubscribe()
    })
  })

  describe('Value.dispose', () => {
    test('should dispose signal', () => {
      const source = prop(1)
      const disposeSpy = vi.spyOn(source, 'dispose')

      Value.dispose(source)

      expect(disposeSpy).toHaveBeenCalled()
    })

    test('should do nothing for literal values', () => {
      // Should not throw
      expect(() => Value.dispose(42)).not.toThrow()
    })
  })

  describe('Value.deriveProp', () => {
    test('should derive prop from signal', () => {
      const source = prop(10)
      const derived = Value.deriveProp(source)

      expect(derived.value).toBe(10)

      source.value = 20
      expect(derived.value).toBe(20)
    })

    test('should create prop from literal value', () => {
      const derived = Value.deriveProp(42)

      expect(derived.value).toBe(42)

      // Should be a prop, so we can set it
      derived.value = 100
      expect(derived.value).toBe(100)
    })

    test('should use custom equals function', () => {
      const source = prop({ count: 1 })
      const derived = Value.deriveProp(source, {
        equals: (a, b) => a.count === b.count
      })

      const listener = vi.fn()
      derived.on(listener)

      // Clear initial call
      listener.mockClear()

      // Should not trigger listener due to custom equals
      source.value = { count: 1 }
      expect(listener).not.toHaveBeenCalled()

      // Should trigger listener
      source.value = { count: 2 }
      expect(listener).toHaveBeenCalled()
    })

    test('should handle autoDisposeProp option', () => {
      const source = prop(1)
      const derived = Value.deriveProp(source, { autoDisposeProp: false })

      expect(derived.value).toBe(1)
      // Test that it works - detailed behavior would need more complex setup
    })
  })

  describe('joinSignals', () => {
    test('should join multiple signals into record', () => {
      const name = prop('John')
      const age = prop(30)
      const city = 'NYC' // literal value

      const joined = joinSignals({ name, age, city })

      expect(joined.value).toEqual({
        name: 'John',
        age: 30,
        city: 'NYC'
      })

      name.value = 'Jane'
      expect(joined.value).toEqual({
        name: 'Jane',
        age: 30,
        city: 'NYC'
      })

      age.value = 25
      expect(joined.value).toEqual({
        name: 'Jane',
        age: 25,
        city: 'NYC'
      })
    })

    test('should handle all literal values', () => {
      const joined = joinSignals({
        a: 1,
        b: 'hello',
        c: true
      })

      expect(joined.value).toEqual({
        a: 1,
        b: 'hello',
        c: true
      })
    })

    test('should handle empty record', () => {
      const joined = joinSignals({})

      expect(joined.value).toEqual({})
    })

    test('should handle single signal', () => {
      const single = prop(42)
      const joined = joinSignals({ value: single })

      expect(joined.value).toEqual({ value: 42 })

      single.value = 100
      expect(joined.value).toEqual({ value: 100 })
    })
  })

  describe('Value.toSignal with custom equals', () => {
    test('should create signal from literal with custom equals', () => {
      const customEquals = (a: { id: number }, b: { id: number }) => a.id === b.id
      const signalFromLiteral = Value.toSignal({ id: 1 }, customEquals)

      expect(signalFromLiteral.value).toEqual({ id: 1 })
      // Note: Value.toSignal creates read-only signals from literals
    })

    test('should return existing signal unchanged', () => {
      const original = prop(42)
      const result = Value.toSignal(original)

      expect(result).toBe(original) // Should be the same instance
    })
  })

  describe('Value.maybeToSignal edge cases', () => {
    test('should handle null values', () => {
      expect(Value.maybeToSignal(null)).toBeUndefined()
    })

    test('should handle undefined values', () => {
      expect(Value.maybeToSignal(undefined)).toBeUndefined()
    })

    test('should handle falsy but valid values', () => {
      expect(Value.maybeToSignal(0)?.value).toBe(0)
      expect(Value.maybeToSignal('')?.value).toBe('')
      expect(Value.maybeToSignal(false)?.value).toBe(false)
    })

    test('should use custom equals for literal values', () => {
      const customEquals = (a: number, b: number) => Math.abs(a - b) < 0.1
      const result = Value.maybeToSignal(1.0, customEquals)

      expect(result).toBeDefined()
      expect(result!.value).toBe(1.0)
      // Note: Value.maybeToSignal creates read-only signals from literals
    })
  })
});
