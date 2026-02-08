import { describe, test, expect } from 'vitest'
import { prop, signal } from '@tempots/core'
import { MockBridge } from '../src/bridge/mock-bridge'
import { NativeContext } from '../src/context/native-context'
import { view } from '../src/renderable/element'
import { nativeStyle, applyProp } from '../src/renderable/style'
import { nativeOn } from '../src/renderable/events'
import { Fragment } from '../src/renderable/shared'
import { nativeRenderable } from '../src/types/domain'
import { renderNative } from '../src/platform/init'

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

function createTestContext() {
  const bridge = new MockBridge()
  const ctx = new NativeContext(bridge, bridge.root.handle)
  return { bridge, ctx }
}

describe('Native view elements', () => {
  test('view.Image creates Image view', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = view.Image()
    const clear = renderable.render(ctx)
    expect(bridge.root.children[0].type).toBe('Image')
    clear(true)
  })

  test('view.ScrollView creates ScrollView', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = view.ScrollView(
      view.Text('Content')
    )
    const clear = renderable.render(ctx)
    expect(bridge.root.children[0].type).toBe('ScrollView')
    expect(bridge.root.children[0].children[0].type).toBe('Text')
    clear(true)
  })

  test('view.TextInput creates TextInput', () => {
    const { bridge, ctx } = createTestContext()
    const renderable = view.TextInput()
    const clear = renderable.render(ctx)
    expect(bridge.root.children[0].type).toBe('TextInput')
    clear(true)
  })
})

describe('Native styles', () => {
  test('applyStyle sets static styles', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('View')
    const renderable = nativeStyle.style({ backgroundColor: 'blue', flex: 1 })
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.styles.backgroundColor).toBe('blue')
    expect(node!.styles.flex).toBe(1)
    clear(true)
  })

  test('applyStyle updates reactive styles', async () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('View')
    const styles = prop({ backgroundColor: 'red' })
    const renderable = nativeStyle.style(styles)
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.styles.backgroundColor).toBe('red')

    styles.set({ backgroundColor: 'green' })
    await waitForUpdate()
    expect(node!.styles.backgroundColor).toBe('green')

    clear(true)
  })

  test('applyProp sets a static property', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('TextInput')
    const renderable = applyProp('placeholder', 'Type here')
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.placeholder).toBe('Type here')
    clear(true)
  })

  test('applyProp updates reactive property', async () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('TextInput')
    const placeholder = prop('Type here')
    const renderable = applyProp('placeholder', placeholder)
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.placeholder).toBe('Type here')

    placeholder.set('Search...')
    await waitForUpdate()
    expect(node!.props.placeholder).toBe('Search...')

    clear(true)
  })

  test('nativeStyle.source sets image source', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('Image')
    const renderable = nativeStyle.source({ uri: 'https://example.com/img.png' })
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.source).toEqual({ uri: 'https://example.com/img.png' })
    clear(true)
  })

  test('nativeStyle.testID sets testID', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('View')
    const renderable = nativeStyle.testID('my-view')
    const clear = renderable.render(viewCtx)
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.testID).toBe('my-view')
    clear(true)
  })
})

describe('Native events', () => {
  test('nativeOn.press handles press events', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('TouchableOpacity')
    let pressed = false
    const renderable = nativeOn.press(() => {
      pressed = true
    })
    const clear = renderable.render(viewCtx)
    bridge.dispatchEvent(viewCtx.handle, 'press', {
      locationX: 0,
      locationY: 0,
      pageX: 0,
      pageY: 0,
      timestamp: Date.now(),
    })
    expect(pressed).toBe(true)
    clear(true)
  })

  test('nativeOn.changeText handles text changes', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('TextInput')
    let text = ''
    const renderable = nativeOn.changeText(e => {
      text = e.text
    })
    const clear = renderable.render(viewCtx)
    bridge.dispatchEvent(viewCtx.handle, 'changeText', { text: 'Hello' })
    expect(text).toBe('Hello')
    clear(true)
  })

  test('nativeOn.layout handles layout events', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('View')
    let layout = { x: 0, y: 0, width: 0, height: 0 }
    const renderable = nativeOn.layout(e => {
      layout = e
    })
    const clear = renderable.render(viewCtx)
    bridge.dispatchEvent(viewCtx.handle, 'layout', {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    })
    expect(layout).toEqual({ x: 10, y: 20, width: 100, height: 50 })
    clear(true)
  })

  test('event listener cleanup works', () => {
    const { bridge, ctx } = createTestContext()
    const viewCtx = ctx.makeChildView('View')
    let count = 0
    const renderable = nativeOn.press(() => {
      count++
    })
    const clear = renderable.render(viewCtx)
    bridge.dispatchEvent(viewCtx.handle, 'press')
    expect(count).toBe(1)

    clear(true)
    bridge.dispatchEvent(viewCtx.handle, 'press')
    expect(count).toBe(1) // no longer listening
  })
})

describe('renderNative', () => {
  test('renders into a bridge root', () => {
    const bridge = new MockBridge()
    const clear = renderNative(
      view.View(view.Text('Hello')),
      { bridge, rootHandle: bridge.root.handle }
    )
    expect(bridge.collectText()).toBe('Hello')
    clear(true)
  })

  test('throws when no bridge is available', () => {
    expect(() => renderNative(view.View())).toThrow(
      'No JSI bridge found'
    )
  })
})
