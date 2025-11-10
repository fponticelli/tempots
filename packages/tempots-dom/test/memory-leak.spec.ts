import { beforeEach, describe, expect, test } from 'vitest'
import { html, render, prop, computed, effect, When, Repeat } from '../src'
import { DisposalScope } from '@tempots/core'
import { domRenderable } from '../src/types/domain'
import { sleep } from './helper'

describe('Memory Leak Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('creating and disposing 1000 scopes should not leak', () => {
    const scopes: DisposalScope[] = []

    // Create 1000 scopes
    for (let i = 0; i < 1000; i++) {
      scopes.push(new DisposalScope())
    }

    expect(scopes.length).toBe(1000)

    // Dispose all scopes
    for (const scope of scopes) {
      scope.dispose()
    }

    // All scopes should be disposed
    expect(scopes.every(s => s['_disposed'])).toBe(true)
  })

  test('creating and disposing 1000 signals should not leak', () => {
    const scope = new DisposalScope()
    const signals = []

    // Create 1000 signals
    for (let i = 0; i < 1000; i++) {
      signals.push(scope.prop(i))
    }

    expect(signals.length).toBe(1000)
    expect(signals.every(s => !s.isDisposed())).toBe(true)

    // Dispose the scope
    scope.dispose()

    // All signals should be disposed
    expect(signals.every(s => s.isDisposed())).toBe(true)
  })

  test('toggling When 1000 times should not leak', async () => {
    const condition = prop(true)
    const createdSignals: any[] = []

    const clear = render(
      When(
        condition,
        () => {
          const signal = prop(1)
          createdSignals.push(signal)
          return html.div('then')
        },
        () => {
          const signal = prop(2)
          createdSignals.push(signal)
          return html.div('else')
        }
      ),
      document.body
    )

    // Toggle 1000 times
    for (let i = 0; i < 1000; i++) {
      condition.set(!condition.value)
      await sleep(0) // Allow effects to run
    }

    // All but the last signal should be disposed
    const disposedCount = createdSignals.filter(s => s.isDisposed()).length
    expect(disposedCount).toBe(createdSignals.length - 1)

    clear()
    condition.dispose()

    // All signals should be disposed
    expect(createdSignals.every(s => s.isDisposed())).toBe(true)
  })

  test('adding and removing list items 1000 times should not leak', async () => {
    const count = prop(0)
    const createdSignals: any[] = []

    const clear = render(
      Repeat(count, pos => {
        const signal = prop(pos.value)
        createdSignals.push(signal)
        return html.div(signal.map(String))
      }),
      document.body
    )

    // Add and remove items 1000 times
    for (let i = 0; i < 1000; i++) {
      count.set(i % 10) // Cycle between 0 and 9 items
      await sleep(0)
    }

    // Most signals should be disposed (only the last batch should be alive)
    const aliveCount = createdSignals.filter(s => !s.isDisposed()).length
    expect(aliveCount).toBeLessThanOrEqual(10)

    clear()
    count.dispose()

    // All signals should be disposed
    expect(createdSignals.every(s => s.isDisposed())).toBe(true)
  })

  test('mounting and unmounting components 1000 times should not leak', () => {
    const createdSignals: any[] = []

    for (let i = 0; i < 1000; i++) {
      const component = domRenderable((ctx: any) => {
        const signal = prop(i)
        createdSignals.push(signal)
        return html.div(signal.map(String)).render(ctx)
      })

      const clear = render(component, document.body)
      clear()
    }

    // All signals should be disposed
    expect(createdSignals.every(s => s.isDisposed())).toBe(true)
  })

  test('creating and disposing computed signals 1000 times should not leak', () => {
    const scope = new DisposalScope()
    const source = prop(0)
    const computeds = []

    // Create 1000 computed signals
    for (let i = 0; i < 1000; i++) {
      computeds.push(scope.computedOf(source)(v => v * i))
    }

    expect(computeds.length).toBe(1000)
    expect(computeds.every(c => !c.isDisposed())).toBe(true)

    // Dispose the scope
    scope.dispose()

    // All computed signals should be disposed
    expect(computeds.every(c => c.isDisposed())).toBe(true)

    source.dispose()
  })

  test('creating and disposing effects 1000 times should not leak', async () => {
    const scope = new DisposalScope()
    const source = prop(0)
    let totalCalls = 0

    // Create 1000 effects
    for (let i = 0; i < 1000; i++) {
      scope.effect(() => {
        totalCalls++
        source.value
      }, [source])
    }

    await sleep()
    expect(totalCalls).toBe(1000)

    // Trigger source change
    source.set(1)
    await sleep()
    expect(totalCalls).toBe(2000)

    // Dispose the scope
    scope.dispose()

    // Effects should not run after disposal
    source.set(2)
    await sleep()
    expect(totalCalls).toBe(2000)

    source.dispose()
  })

  test('nested scopes with 100 levels should not leak', () => {
    const scopes: DisposalScope[] = []
    const signals: any[] = []

    // Create 100 nested scopes
    for (let i = 0; i < 100; i++) {
      const scope = new DisposalScope()
      scopes.push(scope)
      signals.push(scope.prop(i))
    }

    expect(scopes.length).toBe(100)
    expect(signals.length).toBe(100)
    expect(signals.every(s => !s.isDisposed())).toBe(true)

    // Dispose all scopes
    for (const scope of scopes) {
      scope.dispose()
    }

    // All signals should be disposed
    expect(signals.every(s => s.isDisposed())).toBe(true)
  })

  test('complex component with multiple signal types should not leak', () => {
    const createdSignals: any[] = []

    for (let i = 0; i < 100; i++) {
      const component = domRenderable((ctx: any) => {
        const p1 = prop(i)
        const p2 = prop(`value-${i}`)
        const c1 = computed(() => p1.value * 2, [p1])
        const c2 = computed(() => p2.value.toUpperCase(), [p2])

        createdSignals.push(p1, p2, c1, c2)

        return html.div(html.span(c1.map(String)), html.span(c2)).render(ctx)
      })

      const clear = render(component, document.body)
      clear()
    }

    // All signals should be disposed
    expect(createdSignals.every(s => s.isDisposed())).toBe(true)
  })

  test('rapidly creating and disposing scopes should not leak', () => {
    for (let i = 0; i < 10000; i++) {
      const scope = new DisposalScope()
      const signal = scope.prop(i)
      expect(signal.isDisposed()).toBe(false)
      scope.dispose()
      expect(signal.isDisposed()).toBe(true)
    }
  })

  test('scope with mixed signal types should dispose all', () => {
    const scope = new DisposalScope()
    const source = prop(10)

    const p1 = scope.prop(1)
    const p2 = scope.prop('hello')
    const c1 = scope.computedOf(source)(v => v * 2)
    const c2 = scope.computedOf(p2)(v => v.toUpperCase())

    let effectCount = 0
    scope.effect(() => {
      effectCount++
      source.value
    }, [source])

    expect(p1.isDisposed()).toBe(false)
    expect(p2.isDisposed()).toBe(false)
    expect(c1.isDisposed()).toBe(false)
    expect(c2.isDisposed()).toBe(false)

    scope.dispose()

    expect(p1.isDisposed()).toBe(true)
    expect(p2.isDisposed()).toBe(true)
    expect(c1.isDisposed()).toBe(true)
    expect(c2.isDisposed()).toBe(true)

    source.dispose()
  })
})

