import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import {
  MemoryStore,
  storedProp,
  animateSignals,
  computedRecord,
  merge,
  delaySignal,
  signal,
  prop
} from '../src'
import { sleep } from './helper'

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
      store: mockStore
    })

    expect(prop.value).toBe('default')
  })

  test('should load existing value from store', () => {
    mockStore.setItem('test-key', JSON.stringify('stored-value'))

    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore
    })

    expect(prop.value).toBe('stored-value')
  })

  test('should save value to store when changed', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore
    })

    prop.value = 'new-value'
    expect(mockStore.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  test('should use custom serializer/deserializer', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: { count: 0 },
      store: mockStore,
      serialize: (obj) => `custom:${obj.count}`,
      deserialize: (str) => ({ count: parseInt(str.replace('custom:', '')) })
    })

    prop.value = { count: 42 }
    expect(mockStore.getItem('test-key')).toBe('custom:42')

    // Test loading with custom deserializer
    mockStore.setItem('test-key2', 'custom:99')
    const prop2 = storedProp({
      key: 'test-key2',
      defaultValue: { count: 0 },
      store: mockStore,
      serialize: (obj) => `custom:${obj.count}`,
      deserialize: (str) => ({ count: parseInt(str.replace('custom:', '')) })
    })

    expect(prop2.value).toEqual({ count: 99 })
  })

  test('should handle function default value', () => {
    const prop = storedProp({
      key: 'test-key',
      defaultValue: () => 'function-default',
      store: mockStore
    })

    expect(prop.value).toBe('function-default')
  })

  test('should use onLoad callback', () => {
    mockStore.setItem('test-key', JSON.stringify('stored'))

    const prop = storedProp({
      key: 'test-key',
      defaultValue: 'default',
      store: mockStore,
      onLoad: (value) => `loaded:${value}`
    })

    expect(prop.value).toBe('loaded:stored')
  })
})

describe('animateSignals', () => {
  test('should animate between values', async () => {
    const source = prop(0)
    const animated = animateSignals(
      0,
      () => source.value,
      [source],
      { duration: 50 }
    )

    expect(animated.value).toBe(0)

    source.value = 100
    await sleep(25) // Half duration

    expect(animated.value).toBeGreaterThan(0)
    expect(animated.value).toBeLessThan(100)

    await sleep(30) // Complete animation
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
        interpolate: (from, to, progress) => from + (to - from) * progress * progress // Ease-in
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

    const computed = computedRecord(
      { a, b, c: 30 },
      ({ a, b, c }) => a + b + c
    )

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
    const delayed = delaySignal(source, (value) => value * 10)

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
});
