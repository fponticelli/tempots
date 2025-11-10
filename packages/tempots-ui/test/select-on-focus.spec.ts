import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SelectOnFocus } from '../src/renderables/select-on-focus'
import { html, render, attr } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('select-on-focus.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('SelectOnFocus', () => {
    it('should be a function', () => {
      expect(typeof SelectOnFocus).toBe('function')
    })

    it('should select text when input receives focus', async () => {
      const input = html.input(
        SelectOnFocus(),
        attr.value('test value')
      )

      const clear = render(input, document.body)
      await sleep(10)

      const inputElement = document.querySelector('input') as HTMLInputElement

      // Mock the select method
      const selectSpy = vi.spyOn(inputElement, 'select')

      // Trigger focus event
      const focusEvent = new FocusEvent('focus', {
        bubbles: true,
        cancelable: true
      })

      inputElement.dispatchEvent(focusEvent)

      expect(selectSpy).toHaveBeenCalled()

      selectSpy.mockRestore()
      clear()
    })

    it('should select text when textarea receives focus', async () => {
      const textarea = html.textarea(
        SelectOnFocus(),
        'textarea content'
      )

      const clear = render(textarea, document.body)
      await sleep(10)

      const textareaElement = document.querySelector('textarea') as HTMLTextAreaElement

      // Mock the select method
      const selectSpy = vi.spyOn(textareaElement, 'select')

      // Trigger focus event
      const focusEvent = new FocusEvent('focus', {
        bubbles: true,
        cancelable: true
      })

      textareaElement.dispatchEvent(focusEvent)

      expect(selectSpy).toHaveBeenCalled()

      selectSpy.mockRestore()
      clear()
    })

    it('should handle focus on elements without select method', async () => {
      const button = html.button(
        SelectOnFocus(),
        'Button'
      )

      const clear = render(button, document.body)
      await sleep(10)

      const buttonElement = document.querySelector('button') as HTMLButtonElement

      // Trigger focus event - will throw error because button doesn't have select method
      const focusEvent = new FocusEvent('focus', {
        bubbles: true,
        cancelable: true
      })

      expect(() => {
        buttonElement.dispatchEvent(focusEvent)
      }).toThrow('e.target?.select is not a function')

      clear()
    })

    it('should work with multiple inputs', async () => {
      const container = html.div(
        html.input(
          SelectOnFocus(),
          attr.value('first input')
        ),
        html.input(
          SelectOnFocus(),
          attr.value('second input')
        )
      )

      const clear = render(container, document.body)
      await sleep(10)

      const inputs = document.querySelectorAll('input')
      const selectSpies = Array.from(inputs).map(input => vi.spyOn(input, 'select'))

      // Focus each input
      inputs.forEach(input => {
        const focusEvent = new FocusEvent('focus', {
          bubbles: true,
          cancelable: true
        })
        input.dispatchEvent(focusEvent)
      })

      selectSpies.forEach(spy => {
        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
      })

      clear()
    })

    it('should handle rapid focus events', async () => {
      const input = html.input(
        SelectOnFocus(),
        attr.value('rapid focus test')
      )

      const clear = render(input, document.body)
      await sleep(10)

      const inputElement = document.querySelector('input') as HTMLInputElement
      const selectSpy = vi.spyOn(inputElement, 'select')

      // Trigger multiple focus events rapidly
      for (let i = 0; i < 5; i++) {
        const focusEvent = new FocusEvent('focus', {
          bubbles: true,
          cancelable: true
        })
        inputElement.dispatchEvent(focusEvent)
      }

      expect(selectSpy).toHaveBeenCalledTimes(5)

      selectSpy.mockRestore()
      clear()
    })

    it('should work with different input types', async () => {
      const container = html.div(
        html.input(
          SelectOnFocus(),
          attr.type('text'),
          attr.value('text input')
        ),
        html.input(
          SelectOnFocus(),
          attr.type('email'),
          attr.value('email@example.com')
        ),
        html.input(
          SelectOnFocus(),
          attr.type('password'),
          attr.value('password123')
        )
      )

      const clear = render(container, document.body)
      await sleep(10)

      const inputs = document.querySelectorAll('input')
      const selectSpies = Array.from(inputs).map(input => vi.spyOn(input, 'select'))

      // Focus each input
      inputs.forEach(input => {
        const focusEvent = new FocusEvent('focus', {
          bubbles: true,
          cancelable: true
        })
        input.dispatchEvent(focusEvent)
      })

      selectSpies.forEach(spy => {
        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
      })

      clear()
    })

    it('should handle null target gracefully', async () => {
      const input = html.input(
        SelectOnFocus(),
        attr.value('test')
      )

      const clear = render(input, document.body)
      await sleep(10)

      // Create a focus event with null target
      const focusEvent = new FocusEvent('focus', {
        bubbles: true,
        cancelable: true
      })

      // Override target to be null
      Object.defineProperty(focusEvent, 'target', {
        value: null,
        enumerable: true
      })

      const inputElement = document.querySelector('input') as HTMLInputElement

      // Should not throw error
      expect(() => {
        inputElement.dispatchEvent(focusEvent)
      }).not.toThrow()

      clear()
    })

    it('should throw error with contenteditable elements', async () => {
      const div = html.div(
        SelectOnFocus(),
        attr.contenteditable('true'),
        'Editable content'
      )

      const clear = render(div, document.body)
      await sleep(10)

      const divElement = document.querySelector('div') as HTMLDivElement

      // Trigger focus event - will throw error because div doesn't have select method
      const focusEvent = new FocusEvent('focus', {
        bubbles: true,
        cancelable: true
      })

      expect(() => {
        divElement.dispatchEvent(focusEvent)
      }).toThrow('e.target?.select is not a function')

      clear()
    })

    it('should return a renderable function', () => {
      const selectOnFocus = SelectOnFocus()
      expect(selectOnFocus).toHaveProperty('render')
    })
  })
})
