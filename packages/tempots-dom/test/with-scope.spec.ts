import { beforeEach, describe, expect, test } from 'vitest'
import { prop, render, WithScope, html } from '../src'
import type { Prop } from '../src'
import { sleep } from './helper'

describe('WithScope', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should provide scope to callback', () => {
    let capturedScope: any = null

    const clear = render(
      WithScope(scope => {
        capturedScope = scope
        return html.div('test')
      }),
      document.body
    )

    expect(capturedScope).not.toBeNull()
    expect(capturedScope.prop).toBeDefined()
    expect(capturedScope.computed).toBeDefined()
    expect(capturedScope.effect).toBeDefined()

    clear()
  })

  test('should dispose scope when component unmounts', () => {
    let signal: Prop<number> | null = null

    const clear = render(
      WithScope(scope => {
        signal = scope.prop(10)
        return html.div(signal.map(String))
      }),
      document.body
    )

    expect(signal).not.toBeNull()
    expect(signal!.isDisposed()).toBe(false)

    clear()

    expect(signal!.isDisposed()).toBe(true)
  })

  test('should work with scope.prop() in setTimeout', async () => {
    let signal: Prop<number> | null = null

    const clear = render(
      WithScope(scope => {
        setTimeout(() => {
          signal = scope.prop(42)
        }, 10)
        return html.div('test')
      }),
      document.body
    )

    await sleep(20)

    expect(signal).not.toBeNull()
    expect(signal!.value).toBe(42)
    expect(signal!.isDisposed()).toBe(false)

    clear()

    expect(signal!.isDisposed()).toBe(true)
  })

  test('should work with scope.computedOf() in async context', async () => {
    let source: Prop<number> | null = null
    let derived: any = null

    const clear = render(
      WithScope(scope => {
        source = prop(10)
        
        setTimeout(() => {
          derived = scope.computedOf(source!)((s) => s * 2)
        }, 10)
        
        return html.div('test')
      }),
      document.body
    )

    await sleep(20)

    expect(derived).not.toBeNull()
    expect(derived.value).toBe(20)
    expect(derived.isDisposed()).toBe(false)

    clear()

    expect(derived.isDisposed()).toBe(true)
    source!.dispose()
  })

  test('should work with scope.effect() in async context', async () => {
    const source = prop(0)
    let callCount = 0

    const clear = render(
      WithScope(scope => {
        setTimeout(() => {
          scope.effect(() => {
            callCount++
            source.value
          }, [source])
        }, 10)
        
        return html.div('test')
      }),
      document.body
    )

    await sleep(20)
    expect(callCount).toBe(1)

    source.set(1)
    await sleep()
    expect(callCount).toBe(2)

    clear()

    // Effect should be disposed
    source.set(2)
    await sleep()
    expect(callCount).toBe(2)

    source.dispose()
  })

  test('should allow nested WithScope', () => {
    let outerSignal: Prop<number> | null = null
    let innerSignal: Prop<number> | null = null

    const clear = render(
      WithScope(outerScope => {
        outerSignal = outerScope.prop(10)
        return WithScope(innerScope => {
          innerSignal = innerScope.prop(20)
          return html.div('test')
        })
      }),
      document.body
    )

    expect(outerSignal).not.toBeNull()
    expect(innerSignal).not.toBeNull()
    expect(outerSignal!.isDisposed()).toBe(false)
    expect(innerSignal!.isDisposed()).toBe(false)

    clear()

    expect(outerSignal!.isDisposed()).toBe(true)
    expect(innerSignal!.isDisposed()).toBe(true)
  })
})

