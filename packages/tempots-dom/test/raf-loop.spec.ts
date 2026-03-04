import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createRafLoop, RafLoop } from '../src'
import { render, html } from '../src'

describe('createRafLoop', () => {
  let rafCallbacks: Array<(time: number) => void>
  let originalRaf: typeof requestAnimationFrame
  let originalCaf: typeof cancelAnimationFrame
  let frameId: number

  beforeEach(() => {
    rafCallbacks = []
    frameId = 0
    originalRaf = globalThis.requestAnimationFrame
    originalCaf = globalThis.cancelAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb)
      return ++frameId
    })
    globalThis.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCaf
  })

  test('calls callback on each frame with delta time', () => {
    const callback = vi.fn()
    createRafLoop(callback)

    // First frame
    expect(rafCallbacks).toHaveLength(1)
    rafCallbacks[0](1000)
    expect(callback).toHaveBeenCalledWith(0) // first frame dt = 0

    // Second frame
    rafCallbacks[1](1016)
    expect(callback).toHaveBeenCalledWith(16)

    // Third frame
    rafCallbacks[2](1033)
    expect(callback).toHaveBeenCalledWith(17)
  })

  test('dispose stops the loop', () => {
    const callback = vi.fn()
    const handle = createRafLoop(callback)

    rafCallbacks[0](1000) // first frame
    handle.dispose()

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
    // Should not schedule more frames after dispose
    const callbackCount = rafCallbacks.length
    // Even if a stale callback fires, it should not call the user callback
    if (rafCallbacks.length > callbackCount - 1) {
      const lastCb = rafCallbacks[rafCallbacks.length - 1]
      if (lastCb) lastCb(2000)
    }
    // callback should not have been called after dispose
    expect(callback).toHaveBeenCalledTimes(1)
  })
})

describe('RafLoop renderable', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('is a valid renderable', () => {
    const callback = vi.fn()
    const clear = render(html.div(RafLoop(callback)), document.body)
    expect(document.body.innerHTML).toContain('<div>')
    clear()
  })
})
