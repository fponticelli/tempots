import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AutoSelect } from '../src/renderables/autoselect'
import { html, render, attr } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('autoselect.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('AutoSelect', () => {
    it('should select text with default delay', async () => {
      const input = html.input(
        AutoSelect(),
        attr.value('test value')
      )
      
      const clear = render(input, document.body)
      
      // Wait for default delay (10ms) plus a bit more
      await sleep(20)
      
      const inputElement = document.querySelector('input') as HTMLInputElement
      expect(inputElement.selectionStart).toBe(0)
      expect(inputElement.selectionEnd).toBe(10) // length of 'test value'
      
      clear()
    })

    it('should select text with custom delay', async () => {
      const input = html.input(
        AutoSelect(50), // 50ms delay
        attr.value('custom text')
      )
      
      const clear = render(input, document.body)
      
      // Should not be selected immediately
      await sleep(10)
      const inputElement = document.querySelector('input') as HTMLInputElement
      expect(inputElement.selectionStart).toBe(inputElement.selectionEnd)
      
      // Should be selected after custom delay
      await sleep(50)
      expect(inputElement.selectionStart).toBe(0)
      expect(inputElement.selectionEnd).toBe(11) // length of 'custom text'
      
      clear()
    })

    it('should work with empty input', async () => {
      const input = html.input(AutoSelect())
      const clear = render(input, document.body)
      
      await sleep(20)
      
      const inputElement = document.querySelector('input') as HTMLInputElement
      expect(inputElement.selectionStart).toBe(0)
      expect(inputElement.selectionEnd).toBe(0)
      
      clear()
    })

    it('should handle zero delay', async () => {
      const input = html.input(
        AutoSelect(0), // No delay
        attr.value('immediate')
      )
      
      const clear = render(input, document.body)
      
      // Should be selected very quickly
      await sleep(5)
      const inputElement = document.querySelector('input') as HTMLInputElement
      expect(inputElement.selectionStart).toBe(0)
      expect(inputElement.selectionEnd).toBe(9) // length of 'immediate'
      
      clear()
    })

    it('should work with textarea elements', async () => {
      const textarea = html.textarea(
        AutoSelect(),
        'textarea content'
      )
      
      const clear = render(textarea, document.body)
      
      await sleep(20)
      
      const textareaElement = document.querySelector('textarea') as HTMLTextAreaElement
      expect(textareaElement.selectionStart).toBe(0)
      expect(textareaElement.selectionEnd).toBe(16) // length of 'textarea content'
      
      clear()
    })

    it('should handle element disposal before selection', async () => {
      const input = html.input(
        AutoSelect(100), // Long delay
        attr.value('will not select')
      )
      
      const clear = render(input, document.body)
      
      // Dispose before selection happens
      clear()
      
      // Wait for the delay to pass
      await sleep(120)
      
      // Element should not exist anymore
      expect(document.querySelector('input')).toBeNull()
    })

    it('should return a renderable function', () => {
      const autoselect = AutoSelect()
      expect(autoselect).toHaveProperty('render')
    })

    it('should work with different delay values', async () => {
      const delays = [0, 10, 50]
      
      // Test each delay separately
      for (let i = 0; i < delays.length; i++) {
        document.body.innerHTML = '' // Clear for each test
        
        const input = html.input(
          AutoSelect(delays[i]),
          attr.value(`text${i}`)
        )
        
        const clear = render(input, document.body)
        
        if (delays[i] === 0) {
          await sleep(5)
          const inputElement = document.querySelector('input') as HTMLInputElement
          expect(inputElement.selectionStart).toBe(0)
          expect(inputElement.selectionEnd).toBe(5) // length of 'text0'
        } else if (delays[i] === 10) {
          await sleep(5)
          let inputElement = document.querySelector('input') as HTMLInputElement
          expect(inputElement.selectionStart).toBe(inputElement.selectionEnd)
          
          await sleep(10)
          inputElement = document.querySelector('input') as HTMLInputElement
          expect(inputElement.selectionStart).toBe(0)
          expect(inputElement.selectionEnd).toBe(5) // length of 'text1'
        } else if (delays[i] === 50) {
          await sleep(20)
          let inputElement = document.querySelector('input') as HTMLInputElement
          expect(inputElement.selectionStart).toBe(inputElement.selectionEnd)
          
          await sleep(40)
          inputElement = document.querySelector('input') as HTMLInputElement
          expect(inputElement.selectionStart).toBe(0)
          expect(inputElement.selectionEnd).toBe(5) // length of 'text2'
        }
        
        clear()
      }
    })

    it('should work with inputs that have focus', async () => {
      const input = html.input(
        AutoSelect(),
        attr.value('focused text')
      )
      
      const clear = render(input, document.body)
      
      // Focus the input first
      const inputElement = document.querySelector('input') as HTMLInputElement
      inputElement.focus()
      
      await sleep(20)
      
      expect(inputElement.selectionStart).toBe(0)
      expect(inputElement.selectionEnd).toBe(12) // length of 'focused text'
      
      clear()
    })

    it('should handle multiple autoselect elements', async () => {
      document.body.innerHTML = ''
      
      const container = html.div(
        html.input(
          AutoSelect(10),
          attr.value('first')
        ),
        html.input(
          AutoSelect(20),
          attr.value('second')
        )
      )
      
      const clear = render(container, document.body)
      
      await sleep(30)
      
      const inputs = document.querySelectorAll('input')
      expect(inputs.length).toBe(2)
      
      // Both should have their text selected
      expect(inputs[0].selectionStart).toBe(0)
      expect(inputs[0].selectionEnd).toBe(5) // length of 'first'
      expect(inputs[1].selectionStart).toBe(0)
      expect(inputs[1].selectionEnd).toBe(6) // length of 'second'
      
      clear()
    })
  })
})
