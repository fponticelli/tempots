import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AutoFocus } from '../src/renderables/autofocus'
import { html, render } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('autofocus.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('AutoFocus', () => {
    it('should focus element with default delay', async () => {
      const input = html.input(AutoFocus())
      const clear = render(input, document.body)

      // Wait for default delay (10ms) plus a bit more
      await sleep(20)

      // Check that the input is focused
      expect(document.activeElement).toBe(document.querySelector('input'))
      clear()
    })

    it('should focus element with custom delay', async () => {
      const input = html.input(AutoFocus(50)) // 50ms delay
      const clear = render(input, document.body)

      // Should not be focused immediately
      await sleep(10)
      expect(document.activeElement).not.toBe(document.querySelector('input'))

      // Should be focused after custom delay
      await sleep(50)
      expect(document.activeElement).toBe(document.querySelector('input'))

      clear()
    })

    it('should work with real DOM elements', async () => {
      const input = html.input(
        AutoFocus()
      )

      const clear = render(input, document.body)

      // Wait for focus to happen
      await sleep(20)

      // Check that the input is the active element
      expect(document.activeElement).toBe(document.querySelector('input'))

      clear()
    })

    it('should handle zero delay', async () => {
      const input = html.input(AutoFocus(0)) // No delay
      const clear = render(input, document.body)

      // Should be focused very quickly
      await sleep(5)
      expect(document.activeElement).toBe(document.querySelector('input'))

      clear()
    })

    it('should work with different element types', async () => {
      document.body.innerHTML = '' // Clear previous elements

      const button = html.button(AutoFocus(), 'Click me')
      const textarea = html.textarea(AutoFocus(20))

      const clear1 = render(button, document.body)
      const clear2 = render(textarea, document.body)

      await sleep(30)

      // One of them should be focused (the last one to focus wins)
      const activeElement = document.activeElement
      expect(activeElement === document.querySelector('button') ||
             activeElement === document.querySelector('textarea')).toBe(true)

      clear1()
      clear2()
    })

    it('should handle element disposal before focus', async () => {
      const input = html.input(AutoFocus(100)) // Long delay
      const clear = render(input, document.body)

      // Dispose before focus happens
      clear()

      // Wait for the delay to pass
      await sleep(120)

      // Element should not be focused since it was disposed
      expect(document.activeElement).not.toBe(document.querySelector('input'))
    })

    it('should return a renderable function', () => {
      const autofocus = AutoFocus()
      expect(autofocus).toHaveProperty('render')
    })

    it('should work with different delay values', async () => {
      document.body.innerHTML = '' // Clear previous elements

      const delays = [0, 10, 50]
      const elements = delays.map(delay => html.input(AutoFocus(delay)))

      // Render elements one by one to test different delays
      for (let i = 0; i < elements.length; i++) {
        document.body.innerHTML = '' // Clear for each test
        const clear = render(elements[i], document.body)

        if (delays[i] === 0) {
          await sleep(5)
          expect(document.activeElement).toBe(document.querySelector('input'))
        } else if (delays[i] === 10) {
          await sleep(5)
          expect(document.activeElement).not.toBe(document.querySelector('input'))
          await sleep(10)
          expect(document.activeElement).toBe(document.querySelector('input'))
        } else if (delays[i] === 50) {
          await sleep(20)
          expect(document.activeElement).not.toBe(document.querySelector('input'))
          await sleep(40)
          expect(document.activeElement).toBe(document.querySelector('input'))
        }

        clear()
      }
    })

    it('should handle multiple autofocus elements', async () => {
      document.body.innerHTML = ''

      // Create a container to hold both inputs
      const container = html.div(
        html.input(AutoFocus(10)),
        html.input(AutoFocus(20))
      )

      const clear = render(container, document.body)

      // Wait for both to potentially focus
      await sleep(30)

      // Should have 2 inputs
      const inputs = document.querySelectorAll('input')
      expect(inputs.length).toBe(2)

      // One of them should be focused (the last one to focus wins)
      expect(document.activeElement === inputs[0] || document.activeElement === inputs[1]).toBe(true)

      clear()
    })
  })
})
