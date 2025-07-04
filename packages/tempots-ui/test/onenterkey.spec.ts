import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnEnterKey } from '../src/renderables/onenterkey'
import { html, render } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('onenterkey.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('OnEnterKey', () => {
    it('should be a function', () => {
      expect(typeof OnEnterKey).toBe('function')
    })

    it('should call handler when Enter key is pressed inside element', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        html.input()
      )

      const clear = render(container, document.body)
      await sleep(10)

      const input = document.querySelector('input') as HTMLInputElement
      input.focus()

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })

      Object.defineProperty(enterEvent, 'target', {
        value: input,
        enumerable: true
      })

      document.dispatchEvent(enterEvent)

      expect(handler).toHaveBeenCalledWith(enterEvent)

      clear()
    })

    it('should not call handler when other keys are pressed', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        html.input()
      )

      const clear = render(container, document.body)
      await sleep(10)

      const input = document.querySelector('input') as HTMLInputElement
      input.focus()

      const keys = ['Space', 'Tab', 'Escape', 'a', 'A', 'ArrowUp', 'ArrowDown']

      for (const key of keys) {
        const keyEvent = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true
        })

        Object.defineProperty(keyEvent, 'target', {
          value: input,
          enumerable: true
        })

        document.dispatchEvent(keyEvent)
      }

      expect(handler).not.toHaveBeenCalled()

      clear()
    })

    it('should not call handler when Enter is pressed outside element', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        'Container content'
      )

      const clear = render(container, document.body)
      await sleep(10)

      // Create an element outside the container
      const outsideInput = document.createElement('input')
      document.body.appendChild(outsideInput)
      outsideInput.focus()

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })

      Object.defineProperty(enterEvent, 'target', {
        value: outsideInput,
        enumerable: true
      })

      document.dispatchEvent(enterEvent)

      expect(handler).not.toHaveBeenCalled()

      clear()
      outsideInput.remove()
    })

    it('should work with nested elements', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        html.div(
          html.div(
            html.input()
          )
        )
      )

      const clear = render(container, document.body)
      await sleep(10)

      const input = document.querySelector('input') as HTMLInputElement
      input.focus()

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })

      Object.defineProperty(enterEvent, 'target', {
        value: input,
        enumerable: true
      })

      document.dispatchEvent(enterEvent)

      expect(handler).toHaveBeenCalledWith(enterEvent)

      clear()
    })

    it('should handle multiple Enter key presses', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        html.input()
      )

      const clear = render(container, document.body)
      await sleep(10)

      const input = document.querySelector('input') as HTMLInputElement
      input.focus()

      // Press Enter multiple times
      for (let i = 0; i < 3; i++) {
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true
        })

        Object.defineProperty(enterEvent, 'target', {
          value: input,
          enumerable: true
        })

        document.dispatchEvent(enterEvent)
      }

      expect(handler).toHaveBeenCalledTimes(3)

      clear()
    })

    it('should remove event listener on dispose', async () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const container = html.div(
        OnEnterKey(handler),
        html.input()
      )

      const clear = render(container, document.body)
      await sleep(10)

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      // Dispose the component
      clear()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      // Verify handler is not called after disposal
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })

      Object.defineProperty(enterEvent, 'target', {
        value: input,
        enumerable: true
      })

      document.dispatchEvent(enterEvent)

      expect(handler).not.toHaveBeenCalled()

      input.remove()
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should work with different element types', async () => {
      const handler = vi.fn()

      const container = html.div(
        OnEnterKey(handler),
        html.input(),
        html.textarea(),
        html.button('Submit')
      )

      const clear = render(container, document.body)
      await sleep(10)

      const elements = [
        document.querySelector('input') as HTMLElement,
        document.querySelector('textarea') as HTMLElement,
        document.querySelector('button') as HTMLElement
      ]

      for (const element of elements) {
        element.focus()

        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true
        })

        Object.defineProperty(enterEvent, 'target', {
          value: element,
          enumerable: true
        })

        document.dispatchEvent(enterEvent)
      }

      expect(handler).toHaveBeenCalledTimes(3)

      clear()
    })
  })
})
