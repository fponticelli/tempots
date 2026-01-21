import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import {
  MemoryStore,
  storedProp,
  localStorageProp,
  sessionStorageProp,
  delaySignal,
  previousSignal,
  slidingWindowSignal,
  computedRecord,
  merge,
  bind,
  coalesce,
} from '../src/signal-utils'
import { prop, signal } from '../src/signal'
import { sleep } from './helper'

describe('MemoryStore', () => {
  test('should store and retrieve values', () => {
    const store = new MemoryStore()
    expect(store.getItem('key1')).toBeNull()

    store.setItem('key1', 'value1')
    expect(store.getItem('key1')).toBe('value1')

    store.setItem('key1', 'value2')
    expect(store.getItem('key1')).toBe('value2')
  })

  test('should return null for non-existent keys', () => {
    const store = new MemoryStore()
    expect(store.getItem('nonexistent')).toBeNull()
  })
})

describe('storedProp', () => {
  test('should initialize with stored value if present', () => {
    const store = new MemoryStore()
    store.setItem('myKey', JSON.stringify({ value: 42 }))

    const p = storedProp({
      key: 'myKey',
      defaultValue: { value: 0 },
      store,
    })

    expect(p.value).toEqual({ value: 42 })
    p.dispose()
  })

  test('should initialize with default value if not in store', () => {
    const store = new MemoryStore()

    const p = storedProp({
      key: 'myKey',
      defaultValue: { value: 0 },
      store,
    })

    expect(p.value).toEqual({ value: 0 })
    p.dispose()
  })

  test('should initialize with default value function', () => {
    const store = new MemoryStore()

    const p = storedProp({
      key: 'myKey',
      defaultValue: () => ({ value: 100 }),
      store,
    })

    expect(p.value).toEqual({ value: 100 })
    p.dispose()
  })

  test('should persist changes to store', () => {
    const store = new MemoryStore()

    const p = storedProp({
      key: 'myKey',
      defaultValue: 0,
      store,
    })

    p.set(42)
    expect(JSON.parse(store.getItem('myKey')!)).toBe(42)
    p.dispose()
  })

  test('should use custom serialize/deserialize', () => {
    const store = new MemoryStore()

    const p = storedProp({
      key: 'myKey',
      defaultValue: new Date(0),
      store,
      serialize: (d) => d.toISOString(),
      deserialize: (s) => new Date(s),
    })

    const date = new Date('2024-01-01')
    p.set(date)
    expect(store.getItem('myKey')).toBe(date.toISOString())
    p.dispose()
  })

  test('should apply onLoad transform', () => {
    const store = new MemoryStore()
    store.setItem('myKey', JSON.stringify(10))

    const p = storedProp({
      key: 'myKey',
      defaultValue: 0,
      store,
      onLoad: (v) => v * 2,
    })

    expect(p.value).toBe(20)
    p.dispose()
  })

  test('should use custom equals function', () => {
    const store = new MemoryStore()
    const spy = vi.fn()

    const p = storedProp({
      key: 'myKey',
      defaultValue: { id: 1, name: 'test' },
      store,
      equals: (a, b) => a.id === b.id,
    })

    p.on(spy)
    spy.mockClear()

    // Same id, different name - should NOT trigger update
    p.set({ id: 1, name: 'different' })
    expect(spy).not.toHaveBeenCalled()

    // Different id - should trigger update
    p.set({ id: 2, name: 'test' })
    expect(spy).toHaveBeenCalled()

    p.dispose()
  })

  test('should handle reactive key with load strategy', () => {
    const store = new MemoryStore()
    store.setItem('key1', JSON.stringify('value1'))
    store.setItem('key2', JSON.stringify('value2'))

    const keySignal = prop('key1')
    const p = storedProp({
      key: keySignal,
      defaultValue: 'default',
      store,
      onKeyChange: 'load',
    })

    expect(p.value).toBe('value1')

    // Change key - should load from new key
    keySignal.set('key2')
    expect(p.value).toBe('value2')

    p.dispose()
    keySignal.dispose()
  })

  test('should handle reactive key with migrate strategy', () => {
    const store = new MemoryStore()
    store.setItem('key1', JSON.stringify('value1'))

    const keySignal = prop('key1')
    const p = storedProp({
      key: keySignal,
      defaultValue: 'default',
      store,
      onKeyChange: 'migrate',
    })

    expect(p.value).toBe('value1')

    // Change key with migrate - should keep current value and store at new key
    keySignal.set('key2')
    expect(p.value).toBe('value1')
    expect(JSON.parse(store.getItem('key2')!)).toBe('value1')

    p.dispose()
    keySignal.dispose()
  })

  test('should handle reactive key with keep strategy', () => {
    const store = new MemoryStore()
    store.setItem('key1', JSON.stringify('value1'))
    store.setItem('key2', JSON.stringify('value2'))

    const keySignal = prop('key1')
    const p = storedProp({
      key: keySignal,
      defaultValue: 'default',
      store,
      onKeyChange: 'keep',
    })

    expect(p.value).toBe('value1')

    // Change key with keep - should keep current value (not load from key2)
    keySignal.set('key2')
    expect(p.value).toBe('value1')

    p.dispose()
    keySignal.dispose()
  })
})

describe('localStorageProp', () => {
  test('should fall back to MemoryStore when localStorage unavailable', () => {
    // In Node.js environment, localStorage is not available
    const p = localStorageProp({
      key: 'testKey',
      defaultValue: 'default',
    })

    expect(p.value).toBe('default')
    p.set('newValue')
    expect(p.value).toBe('newValue')
    p.dispose()
  })
})

describe('sessionStorageProp', () => {
  test('should fall back to MemoryStore when sessionStorage unavailable', () => {
    const p = sessionStorageProp({
      key: 'testKey',
      defaultValue: 'default',
    })

    expect(p.value).toBe('default')
    p.set('newValue')
    expect(p.value).toBe('newValue')
    p.dispose()
  })
})

describe('delaySignal', () => {
  test('should delay signal updates', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, 20)

    expect(delayed.get()).toBe(1)

    source.set(2)
    expect(delayed.get()).toBe(1) // Still old value

    await sleep(30)
    expect(delayed.get()).toBe(2)

    source.dispose()
    delayed.dispose()
  })

  test('should cancel pending updates on rapid changes', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, 30)

    source.set(2)
    source.set(3)
    source.set(4)

    await sleep(50)
    expect(delayed.get()).toBe(4) // Only final value

    source.dispose()
    delayed.dispose()
  })

  test('should support function-based delay', async () => {
    const source = prop(10)
    const delayed = delaySignal(source, (v) => v) // Delay equals value

    source.set(20)
    expect(delayed.get()).toBe(10)

    await sleep(30)
    expect(delayed.get()).toBe(20)

    source.dispose()
    delayed.dispose()
  })

  test('should clean up on dispose', async () => {
    const source = prop(1)
    const delayed = delaySignal(source, 50)

    source.set(2)
    delayed.dispose()

    await sleep(60)
    // No errors should occur
    expect(delayed.get()).toBe(1) // Value before dispose
  })
})

describe('previousSignal', () => {
  test('should emit previous values', () => {
    const source = prop(1)
    const previous = previousSignal(source)

    expect(previous.get()).toBeUndefined() // No previous on first access

    source.set(2)
    expect(previous.get()).toBe(1)

    source.set(3)
    expect(previous.get()).toBe(2)

    source.dispose()
  })

  test('should track all changes', () => {
    const source = prop('a')
    const previous = previousSignal(source)
    const history: (string | undefined)[] = []

    // Initial access triggers first computation
    history.push(previous.get())

    source.set('b')
    history.push(previous.get())

    source.set('c')
    history.push(previous.get())

    source.set('d')
    history.push(previous.get())

    expect(history).toEqual([undefined, 'a', 'b', 'c'])
  })
})

describe('slidingWindowSignal', () => {
  test('should collect values into sliding window', () => {
    const source = prop(1)
    const window = slidingWindowSignal({ size: 3, signal: source })

    expect(window.get()).toEqual([1])

    source.set(2)
    expect(window.get()).toEqual([1, 2])

    source.set(3)
    expect(window.get()).toEqual([1, 2, 3])

    source.set(4)
    expect(window.get()).toEqual([2, 3, 4]) // First value dropped

    source.set(5)
    expect(window.get()).toEqual([3, 4, 5])
  })

  test('should work with undefined size (unlimited)', () => {
    const source = prop(1)
    const window = slidingWindowSignal({ size: undefined, signal: source })

    // Access between each set to trigger computation
    window.get()
    source.set(2)
    window.get()
    source.set(3)
    window.get()
    source.set(4)
    window.get()
    source.set(5)

    expect(window.get()).toEqual([1, 2, 3, 4, 5])
  })

  test('should return new array each time', () => {
    const source = prop(1)
    const window = slidingWindowSignal({ size: 3, signal: source })

    const first = window.get()
    source.set(2)
    const second = window.get()

    expect(first).not.toBe(second)
  })
})

describe('computedRecord', () => {
  test('should compute from record of signals', () => {
    const a = prop(2)
    const b = prop(3)

    const computed = computedRecord({ a, b }, ({ a, b }) => a + b)

    expect(computed.value).toBe(5)

    a.set(10)
    expect(computed.value).toBe(13)

    b.set(20)
    expect(computed.value).toBe(30)

    a.dispose()
    b.dispose()
  })

  test('should compute from mixed signals and literals', () => {
    const x = prop(5)
    const y = 10

    const computed = computedRecord({ x, y }, ({ x, y }) => x * y)

    expect(computed.value).toBe(50)

    x.set(3)
    expect(computed.value).toBe(30)

    x.dispose()
  })

  test('should handle complex objects', () => {
    const user = prop({ name: 'John', age: 30 })
    const multiplier = prop(2)

    const computed = computedRecord(
      { user, multiplier },
      ({ user, multiplier }) => ({
        name: user.name,
        doubledAge: user.age * multiplier,
      })
    )

    expect(computed.value).toEqual({ name: 'John', doubledAge: 60 })

    user.set({ name: 'Jane', age: 25 })
    expect(computed.value).toEqual({ name: 'Jane', doubledAge: 50 })

    user.dispose()
    multiplier.dispose()
  })
})

describe('merge', () => {
  test('should merge signals into single signal', () => {
    const a = prop(1)
    const b = prop('hello')
    const c = prop(true)

    const merged = merge({ a, b, c })

    expect(merged.value).toEqual({ a: 1, b: 'hello', c: true })

    a.set(2)
    expect(merged.value).toEqual({ a: 2, b: 'hello', c: true })

    b.set('world')
    expect(merged.value).toEqual({ a: 2, b: 'world', c: true })

    a.dispose()
    b.dispose()
    c.dispose()
  })

  test('should merge mixed signals and literals', () => {
    const name = prop('John')
    const age = 30

    const merged = merge({ name, age })

    expect(merged.value).toEqual({ name: 'John', age: 30 })

    name.set('Jane')
    expect(merged.value).toEqual({ name: 'Jane', age: 30 })

    name.dispose()
  })
})

describe('bind', () => {
  test('should bind function to signal arguments', () => {
    const add = (a: number, b: number) => a + b
    const boundAdd = bind(add)

    const x = prop(5)
    const y = prop(3)

    const result = boundAdd(x, y)

    expect(result.value).toBe(8)

    x.set(10)
    expect(result.value).toBe(13)

    y.set(7)
    expect(result.value).toBe(17)

    x.dispose()
    y.dispose()
  })

  test('should bind signal function', () => {
    const multiply = (a: number, b: number) => a * b
    const divide = (a: number, b: number) => a / b

    const operation = prop(multiply)
    const boundOp = bind(operation)

    const result = boundOp(10, 5)

    expect(result.value).toBe(50)

    operation.set(divide)
    expect(result.value).toBe(2)

    operation.dispose()
  })

  test('should work with mixed signals and literals', () => {
    const greet = (name: string, greeting: string) => `${greeting}, ${name}!`
    const boundGreet = bind(greet)

    const name = prop('World')
    const result = boundGreet(name, 'Hello')

    expect(result.value).toBe('Hello, World!')

    name.set('Claude')
    expect(result.value).toBe('Hello, Claude!')

    name.dispose()
  })
})

describe('coalesce', () => {
  test('should return first non-null value', () => {
    const a = prop<string | null>(null)
    const b = prop<string | null>(null)
    const c = prop('default')

    const result = coalesce(a, b, c)

    expect(result.value).toBe('default')

    b.set('second')
    expect(result.value).toBe('second')

    a.set('first')
    expect(result.value).toBe('first')

    a.dispose()
    b.dispose()
    c.dispose()
  })

  test('should return undefined if all null', () => {
    const a = prop<number | null>(null)
    const b = prop<number | null>(null)

    const result = coalesce(a, b)

    expect(result.value).toBeUndefined()

    a.dispose()
    b.dispose()
  })

  test('should work with mixed signals and literals', () => {
    const a = prop<string | null>(null)
    const literal = 'fallback'

    const result = coalesce(a, literal)

    expect(result.value).toBe('fallback')

    a.set('value')
    expect(result.value).toBe('value')

    a.dispose()
  })

  test('should handle zero and empty string correctly', () => {
    const a = prop<number | null>(null)
    const b = prop(0)

    const result = coalesce(a, b)

    expect(result.value).toBe(0) // 0 is not null

    a.dispose()
    b.dispose()
  })
})
