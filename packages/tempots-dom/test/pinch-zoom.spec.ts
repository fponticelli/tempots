import { describe, expect, test } from 'vitest'
import { createPinchZoomHandler, prop } from '../src'
import type { PinchZoomState } from '../src'

function makeTouch(id: number, x: number, y: number): Touch {
  return {
    identifier: id,
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
    pageX: x,
    pageY: y,
    target: document.body,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 0,
  }
}

function makeTouchEvent(
  type: string,
  touches: Touch[]
): TouchEvent {
  const event = new Event(type) as any
  event.touches = touches
  event.preventDefault = () => {}
  return event as TouchEvent
}

describe('createPinchZoomHandler', () => {
  const rect: DOMRect = {
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: 400,
    toJSON: () => {},
  }

  test('does nothing with single touch', () => {
    const state = prop<PinchZoomState>({ scale: 1, panX: 0, panY: 0 })
    const handler = createPinchZoomHandler(state, () => rect)

    const event = makeTouchEvent('touchstart', [makeTouch(0, 100, 100)])
    handler.onTouchStart(event)

    expect(state.get()).toEqual({ scale: 1, panX: 0, panY: 0 })
    state.dispose()
  })

  test('scales up on pinch apart', () => {
    const state = prop<PinchZoomState>({ scale: 1, panX: 0, panY: 0 })
    const handler = createPinchZoomHandler(state, () => rect)

    // Two fingers 100px apart
    handler.onTouchStart(
      makeTouchEvent('touchstart', [makeTouch(0, 100, 200), makeTouch(1, 200, 200)])
    )

    // Spread to 200px apart (2x zoom)
    handler.onTouchMove(
      makeTouchEvent('touchmove', [makeTouch(0, 50, 200), makeTouch(1, 250, 200)])
    )

    expect(state.get().scale).toBeCloseTo(2, 1)
    state.dispose()
  })

  test('respects minScale and maxScale', () => {
    const state = prop<PinchZoomState>({ scale: 1, panX: 0, panY: 0 })
    const handler = createPinchZoomHandler(state, () => rect, {
      minScale: 0.5,
      maxScale: 2,
    })

    // Two fingers 100px apart
    handler.onTouchStart(
      makeTouchEvent('touchstart', [makeTouch(0, 100, 200), makeTouch(1, 200, 200)])
    )

    // Spread to 400px (4x) — should clamp to 2
    handler.onTouchMove(
      makeTouchEvent('touchmove', [makeTouch(0, 0, 200), makeTouch(1, 400, 200)])
    )

    expect(state.get().scale).toBe(2)
    state.dispose()
  })

  test('touchend is a no-op', () => {
    const state = prop<PinchZoomState>({ scale: 1, panX: 0, panY: 0 })
    const handler = createPinchZoomHandler(state, () => rect)

    handler.onTouchEnd(makeTouchEvent('touchend', []))
    expect(state.get()).toEqual({ scale: 1, panX: 0, panY: 0 })
    state.dispose()
  })
})
