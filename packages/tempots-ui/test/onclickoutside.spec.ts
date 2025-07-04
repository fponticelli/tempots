import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnClickOutside } from '../src/renderables/onclickoutside'
import { html, render } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('onclickoutside.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('OnClickOutside', () => {
    it('should be a function', () => {
      expect(typeof OnClickOutside).toBe('function')
    })

    it('should call handler when clicking outside the element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnClickOutside(handler),
        'Click outside me'
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      // Create a click event outside the container
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        target: outsideElement
      })
      
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      expect(handler).toHaveBeenCalledWith(clickEvent)
      
      clear()
      outsideElement.remove()
    })

    it('should not call handler when clicking inside the element', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnClickOutside(handler),
        'Click inside me'
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const containerElement = document.querySelector('div') as HTMLElement
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(clickEvent, 'target', {
        value: containerElement,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      clear()
    })

    it('should not call handler when clicking on child elements', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnClickOutside(handler),
        html.span('Child element'),
        html.button('Button child')
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const spanElement = document.querySelector('span') as HTMLElement
      const buttonElement = document.querySelector('button') as HTMLElement
      
      // Click on span child
      const spanClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(spanClickEvent, 'target', {
        value: spanElement,
        enumerable: true
      })
      
      document.dispatchEvent(spanClickEvent)
      expect(handler).not.toHaveBeenCalled()
      
      // Click on button child
      const buttonClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(buttonClickEvent, 'target', {
        value: buttonElement,
        enumerable: true
      })
      
      document.dispatchEvent(buttonClickEvent)
      expect(handler).not.toHaveBeenCalled()
      
      clear()
    })

    it('should handle multiple OnClickOutside components', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      const container = html.div(
        html.div(
          OnClickOutside(handler1),
          'First container'
        ),
        html.div(
          OnClickOutside(handler2),
          'Second container'
        )
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      // Create a click event outside both containers
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      expect(handler1).toHaveBeenCalledWith(clickEvent)
      expect(handler2).toHaveBeenCalledWith(clickEvent)
      
      clear()
      outsideElement.remove()
    })

    it('should remove event listener on dispose', async () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const container = html.div(
        OnClickOutside(handler),
        'Test container'
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
      
      // Dispose the component
      clear()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
      
      // Verify handler is not called after disposal
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      outsideElement.remove()
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should work with nested elements', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnClickOutside(handler),
        html.div(
          html.div(
            html.span('Deeply nested content')
          )
        )
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const nestedSpan = document.querySelector('span') as HTMLElement
      
      // Click on deeply nested element should not trigger handler
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      Object.defineProperty(clickEvent, 'target', {
        value: nestedSpan,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      expect(handler).not.toHaveBeenCalled()
      
      clear()
    })

    it('should handle rapid clicks', async () => {
      const handler = vi.fn()
      
      const container = html.div(
        OnClickOutside(handler),
        'Test container'
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
        
        Object.defineProperty(clickEvent, 'target', {
          value: outsideElement,
          enumerable: true
        })
        
        document.dispatchEvent(clickEvent)
      }
      
      expect(handler).toHaveBeenCalledTimes(5)
      
      clear()
      outsideElement.remove()
    })

    it('should work with different element types', async () => {
      const handler = vi.fn()
      
      const container = html.section(
        OnClickOutside(handler),
        html.header('Header'),
        html.main('Main content'),
        html.footer('Footer')
      )
      
      const clear = render(container, document.body)
      await sleep(10)
      
      // Click on each child element should not trigger handler
      const header = document.querySelector('header') as HTMLElement
      const main = document.querySelector('main') as HTMLElement
      const footer = document.querySelector('footer') as HTMLElement
      
      for (const element of [header, main, footer]) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
        
        Object.defineProperty(clickEvent, 'target', {
          value: element,
          enumerable: true
        })
        
        document.dispatchEvent(clickEvent)
      }
      
      expect(handler).not.toHaveBeenCalled()
      
      clear()
    })
  })
})
