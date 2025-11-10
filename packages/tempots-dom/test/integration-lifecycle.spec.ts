import { beforeEach, describe, expect, test } from 'vitest'
import { prop, computed, effect, render, html } from '../src'
import type { Prop, Computed } from '../src'
import { domRenderable } from '../src/types/domain'
import { sleep } from './helper'

describe('Integration - Component Lifecycle', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should create scope when mounting component', () => {
    let signal: Prop<number> | null = null

    const component = domRenderable((ctx: any) => {
      signal = prop(10)
      return html.div('test').render(ctx)
    })

    const clear = render(component, document.body)

    expect(signal).not.toBeNull()
    expect(signal!.isDisposed()).toBe(false)

    clear()
  })

  test('should dispose scope when unmounting component', async () => {
    let signal: Prop<number> | null = null
    let computedSignal: Computed<number> | null = null
    let effectCount = 0

    const component = domRenderable((ctx: any) => {
      signal = prop(10)
      computedSignal = computed(() => signal!.value * 2, [signal!])
      effect(() => {
        effectCount++
        signal!.value
      }, [signal!])
      return html.div(computedSignal.map(String)).render(ctx)
    })

    const clear = render(component, document.body)
    await sleep()

    expect(signal).not.toBeNull()
    expect(computedSignal).not.toBeNull()
    expect(effectCount).toBe(1)
    expect(signal!.isDisposed()).toBe(false)
    expect(computedSignal!.isDisposed()).toBe(false)

    clear()

    expect(signal!.isDisposed()).toBe(true)
    expect(computedSignal!.isDisposed()).toBe(true)

    // Effect should not run after disposal
    signal!.set(20)
    await sleep()
    expect(effectCount).toBe(1)
  })

  test('should create new scope when remounting component', () => {
    let firstSignal: Prop<number> | null = null
    let secondSignal: Prop<number> | null = null

    const component = domRenderable((ctx: any) => {
      const signal = prop(10)
      if (firstSignal === null) {
        firstSignal = signal
      } else {
        secondSignal = signal
      }
      return html.div(signal.map(String)).render(ctx)
    })

    // First mount
    const clear1 = render(component, document.body)
    expect(firstSignal).not.toBeNull()
    expect(firstSignal!.isDisposed()).toBe(false)

    clear1()
    expect(firstSignal!.isDisposed()).toBe(true)

    // Second mount
    const clear2 = render(component, document.body)
    expect(secondSignal).not.toBeNull()
    expect(secondSignal!.isDisposed()).toBe(false)
    expect(firstSignal).not.toBe(secondSignal)

    clear2()
    expect(secondSignal!.isDisposed()).toBe(true)
  })

  test('should have separate scopes for multiple instances', () => {
    const signals: Prop<number>[] = []

    const component = domRenderable((ctx: any) => {
      const signal = prop(10)
      signals.push(signal)
      return html.div(signal.map(String)).render(ctx)
    })

    const container1 = document.createElement('div')
    const container2 = document.createElement('div')
    document.body.appendChild(container1)
    document.body.appendChild(container2)

    const clear1 = render(component, container1)
    const clear2 = render(component, container2)

    expect(signals.length).toBe(2)
    expect(signals[0]).not.toBe(signals[1])
    expect(signals[0].isDisposed()).toBe(false)
    expect(signals[1].isDisposed()).toBe(false)

    // Dispose first instance
    clear1()
    expect(signals[0].isDisposed()).toBe(true)
    expect(signals[1].isDisposed()).toBe(false)

    // Dispose second instance
    clear2()
    expect(signals[1].isDisposed()).toBe(true)
  })

  test('should handle complex component with multiple signals', async () => {
    let prop1: Prop<number> | null = null
    let prop2: Prop<string> | null = null
    let computed1: Computed<number> | null = null
    let computed2: Computed<string> | null = null
    let effectCount = 0

    const component = domRenderable((ctx: any) => {
      prop1 = prop(10)
      prop2 = prop('hello')
      computed1 = computed(() => prop1!.value * 2, [prop1!])
      computed2 = computed(() => prop2!.value.toUpperCase(), [prop2!])

      effect(() => {
        effectCount++
        prop1!.value
        prop2!.value
      }, [prop1!, prop2!])

      return html
        .div(html.span(computed1.map(String)), html.span(computed2))
        .render(ctx)
    })

    const clear = render(component, document.body)
    await sleep()

    expect(prop1).not.toBeNull()
    expect(prop2).not.toBeNull()
    expect(computed1).not.toBeNull()
    expect(computed2).not.toBeNull()
    expect(effectCount).toBe(1)

    // All signals should be alive
    expect(prop1!.isDisposed()).toBe(false)
    expect(prop2!.isDisposed()).toBe(false)
    expect(computed1!.isDisposed()).toBe(false)
    expect(computed2!.isDisposed()).toBe(false)

    clear()

    // All signals should be disposed
    expect(prop1!.isDisposed()).toBe(true)
    expect(prop2!.isDisposed()).toBe(true)
    expect(computed1!.isDisposed()).toBe(true)
    expect(computed2!.isDisposed()).toBe(true)
  })

  test('should handle nested components with separate scopes', () => {
    let outerSignal: Prop<number> | null = null
    let innerSignal: Prop<number> | null = null

    const innerComponent = domRenderable((ctx: any) => {
      innerSignal = prop(20)
      return html.span(innerSignal.map(String)).render(ctx)
    })

    const outerComponent = domRenderable((ctx: any) => {
      outerSignal = prop(10)
      return html.div(innerComponent).render(ctx)
    })

    const clear = render(outerComponent, document.body)

    expect(outerSignal).not.toBeNull()
    expect(innerSignal).not.toBeNull()
    expect(outerSignal!.isDisposed()).toBe(false)
    expect(innerSignal!.isDisposed()).toBe(false)

    clear()

    // Both scopes should be disposed
    expect(outerSignal!.isDisposed()).toBe(true)
    expect(innerSignal!.isDisposed()).toBe(true)
  })

  test('should not affect parent scope from child scope', () => {
    let parentSignal: Prop<number> | null = null
    let childSignal: Prop<number> | null = null

    const childComponent = domRenderable((ctx: any) => {
      childSignal = prop(20)
      return html.div('child').render(ctx)
    })

    const parentComponent = domRenderable((ctx: any) => {
      parentSignal = prop(10)
      return html.div(childComponent).render(ctx)
    })

    const clear = render(parentComponent, document.body)

    expect(parentSignal).not.toBeNull()
    expect(childSignal).not.toBeNull()

    // Both should be alive
    expect(parentSignal!.isDisposed()).toBe(false)
    expect(childSignal!.isDisposed()).toBe(false)

    clear()

    // Both should be disposed (parent scope disposes child scope)
    expect(parentSignal!.isDisposed()).toBe(true)
    expect(childSignal!.isDisposed()).toBe(true)
  })
})
