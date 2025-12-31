import { beforeEach, describe, expect, test, vi } from 'vitest'
import { html, render, prop, WithScope } from '../src'
import { sleep } from './helper'
import type { Prop, Computed } from '../src'

describe('Integration - Async Contexts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should handle setTimeout with scope.prop()', async () => {
    let asyncSignal: Prop<number> | null = null

    const component = WithScope(scope => {
      setTimeout(() => {
        asyncSignal = scope.prop(42)
      }, 10)
      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(20)

    expect(asyncSignal).not.toBeNull()
    expect(asyncSignal!.isDisposed()).toBe(false)
    expect(asyncSignal!.value).toBe(42)

    clear()
    expect(asyncSignal!.isDisposed()).toBe(true)
  })

  test('should handle multiple async signals with scope.prop()', async () => {
    const signals: Prop<number>[] = []

    const component = WithScope(scope => {
      setTimeout(() => {
        signals.push(scope.prop(1))
      }, 10)
      setTimeout(() => {
        signals.push(scope.prop(2))
      }, 20)
      setTimeout(() => {
        signals.push(scope.prop(3))
      }, 30)
      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(50)

    expect(signals.length).toBe(3)
    expect(signals[0].value).toBe(1)
    expect(signals[1].value).toBe(2)
    expect(signals[2].value).toBe(3)
    expect(signals.every(s => !s.isDisposed())).toBe(true)

    clear()
    expect(signals.every(s => s.isDisposed())).toBe(true)
  })

  test('should handle fetch callbacks with scope.computedOf()', async () => {
    let asyncComputed: Computed<number> | null = null
    const source = prop(10)

    const component = WithScope(scope => {
      // Simulate fetch callback
      setTimeout(() => {
        asyncComputed = scope.computedOf(source)(v => v * 2)
      }, 10)
      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(20)

    expect(asyncComputed).not.toBeNull()
    expect(asyncComputed!.isDisposed()).toBe(false)
    expect(asyncComputed!.value).toBe(20)

    source.set(20)
    await sleep()
    expect(asyncComputed!.value).toBe(40)

    clear()
    expect(asyncComputed!.isDisposed()).toBe(true)
    source.dispose()
  })

  test('should handle event handlers with scope.effect()', async () => {
    let effectCount = 0
    const source = prop(0)

    const component = WithScope(scope => {
      const button = html.button('Click me')

      // Simulate event handler setup
      setTimeout(() => {
        scope.effect(() => {
          effectCount++
          source.value
        }, [source])
      }, 10)

      return button
    })

    const clear = render(component, document.body)
    await sleep(20)

    expect(effectCount).toBe(1)

    source.set(1)
    await sleep()
    expect(effectCount).toBe(2)

    clear()

    // Effect should not run after disposal
    source.set(2)
    await sleep()
    expect(effectCount).toBe(2)

    source.dispose()
  })

  test('should dispose signals even if async operations are pending', async () => {
    let signal1: Prop<number> | null = null
    let signal2: Prop<number> | null = null
    let errorThrown = false

    const component = WithScope(scope => {
      // Create signal immediately
      signal1 = scope.prop(1)

      // Schedule signals to be created later
      setTimeout(() => {
        signal2 = scope.prop(2)
      }, 10)
      setTimeout(() => {
        // This will happen after we clear - should throw error
        try {
          scope.prop(3)
        } catch (e) {
          errorThrown = true
        }
      }, 50)

      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(20)

    expect(signal1).not.toBeNull()
    expect(signal2).not.toBeNull()

    // Clear before third signal is created
    clear()

    expect(signal1!.isDisposed()).toBe(true)
    expect(signal2!.isDisposed()).toBe(true)

    // Wait for the third setTimeout to execute
    await sleep(40)

    // Attempting to track a signal in a disposed scope should throw an error
    expect(errorThrown).toBe(true)
  })

  test('should handle nested async operations', async () => {
    vi.useFakeTimers()
    try {
      let outerSignal: Prop<number> | null = null
      let innerSignal: Prop<number> | null = null

      const component = WithScope(scope => {
        setTimeout(() => {
          outerSignal = scope.prop(1)

          setTimeout(() => {
            innerSignal = scope.prop(2)
          }, 10)
        }, 10)

        return html.div('test')
      })

      const clear = render(component, document.body)
      await vi.advanceTimersByTimeAsync(30)

      expect(outerSignal).not.toBeNull()
      expect(innerSignal).not.toBeNull()
      expect(outerSignal!.isDisposed()).toBe(false)
      expect(innerSignal!.isDisposed()).toBe(false)

      clear()

      expect(outerSignal!.isDisposed()).toBe(true)
      expect(innerSignal!.isDisposed()).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  test('should handle Promise.then with scope.computedOf()', async () => {
    let asyncComputed: Computed<string> | null = null
    const source = prop('hello')

    const component = WithScope(scope => {
      Promise.resolve().then(() => {
        asyncComputed = scope.computedOf(source)(v => v.toUpperCase())
      })
      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(10)

    expect(asyncComputed).not.toBeNull()
    expect(asyncComputed!.value).toBe('HELLO')
    expect(asyncComputed!.isDisposed()).toBe(false)

    clear()
    expect(asyncComputed!.isDisposed()).toBe(true)
    source.dispose()
  })

  test('should handle async/await with scope methods', async () => {
    let signal: Prop<number> | null = null
    let computed: Computed<number> | null = null

    const component = WithScope(scope => {
      const asyncFn = async () => {
        await sleep(10)
        signal = scope.prop(10)
        computed = scope.computedOf(signal)(v => v * 2)
      }

      asyncFn()
      return html.div('test')
    })

    const clear = render(component, document.body)
    await sleep(20)

    expect(signal).not.toBeNull()
    expect(computed).not.toBeNull()
    expect(signal!.value).toBe(10)
    expect(computed!.value).toBe(20)
    expect(signal!.isDisposed()).toBe(false)
    expect(computed!.isDisposed()).toBe(false)

    clear()

    expect(signal!.isDisposed()).toBe(true)
    expect(computed!.isDisposed()).toBe(true)
  })

  test('should handle multiple WithScope components independently', async () => {
    const signals1: Prop<number>[] = []
    const signals2: Prop<number>[] = []

    const component1 = WithScope(scope => {
      setTimeout(() => {
        signals1.push(scope.prop(1))
      }, 10)
      return html.div('component1')
    })

    const component2 = WithScope(scope => {
      setTimeout(() => {
        signals2.push(scope.prop(2))
      }, 10)
      return html.div('component2')
    })

    const container1 = document.createElement('div')
    const container2 = document.createElement('div')
    document.body.appendChild(container1)
    document.body.appendChild(container2)

    const clear1 = render(component1, container1)
    const clear2 = render(component2, container2)
    await sleep(20)

    expect(signals1.length).toBe(1)
    expect(signals2.length).toBe(1)
    expect(signals1[0].value).toBe(1)
    expect(signals2[0].value).toBe(2)

    // Clear first component
    clear1()
    expect(signals1[0].isDisposed()).toBe(true)
    expect(signals2[0].isDisposed()).toBe(false)

    // Clear second component
    clear2()
    expect(signals2[0].isDisposed()).toBe(true)
  })
})
