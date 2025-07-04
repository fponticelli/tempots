import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnKeyPressed, matchesKeyCombo, type KeyCombo } from '../src/renderables/onkeypressed'
import { html, render } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('onkeypressed.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('matchesKeyCombo', () => {
    it('should match string key combos', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      
      expect(matchesKeyCombo('Enter', event)).toBe(true)
      expect(matchesKeyCombo('Space', event)).toBe(false)
      expect(matchesKeyCombo('a', event)).toBe(false)
    })

    it('should match KeyCombo objects with key property', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      
      expect(matchesKeyCombo({ key: 'Enter' }, event)).toBe(true)
      expect(matchesKeyCombo({ key: 'Space' }, event)).toBe(false)
    })

    it('should match KeyCombo objects with code property', () => {
      const event = new KeyboardEvent('keydown', { code: 'KeyA' })
      
      expect(matchesKeyCombo({ code: 'KeyA' }, event)).toBe(true)
      expect(matchesKeyCombo({ code: 'KeyB' }, event)).toBe(false)
    })

    it('should match modifier keys', () => {
      const ctrlEvent = new KeyboardEvent('keydown', { 
        key: 'a', 
        ctrlKey: true 
      })
      
      expect(matchesKeyCombo({ key: 'a', ctrlKey: true }, ctrlEvent)).toBe(true)
      expect(matchesKeyCombo({ key: 'a', ctrlKey: false }, ctrlEvent)).toBe(false)
      expect(matchesKeyCombo({ key: 'a' }, ctrlEvent)).toBe(true) // undefined means "don't care"
    })

    it('should match all modifier keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: true,
        repeat: true
      })
      
      const combo: KeyCombo = {
        key: 'a',
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: true,
        repeat: true
      }
      
      expect(matchesKeyCombo(combo, event)).toBe(true)
    })

    it('should handle commandOrControlKey modifier', () => {
      const ctrlEvent = new KeyboardEvent('keydown', { 
        key: 'a', 
        ctrlKey: true 
      })
      
      const metaEvent = new KeyboardEvent('keydown', { 
        key: 'a', 
        metaKey: true 
      })
      
      const combo: KeyCombo = { key: 'a', commandOrControlKey: true }
      
      expect(matchesKeyCombo(combo, ctrlEvent)).toBe(true)
      expect(matchesKeyCombo(combo, metaEvent)).toBe(true)
      
      const normalEvent = new KeyboardEvent('keydown', { key: 'a' })
      expect(matchesKeyCombo(combo, normalEvent)).toBe(false)
    })

    it('should handle undefined properties as "don\'t care"', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        altKey: false
      })
      
      // Undefined properties should match regardless of event state
      expect(matchesKeyCombo({ key: 'a' }, event)).toBe(true)
      expect(matchesKeyCombo({ key: 'a', ctrlKey: undefined }, event)).toBe(true)
      expect(matchesKeyCombo({ key: 'a', altKey: undefined }, event)).toBe(true)
    })
  })

  describe('OnKeyPressed', () => {
    it('should be a function', () => {
      expect(typeof OnKeyPressed).toBe('function')
    })

    it('should call handler when allowed key is pressed inside element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ allowedKeys: ['Enter'], handler }),
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

    it('should not call handler when disallowed key is pressed', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ allowedKeys: ['Enter'], handler }),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      const spaceEvent = new KeyboardEvent('keydown', {
        key: 'Space',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(spaceEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(spaceEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      clear()
    })

    it('should not call handler when key is pressed outside element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ allowedKeys: ['Enter'], handler }),
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

    it('should handle multiple allowed keys', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ 
          allowedKeys: ['Enter', 'Space', 'Escape'], 
          handler 
        }),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      const keys = ['Enter', 'Space', 'Escape']
      
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
      
      expect(handler).toHaveBeenCalledTimes(3)
      
      clear()
    })

    it('should handle KeyCombo objects', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ 
          allowedKeys: [
            { key: 'a', ctrlKey: true },
            { key: 'b', altKey: true }
          ], 
          handler 
        }),
        html.input()
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const input = document.querySelector('input') as HTMLInputElement
      input.focus()
      
      // Test Ctrl+A
      const ctrlAEvent = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(ctrlAEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(ctrlAEvent)
      
      // Test Alt+B
      const altBEvent = new KeyboardEvent('keydown', {
        key: 'b',
        altKey: true,
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(altBEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(altBEvent)
      
      // Test plain 'a' (should not match)
      const plainAEvent = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(plainAEvent, 'target', {
        value: input,
        enumerable: true
      })
      
      document.dispatchEvent(plainAEvent)
      
      expect(handler).toHaveBeenCalledTimes(2)
      
      clear()
    })

    it('should stop at first matching key combo', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnKeyPressed({ 
          allowedKeys: ['Enter', 'Enter'], // Duplicate keys
          handler 
        }),
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
      
      // Should only be called once due to break statement
      expect(handler).toHaveBeenCalledTimes(1)
      
      clear()
    })

    it('should remove event listener on dispose', async () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const container = html.div(
        OnKeyPressed({ allowedKeys: ['Enter'], handler }),
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
  })
})
