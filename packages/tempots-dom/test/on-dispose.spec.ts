import { describe, expect, test, vi } from 'vitest'
import { render, html, OnDispose, Fragment } from '../src'

describe('OnDispose', () => {
  test('should call dispose function on clear', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const disposeFn = vi.fn()

    const clear = render(
      html.div(
        OnDispose(disposeFn)
      ),
      element
    )

    expect(disposeFn).not.toHaveBeenCalled()

    clear()

    expect(disposeFn).toHaveBeenCalledTimes(1)
    document.body.removeChild(element)
  })

  test('should pass removeTree argument to dispose function', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const disposeFn = vi.fn()

    const clear = render(
      html.div(
        OnDispose(disposeFn)
      ),
      element
    )

    clear()

    // When OnDispose is inside an element, removeTree is false because
    // the parent element handles tree removal
    expect(disposeFn).toHaveBeenCalledWith(false, expect.anything())
    document.body.removeChild(element)
  })

  test('should call multiple dispose functions', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const disposeFn1 = vi.fn()
    const disposeFn2 = vi.fn()
    const disposeFn3 = vi.fn()

    const clear = render(
      html.div(
        OnDispose(disposeFn1, disposeFn2, disposeFn3)
      ),
      element
    )

    clear()

    expect(disposeFn1).toHaveBeenCalledTimes(1)
    expect(disposeFn2).toHaveBeenCalledTimes(1)
    expect(disposeFn3).toHaveBeenCalledTimes(1)
    document.body.removeChild(element)
  })

  test('should handle WithDispose objects', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const disposeFn = vi.fn()
    const disposable = { dispose: disposeFn }

    const clear = render(
      html.div(
        OnDispose(disposable)
      ),
      element
    )

    clear()

    expect(disposeFn).toHaveBeenCalledTimes(1)
    // When OnDispose is inside an element, removeTree is false
    expect(disposeFn).toHaveBeenCalledWith(false, expect.anything())
    document.body.removeChild(element)
  })

  test('should handle mixed functions and WithDispose objects', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const directFn = vi.fn()
    const objectDispose = vi.fn()

    const clear = render(
      html.div(
        OnDispose(directFn, { dispose: objectDispose })
      ),
      element
    )

    clear()

    expect(directFn).toHaveBeenCalledTimes(1)
    expect(objectDispose).toHaveBeenCalledTimes(1)
    document.body.removeChild(element)
  })

  test('should work with nested elements', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const outerDispose = vi.fn()
    const innerDispose = vi.fn()

    const clear = render(
      html.div(
        OnDispose(outerDispose),
        html.span(
          OnDispose(innerDispose)
        )
      ),
      element
    )

    clear()

    expect(outerDispose).toHaveBeenCalledTimes(1)
    expect(innerDispose).toHaveBeenCalledTimes(1)
    document.body.removeChild(element)
  })

  test('should work with Fragment', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const disposeFn = vi.fn()

    const clear = render(
      Fragment(
        html.span('content'),
        OnDispose(disposeFn)
      ),
      element
    )

    expect(element.innerHTML).toBe('<span>content</span>')

    clear()

    expect(disposeFn).toHaveBeenCalledTimes(1)
    document.body.removeChild(element)
  })

  test('should provide DOMContext to dispose function', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    let capturedCtx: unknown

    const clear = render(
      html.div(
        OnDispose((removeTree, ctx) => {
          capturedCtx = ctx
        })
      ),
      element
    )

    clear()

    expect(capturedCtx).toBeDefined()
    expect(typeof capturedCtx).toBe('object')
    document.body.removeChild(element)
  })

  test('should handle empty OnDispose', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    // Should not throw
    const clear = render(
      html.div(
        OnDispose()
      ),
      element
    )

    expect(() => clear()).not.toThrow()
    document.body.removeChild(element)
  })

  test('should call dispose in order', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const order: number[] = []

    const clear = render(
      html.div(
        OnDispose(
          () => order.push(1),
          () => order.push(2),
          () => order.push(3)
        )
      ),
      element
    )

    clear()

    expect(order).toEqual([1, 2, 3])
    document.body.removeChild(element)
  })
})
