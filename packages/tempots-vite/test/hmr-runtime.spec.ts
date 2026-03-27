import { describe, it, expect, vi } from 'vitest'
import {
  createHmrBoundary,
  componentBoundary,
  hmrNotify,
  hmrRegistry,
} from '../src/hmr/runtime'

const makeRenderable = () => 'renderable'

describe('createHmrBoundary', () => {
  it('calls render with factory result on creation', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const renderable = { type: 'app' }
    const factory = () => renderable
    const target = '#app'

    createHmrBoundary(render, factory, target)

    expect(render).toHaveBeenCalledOnce()
    expect(render).toHaveBeenCalledWith(renderable, target, undefined)
  })

  it('calls clear then re-render on update', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const factory1 = () => ({ v: 1 })
    const factory2 = () => ({ v: 2 })
    const target = '#app'

    const boundary = createHmrBoundary(render, factory1, target)

    expect(render).toHaveBeenCalledOnce()

    boundary.update(factory2)

    expect(clearFn).toHaveBeenCalledOnce()
    expect(render).toHaveBeenCalledTimes(2)
    expect(render).toHaveBeenLastCalledWith({ v: 2 }, target, undefined)
  })

  it('calls clear on dispose', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const target = '#app'

    const boundary = createHmrBoundary(render, () => 'app', target)

    boundary.dispose()

    expect(clearFn).toHaveBeenCalledOnce()
  })

  it('passes render options through', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const target = '#app'
    const options = { hydrate: true }

    createHmrBoundary(render, () => 'app', target, options)

    expect(render).toHaveBeenCalledWith('app', target, options)
  })

  it('does not throw when update factory throws', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const target = '#app'
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const boundary = createHmrBoundary(render, () => 'app', target)

    const badFactory = () => {
      throw new Error('boom')
    }

    expect(() => boundary.update(badFactory)).not.toThrow()
    expect(errorSpy).toHaveBeenCalledOnce()
    expect(errorSpy.mock.calls[0][0]).toBe(
      '[tempo:hmr] Error during hot update:'
    )
    expect(errorSpy.mock.calls[0][1]).toBeInstanceOf(Error)

    errorSpy.mockRestore()
  })

  it('recovers after failed update when next update succeeds', () => {
    const clearFn1 = vi.fn()
    const clearFn2 = vi.fn()
    const render = vi
      .fn()
      .mockReturnValueOnce(clearFn1)
      .mockReturnValueOnce(clearFn2)
    const target = '#app'
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const boundary = createHmrBoundary(render, () => 'app', target)

    // Failed update - factory throws before render is called
    boundary.update(() => {
      throw new Error('boom')
    })

    // clear was called for teardown
    expect(clearFn1).toHaveBeenCalledOnce()
    // render was only called once (initial), the failed factory never reached render
    expect(render).toHaveBeenCalledOnce()

    // Successful update after failure
    boundary.update(() => 'recovered')

    // render called again with recovered value
    expect(render).toHaveBeenCalledTimes(2)
    expect(render).toHaveBeenLastCalledWith('recovered', target, undefined)

    errorSpy.mockRestore()
  })

  it('does not throw on dispose when no clear exists (after failed update)', () => {
    const clearFn = vi.fn()
    const render = vi.fn().mockReturnValue(clearFn)
    const target = '#app'
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const boundary = createHmrBoundary(render, () => 'app', target)

    // Failed update leaves clear as null
    boundary.update(() => {
      throw new Error('boom')
    })

    // Dispose should not throw even though clear is null
    expect(() => boundary.dispose()).not.toThrow()

    errorSpy.mockRestore()
  })
})

describe('snapshot/restore', () => {
  it('should restore prop values after dispose/re-create cycle', () => {
    const oldProp: any = { value: 42, __hmr_label: 'count', $__prop__: true, set: vi.fn() }
    const newProp: any = { value: 0, __hmr_label: 'count', $__prop__: true, set: vi.fn() }

    const clearFn = vi.fn()
    const mockRender = vi.fn().mockReturnValue(clearFn)
    const target = {} as Node

    const hmr = createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [oldProp], 'test-module'
    )
    hmr.dispose()

    createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [newProp], 'test-module'
    )

    expect(newProp.set).toHaveBeenCalledWith(42)
  })

  it('should not restore props with no matching label', () => {
    const oldProp: any = { value: 42, __hmr_label: 'count', $__prop__: true, set: vi.fn() }
    const newProp: any = { value: 0, __hmr_label: 'name', $__prop__: true, set: vi.fn() }

    const clearFn = vi.fn()
    const mockRender = vi.fn().mockReturnValue(clearFn)
    const target = {} as Node

    const hmr = createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [oldProp], 'test-module'
    )
    hmr.dispose()

    createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [newProp], 'test-module'
    )

    expect(newProp.set).not.toHaveBeenCalled()
  })

  it('should namespace snapshots by module ID', () => {
    const prop1: any = { value: 10, __hmr_label: 'count', $__prop__: true, set: vi.fn() }
    const prop2: any = { value: 0, __hmr_label: 'count', $__prop__: true, set: vi.fn() }

    const clearFn = vi.fn()
    const mockRender = vi.fn().mockReturnValue(clearFn)
    const target = {} as Node

    const hmrA = createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [prop1], 'module-a'
    )
    hmrA.dispose()

    createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [prop2], 'module-b'
    )

    expect(prop2.set).not.toHaveBeenCalled()
  })

  it('should handle dispose without moduleProps gracefully', () => {
    const clearFn = vi.fn()
    const mockRender = vi.fn().mockReturnValue(clearFn)
    const target = {} as Node

    const hmr = createHmrBoundary(mockRender, makeRenderable, target)
    expect(() => hmr.dispose()).not.toThrow()
  })

  it('should restore multiple props', () => {
    const oldA: any = { value: 'hello', __hmr_label: 'name', $__prop__: true, set: vi.fn() }
    const oldB: any = { value: 99, __hmr_label: 'age', $__prop__: true, set: vi.fn() }
    const newA: any = { value: '', __hmr_label: 'name', $__prop__: true, set: vi.fn() }
    const newB: any = { value: 0, __hmr_label: 'age', $__prop__: true, set: vi.fn() }

    const clearFn = vi.fn()
    const mockRender = vi.fn().mockReturnValue(clearFn)
    const target = {} as Node

    const hmr = createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [oldA, oldB], 'mod'
    )
    hmr.dispose()

    createHmrBoundary(
      mockRender, makeRenderable, target,
      undefined, [newA, newB], 'mod'
    )

    expect(newA.set).toHaveBeenCalledWith('hello')
    expect(newB.set).toHaveBeenCalledWith(99)
  })
})

describe('componentBoundary', () => {
  it('should render the component via factory on creation', () => {
    const clear = vi.fn()
    const renderFn = vi.fn().mockReturnValue(clear)
    const MyComp = (x: number) => ({ rendered: x })

    const boundary = componentBoundary(
      './my-comp', 'MyComp',
      (Comp: any) => Comp(42),
      MyComp, renderFn
    )

    expect(renderFn).toHaveBeenCalledOnce()
    expect(renderFn).toHaveBeenCalledWith({ rendered: 42 })
    boundary.dispose()
  })

  it('should register in the registry on creation', () => {
    const renderFn = vi.fn().mockReturnValue(vi.fn())

    const boundary = componentBoundary(
      './reg-test', 'MyComp',
      (Comp: any) => Comp(),
      () => 'result', renderFn
    )

    expect(hmrRegistry.has('./reg-test')).toBe(true)
    expect(hmrRegistry.get('./reg-test')!.size).toBeGreaterThanOrEqual(1)
    boundary.dispose()
  })

  it('should deregister from registry on dispose', () => {
    const renderFn = vi.fn().mockReturnValue(vi.fn())

    const boundary = componentBoundary(
      './dereg-test', 'Comp',
      (Comp: any) => Comp(),
      () => 'result', renderFn
    )

    boundary.dispose()
    expect(hmrRegistry.get('./dereg-test')!.size).toBe(0)
  })

  it('should call clear on dispose', () => {
    const clear = vi.fn()
    const renderFn = vi.fn().mockReturnValue(clear)

    const boundary = componentBoundary(
      './clear-test', 'Comp',
      (Comp: any) => Comp(),
      () => 'result', renderFn
    )

    boundary.dispose()
    expect(clear).toHaveBeenCalledOnce()
  })

  it('should re-render with new component on update', () => {
    const clear1 = vi.fn()
    const clear2 = vi.fn()
    const renderFn = vi.fn()
      .mockReturnValueOnce(clear1)
      .mockReturnValueOnce(clear2)

    const OldComp = () => ({ version: 1 })
    const NewComp = () => ({ version: 2 })

    const boundary = componentBoundary(
      './update-test', 'MyComp',
      (Comp: any) => Comp(),
      OldComp, renderFn
    )

    boundary.update({ MyComp: NewComp })

    expect(clear1).toHaveBeenCalledOnce()
    expect(renderFn).toHaveBeenCalledTimes(2)
    expect(renderFn.mock.calls[1][0]).toEqual({ version: 2 })
    boundary.dispose()
  })

  it('should handle multiple boundaries for same module', () => {
    const renderFn = vi.fn().mockReturnValue(vi.fn())
    const Comp = () => 'result'

    const b1 = componentBoundary('./multi', 'C', (C: any) => C(1), Comp, renderFn)
    const b2 = componentBoundary('./multi', 'C', (C: any) => C(2), Comp, renderFn)
    const b3 = componentBoundary('./multi', 'C', (C: any) => C(3), Comp, renderFn)

    expect(hmrRegistry.get('./multi')!.size).toBe(3)

    b1.dispose()
    expect(hmrRegistry.get('./multi')!.size).toBe(2)

    b2.dispose()
    b3.dispose()
  })
})

describe('hmrNotify', () => {
  it('should call update on all boundaries for a module', () => {
    const renderFn = vi.fn().mockReturnValue(vi.fn())
    const Comp = () => 'old'

    const b1 = componentBoundary('./notify', 'Comp', (C: any) => C(1), Comp, renderFn)
    const b2 = componentBoundary('./notify', 'Comp', (C: any) => C(2), Comp, renderFn)

    hmrNotify('./notify', { Comp: () => 'new' })

    // 2 initial + 2 updates = 4
    expect(renderFn).toHaveBeenCalledTimes(4)

    b1.dispose()
    b2.dispose()
  })

  it('should not throw when notifying unknown module', () => {
    expect(() => hmrNotify('./unknown', {})).not.toThrow()
  })

  it('should catch errors in update and continue to next boundary', () => {
    const renderFn = vi.fn()
      .mockReturnValueOnce(vi.fn())
      .mockReturnValueOnce(vi.fn())
      .mockImplementationOnce(() => { throw new Error('fail') })
      .mockReturnValueOnce(vi.fn())

    const Comp = () => 'v1'
    const b1 = componentBoundary('./err', 'A', (C: any) => C(), Comp, renderFn)
    const b2 = componentBoundary('./err', 'B', (C: any) => C(), Comp, renderFn)

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    hmrNotify('./err', { A: () => 'a2', B: () => 'b2' })
    spy.mockRestore()

    expect(renderFn).toHaveBeenCalledTimes(4)

    b1.dispose()
    b2.dispose()
  })
})
