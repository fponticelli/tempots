import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { makeProbe, GlobalProbe, type ProbeResolution } from '../src/renderable/probe'
import { Provide, Use } from '../src/renderable/provider'
import { render } from '../src/renderable/render'

describe('Probe', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should create a probe with default options', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)

    expect(probe.mark).toBeDefined()
    expect(probe.create).toBeDefined()
  })

  test('should create probe function with default callback and timeout', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const provider = probe.create()

    expect(provider.value).toBeInstanceOf(Function)
    expect(provider.dispose).toBeInstanceOf(Function)
    expect(provider.onUse).toBeInstanceOf(Function)
  })

  test('should call callback with "resolved" when counter reaches zero', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback })

    // Simulate usage
    provider.onUse() // counter = 1
    provider.onUse() // counter = 2

    // Call probe function twice to decrement counter to zero
    provider.value() // counter = 1
    provider.value() // counter = 0, should trigger callback

    expect(callback).toHaveBeenCalledWith('resolved')
  })

  test('should call callback with "timeout" when timeout expires', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback, timeout: 100 })

    // Advance time to trigger timeout
    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledWith('timeout')
  })

  test('should call callback with "disposed" when dispose is called', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback })

    provider.dispose()

    expect(callback).toHaveBeenCalledWith('disposed')
  })

  test('should throw error if probe already exists', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)

    probe.create()

    expect(() => probe.create()).toThrow('Probe already exists: test')
  })

  test('should handle probe function call after probe is cleared', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback })

    provider.onUse() // counter = 1
    provider.dispose() // clears the probe

    // Calling probe function after disposal should not throw
    expect(() => provider.value()).not.toThrow()
    expect(callback).toHaveBeenCalledWith('disposed')
  })

  test('should clear timeout when probe function is called', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback, timeout: 100 })

    provider.onUse() // counter = 1
    provider.value() // counter = 0, should clear timeout and call callback

    // Advance time - timeout should not trigger since it was cleared
    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('resolved')
  })

  test('should work with custom timeout value', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback, timeout: 500 })

    // Advance time less than timeout
    vi.advanceTimersByTime(400)
    expect(callback).not.toHaveBeenCalled()

    // Advance time to trigger timeout
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledWith('timeout')
  })

  test('should increment counter on each onUse call', () => {
    const testSymbol = Symbol('test')
    const probe = makeProbe(testSymbol)
    const callback = vi.fn()
    const provider = probe.create({ callback })

    provider.onUse() // counter = 1
    provider.onUse() // counter = 2
    provider.onUse() // counter = 3

    // Should need 3 calls to probe function to reach zero
    provider.value() // counter = 2
    provider.value() // counter = 1
    expect(callback).not.toHaveBeenCalled()

    provider.value() // counter = 0
    expect(callback).toHaveBeenCalledWith('resolved')
  })

  test('GlobalProbe should be available', () => {
    expect(GlobalProbe).toBeDefined()
    expect(GlobalProbe.mark).toBeDefined()
    expect(GlobalProbe.create).toBeDefined()
  })

  test('should handle multiple probes with different symbols', () => {
    const symbol1 = Symbol('test1')
    const symbol2 = Symbol('test2')
    const probe1 = makeProbe(symbol1)
    const probe2 = makeProbe(symbol2)
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const provider1 = probe1.create({ callback: callback1 })
    const provider2 = probe2.create({ callback: callback2 })

    provider1.onUse()
    provider2.onUse()

    provider1.value() // Should trigger callback1
    expect(callback1).toHaveBeenCalledWith('resolved')
    expect(callback2).not.toHaveBeenCalled()

    provider2.value() // Should trigger callback2
    expect(callback2).toHaveBeenCalledWith('resolved')
  })
})
