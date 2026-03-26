import { describe, it, expect, vi } from 'vitest'
import { createHmrBoundary } from '../src/hmr/runtime'

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
