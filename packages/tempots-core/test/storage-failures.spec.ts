import { expect, test, vi } from 'vitest'
import { localStorageProp, MemoryStore, prop, sessionStorageProp, storedProp } from '../src'

test('a corrupt stored value falls back without replacing the original bytes', () => {
  const store = new MemoryStore()
  store.setItem('old', 'not json')
  const key = prop('old')
  const onPersistenceError = vi.fn()
  const value = storedProp({ store, key, defaultValue: 0, onPersistenceError })

  expect(value.value).toBe(0)
  expect(onPersistenceError).toHaveBeenCalledWith(expect.objectContaining({
    key: 'old', operation: 'decode',
  }))
  key.set('new')
  expect(store.getItem('old')).toBe('not json')
  value.set(2)
  expect(store.getItem('new')).toBe('2')
  value.dispose()
})

test('a failed read never overwrites an unreadable stored value', () => {
  const failure = new Error('read failed')
  const store = { getItem() { throw failure }, setItem: vi.fn() }
  const onPersistenceError = vi.fn()
  const value = storedProp({ store, key: 'key', defaultValue: 5, onPersistenceError })

  expect(value.value).toBe(5)
  expect(store.setItem).not.toHaveBeenCalled()
  expect(onPersistenceError).toHaveBeenCalledWith({ key: 'key', operation: 'read', error: failure })
  value.dispose()
})

test('storage quota errors leave the in-memory prop and its listeners usable', () => {
  const failure = new Error('quota exceeded')
  const store = {
    getItem: () => null,
    setItem: vi.fn(() => { throw failure }),
  }
  const onPersistenceError = vi.fn()
  const value = storedProp({ store, key: 'key', defaultValue: 0, onPersistenceError })
  const listener = vi.fn()
  value.onChange(listener)

  value.set(1)
  expect(value.value).toBe(1)
  expect(listener).toHaveBeenCalledWith(1, 0)
  expect(onPersistenceError).toHaveBeenCalledTimes(2)
  expect(onPersistenceError).toHaveBeenLastCalledWith({ key: 'key', operation: 'write', error: failure })
  value.dispose()
})

test.each([
  ['localStorage', localStorageProp],
  ['sessionStorage', sessionStorageProp],
] as const)('falls back to memory if accessing %s is blocked', (name, create) => {
  const error = new Error('blocked')
  const onPersistenceError = vi.fn()
  vi.stubGlobal('window', { get [name]() { throw error } })
  try {
    const value = create({ key: 'key', defaultValue: 'safe', onPersistenceError })
    expect(value.value).toBe('safe')
    value.set('updated')
    expect(value.value).toBe('updated')
    expect(onPersistenceError).toHaveBeenCalledExactlyOnceWith({ key: 'key', operation: 'access', error })
    value.dispose()
  } finally {
    vi.unstubAllGlobals()
  }
})
