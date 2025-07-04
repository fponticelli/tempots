import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnEscapeKey } from '../src/renderables/onescapekey'
import { html, render } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('onescapekey.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('OnEscapeKey', () => {
    it('should be a function', () => {
      expect(typeof OnEscapeKey).toBe('function')
    })

    it('should call handler when Escape key is pressed inside element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(escapeEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(escapeEvent)
      
      expect(handler).toHaveBeenCalledWith(escapeEvent)
      
      clear()
    })

    it('should not call handler when other keys are pressed', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      const keys = ['Enter', 'Space', 'Tab', 'a', 'A', 'ArrowUp', 'ArrowDown']
      
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

    it('should not call handler when Escape is pressed outside element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
        'Container content'
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      // Create an element outside the container
      const outsideInput = document.createElement('input')
      document.body.appendChild(outsideInput)
      outsideInput.focus()
      
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(escapeEvent, 'target', {
        value: outsideInput,
        enumerable: true
      })
      
      document.dispatchEvent(escapeEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      clear()
      outsideInput.remove()
    })

    it('should work with nested elements', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
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
      
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(escapeEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(escapeEvent)
      
      expect(handler).toHaveBeenCalledWith(escapeEvent)
      
      clear()
    })

    it('should handle multiple Escape key presses', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      // Press Escape multiple times
      for (let i = 0; i < 3; i++) {
        const escapeEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true
        })
        
        Object.defineProperty(escapeEvent, 'target', {
          value: input,
          enumerable: true
        })
        
        document.dispatchEvent(escapeEvent)
      }
      
      expect(handler).toHaveBeenCalledTimes(3)
      
      clear()
    })

    it('should remove event listener on dispose', async () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const container = html.div(
        OnEscapeKey(handler),
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
      
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(escapeEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(escapeEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      input.remove()
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should work with modal/dialog use case', async () => {
      const closeModal = vi.fn()
      
      const modal = html.div(
        OnEscapeKey(closeModal),
        html.div('Modal content'),
        html.button('Close')
      )
      
      const clear = render(modal, document.body)
      await sleep(10)
      
      const button = document.querySelector('button') as HTMLButtonElement
      button.focus()
      
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(escapeEvent, 'target', {
        value: button,
        enumerable: true
      })
      
      document.dispatchEvent(escapeEvent)
      
      expect(closeModal).toHaveBeenCalledWith(escapeEvent)
      
      clear()
    })

    it('should work with different element types', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnEscapeKey(handler),
        html.input(),
        html.textarea(),
        html.select(html.option('Option 1'))
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const elements = [
        document.querySelector('input') as HTMLElement,
        document.querySelector('textarea') as HTMLElement,
        document.querySelector('select') as HTMLElement
      ]
      
      for (const element of elements) {
        element.focus()
        
        const escapeEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true
        })
        
        Object.defineProperty(escapeEvent, 'target', {
          value: element,
          enumerable: true
        })
        
        document.dispatchEvent(escapeEvent)
      }
      
      expect(handler).toHaveBeenCalledTimes(3)
      
      clear()
    })
  })
})
