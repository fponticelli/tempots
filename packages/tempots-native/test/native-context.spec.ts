import { describe, test, expect } from 'vitest'
import { makeProviderMark } from '@tempots/core'
import { MockBridge } from '../src/bridge/mock-bridge'
import { NativeContext } from '../src/context/native-context'

describe('NativeContext', () => {
  function createContext() {
    const bridge = new MockBridge()
    const ctx = new NativeContext(bridge, bridge.root.handle)
    return { bridge, ctx }
  }

  test('makeRef creates an invisible marker view', () => {
    const { bridge, ctx } = createContext()
    const ref = ctx.makeRef()
    expect(ref).toBeInstanceOf(NativeContext)
    const node = bridge.getNode(ref.handle)
    expect(node).toBeDefined()
    expect(node!.type).toBe('__ref__')
  })

  test('clear removes view from tree', () => {
    const { bridge, ctx } = createContext()
    const ref = ctx.makeRef()
    expect(bridge.root.children.length).toBe(1)
    ref.clear(true)
    expect(bridge.root.children.length).toBe(0)
  })

  test('makeChildText creates a text view', () => {
    const { bridge, ctx } = createContext()
    const textCtx = ctx.makeChildText('Hello')
    const node = bridge.getNode(textCtx.handle)
    expect(node).toBeDefined()
    expect(node!.type).toBe('__text__')
    expect(node!.text).toBe('Hello')
  })

  test('setText updates text content', () => {
    const { bridge, ctx } = createContext()
    const textCtx = ctx.makeChildText('Hello')
    textCtx.setText('World')
    const node = bridge.getNode(textCtx.handle)
    expect(node!.text).toBe('World')
  })

  test('getText returns text content', () => {
    const { ctx } = createContext()
    const textCtx = ctx.makeChildText('Hello')
    expect(textCtx.getText()).toBe('Hello')
  })

  test('makeChildView creates a view of the given type', () => {
    const { bridge, ctx } = createContext()
    const viewCtx = ctx.makeChildView('View')
    const node = bridge.getNode(viewCtx.handle)
    expect(node).toBeDefined()
    expect(node!.type).toBe('View')
    expect(bridge.root.children.length).toBe(1)
  })

  test('setProp sets a property on the view', () => {
    const { bridge, ctx } = createContext()
    const viewCtx = ctx.makeChildView('TextInput')
    viewCtx.setProp('placeholder', 'Enter text...')
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.placeholder).toBe('Enter text...')
  })

  test('setProps sets multiple properties', () => {
    const { bridge, ctx } = createContext()
    const viewCtx = ctx.makeChildView('TextInput')
    viewCtx.setProps({ placeholder: 'Enter text...', editable: true })
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.props.placeholder).toBe('Enter text...')
    expect(node!.props.editable).toBe(true)
  })

  test('setStyle sets styles on the view', () => {
    const { bridge, ctx } = createContext()
    const viewCtx = ctx.makeChildView('View')
    viewCtx.setStyle({ backgroundColor: 'red', flex: 1 })
    const node = bridge.getNode(viewCtx.handle)
    expect(node!.styles.backgroundColor).toBe('red')
    expect(node!.styles.flex).toBe(1)
  })

  test('on attaches and removes event listeners', () => {
    const { bridge, ctx } = createContext()
    const viewCtx = ctx.makeChildView('View')
    let pressed = false
    const clear = viewCtx.on('press', () => {
      pressed = true
    })
    bridge.dispatchEvent(viewCtx.handle, 'press')
    expect(pressed).toBe(true)

    pressed = false
    clear()
    bridge.dispatchEvent(viewCtx.handle, 'press')
    expect(pressed).toBe(false)
  })

  describe('moveRangeBefore', () => {
    test('moves a range of children before a target', () => {
      const { bridge, ctx } = createContext()
      const a = ctx.makeChildView('A')
      const b = ctx.makeChildView('B')
      const c = ctx.makeChildView('C')
      const d = ctx.makeChildView('D')

      // Order: A B C D → move B..C before A → B C A D
      ctx.moveRangeBefore(b, c, a)

      const handles = bridge.getChildren(ctx.handle)
      const types = handles.map(h => bridge.getNode(h)!.type)
      expect(types).toEqual(['B', 'C', 'A', 'D'])
    })

    test('no-op when start or end not found', () => {
      const { bridge, ctx } = createContext()
      const a = ctx.makeChildView('A')
      const other = new NativeContext(bridge, 999 as any)

      ctx.moveRangeBefore(other, a, a)
      const handles = bridge.getChildren(ctx.handle)
      expect(handles.length).toBe(1)
    })
  })

  describe('removeRange', () => {
    test('removes a range of children', () => {
      const { bridge, ctx } = createContext()
      const a = ctx.makeChildView('A')
      const b = ctx.makeChildView('B')
      const c = ctx.makeChildView('C')
      const d = ctx.makeChildView('D')

      ctx.removeRange(b, c)

      const handles = bridge.getChildren(ctx.handle)
      const types = handles.map(h => bridge.getNode(h)!.type)
      expect(types).toEqual(['A', 'D'])
    })

    test('no-op when start or end not found', () => {
      const { bridge, ctx } = createContext()
      ctx.makeChildView('A')
      const other = new NativeContext(bridge, 999 as any)

      ctx.removeRange(other, other)
      const handles = bridge.getChildren(ctx.handle)
      expect(handles.length).toBe(1)
    })
  })

  describe('removeAllBefore', () => {
    test('removes all children before the marker', () => {
      const { bridge, ctx } = createContext()
      ctx.makeChildView('A')
      ctx.makeChildView('B')
      const c = ctx.makeChildView('C')
      ctx.makeChildView('D')

      ctx.removeAllBefore(c)

      const handles = bridge.getChildren(ctx.handle)
      const types = handles.map(h => bridge.getNode(h)!.type)
      expect(types).toEqual(['C', 'D'])
    })

    test('no-op when marker is first child', () => {
      const { bridge, ctx } = createContext()
      const a = ctx.makeChildView('A')
      ctx.makeChildView('B')

      ctx.removeAllBefore(a)

      const handles = bridge.getChildren(ctx.handle)
      expect(handles.length).toBe(2)
    })
  })

  describe('providers', () => {
    test('setProvider and getProvider work correctly', () => {
      const { ctx } = createContext()
      const mark = makeProviderMark<string>('test')
      const newCtx = ctx.setProvider(mark, 'value', undefined)
      const { value } = newCtx.getProvider(mark)
      expect(value).toBe('value')
    })

    test('setProvider returns a new context (immutable)', () => {
      const { ctx } = createContext()
      const mark = makeProviderMark<string>('test')
      const newCtx = ctx.setProvider(mark, 'value', undefined)
      expect(newCtx).not.toBe(ctx)
    })

    test('getProvider throws when not found', () => {
      const { ctx } = createContext()
      const mark = makeProviderMark<string>('missing')
      expect(() => ctx.getProvider(mark)).toThrow()
    })

    test('provider onUse callback is returned', () => {
      const { ctx } = createContext()
      const mark = makeProviderMark<string>('test')
      let used = false
      const newCtx = ctx.setProvider(mark, 'value', () => {
        used = true
      })
      const result = newCtx.getProvider(mark)
      result.onUse?.()
      expect(used).toBe(true)
    })

    test('child contexts inherit providers', () => {
      const { ctx } = createContext()
      const mark = makeProviderMark<number>('counter')
      const withProvider = ctx.setProvider(mark, 42, undefined)
      const child = withProvider.makeChildView('View')
      const { value } = child.getProvider(mark)
      expect(value).toBe(42)
    })
  })
})
