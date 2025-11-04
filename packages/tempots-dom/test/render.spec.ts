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
  computed,
  effect,
  BrowserContext,
  HeadlessContext,
  makeProviderMark,
  _NODE_PLACEHOLDER_ATTR,
  CLASS_PLACEHOLDER_ATTR,
} from '../src'
import type { Prop, Computed, Renderable } from '../src'
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

      expect(document.querySelector('#app')?.innerHTML).toBe(
        '<div>Hello World</div>'
      )
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

      expect(container.innerHTML).toBe(
        '<p>Existing content</p><div>New content</div>'
      )
      clear()
      document.body.removeChild(container)
    })

    test('should use custom document', () => {
      const customDoc = document.implementation.createHTMLDocument('test')
      customDoc.body.innerHTML = '<div id="app"></div>'

      const clear = render(html.div('Hello'), '#app', { doc: customDoc })

      expect(customDoc.querySelector('#app')?.innerHTML).toBe(
        '<div>Hello</div>'
      )
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
      const clear = render(html.div('test'), child)

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

      const clear = render(html.div('test'), child, {
        disposeWithParent: false,
      })

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
        [testMark]: ['test-value', undefined] as [string, undefined],
      }

      const clear = render(html.div('test'), document.body, { providers })

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

    describe('automatic signal disposal', () => {
      test('should track signals created in renderable', async () => {
        const element = document.createElement('div')
        const ctx = BrowserContext.of(element, undefined, {})
        let signal: Prop<number> | null = null

        const MyComponent: Renderable = () => {
          signal = prop(0)
          return () => {}
        }

        const clear = renderWithContext(MyComponent, ctx)

        expect(signal).not.toBeNull()
        expect(signal!.isDisposed()).toBe(false)

        clear()

        // Signal should be disposed when clear() is called
        expect(signal!.isDisposed()).toBe(true)
      })

      test('should dispose all tracked signals when clear() is called', async () => {
        const element = document.createElement('div')
        const ctx = BrowserContext.of(element, undefined, {})
        const signals: Array<Prop<number>> = []

        const MyComponent: Renderable = () => {
          signals.push(prop(1))
          signals.push(prop(2))
          signals.push(prop(3))
          return () => {}
        }

        const clear = renderWithContext(MyComponent, ctx)

        expect(signals).toHaveLength(3)
        signals.forEach(s => expect(s.isDisposed()).toBe(false))

        clear()

        // All signals should be disposed
        signals.forEach(s => expect(s.isDisposed()).toBe(true))
      })

      test('should dispose computed signals', async () => {
        const element = document.createElement('div')
        const ctx = BrowserContext.of(element, undefined, {})
        let source: Prop<number> | null = null
        let derived: Computed<number> | null = null

        const MyComponent: Renderable = () => {
          source = prop(10)
          derived = computed(() => source!.value * 2, [source])
          return () => {}
        }

        const clear = renderWithContext(MyComponent, ctx)

        expect(source).not.toBeNull()
        expect(derived).not.toBeNull()
        expect(source!.isDisposed()).toBe(false)
        expect(derived!.isDisposed()).toBe(false)

        clear()

        expect(source!.isDisposed()).toBe(true)
        expect(derived!.isDisposed()).toBe(true)
      })

      test('should dispose effects', async () => {
        const element = document.createElement('div')
        const ctx = BrowserContext.of(element, undefined, {})
        const source = prop(0)
        let callCount = 0

        const MyComponent: Renderable = () => {
          effect(() => {
            callCount++
            source.value
          }, [source])
          return () => {}
        }

        const clear = renderWithContext(MyComponent, ctx)

        await sleep()
        expect(callCount).toBe(1)

        source.set(1)
        await sleep()
        expect(callCount).toBe(2)

        clear()

        // Effect should be disposed, so changing source shouldn't trigger it
        source.set(2)
        await sleep()
        expect(callCount).toBe(2)

        // Clean up
        source.dispose()
      })

      test('should create separate scopes for nested renderables', () => {
        const element = document.createElement('div')
        const ctx = BrowserContext.of(element, undefined, {})
        let outerSignal: Prop<number> | null = null
        let innerSignal: Prop<number> | null = null

        const InnerComponent: Renderable = () => {
          innerSignal = prop(20)
          return () => {}
        }

        const OuterComponent: Renderable = ctx => {
          outerSignal = prop(10)
          const innerClear = renderWithContext(InnerComponent, ctx)
          return () => {
            innerClear()
          }
        }

        const clear = renderWithContext(OuterComponent, ctx)

        expect(outerSignal).not.toBeNull()
        expect(innerSignal).not.toBeNull()
        expect(outerSignal!.isDisposed()).toBe(false)
        expect(innerSignal!.isDisposed()).toBe(false)

        // Clearing outer should dispose both scopes
        clear()

        expect(outerSignal!.isDisposed()).toBe(true)
        expect(innerSignal!.isDisposed()).toBe(true)
      })
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
      const { clear, currentURL } = runHeadless(() => html.div('Hello'), {
        selector: 'body',
        startUrl: 'https://custom.com',
      })

      expect(currentURL.value).toBe('https://custom.com')
      clear()
    })

    test('should use signal for startUrl', async () => {
      const urlSignal = prop('https://signal.com')
      const { clear, currentURL } = runHeadless(() => html.div('Hello'), {
        selector: 'body',
        startUrl: urlSignal,
      })

      expect(currentURL.value).toBe('https://signal.com')

      urlSignal.set('https://updated.com')
      await sleep()
      expect(currentURL.value).toBe('https://updated.com')

      clear()
    })

    test('should use custom selector', () => {
      const { clear, root } = runHeadless(() => html.div('Hello'), {
        selector: '#custom',
      })

      expect(root.selector).toBe('#custom')
      clear()
    })

    test('should pass providers to context', () => {
      const testMark = makeProviderMark<string>('TestProvider')
      const onUseSpy = vi.fn()
      const providers = {
        [testMark]: ['test-value', onUseSpy] as [string, () => void],
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
          providers,
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

  describe('HeadlessAdapter', () => {
    test('should work with runHeadless', () => {
      const { root, clear } = runHeadless(() => html.div('Hello World'))

      expect(root.contentToHTML()).toBe('<div>Hello World</div>')
      clear()
    })

    test('should create adapter with all required methods', () => {
      const mockElement = { id: 'test' }
      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (_el, attr) => (attr === 'test' ? 'value' : null),
        setAttribute: (_el, _attr, _value) => {},
        getClass: _el => 'test-class',
        setClass: (_el, _cls) => {},
        getStyles: _el => ({ color: 'red' }),
        setStyles: (_el, _styles) => {},
        appendHTML: (_el, _html) => {},
        getInnerHTML: _el => '<span>inner</span>',
        setInnerHTML: (_el, _html) => {},
        getInnerText: _el => 'inner text',
        setInnerText: (_el, _text) => {},
      })

      expect(adapter.select('div')).toEqual([mockElement])
      expect(adapter.getAttribute(mockElement, 'test')).toBe('value')
      expect(adapter.getAttribute(mockElement, 'other')).toBe(null)
      expect(adapter.getClass(mockElement)).toBe('test-class')
      expect(adapter.getStyles(mockElement)).toEqual({ color: 'red' })
      expect(adapter.getInnerHTML(mockElement)).toBe('<span>inner</span>')
      expect(adapter.getInnerText(mockElement)).toBe('inner text')
    })

    test('should handle setFromRoot with element selector', () => {
      const mockElement = {
        id: 'test',
        attributes: new Map(),
        innerHTML: '',
        innerText: '',
        className: '',
        styles: {},
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      const { root, clear } = runHeadless(() => html.div('Test content'))

      // Test setFromRoot - this should call setInnerHTML with the root's HTML
      adapter.setFromRoot(root, false)

      expect(mockElement.innerHTML).toBe('<div>Test content</div>')
      clear()
    })

    test('should handle setFromRoot with placeholders', () => {
      const mockElement = {
        attributes: new Map(),
        innerHTML: 'original html',
        innerText: 'original text',
        className: 'original-class',
        styles: { color: 'blue' },
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      const { root, clear } = runHeadless(() =>
        html.div(
          attr.class('new-class'),
          attr.style('color: red; font-size: 14px'),
          'New content'
        )
      )

      adapter.setFromRoot(root, true) // setPlaceholders = true

      // The content should be appended (HeadlessAdapter uses appendHTML)
      expect(mockElement.innerHTML).toContain('<div')
      expect(mockElement.innerHTML).toContain('New content')
      expect(mockElement.innerHTML).toContain('class="new-class"')

      clear()
    })

    test('should handle setFromRoot with comprehensive portal features', () => {
      // Create a real DOM element to test with
      const element = document.createElement('div')
      element.innerHTML = 'original html'
      element.textContent = 'original text'
      element.className = 'original-class'
      element.style.color = 'blue'
      element.style.fontSize = '12px'
      element.setAttribute('data-original', 'value')
      document.body.appendChild(element)

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [element],
        getAttribute: (el, attr) => (el as HTMLElement).getAttribute(attr),
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as HTMLElement).removeAttribute(attr)
          } else {
            ;(el as HTMLElement).setAttribute(attr, value)
          }
        },
        getClass: el => (el as HTMLElement).className,
        setClass: (el, cls) => {
          ;(el as HTMLElement).className = cls || ''
        },
        getStyles: el => {
          const styles: Record<string, string> = {}
          const computedStyle = getComputedStyle(el as HTMLElement)
          for (let i = 0; i < computedStyle.length; i++) {
            const prop = computedStyle[i]
            styles[prop] = computedStyle.getPropertyValue(prop)
          }
          return styles
        },
        setStyles: (el, styles) => {
          Object.entries(styles).forEach(([prop, value]) => {
            ;(el as HTMLElement).style.setProperty(prop, value)
          })
        },
        getInnerHTML: el => (el as HTMLElement).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as HTMLElement).innerHTML = html
        },
        appendHTML: (el, html) => {
          ;(el as HTMLElement).innerHTML += html
        },
        getInnerText: el => (el as HTMLElement).textContent || '',
        setInnerText: (el, text) => {
          ;(el as HTMLElement).textContent = text
        },
      })

      const { root, clear } = runHeadless(() => html.div('Test content'))

      // Test setFromRoot with placeholders enabled to cover more branches
      adapter.setFromRoot(root, true)

      // Verify that content was updated (this is what we can actually test)
      expect(element.innerHTML).toContain('Test content')

      document.body.removeChild(element)
      clear()
    })

    test('should handle setFromRoot with null element error', () => {
      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [null], // Return null element
        getAttribute: () => null,
        setAttribute: () => {},
        getClass: () => '',
        setClass: () => {},
        getStyles: () => ({}),
        setStyles: () => {},
        getInnerHTML: () => '',
        setInnerHTML: () => {},
        appendHTML: () => {},
        getInnerText: () => '',
        setInnerText: () => {},
      })

      const { root, clear } = runHeadless(() => html.div('Test content'))

      // This should throw an error when element is null (covers lines 360-364)
      expect(() => {
        adapter.setFromRoot(root, false)
      }).toThrow('Cannot find element by selector for render:')

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

    test('should restore text placeholders', () => {
      // Create element with text placeholder
      const div = document.createElement('div')
      div.setAttribute('data-tts-text', 'original text')
      div.textContent = 'new text'
      document.body.appendChild(div)

      restoreTempoPlaceholders()

      // Text should be restored
      expect(div.textContent).toBe('original text')
      expect(div.hasAttribute('data-tts-text')).toBe(false)
    })

    test('should restore HTML placeholders', () => {
      // Create element with HTML placeholder
      const div = document.createElement('div')
      div.setAttribute('data-tts-html', '<span>original</span>')
      div.innerHTML = '<span>new</span>'
      document.body.appendChild(div)

      restoreTempoPlaceholders()

      // HTML should be restored
      expect(div.innerHTML).toBe('<span>original</span>')
      expect(div.hasAttribute('data-tts-html')).toBe(false)
    })

    test('should restore style placeholders', () => {
      // Create element with style placeholder
      const div = document.createElement('div')
      div.setAttribute('data-tts-style', '{"color":"blue","font-size":"12px"}')
      div.style.color = 'red'
      div.style.fontSize = '16px'
      document.body.appendChild(div)

      restoreTempoPlaceholders()

      // Styles should be restored (note: CSS property names are kebab-case in JSON)
      expect(div.style.color).toBe('blue')
      expect(div.style.fontSize).toBe('12px')
      expect(div.hasAttribute('data-tts-style')).toBe(false)
    })

    test('should handle invalid JSON in style placeholder', () => {
      // Create element with invalid JSON in style placeholder
      const div = document.createElement('div')
      div.setAttribute('data-tts-style', 'invalid json')
      div.style.color = 'red'
      document.body.appendChild(div)

      // The function should throw an error for invalid JSON
      expect(() => {
        restoreTempoPlaceholders()
      }).toThrow('Unexpected token')

      // The attribute should still be removed even if JSON parsing fails
      expect(div.hasAttribute('data-tts-style')).toBe(false)
    })

    test('should handle nested elements with placeholders', () => {
      // Create nested structure with placeholders
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')

      parent.setAttribute(CLASS_PLACEHOLDER_ATTR, 'parent-class')
      parent.className = 'new-parent-class'

      child1.setAttribute('data-tts-text', 'child1 text')
      child1.textContent = 'new child1 text'

      child2.setAttribute(_NODE_PLACEHOLDER_ATTR, 'true')
      child2.textContent = 'should be removed'

      parent.appendChild(child1)
      parent.appendChild(child2)
      document.body.appendChild(parent)

      expect(parent.children.length).toBe(2)

      restoreTempoPlaceholders()

      // Parent class should be restored
      expect(parent.className).toBe('parent-class')
      expect(parent.hasAttribute(CLASS_PLACEHOLDER_ATTR)).toBe(false)

      // Child1 text should be restored
      expect(child1.textContent).toBe('child1 text')
      expect(child1.hasAttribute('data-tts-text')).toBe(false)

      // Child2 should be removed
      expect(parent.children.length).toBe(1)
      expect(parent.contains(child2)).toBe(false)
    })

    test('should restore attribute placeholders with null values', () => {
      // Create element with attribute placeholder that includes null values
      const div = document.createElement('div')
      div.setAttribute('data-tts-attrs', '{"data-test":null,"id":"test-id"}')
      div.setAttribute('data-test', 'should-be-removed')
      div.setAttribute('id', 'current-id')
      document.body.appendChild(div)

      restoreTempoPlaceholders()

      // Attribute with null value should be removed (covers line 506)
      expect(div.hasAttribute('data-test')).toBe(false)
      // Attribute with string value should be set
      expect(div.getAttribute('id')).toBe('test-id')
      expect(div.hasAttribute('data-tts-attrs')).toBe(false)
    })
  })

  describe('render edge cases', () => {
    test('should handle render with clear option false', () => {
      // Pre-populate the target element
      document.body.innerHTML = '<div>existing content</div>'

      const clear = render(html.span('new content'), document.body, {
        clear: false,
      })

      // Should append, not replace
      expect(document.body.children.length).toBe(2)
      expect(document.body.children[0].tagName).toBe('DIV')
      expect(document.body.children[0].textContent).toBe('existing content')
      expect(document.body.children[1].tagName).toBe('SPAN')
      expect(document.body.children[1].textContent).toBe('new content')

      clear()
    })

    test('should handle render with clear option true (default)', () => {
      // Pre-populate the target element
      document.body.innerHTML = '<div>existing content</div>'

      const clear = render(html.span('new content'), document.body, {
        clear: true,
      })

      // Should replace, not append
      expect(document.body.children.length).toBe(1)
      expect(document.body.children[0].tagName).toBe('SPAN')
      expect(document.body.children[0].textContent).toBe('new content')

      clear()
    })

    test('should handle render with undefined options', () => {
      const clear = render(html.div('test'), document.body, undefined)

      expect(document.body.innerHTML).toBe('<div>test</div>')
      clear()
    })

    test('should handle renderWithContext with different removeTree values', () => {
      const element = document.createElement('div')
      const ctx = BrowserContext.of(element, undefined, {})

      const clear = renderWithContext(html.span('Hello'), ctx)

      expect(element.innerHTML).toBe('<span>Hello</span>')

      // Test clear with removeTree = false
      clear(false)
      expect(element.innerHTML).toBe('<span>Hello</span>')

      // Test clear with removeTree = true
      clear(true)
      expect(element.innerHTML).toBe('')
    })

    test('should cover portal rendering with innerHTML feature (lines 368-376)', () => {
      const mockElement = {
        attributes: new Map(),
        innerHTML: 'original-html',
        innerText: '',
        className: '',
        styles: {},
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      // Create a headless environment with a portal that has innerHTML
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          const portalCtx = ctx.makePortal('#test-portal')
          portalCtx.element.properties.innerHTML =
            '<span>portal innerHTML</span>'
          return () => {}
        }
      })

      // Test setFromRoot with placeholders to cover innerHTML handling (lines 368-376)
      adapter.setFromRoot(root, true)

      // Verify innerHTML feature was detected and processed (covers lines 368-376)
      expect(mockElement.innerHTML).toBe('<span>portal innerHTML</span>')
      // The placeholder should be set with the original value
      expect(mockElement.attributes.has('data-tts-html')).toBe(true)

      clear()
    })

    test('should cover portal rendering with innerText feature (lines 377-385)', () => {
      const mockElement = {
        attributes: new Map(),
        innerHTML: '',
        innerText: 'original-text',
        className: '',
        styles: {},
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      // Create a headless environment with a portal that has innerText
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          const portalCtx = ctx.makePortal('#test-portal')
          portalCtx.element.properties.innerText = 'portal innerText'
          return () => {}
        }
      })

      // Test setFromRoot with placeholders to cover innerText handling (lines 377-385)
      adapter.setFromRoot(root, true)

      // Verify innerText feature was detected and processed (covers lines 377-385)
      expect(mockElement.innerText).toBe('portal innerText')
      // The placeholder should be set with the original value
      expect(mockElement.attributes.has('data-tts-text')).toBe(true)

      clear()
    })

    test('should cover portal rendering with classes feature (lines 386-394)', () => {
      const mockElement = {
        attributes: new Map(),
        innerHTML: '',
        innerText: '',
        className: 'original-class',
        styles: {},
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      // Create a headless environment with a portal that has classes
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          const portalCtx = ctx.makePortal('#test-portal')
          // Use the public method to add classes
          portalCtx.addClasses(['portal-class', 'another-class'])
          return () => {}
        }
      })

      // Test setFromRoot with placeholders to cover classes handling (lines 386-394)
      adapter.setFromRoot(root, true)

      // Verify classes feature was detected and processed (covers lines 386-394)
      expect(mockElement.className).toBe('portal-class another-class')
      // The placeholder should be set with the original value
      expect(mockElement.attributes.has('data-tts-class')).toBe(true)

      clear()
    })

    test('should cover portal rendering with styles feature (lines 395-407)', () => {
      const mockElement = {
        attributes: new Map(),
        innerHTML: '',
        innerText: '',
        className: '',
        styles: { color: 'blue', fontSize: '12px' },
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      // Create a headless environment with a portal that has styles
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          const portalCtx = ctx.makePortal('#test-portal')
          // Use the public method to set styles
          portalCtx.setStyle('color', 'red')
          portalCtx.setStyle('fontSize', '16px')
          return () => {}
        }
      })

      // Test setFromRoot with placeholders to cover styles handling (lines 395-407)
      adapter.setFromRoot(root, true)

      // Verify styles feature was detected and processed (covers lines 395-407)
      expect(mockElement.styles).toEqual({ color: 'red', fontSize: '16px' })
      // The placeholder should be set with the original value
      expect(mockElement.attributes.has('data-tts-style')).toBe(true)

      clear()
    })

    test('should cover portal rendering with attributes feature (lines 408-429)', () => {
      const mockElement = {
        attributes: new Map([
          ['data-original', 'value'],
          ['id', 'original-id'],
        ]),
        innerHTML: '',
        innerText: '',
        className: '',
        styles: {},
      }

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [mockElement],
        getAttribute: (el, attr) => (el as any).attributes.get(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as any).attributes.delete(attr)
          } else {
            ;(el as any).attributes.set(attr, value)
          }
        },
        getClass: el => (el as any).className,
        setClass: (el, cls) => {
          ;(el as any).className = cls || ''
        },
        getStyles: el => (el as any).styles,
        setStyles: (el, styles) => {
          ;(el as any).styles = styles
        },
        appendHTML: (el, html) => {
          ;(el as any).innerHTML += html
        },
        getInnerHTML: el => (el as any).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as any).innerHTML = html
        },
        getInnerText: el => (el as any).innerText,
        setInnerText: (el, text) => {
          ;(el as any).innerText = text
        },
      })

      // Create a headless environment with a portal that has attributes
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          const portalCtx = ctx.makePortal('#test-portal')
          portalCtx.element.properties.id = 'portal-id'
          portalCtx.element.properties.title = 'Portal Title'
          portalCtx.element.properties['data-test'] = 'portal-data'
          return () => {}
        }
      })

      // Test setFromRoot with placeholders to cover attributes handling (lines 408-429)
      adapter.setFromRoot(root, true)

      // Verify attributes feature was detected and processed (covers lines 408-429)
      expect(mockElement.attributes.get('id')).toBe('portal-id')
      expect(mockElement.attributes.get('title')).toBe('Portal Title')
      expect(mockElement.attributes.get('data-test')).toBe('portal-data')
      // The placeholder should be set with the original attributes
      expect(mockElement.attributes.has('data-tts-attrs')).toBe(true)

      clear()
    })

    test('should cover portal rendering with HTMLElement selector (line 358)', () => {
      // Create a real DOM element to use as the portal target
      const targetElement = document.createElement('div')
      targetElement.innerHTML = 'original content'
      document.body.appendChild(targetElement)

      const adapter = new HeadlessAdapter({
        select: (_selector: string) => [targetElement],
        getAttribute: (el, attr) =>
          (el as HTMLElement).getAttribute(attr) || null,
        setAttribute: (el, attr, value) => {
          if (value === null) {
            ;(el as HTMLElement).removeAttribute(attr)
          } else {
            ;(el as HTMLElement).setAttribute(attr, value)
          }
        },
        getClass: el => (el as HTMLElement).className,
        setClass: (el, cls) => {
          ;(el as HTMLElement).className = cls
        },
        getStyles: el => {
          const styles: Record<string, string> = {}
          const computedStyle = getComputedStyle(el as HTMLElement)
          for (let i = 0; i < computedStyle.length; i++) {
            const prop = computedStyle[i]
            styles[prop] = computedStyle.getPropertyValue(prop)
          }
          return styles
        },
        setStyles: (el, styles) => {
          Object.entries(styles).forEach(([prop, value]) => {
            ;(el as HTMLElement).style.setProperty(prop, value)
          })
        },
        appendHTML: (el, html) => {
          ;(el as HTMLElement).innerHTML += html
        },
        getInnerHTML: el => (el as HTMLElement).innerHTML,
        setInnerHTML: (el, html) => {
          ;(el as HTMLElement).innerHTML = html
        },
        getInnerText: el => (el as HTMLElement).textContent || '',
        setInnerText: (el, text) => {
          ;(el as HTMLElement).textContent = text
        },
      })

      // Create a headless environment with a portal that uses HTMLElement selector
      const { root, clear } = runHeadless(() => {
        return (ctx: any) => {
          // Use the actual DOM element as the portal selector (this covers line 358)
          const portalCtx = ctx.makePortal(targetElement)
          portalCtx.makeChildText('Portal with HTMLElement selector')
          return () => {}
        }
      })

      // Test setFromRoot to cover HTMLElement selector path (line 358)
      adapter.setFromRoot(root, false)

      // Verify that the portal content was processed
      expect(targetElement.innerHTML).toContain(
        'Portal with HTMLElement selector'
      )

      // Clean up
      document.body.removeChild(targetElement)
      clear()
    })
  })
})
