import { describe, it, expect, vi } from 'vitest'
import { createHmrBoundary } from '../src/hmr/runtime'

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
