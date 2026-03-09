import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import {
  MemoryStore,
  storedProp,
  animateSignals,
  computedRecord,
  merge,
  delaySignal,
  bind,
  signal,
  prop,
  coalesce,
  syncProp,
} from '../src'
import { sleep } from './helper'

class MockBroadcastChannel {
  static channels = new Map<string, Set<MockBroadcastChannel>>()

  static reset() {
    MockBroadcastChannel.channels.clear()
  }

  public onmessage: ((event: MessageEvent<unknown>) => void) | null = null

  private readonly listeners = new Set<(event: MessageEvent<unknown>) => void>()

  constructor(public readonly name: string) {
    if (!MockBroadcastChannel.channels.has(name)) {
      MockBroadcastChannel.channels.set(name, new Set())
    }
    MockBroadcastChannel.channels.get(name)!.add(this)
  }

  postMessage(data: unknown) {
    const channels = MockBroadcastChannel.channels.get(this.name)
    if (channels == null) return
    const sender = this
    const deliver = () => {
      channels.forEach(channel => {
        // Don't deliver to the sender (matches real BroadcastChannel behavior)
        if (channel === sender) return
        const event = { data } as MessageEvent<unknown>
        channel.listeners.forEach(listener => listener(event))
        channel.onmessage?.(event)
      })
    }
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(deliver)
    } else {
      Promise.resolve().then(deliver)
    }
  }

  addEventListener(
    type: string,
    listener: (event: MessageEvent<unknown>) => void
  ) {
    if (type === 'message') {
      this.listeners.add(listener)
    }
  }

  removeEventListener(
    type: string,
    listener: (event: MessageEvent<unknown>) => void
  ) {
    if (type === 'message') {
      this.listeners.delete(listener)
    }
  }

  close() {
    const channels = MockBroadcastChannel.channels.get(this.name)
    if (channels != null) {
      channels.delete(this)
      if (channels.size === 0) {
        MockBroadcastChannel.channels.delete(this.name)
      }
    }
    this.listeners.clear()
    this.onmessage = null
  }
}

describe('MemoryStore', () => {
  let store: MemoryStore

  beforeEach(() => {
    store = new MemoryStore()
  })

  test('should store and retrieve values', () => {
    store.setItem('key1', 'value1')
    expect(store.getItem('key1')).toBe('value1')
  })

  test('should return null for non-existent keys', () => {
    expect(store.getItem('nonexistent')).toBe(null)
  })

  test('should handle basic storage operations', () => {
    store.setItem('key1', 'value1')
    expect(store.getItem('key1')).toBe('value1')

    store.setItem('key2', 'value2')
    expect(store.getItem('key2')).toBe('value2')

    // MemoryStore is a simple implementation, doesn't have removeItem, clear, length, key methods
    // It only implements the basic Storage interface methods needed for storedProp
  })
})

describe('storedProp', () => {
  let mockStore: MemoryStore

  beforeEach(() => {
    mockStore = new MemoryStore()
  })

  test('should create prop with default value when no stored value', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore,
      syncTabs: false,
    })

    expect(prop.value).toBe('default')
  })

  test('should load existing value from store', () => {
    mockStore.setItem('test-key', JSON.stringify('stored-value'))

    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore,
      syncTabs: false,
    })

    expect(prop.value).toBe('stored-value')
  })

  test('should save value to store when changed', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore,
      syncTabs: false,
    })

    prop.value = 'new-value'
    expect(mockStore.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  test('should use custom serializer/deserializer', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: { count: 0 },
      store: mockStore,
      serialize: obj => `custom:${obj.count}`,
      deserialize: str => ({ count: parseInt(str.replace('custom:', '')) }),
      syncTabs: false,
    })

    prop.value = { count: 42 }
    expect(mockStore.getItem('test-key')).toBe('custom:42')

    // Test loading with custom deserializer
    mockStore.setItem('test-key2', 'custom:99')
    const prop2 = storedProp({
      key: 'test-key2',
      defaultValue: { count: 0 },
      store: mockStore,
      serialize: obj => `custom:${obj.count}`,
      deserialize: str => ({ count: parseInt(str.replace('custom:', '')) }),
      syncTabs: false,
    })

    expect(prop2.value).toEqual({ count: 99 })
  })

  test('should handle function default value', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: () => 'function-default',
      store: mockStore,
      syncTabs: false,
    })

    expect(prop.value).toBe('function-default')
  })

  test('should use onLoad callback', () => {
    mockStore.setItem('test-key', JSON.stringify('stored'))

    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore,
      onLoad: value => `loaded:${value}`,
      syncTabs: false,
    })

    expect(prop.value).toBe('loaded:stored')
  })

  describe('syncTabs', () => {
    let originalBroadcastChannel: typeof window.BroadcastChannel | undefined

    beforeEach(() => {
      originalBroadcastChannel = window.BroadcastChannel
      MockBroadcastChannel.reset()
      ;(
        window as typeof window & {
          BroadcastChannel?: typeof BroadcastChannel
        }
      ).BroadcastChannel =
        MockBroadcastChannel as unknown as typeof BroadcastChannel
    })

    afterEach(() => {
      MockBroadcastChannel.reset()
      if (originalBroadcastChannel === undefined) {
        delete (window as any).BroadcastChannel
      } else {
        window.BroadcastChannel = originalBroadcastChannel
      }
    })

    test('should sync updates across tabs when supported', async () => {
      const store = new MemoryStore()
      const propA = storedProp({
        key: 'sync-key',
        defaultValue: 'first',
        store,
        syncTabs: true,
      })
      const propB = storedProp({
        key: 'sync-key',
        defaultValue: 'second',
        store,
        syncTabs: true,
      })

      propA.value = 'updated'

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(propB.value).toBe('updated')

      propA.dispose()
      propB.dispose()
    })

    test('should not sync when flag is disabled', async () => {
      const store = new MemoryStore()
      const propA = storedProp({
        key: 'no-sync',
        defaultValue: 'value-a',
        store,
        syncTabs: false,
      })
      const propB = storedProp({
        key: 'no-sync',
        defaultValue: 'value-b',
        store,
        syncTabs: false,
      })

      propA.value = 'changed'

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(propB.value).toBe('value-a')

      propA.dispose()
      propB.dispose()
    })

    test('should ignore syncTabs when broadcast channel is unsupported', () => {
      delete (window as any).BroadcastChannel

      const store = new MemoryStore()
      const prop = storedProp({
        key: 'unsupported-sync',
        defaultValue: 'value',
        store,
        syncTabs: true,
      })

      expect(() => {
        prop.value = 'next'
      }).not.toThrow()

      prop.dispose()
    })
  })

  describe('reactive key', () => {
    let mockStore: MemoryStore

    beforeEach(() => {
      mockStore = new MemoryStore()
    })

    test('should work with static string key (backward compatibility)', () => {
      const prop = storedProp({
        key: 'static-key',
        defaultValue: 'initial',
        store: mockStore,
        syncTabs: false,
      })

      expect(prop.value).toBe('initial')
      prop.value = 'updated'
      expect(mockStore.getItem('static-key')).toBe('"updated"')

      prop.dispose()
    })

    test('should load value from new key when key changes (default behavior)', async () => {
      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: false,
      })

      storedProp1.value = 'value1'
      expect(mockStore.getItem('key1')).toBe('"value1"')

      // Pre-populate key2 with a different value
      mockStore.setItem('key2', '"value2"')

      // Change key - should load from key2
      keySignal.value = 'key2'
      await sleep(10)

      expect(storedProp1.value).toBe('value2')
      expect(mockStore.getItem('key1')).toBe('"value1"') // old key still has old value
      expect(mockStore.getItem('key2')).toBe('"value2"')

      storedProp1.dispose()
    })

    test('should migrate current value to new key when onKeyChange is "migrate"', async () => {
      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: false,
        onKeyChange: 'migrate',
      })

      storedProp1.value = 'value1'
      expect(mockStore.getItem('key1')).toBe('"value1"')

      // Pre-populate key2 with a different value
      mockStore.setItem('key2', '"value2"')

      // Change key - should migrate current value
      keySignal.value = 'key2'
      await sleep(10)

      expect(storedProp1.value).toBe('value1') // keeps current value
      expect(mockStore.getItem('key1')).toBe('"value1"') // old key still has old value
      expect(mockStore.getItem('key2')).toBe('"value1"') // new key has migrated value

      storedProp1.dispose()
    })

    test('should keep current value when onKeyChange is "keep"', async () => {
      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: false,
        onKeyChange: 'keep',
      })

      storedProp1.value = 'value1'
      expect(mockStore.getItem('key1')).toBe('"value1"')

      // Pre-populate key2 with a different value
      mockStore.setItem('key2', '"value2"')

      // Change key - should keep current value
      keySignal.value = 'key2'
      await sleep(10)

      expect(storedProp1.value).toBe('value1') // keeps current value
      expect(mockStore.getItem('key1')).toBe('"value1"') // old key still has old value
      expect(mockStore.getItem('key2')).toBe('"value2"') // new key unchanged

      storedProp1.dispose()
    })

    test('should store current value at new key when loading and new key is empty', async () => {
      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: false,
        onKeyChange: 'load',
      })

      storedProp1.value = 'value1'
      expect(mockStore.getItem('key1')).toBe('"value1"')

      // Change key to empty key
      keySignal.value = 'key2'
      await sleep(10)

      expect(storedProp1.value).toBe('value1') // keeps current value since key2 is empty
      expect(mockStore.getItem('key2')).toBe('"value1"') // new key gets current value

      storedProp1.dispose()
    })

    test('should handle multiple key changes', async () => {
      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: false,
        onKeyChange: 'migrate',
      })

      storedProp1.value = 'value1'
      expect(mockStore.getItem('key1')).toBe('"value1"')

      keySignal.value = 'key2'
      await sleep(10)
      expect(storedProp1.value).toBe('value1')
      expect(mockStore.getItem('key2')).toBe('"value1"')

      storedProp1.value = 'value2'
      expect(mockStore.getItem('key2')).toBe('"value2"')

      keySignal.value = 'key3'
      await sleep(10)
      expect(storedProp1.value).toBe('value2')
      expect(mockStore.getItem('key3')).toBe('"value2"')

      storedProp1.dispose()
    })

    test('should handle BroadcastChannel cleanup on key change', async () => {
      const originalBroadcastChannel = window.BroadcastChannel
      MockBroadcastChannel.reset()
      ;(
        window as typeof window & {
          BroadcastChannel?: typeof BroadcastChannel
        }
      ).BroadcastChannel =
        MockBroadcastChannel as unknown as typeof BroadcastChannel

      const keySignal = prop('key1')
      const storedProp1 = storedProp({
        key: keySignal,
        defaultValue: 'default',
        store: mockStore,
        syncTabs: true,
      })

      expect(MockBroadcastChannel.channels.has('tempo:storedProp:key1')).toBe(
        true
      )

      keySignal.value = 'key2'
      await sleep(10)

      expect(MockBroadcastChannel.channels.has('tempo:storedProp:key1')).toBe(
        false
      )
      expect(MockBroadcastChannel.channels.has('tempo:storedProp:key2')).toBe(
        true
      )

      storedProp1.dispose()
      MockBroadcastChannel.reset()

      if (originalBroadcastChannel === undefined) {
        delete (window as any).BroadcastChannel
      } else {
        window.BroadcastChannel = originalBroadcastChannel
      }
    })
  })
})

describe('animateSignals', () => {
  test('should animate between values', async () => {
    const source = prop(0)
    const animated = animateSignals(0, () => source.value, [source], {
      duration: 50,
    })

    expect(animated.value).toBe(0)

    source.value = 100
    await sleep(10) // Early in animation

    expect(animated.value).toBeGreaterThanOrEqual(0)
    expect(animated.value).toBeLessThanOrEqual(100)

    await sleep(150) // Complete animation with margin for CI timing variations
    expect(animated.value).toBe(100)
  })

  test('should use custom interpolation', async () => {
    const source = prop(0)
    const animated = animateSignals(
      0,
      () => source.value * 2, // Custom function
      [source],
      {
        duration: 50,
        interpolate: (from, to, progress) =>
          from + (to - from) * progress * progress, // Ease-in
      }
    )

    source.value = 10 // Should become 20 after function
    await sleep(60)

    expect(animated.value).toBe(20)
  })
})

describe('computedRecord', () => {
  test('should compute from record of signals and literals', () => {
    const a = prop(10)
    const b = prop(20)

    const computed = computedRecord({ a, b, c: 30 }, ({ a, b, c }) => a + b + c)

    expect(computed.value).toBe(60)

    a.value = 15
    expect(computed.value).toBe(65)
  })

  test('should handle mixed signals and literals', () => {
    const name = prop('John')
    const computed = computedRecord(
      { name, age: 25, city: 'NYC' },
      ({ name, age, city }) => `${name}, ${age}, ${city}`
    )

    expect(computed.value).toBe('John, 25, NYC')

    name.value = 'Jane'
    expect(computed.value).toBe('Jane, 25, NYC')
  })
})

describe('merge', () => {
  test('should merge signals and literals into single signal', () => {
    const a = prop(1)
    const b = prop(2)

    const merged = merge({ a, b, c: 3 })

    expect(merged.value).toEqual({ a: 1, b: 2, c: 3 })

    a.value = 10
    expect(merged.value).toEqual({ a: 10, b: 2, c: 3 })
  })
})

describe('delaySignal', () => {
  test('should delay signal updates', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, 50)

    expect(delayed.value).toBe(1)

    source.value = 2
    expect(delayed.value).toBe(1) // Should still be old value

    await sleep(60)
    expect(delayed.value).toBe(2) // Should now be updated
  })

  test('should use function for delay calculation', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, value => value * 10)

    source.value = 5 // Should delay by 50ms
    expect(delayed.value).toBe(1)

    await sleep(60)
    expect(delayed.value).toBe(5)
  })

  test('should cancel previous timeout on rapid changes', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, 50)

    source.value = 2
    await sleep(25) // Half delay
    source.value = 3 // Should cancel previous timeout

    await sleep(30) // Less than full delay from first change
    expect(delayed.value).toBe(1) // Should still be original

    await sleep(30) // Complete delay from second change
    expect(delayed.value).toBe(3)
  })
})

describe('bind', () => {
  test('should bind a literal function with literal arguments', () => {
    const add = (a: number, b: number) => a + b
    const boundAdd = bind(add)

    const result = boundAdd(5, 3)

    expect(result.value).toBe(8)
  })

  test('should bind a literal function with signal arguments', () => {
    const multiply = (a: number, b: number) => a * b
    const boundMultiply = bind(multiply)

    const a = prop(4)
    const b = prop(6)
    const result = boundMultiply(a, b)

    expect(result.value).toBe(24)

    // Should update when signals change
    a.value = 5
    expect(result.value).toBe(30)

    b.value = 7
    expect(result.value).toBe(35)
  })

  test('should bind a literal function with mixed signal and literal arguments', () => {
    const subtract = (a: number, b: number) => a - b
    const boundSubtract = bind(subtract)

    const a = prop(10)
    const result = boundSubtract(a, 3)

    expect(result.value).toBe(7)

    a.value = 15
    expect(result.value).toBe(12)
  })

  test('should bind a signal of a function', () => {
    const add = (a: number, b: number) => a + b
    const multiply = (a: number, b: number) => a * b
    const fnSignal = prop(add)
    const boundFn = bind(fnSignal)

    const a = prop(4)
    const b = prop(5)
    const result = boundFn(a, b)

    expect(result.value).toBe(9) // add(4, 5)

    // Change the function
    fnSignal.value = multiply
    expect(result.value).toBe(20) // multiply(4, 5)

    // Change arguments
    a.value = 3
    expect(result.value).toBe(15) // multiply(3, 5)
  })

  test('should handle functions with different arities', () => {
    const unary = (x: number) => x * 2
    const binary = (x: number, y: number) => x + y
    const ternary = (x: number, y: number, z: number) => x + y + z

    const boundUnary = bind(unary)
    const boundBinary = bind(binary)
    const boundTernary = bind(ternary)

    const x = prop(5)
    const y = prop(3)
    const z = prop(2)

    expect(boundUnary(x).value).toBe(10)
    expect(boundBinary(x, y).value).toBe(8)
    expect(boundTernary(x, y, z).value).toBe(10)
  })

  test('should handle functions with no arguments', () => {
    const getValue = () => 42
    const boundGetValue = bind(getValue)

    const result = boundGetValue()

    expect(result.value).toBe(42)
  })

  test('should handle functions returning different types', () => {
    const toString = (n: number) => n.toString()
    const toBoolean = (n: number) => n > 0
    const toArray = (n: number) => [n, n * 2]

    const boundToString = bind(toString)
    const boundToBoolean = bind(toBoolean)
    const boundToArray = bind(toArray)

    const num = prop(5)

    expect(boundToString(num).value).toBe('5')
    expect(boundToBoolean(num).value).toBe(true)
    expect(boundToArray(num).value).toEqual([5, 10])

    num.value = -3
    expect(boundToString(num).value).toBe('-3')
    expect(boundToBoolean(num).value).toBe(false)
    expect(boundToArray(num).value).toEqual([-3, -6])
  })

  test('should handle complex object arguments', () => {
    const processUser = (user: { name: string; age: number }) =>
      `${user.name} is ${user.age} years old`

    const boundProcessUser = bind(processUser)

    const user = prop({ name: 'Alice', age: 30 })
    const result = boundProcessUser(user)

    expect(result.value).toBe('Alice is 30 years old')

    user.value = { name: 'Bob', age: 25 }
    expect(result.value).toBe('Bob is 25 years old')
  })

  test('should handle functions that throw errors', () => {
    const throwingFn = (shouldThrow: boolean) => {
      if (shouldThrow) throw new Error('Test error')
      return 'success'
    }

    const boundThrowingFn = bind(throwingFn)
    const shouldThrow = prop(false)
    const result = boundThrowingFn(shouldThrow)

    expect(result.value).toBe('success')

    // When the function throws, the computed signal should handle it
    shouldThrow.value = true
    expect(() => result.value).toThrow('Test error')
  })

  test('should work with arrow functions', () => {
    const arrowFn = (x: number, y: number) => x ** y
    const boundArrowFn = bind(arrowFn)

    const base = prop(2)
    const exponent = prop(3)
    const result = boundArrowFn(base, exponent)

    expect(result.value).toBe(8) // 2^3

    exponent.value = 4
    expect(result.value).toBe(16) // 2^4
  })

  test('should work with method references', () => {
    const obj = {
      multiplier: 10,
      multiply(x: number) {
        return x * this.multiplier
      },
    }

    // Bind the method (note: this will lose the `this` context)
    const boundMethod = bind(obj.multiply.bind(obj))
    const input = prop(5)
    const result = boundMethod(input)

    expect(result.value).toBe(50)

    input.value = 3
    expect(result.value).toBe(30)
  })

  test('should handle rapid signal changes efficiently', () => {
    const add = (a: number, b: number) => a + b
    const boundAdd = bind(add)

    const a = prop(1)
    const b = prop(2)
    const result = boundAdd(a, b)

    expect(result.value).toBe(3)

    // Rapid changes should only trigger computation once per batch
    a.value = 10
    a.value = 20
    a.value = 30
    b.value = 5

    expect(result.value).toBe(35) // 30 + 5
  })

  test('should handle nested function calls', () => {
    const add = (a: number, b: number) => a + b
    const multiply = (a: number, b: number) => a * b

    const boundAdd = bind(add)
    const boundMultiply = bind(multiply)

    const x = prop(2)
    const y = prop(3)
    const z = prop(4)

    // Create nested computation: (x + y) * z
    const sum = boundAdd(x, y)
    const result = boundMultiply(sum, z)

    expect(result.value).toBe(20) // (2 + 3) * 4

    x.value = 5
    expect(result.value).toBe(32) // (5 + 3) * 4
  })

  test('should properly dispose of computed signals', () => {
    const add = (a: number, b: number) => a + b
    const boundAdd = bind(add)

    const a = prop(1)
    const b = prop(2)
    const result = boundAdd(a, b)

    expect(result.value).toBe(3)

    // Dispose the result signal
    result.dispose()

    // Changes to inputs should not affect the disposed signal
    a.value = 10
    b.value = 20

    // The result should still be the last computed value before disposal
    expect(result.value).toBe(3)
  })

  test('should handle functions with optional parameters', () => {
    const greet = (name: string, greeting?: string) =>
      `${greeting || 'Hello'}, ${name}!`

    const boundGreet = bind(greet)
    const name = prop('Alice')
    const greeting = prop('Hi' as string | undefined)

    // With both parameters
    const result1 = boundGreet(name, greeting)
    expect(result1.value).toBe('Hi, Alice!')

    // With only required parameter (optional should be undefined)
    const result2 = boundGreet(name)
    expect(result2.value).toBe('Hello, Alice!')
  })

  test('should work with async functions that return promises', () => {
    const asyncAdd = async (a: number, b: number) => {
      await new Promise(resolve => setTimeout(resolve, 1))
      return a + b
    }

    const boundAsyncAdd = bind(asyncAdd)
    const a = prop(5)
    const b = prop(3)
    const result = boundAsyncAdd(a, b)

    // The result should be a Promise
    expect(result.value).toBeInstanceOf(Promise)

    // We can test that the promise resolves correctly
    return expect(result.value).resolves.toBe(8)
  })
})

describe('coalesce', () => {
  test('should return first non-null literal value', () => {
    const result = coalesce(null, undefined, 'first-value', 'second-value')
    expect(result.value).toBe('first-value')
  })

  test('should return first non-null signal value', () => {
    const a = prop(null as string | null | undefined)
    const b = prop(undefined as string | undefined | null)
    const c = prop('signal-value')
    const d = prop('another-value')

    const result = coalesce(a, b, c, d)
    expect(result.value).toBe('signal-value')
  })

  test('should update when earlier signal becomes non-null', () => {
    const a = prop(null as string | null)
    const b = prop('fallback')

    const result = coalesce(a, b)
    expect(result.value).toBe('fallback')

    a.value = 'primary'
    expect(result.value).toBe('primary')
  })

  test('should handle mixed signals and literals', () => {
    const signal = prop(null as string | null)
    const result = coalesce(signal, null, undefined, 'literal-value')

    expect(result.value).toBe('literal-value')

    signal.value = 'signal-value'
    expect(result.value).toBe('signal-value')
  })

  test('should return undefined when all values are null/undefined', () => {
    const result = coalesce(
      null as string | null,
      undefined as string | undefined,
      prop(null as string | null),
      prop(undefined as string | undefined)
    )
    expect(result.value).toBeUndefined()
  })

  test('should handle falsy but defined values', () => {
    const result = coalesce(null, undefined, 0, false, '')
    expect(result.value).toBe(0) // First non-null/undefined value
  })

  test('should handle complex objects', () => {
    const obj = { name: 'test', value: 123 }
    const result = coalesce(null, undefined, obj)
    expect(result.value).toEqual(obj)
  })

  test('should handle undefined last', () => {
    const result = coalesce(null, 1, undefined as number | undefined)
    expect(result.value).toBe(1) // Should return first non-null value
  })

  test('should handle nullable last', () => {
    const result = coalesce(3, 1, null as number | null)
    expect(result.value).toBe(3) // Should return first non-null value
  })

  test('should update reactively when multiple signals change', () => {
    const a = prop(null as string | null)
    const b = prop(null as string | null)
    const c = prop('fallback')

    const result = coalesce(a, b, c)
    expect(result.value).toBe('fallback')

    b.value = 'second'
    expect(result.value).toBe('second')

    a.value = 'first'
    expect(result.value).toBe('first')

    a.value = null
    expect(result.value).toBe('second')
  })

  test('should dispose properly', () => {
    const a = prop('value')
    const result = coalesce(null, a)

    expect(result.value).toBe('value')

    result.dispose()

    a.value = 'new-value'
    expect(result.value).toBe('value') // Should not update after disposal
  })

  test('should handle rapid signal changes', () => {
    const a = prop(null as string | null)
    const b = prop('fallback')

    const result = coalesce(a, b)

    a.value = 'first'
    a.value = null
    a.value = 'second'

    expect(result.value).toBe('second')
  })
})

describe('syncProp', () => {
  let originalBroadcastChannel: typeof BroadcastChannel | undefined

  beforeEach(() => {
    // Save original BroadcastChannel
    originalBroadcastChannel = (globalThis as any).BroadcastChannel
    // Replace with mock
    ;(globalThis as any).BroadcastChannel = MockBroadcastChannel
    MockBroadcastChannel.reset()
  })

  afterEach(() => {
    // Restore original BroadcastChannel
    if (originalBroadcastChannel !== undefined) {
      ;(globalThis as any).BroadcastChannel = originalBroadcastChannel
    } else {
      delete (globalThis as any).BroadcastChannel
    }
    MockBroadcastChannel.reset()
  })

  test('should synchronize prop changes across tabs', async () => {
    const prop1 = prop(0)
    const prop2 = prop(0)

    const dispose1 = syncProp(prop1, { channel: 'test-counter' })
    const dispose2 = syncProp(prop2, { channel: 'test-counter' })

    // Change prop1, should sync to prop2
    prop1.value = 42
    await sleep(10)

    expect(prop2.value).toBe(42)

    dispose1()
    dispose2()
  })

  test('should synchronize in both directions', async () => {
    const prop1 = prop('hello')
    const prop2 = prop('hello')

    const dispose1 = syncProp(prop1, { channel: 'test-string' })
    const dispose2 = syncProp(prop2, { channel: 'test-string' })

    // Change prop1
    prop1.value = 'world'
    await sleep(10)
    expect(prop2.value).toBe('world')

    // Change prop2
    prop2.value = 'tempo'
    await sleep(10)
    expect(prop1.value).toBe('tempo')

    dispose1()
    dispose2()
  })

  test('should not sync props with different channels', async () => {
    const prop1 = prop(0)
    const prop2 = prop(0)

    const dispose1 = syncProp(prop1, { channel: 'channel-1' })
    const dispose2 = syncProp(prop2, { channel: 'channel-2' })

    prop1.value = 42
    await sleep(10)

    expect(prop2.value).toBe(0) // Should not change

    dispose1()
    dispose2()
  })

  test('should handle multiple props on same channel', async () => {
    const prop1 = prop(0)
    const prop2 = prop(0)
    const prop3 = prop(0)

    const dispose1 = syncProp(prop1, { channel: 'multi-test' })
    const dispose2 = syncProp(prop2, { channel: 'multi-test' })
    const dispose3 = syncProp(prop3, { channel: 'multi-test' })

    prop1.value = 100
    await sleep(10)

    expect(prop2.value).toBe(100)
    expect(prop3.value).toBe(100)

    dispose1()
    dispose2()
    dispose3()
  })

  test('should use custom serialize/deserialize', async () => {
    const prop1 = prop({ count: 0 })
    const prop2 = prop({ count: 0 })

    const dispose1 = syncProp(prop1, {
      channel: 'custom-serialize',
      serialize: v => JSON.stringify(v),
      deserialize: v => JSON.parse(v),
      equals: (a, b) => a.count === b.count,
    })
    const dispose2 = syncProp(prop2, {
      channel: 'custom-serialize',
      serialize: v => JSON.stringify(v),
      deserialize: v => JSON.parse(v),
      equals: (a, b) => a.count === b.count,
    })

    prop1.value = { count: 42 }
    await sleep(10)

    expect(prop2.value.count).toBe(42)

    dispose1()
    dispose2()
  })

  test('should stop syncing after disposal', async () => {
    const prop1 = prop(0)
    const prop2 = prop(0)

    const dispose1 = syncProp(prop1, { channel: 'disposal-test' })
    const dispose2 = syncProp(prop2, { channel: 'disposal-test' })

    prop1.value = 10
    await sleep(10)
    expect(prop2.value).toBe(10)

    // Dispose prop1's sync
    dispose1()

    // Change prop1 again - should not sync
    prop1.value = 20
    await sleep(10)
    expect(prop2.value).toBe(10) // Should still be 10

    // But prop2 can still send
    prop2.value = 30
    await sleep(10)
    expect(prop1.value).toBe(20) // prop1 not listening anymore

    dispose2()
  })

  test('should not sync initial value', async () => {
    const prop1 = prop(100)
    const prop2 = prop(200)

    const dispose1 = syncProp(prop1, { channel: 'initial-test' })
    const dispose2 = syncProp(prop2, { channel: 'initial-test' })

    await sleep(10)

    // Initial values should not sync
    expect(prop1.value).toBe(100)
    expect(prop2.value).toBe(200)

    dispose1()
    dispose2()
  })

  test('should handle serialization errors gracefully', async () => {
    const prop1 = prop({ value: 1 })
    const prop2 = prop({ value: 2 })

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {})

    const dispose1 = syncProp(prop1, {
      channel: 'error-test',
      serialize: v => {
        throw new Error('Serialize error')
      },
    })
    const dispose2 = syncProp(prop2, {
      channel: 'error-test',
      deserialize: v => {
        throw new Error('Deserialize error')
      },
    })

    // This should not throw, but log a warning
    prop1.value = { value: 42 }
    await sleep(10)

    // prop2 should not have changed due to deserialization error
    expect(prop2.value).toEqual({ value: 2 })
    expect(consoleWarnSpy).toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
    dispose1()
    dispose2()
  })

  test('should not sync when value equals previous value', async () => {
    const prop1 = prop(0)
    const prop2 = prop(100)

    const dispose1 = syncProp(prop1, { channel: 'equals-test' })
    const dispose2 = syncProp(prop2, {
      channel: 'equals-test',
      equals: (a, b) => a === b,
    })

    // Set prop1 to a new value
    prop1.value = 42
    await sleep(10)

    // prop2 should have synced
    expect(prop2.value).toBe(42)

    // Set prop1 to the same value again
    prop1.value = 42
    await sleep(10)

    // prop2 should still be 42 (no change)
    expect(prop2.value).toBe(42)

    dispose1()
    dispose2()
  })

  test('should return no-op disposal when BroadcastChannel is not available', () => {
    // Remove BroadcastChannel
    delete (globalThis as any).BroadcastChannel

    const prop1 = prop(0)
    const dispose = syncProp(prop1, { channel: 'no-bc-test' })

    // Should not throw
    expect(dispose).toBeTypeOf('function')
    dispose()
  })

  test('should not sync messages from same instance', async () => {
    const prop1 = prop(0)
    const prop2 = prop(0)

    const dispose1 = syncProp(prop1, { channel: 'same-instance-test' })
    const dispose2 = syncProp(prop2, { channel: 'same-instance-test' })

    // Change prop1
    prop1.value = 42
    await sleep(10)

    // prop2 should have received the broadcast
    expect(prop2.value).toBe(42)

    // Change prop2
    prop2.value = 100
    await sleep(10)

    // prop1 should have received the broadcast from prop2
    expect(prop1.value).toBe(100)

    dispose1()
    dispose2()
  })
})
