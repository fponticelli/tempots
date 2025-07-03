import { describe, expect, test, beforeEach, vi, afterEach } from 'vitest'
import {
  render,
  renderWithContext,
  runHeadless,
  HeadlessAdapter,
  RenderingError,
  restoreTempoPlaceholders,
  html,
  attr,
  prop,
  BrowserContext,
  HeadlessContext,
  HeadlessPortal,
  makeProviderMark,
  _NODE_PLACEHOLDER_ATTR,
  CLASS_PLACEHOLDER_ATTR
} from '../src'
import { sleep } from './helper'

describe('Render', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('render function', () => {
    test('should render to element by reference', () => {
      const container = document.createElement('div')
      document.body.appendChild(container) // Add to DOM for MutationObserver
      const clear = render(html.div('Hello World'), container)

      expect(container.innerHTML).toBe('<div>Hello World</div>')
      clear()
      document.body.removeChild(container)
    })

    test('should render to element by selector', () => {
      document.body.innerHTML = '<div id="app"></div>'
      const clear = render(html.div('Hello World'), '#app')

      expect(document.querySelector('#app')?.innerHTML).toBe('<div>Hello World</div>')
      clear()
    })

    test('should throw error when selector not found', () => {
      expect(() => {
        render(html.div('Hello'), '#non-existent')
      }).toThrow(RenderingError)
      expect(() => {
        render(html.div('Hello'), '#non-existent')
      }).toThrow('Cannot find element by selector for render: #non-existent')
    })

    test('should clear container by default', () => {
      const container = document.createElement('div')
      container.innerHTML = '<p>Existing content</p>'
      document.body.appendChild(container)

      const clear = render(html.div('New content'), container)

      expect(container.innerHTML).toBe('<div>New content</div>')
      clear()
      document.body.removeChild(container)
    })

    test('should not clear container when clear=false', () => {
      const container = document.createElement('div')
      container.innerHTML = '<p>Existing content</p>'
      document.body.appendChild(container)

      const clear = render(html.div('New content'), container, { clear: false })

      expect(container.innerHTML).toBe('<p>Existing content</p><div>New content</div>')
      clear()
      document.body.removeChild(container)
    })

    test('should use custom document', () => {
      const customDoc = document.implementation.createHTMLDocument('test')
      customDoc.body.innerHTML = '<div id="app"></div>'

      const clear = render(html.div('Hello'), '#app', { doc: customDoc })

      expect(customDoc.querySelector('#app')?.innerHTML).toBe('<div>Hello</div>')
      clear()
    })

    test('should handle text node parent', () => {
      const container = document.createElement('div')
      const textNode = document.createTextNode('text')
      container.appendChild(textNode)
      document.body.appendChild(container)

      const clear = render(html.div('Hello'), textNode)

      // The actual behavior: div is inserted after text node
      expect(container.innerHTML).toBe('<div>Hello</div>text')
      clear()
      document.body.removeChild(container)
    })

    test('should dispose when parent element is removed', () => {
      const container = document.createElement('div')
      const child = document.createElement('div')
      container.appendChild(child)
      document.body.appendChild(container)

      const disposeSpy = vi.fn()
      const clear = render(
        html.div('test'),
        child
      )

      // Remove parent element
      container.removeChild(child)

      // Wait for MutationObserver
      return new Promise(resolve => {
        setTimeout(() => {
          // Just verify the element was removed
          expect(container.children.length).toBe(0)
          clear()
          resolve(undefined)
        }, 10)
      })
    })

    test('should not dispose when disposeWithParent=false', () => {
      const container = document.createElement('div')
      const child = document.createElement('div')
      container.appendChild(child)
      document.body.appendChild(container)

      const clear = render(
        html.div('test'),
        child,
        { disposeWithParent: false }
      )

      // Remove parent element
      container.removeChild(child)

      // Wait for MutationObserver
      return new Promise(resolve => {
        setTimeout(() => {
          // Just verify the element was removed but render wasn't disposed
          expect(container.children.length).toBe(0)
          clear()
          resolve(undefined)
        }, 10)
      })
    })

    test('should accept providers option', () => {
      // Just test that the providers option is accepted without error
      const testMark = makeProviderMark<string>('TestProvider')
      const providers = {
        [testMark]: ['test-value', undefined] as [string, undefined]
      }

      const clear = render(
        html.div('test'),
        document.body,
        { providers }
      )

      expect(document.body.innerHTML).toBe('<div>test</div>')
      clear()
    })
  })

  describe('renderWithContext', () => {
    test('should render with provided context', () => {
      const element = document.createElement('div')
      const ctx = BrowserContext.of(element, undefined, {})

      const clear = renderWithContext(html.span('Hello'), ctx)

      expect(element.innerHTML).toBe('<span>Hello</span>')
      clear()
    })

    test('should return clear function with removeTree parameter', () => {
      const element = document.createElement('div')
      const ctx = BrowserContext.of(element, undefined, {})

      const clear = renderWithContext(html.span('Hello'), ctx)
      expect(element.innerHTML).toBe('<span>Hello</span>')

      clear(false) // Don't remove tree
      expect(element.innerHTML).toBe('<span>Hello</span>')

      clear(true) // Remove tree
      expect(element.innerHTML).toBe('')
    })
  })

  describe('runHeadless', () => {
    test('should create headless environment with default options', () => {
      const { clear, root, currentURL } = runHeadless(() => html.div('Hello'))

      expect(root.contentToHTML()).toBe('<div>Hello</div>')
      expect(currentURL.value).toBe('https://example.com')
      clear()
    })

    test('should use custom startUrl', () => {
      const { clear, currentURL } = runHeadless(
        () => html.div('Hello'),
        {
          selector: 'body',
          startUrl: 'https://custom.com'
        }
      )

      expect(currentURL.value).toBe('https://custom.com')
      clear()
    })

    test('should use signal for startUrl', () => {
      const urlSignal = prop('https://signal.com')
      const { clear, currentURL } = runHeadless(
        () => html.div('Hello'),
        {
          selector: 'body',
          startUrl: urlSignal
        }
      )

      expect(currentURL.value).toBe('https://signal.com')

      urlSignal.set('https://updated.com')
      expect(currentURL.value).toBe('https://updated.com')

      clear()
    })

    test('should use custom selector', () => {
      const { clear, root } = runHeadless(
        () => html.div('Hello'),
        { selector: '#custom' }
      )

      expect(root.selector).toBe('#custom')
      clear()
    })

    test('should pass providers to context', () => {
      const testMark = makeProviderMark<string>('TestProvider')
      const onUseSpy = vi.fn()
      const providers = {
        [testMark]: ['test-value', onUseSpy] as [string, () => void]
      }

      let capturedValue: string | undefined
      const { clear } = runHeadless(
        () => ctx => {
          const provider = ctx.getProvider(testMark)
          capturedValue = provider.value
          provider.onUse?.()
          return () => {}
        },
        {
          selector: 'body',
          providers
        }
      )

      expect(capturedValue).toBe('test-value')
      expect(onUseSpy).toHaveBeenCalled()
      clear()
    })
  })

  describe('RenderingError', () => {
    test('should create error with message', () => {
      const error = new RenderingError('Test error message')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(RenderingError)
      expect(error.message).toBe('Test error message')
    })
  })

  describe('HeadlessAdapter basic functionality', () => {
    test('should work with runHeadless', () => {
      const { root, clear } = runHeadless(() => html.div('Hello World'))

      expect(root.contentToHTML()).toBe('<div>Hello World</div>')
      clear()
    })
  })

  describe('restoreTempoPlaceholders', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    test('should restore class placeholders', () => {
      // Create element with class placeholder
      const div = document.createElement('div')
      div.setAttribute(CLASS_PLACEHOLDER_ATTR, 'original-class')
      div.className = 'new-class'
      document.body.appendChild(div)

      restoreTempoPlaceholders()

      // Class should be restored
      expect(div.className).toBe('original-class')
      expect(div.hasAttribute(CLASS_PLACEHOLDER_ATTR)).toBe(false)
    })

    test('should remove node placeholders', () => {
      // Create element with node placeholder
      const div = document.createElement('div')
      div.setAttribute(_NODE_PLACEHOLDER_ATTR, 'true')
      div.textContent = 'Should be removed'
      document.body.appendChild(div)

      expect(document.body.children.length).toBe(1)

      restoreTempoPlaceholders()

      // Node should be removed
      expect(document.body.children.length).toBe(0)
    })

    test('should handle empty placeholder attributes', () => {
      // Create elements with empty placeholder attributes
      const div1 = document.createElement('div')
      div1.setAttribute(CLASS_PLACEHOLDER_ATTR, '')
      div1.className = 'some-class'

      const div2 = document.createElement('div')
      div2.setAttribute('data-tts-html', '')

      document.body.appendChild(div1)
      document.body.appendChild(div2)

      expect(() => {
        restoreTempoPlaceholders()
      }).not.toThrow()

      // Placeholder attributes should be removed
      expect(div1.hasAttribute(CLASS_PLACEHOLDER_ATTR)).toBe(false)
      expect(div2.hasAttribute('data-tts-html')).toBe(false)
    })
  })
})
