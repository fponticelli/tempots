import { describe, expect, test, beforeEach, vi } from 'vitest'
import { DOMNode } from '../src/renderable/domnode'
import { render, html, runHeadless, Renderable } from '../src'
import { BrowserContext } from '../src/dom/browser-context'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('DOMNode Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    test('should render a DOM element node', () => {
      const element = document.createElement('span')
      element.textContent = 'Test Element'
      element.className = 'test-class'

      const clear = render(
        html.div(
          DOMNode(element) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const renderedSpan = container.querySelector('span')!

      expect(renderedSpan).toBe(element) // Should be the exact same element
      expect(renderedSpan.textContent).toBe('Test Element')
      expect(renderedSpan.className).toBe('test-class')
      clear()
    })

    test('should render a text node', () => {
      const textNode = document.createTextNode('Hello World')

      const clear = render(
        html.div(
          DOMNode(textNode) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      expect(container.textContent).toBe('Hello World')

      // Verify it's the same text node
      const childNodes = Array.from(container.childNodes)
      expect(childNodes).toContain(textNode)
      clear()
    })

    test('should render a comment node', () => {
      const commentNode = document.createComment('This is a comment')

      const clear = render(
        html.div(
          DOMNode(commentNode) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const childNodes = Array.from(container.childNodes)

      expect(childNodes).toContain(commentNode)
      expect(commentNode.nodeValue).toBe('This is a comment')
      clear()
    })

    test('should render a document fragment', () => {
      const fragment = document.createDocumentFragment()
      const span1 = document.createElement('span')
      const span2 = document.createElement('span')
      span1.textContent = 'First'
      span2.textContent = 'Second'
      fragment.appendChild(span1)
      fragment.appendChild(span2)

      const clear = render(
        html.div(
          DOMNode(fragment) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const spans = container.querySelectorAll('span')

      expect(spans).toHaveLength(2)
      expect(spans[0].textContent).toBe('First')
      expect(spans[1].textContent).toBe('Second')
      clear()
    })
  })

  describe('insertion behavior', () => {
    test('should append node when no reference is provided', () => {
      const element1 = document.createElement('span')
      const element2 = document.createElement('div')
      element1.textContent = 'First'
      element2.textContent = 'Second'

      const clear = render(
        html.section(
          DOMNode(element1) as Renderable,
          DOMNode(element2) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('section')!
      const children = Array.from(container.children)

      expect(children).toHaveLength(2)
      expect(children[0]).toBe(element1)
      expect(children[1]).toBe(element2)
      expect(children[0].textContent).toBe('First')
      expect(children[1].textContent).toBe('Second')
      clear()
    })

    test('should insert node before reference when reference exists', () => {
      const element1 = document.createElement('span')
      const element2 = document.createElement('div')
      element1.textContent = 'First'
      element2.textContent = 'Second'

      const clear = render(
        html.section(
          html.p('Reference'),
          DOMNode(element1) as Renderable,
          DOMNode(element2) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('section')!
      const children = Array.from(container.children)

      expect(children).toHaveLength(3)
      expect(children[0].tagName).toBe('P')
      expect(children[0].textContent).toBe('Reference')
      expect(children[1]).toBe(element1)
      expect(children[2]).toBe(element2)
      clear()
    })
  })

  describe('cleanup behavior', () => {
    test('should remove node when removeTree is true', () => {
      const element = document.createElement('span')
      element.textContent = 'To be removed'
      element.id = 'test-element'

      // Test DOMNode directly with BrowserContext
      const container = document.createElement('div')
      document.body.appendChild(container)

      const ctx = BrowserContext.of(container, undefined, {}) as BrowserContext
      const dispose = DOMNode(element)(ctx)

      expect(element.parentElement).toBe(container)
      expect(container.contains(element)).toBe(true)

      dispose(true) // removeTree = true

      // After dispose(true), the element should be removed
      expect(element.parentElement).toBe(null)
      expect(container.contains(element)).toBe(false)

      container.remove()
    })

    test('should not remove node when removeTree is false', () => {
      const element = document.createElement('span')
      element.textContent = 'Should stay'
      element.id = 'persistent-element'

      const renderable = DOMNode(element) as Renderable
      const container = document.createElement('div')
      document.body.appendChild(container)

      // Manually create context and call renderable
      const mockContext = {
        element: container,
        appendOrInsert: (node: Node) => container.appendChild(node)
      }

      const dispose = renderable(mockContext as any)

      expect(container.querySelector('#persistent-element')).toBe(element)
      expect(element.parentElement).toBe(container)

      dispose(false) // removeTree = false

      expect(container.querySelector('#persistent-element')).toBe(element)
      expect(element.parentElement).toBe(container)

      container.remove()
    })

    test('should handle cleanup of element with onblur handler', () => {
      const element = document.createElement('input') as HTMLInputElement
      element.type = 'text'
      element.value = 'Test input'

      // Add an onblur handler
      const onBlurSpy = vi.fn()
      element.onblur = onBlurSpy

      // Test DOMNode directly with BrowserContext
      const container = document.createElement('div')
      document.body.appendChild(container)

      const ctx = BrowserContext.of(container, undefined, {}) as BrowserContext
      const dispose = DOMNode(element)(ctx)

      expect(element.onblur).toBe(onBlurSpy)
      expect(element.parentElement).toBe(container)

      dispose(true) // This should clean up the onblur handler

      // The onblur handler should be cleaned up when the element is removed
      expect(element.onblur).toBe(null)
      expect(element.parentElement).toBe(null)

      container.remove()
    })

    test('should handle cleanup of node without parent', () => {
      const element = document.createElement('span')
      element.textContent = 'Orphaned element'

      const renderable = DOMNode(element) as Renderable
      const container = document.createElement('div')

      const mockContext = {
        element: container,
        appendOrInsert: (_node: Node) => {
          // Don't actually append, simulating an orphaned node
        }
      }

      const dispose = renderable(mockContext as any)

      // Element should not have a parent
      expect(element.parentElement).toBe(null)

      // Should not throw when trying to remove
      expect(() => dispose(true)).not.toThrow()
    })

    test('should handle cleanup of node with undefined ownerDocument', () => {
      const element = document.createElement('span')
      element.textContent = 'Test element'

      // Mock the ownerDocument to be undefined
      Object.defineProperty(element, 'ownerDocument', {
        value: undefined,
        configurable: true
      })

      const renderable = DOMNode(element) as Renderable
      const container = document.createElement('div')
      document.body.appendChild(container)

      const mockContext = {
        element: container,
        appendOrInsert: (node: Node) => container.appendChild(node)
      }

      const dispose = renderable(mockContext as any)

      // Should not throw when trying to remove
      expect(() => dispose(true)).not.toThrow()

      container.remove()
    })
  })

  describe('complex scenarios', () => {
    test('should handle multiple DOMNode components', () => {
      const element1 = document.createElement('h1')
      const element2 = document.createElement('p')
      const element3 = document.createElement('footer')

      element1.textContent = 'Title'
      element2.textContent = 'Content'
      element3.textContent = 'Footer'

      const clear = render(
        html.article(
          DOMNode(element1) as Renderable,
          DOMNode(element2) as Renderable,
          DOMNode(element3) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('article')!
      const children = Array.from(container.children)

      expect(children).toHaveLength(3)
      expect(children[0]).toBe(element1)
      expect(children[1]).toBe(element2)
      expect(children[2]).toBe(element3)
      expect(children[0].textContent).toBe('Title')
      expect(children[1].textContent).toBe('Content')
      expect(children[2].textContent).toBe('Footer')
      clear()
    })

    test('should handle nested DOMNode components', () => {
      const outerDiv = document.createElement('div')
      const innerSpan = document.createElement('span')

      outerDiv.className = 'outer'
      innerSpan.textContent = 'Inner content'
      innerSpan.className = 'inner'

      outerDiv.appendChild(innerSpan)

      const clear = render(
        html.section(
          DOMNode(outerDiv) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('section')!
      const outerElement = container.querySelector('.outer')!
      const innerElement = outerElement.querySelector('.inner')!

      expect(outerElement).toBe(outerDiv)
      expect(innerElement).toBe(innerSpan)
      expect(innerElement.textContent).toBe('Inner content')
      clear()
    })

    test('should handle DOMNode mixed with other renderables', () => {
      const customElement = document.createElement('custom-element')
      customElement.textContent = 'Custom'

      const clear = render(
        html.div(
          html.h1('Regular Title'),
          DOMNode(customElement) as Renderable,
          html.p('Regular paragraph')
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const children = Array.from(container.children)

      expect(children).toHaveLength(3)
      expect(children[0].tagName).toBe('H1')
      expect(children[0].textContent).toBe('Regular Title')
      expect(children[1]).toBe(customElement)
      expect(children[1].textContent).toBe('Custom')
      expect(children[2].tagName).toBe('P')
      expect(children[2].textContent).toBe('Regular paragraph')
      clear()
    })
  })

  describe('headless environment', () => {
    test('should not work in headless mode - DOMNode is browser-only', () => {
      const element = document.createElement('span')
      element.textContent = 'Browser Element'

      // DOMNode is designed for browser contexts only
      // Raw DOM nodes don't have toHTML() method required by headless context
      const { root, clear } = runHeadless(() =>
        html.div(
          DOMNode(element) as Renderable
        )
      )

      // The error occurs when trying to generate HTML
      expect(() => {
        root.contentToHTML()
      }).toThrow('child.toHTML is not a function')

      clear()
    })
  })

  describe('edge cases', () => {
    test('should handle empty text node', () => {
      const emptyTextNode = document.createTextNode('')

      const clear = render(
        html.div(
          DOMNode(emptyTextNode) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const childNodes = Array.from(container.childNodes)

      expect(childNodes).toContain(emptyTextNode)
      expect(emptyTextNode.nodeValue).toBe('')
      clear()
    })

    test('should handle element with attributes and properties', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'text'
      input.value = 'Initial value'
      input.placeholder = 'Enter text'
      input.setAttribute('data-testid', 'test-input')
      input.disabled = true

      const clear = render(
        html.form(
          DOMNode(input) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('form')!
      const renderedInput = container.querySelector('input')! as HTMLInputElement

      expect(renderedInput).toBe(input)
      expect(renderedInput.type).toBe('text')
      expect(renderedInput.value).toBe('Initial value')
      expect(renderedInput.placeholder).toBe('Enter text')
      expect(renderedInput.getAttribute('data-testid')).toBe('test-input')
      expect(renderedInput.disabled).toBe(true)
      clear()
    })

    test('should handle element with event listeners', () => {
      const button = document.createElement('button')
      button.textContent = 'Click me'

      const clickHandler = vi.fn()
      button.addEventListener('click', clickHandler)

      const clear = render(
        html.div(
          DOMNode(button) as Renderable
        ),
        document.body
      )

      const container = document.querySelector('div')!
      const renderedButton = container.querySelector('button')!

      expect(renderedButton).toBe(button)

      // Test that event listener is preserved
      renderedButton.click()
      expect(clickHandler).toHaveBeenCalledTimes(1)

      clear()
    })
  })
})
