import { describe, test, expect } from 'vitest'
import { prop, signal } from '@tempots/core'
import { MockBridge } from '../src/bridge/mock-bridge'
import { NativeContext } from '../src/context/native-context'
import { renderNative } from '../src/platform/init'
import {
  Empty,
  Fragment,
  When,
  Unless,
  ForEach,
  Repeat,
  MapSignal,
  Ensure,
  NotEmpty,
  Task,
  Async,
  OnDispose,
  Conjunction,
  OneOfValue,
} from '../src/renderable/shared'
import { view, NativeEl } from '../src/renderable/element'
import { nativeRenderable } from '../src/types/domain'

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

function createTestContext() {
  const bridge = new MockBridge()
  const ctx = new NativeContext(bridge, bridge.root.handle)
  return { bridge, ctx }
}

function renderTest(
  bridge: MockBridge,
  ...children: Parameters<typeof Fragment>
) {
  const renderable = Fragment(...children)
  return renderNative(renderable, { bridge })
}

describe('Shared renderables with NativeContext', () => {
  test('Empty renders nothing', () => {
    const { bridge } = createTestContext()
    const clear = renderTest(bridge, Empty)
    expect(bridge.root.children.length).toBe(0)
    clear(true)
  })

  test('Fragment renders multiple children', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Fragment(
      nativeRenderable(c => {
        c.makeChildText('Hello')
        return () => {}
      }),
      nativeRenderable(c => {
        c.makeChildText('World')
        return () => {}
      })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('HelloWorld')
    clear(true)
  })

  test('text node rendering', () => {
    const { bridge, ctx } = createTestContext()
    const text = 'Hello, Native!'
    const renderable = nativeRenderable((c: NativeContext) => {
      c.makeChildText(text)
      return () => {}
    })
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe(text)
    clear(true)
  })

  test('When renders then branch when true', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = When(
      true,
      () =>
        nativeRenderable(c => {
          c.makeChildText('Visible')
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Visible')
    clear(true)
  })

  test('When renders otherwise branch when false', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = When(
      false,
      () =>
        nativeRenderable(c => {
          c.makeChildText('Then')
          return () => {}
        }),
      () =>
        nativeRenderable(c => {
          c.makeChildText('Else')
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Else')
    clear(true)
  })

  test('When switches branches reactively', async () => {
    const { bridge, ctx } = createTestContext()
    const condition = prop(true)
    const renderable = When(
      condition,
      () => 'Then',
      () => 'Else'
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Then')

    condition.set(false)
    await waitForUpdate()
    expect(bridge.collectText()).toBe('Else')

    clear(true)
  })

  test('Unless is the inverse of When', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Unless(
      false,
      () =>
        nativeRenderable(c => {
          c.makeChildText('Shown')
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Shown')
    clear(true)
  })

  test('Repeat with static count', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Repeat(3, pos =>
      nativeRenderable(c => {
        c.makeChildText(`Item ${pos.index}`)
        return () => {}
      })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Item 0Item 1Item 2')
    clear(true)
  })

  test('Repeat with signal count', async () => {
    const { bridge, ctx } = createTestContext()
    const count = prop(2)
    const renderable = Repeat(count, pos =>
      nativeRenderable(c => {
        c.makeChildText(`Item ${pos.index}`)
        return () => {}
      })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Item 0Item 1')

    count.set(3)
    await waitForUpdate()
    expect(bridge.collectText()).toBe('Item 0Item 1Item 2')

    clear(true)
  })

  test('ForEach renders list items', async () => {
    const { bridge, ctx } = createTestContext()
    const items = prop(['A', 'B', 'C'])
    const renderable = ForEach(items, itemSignal => itemSignal)
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('ABC')

    items.set(['X', 'Y'])
    await waitForUpdate()
    expect(bridge.collectText()).toBe('XY')

    clear(true)
  })

  test('MapSignal maps values to renderables', async () => {
    const { bridge, ctx } = createTestContext()
    const count = prop(1)
    const renderable = MapSignal(count, n => `Count: ${n}`)
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Count: 1')

    count.set(5)
    await waitForUpdate()
    expect(bridge.collectText()).toBe('Count: 5')

    clear(true)
  })

  test('Ensure renders when value is non-null', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Ensure(
      'hello',
      valueSignal =>
        nativeRenderable(c => {
          c.makeChildText(valueSignal.value)
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('hello')
    clear(true)
  })

  test('Ensure renders otherwise when null', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Ensure(
      null as string | null,
      valueSignal =>
        nativeRenderable(c => {
          c.makeChildText(valueSignal.value)
          return () => {}
        }),
      () =>
        nativeRenderable(c => {
          c.makeChildText('Nothing')
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Nothing')
    clear(true)
  })

  test('NotEmpty renders content for non-empty arrays', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = NotEmpty(
      signal([1, 2, 3]),
      () =>
        nativeRenderable(c => {
          c.makeChildText('Has items')
          return () => {}
        }),
      () =>
        nativeRenderable(c => {
          c.makeChildText('Empty')
          return () => {}
        })
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Has items')
    clear(true)
  })

  test('Task resolves and renders', async () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Task(
      () => Promise.resolve('Done'),
      {
        pending: () => 'Loading...',
        then: value => value,
      }
    )
    const clear = renderable.render(ctx)
    expect(bridge.collectText()).toBe('Loading...')

    await waitForUpdate()
    expect(bridge.collectText()).toBe('Done')

    clear(true)
  })

  test('Async resolves and renders', async () => {
    const { bridge, ctx } = createTestContext()
    const renderable = Async(
      Promise.resolve('Result'),
      value => value
    )
    const clear = renderable.render(ctx)

    await waitForUpdate()
    expect(bridge.collectText()).toBe('Result')

    clear(true)
  })

  test('OnDispose calls callback', () => {
    const { ctx } = createTestContext()
    let disposed = false
    const renderable = OnDispose(() => {
      disposed = true
    })
    const clear = renderable.render(ctx)
    expect(disposed).toBe(false)
    clear(true)
    expect(disposed).toBe(true)
  })

  test('NativeEl creates a native view with children', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = NativeEl('View', 'Hello from NativeEl')
    const clear = renderable.render(ctx)
    expect(bridge.root.children.length).toBe(1)
    expect(bridge.root.children[0].type).toBe('View')
    expect(bridge.collectText()).toBe('Hello from NativeEl')
    clear(true)
  })

  test('view proxy creates view elements', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = view.View(
      view.Text('Hello'),
      view.Text('World')
    )
    const clear = renderable.render(ctx)
    expect(bridge.root.children.length).toBe(1)
    expect(bridge.root.children[0].type).toBe('View')
    expect(bridge.root.children[0].children.length).toBe(2)
    expect(bridge.root.children[0].children[0].type).toBe('Text')
    expect(bridge.root.children[0].children[1].type).toBe('Text')
    clear(true)
  })
})
