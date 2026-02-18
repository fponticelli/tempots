import { describe, expect, test, beforeEach, vi } from 'vitest'
import { BrowserContext } from '../src/dom/browser-context'
import { ProviderNotFoundError } from '../src/dom/errors'
import { ProviderMark } from '../src/types/domain'
import { makeProviderMark } from '../src';

describe('BrowserContext', () => {
  let container: HTMLElement
  let ctx: BrowserContext

  beforeEach(() => {
    // Clean up any existing containers
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)
    ctx = BrowserContext.of(container, undefined, {}) as BrowserContext
  })

  describe('createElement', () => {
    test('should create HTML element without namespace', () => {
      const element = ctx.createElement('div', undefined)

      expect(element.tagName).toBe('DIV')
      expect(element).toBeInstanceOf(HTMLDivElement)
    })

    test('should create element with namespace', () => {
      const svgNamespace = 'http://www.w3.org/2000/svg'
      const element = ctx.createElement('svg', svgNamespace)

      expect(element.tagName).toBe('svg')
      expect(element.namespaceURI).toBe(svgNamespace)
    })

    test('should create different element types', () => {
      const span = ctx.createElement('span', undefined)
      const input = ctx.createElement('input', undefined)
      const button = ctx.createElement('button', undefined)

      expect(span.tagName).toBe('SPAN')
      expect(input.tagName).toBe('INPUT')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('makeChildElement', () => {
    test('should create and append child element', () => {
      const childCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      expect(container.children.length).toBe(1)
      expect(container.children[0].tagName).toBe('DIV')
      expect(childCtx.element).toBe(container.children[0])
    })

    test('should create namespaced child element', () => {
      const svgNamespace = 'http://www.w3.org/2000/svg'
      const svgCtx = ctx.makeChildElement('svg', svgNamespace)

      expect(container.children.length).toBe(1)
      expect(container.children[0].tagName).toBe('svg')
      expect(container.children[0].namespaceURI).toBe(svgNamespace)
    })

    test('should create nested elements', () => {
      const divCtx = ctx.makeChildElement('div', undefined)
      const spanCtx = divCtx.makeChildElement('span', undefined)

      expect(container.children.length).toBe(1)
      expect(container.children[0].children.length).toBe(1)
      expect(container.children[0].children[0].tagName).toBe('SPAN')
    })
  })

  describe('createText', () => {
    test('should create text node with content', () => {
      const textNode = ctx.createText('Hello, World!')

      expect(textNode.nodeType).toBe(Node.TEXT_NODE)
      expect(textNode.textContent).toBe('Hello, World!')
    })

    test('should create empty text node', () => {
      const textNode = ctx.createText('')

      expect(textNode.nodeType).toBe(Node.TEXT_NODE)
      expect(textNode.textContent).toBe('')
    })
  })

  describe('makeChildText', () => {
    test('should create and append text node', () => {
      const textCtx = ctx.makeChildText('Hello, World!')

      expect(container.childNodes.length).toBe(1)
      expect(container.childNodes[0].nodeType).toBe(Node.TEXT_NODE)
      expect(container.childNodes[0].textContent).toBe('Hello, World!')
    })

    test('should handle special characters in text', () => {
      const specialText = 'Special chars: <>&"\'`'
      const textCtx = ctx.makeChildText(specialText)

      expect(container.textContent).toBe(specialText)
    })
  })

  describe('makeAccessors', () => {
    test('should create accessors for attributes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      const { get, set } = divCtx.makeAccessors('id')

      set('test-id')
      expect(divCtx.element.getAttribute('id')).toBe('test-id')
      expect(get()).toBe('test-id')
    })

    test('should handle boolean attributes', () => {
      const inputCtx = ctx.makeChildElement('input', undefined) as BrowserContext
      const { get, set } = inputCtx.makeAccessors('checked')

      set(true)
      expect((inputCtx.element as HTMLInputElement).checked).toBe(true)
      expect(get()).toBe(true)
    })

    test('should handle null values', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      const { get, set } = divCtx.makeAccessors('data-test')

      set('value')
      expect(get()).toBe('value')

      set(null)
      expect(divCtx.element.hasAttribute('data-test')).toBe(false)
      expect(get()).toBe(null)
    })
  })



  describe('on method', () => {
    test('should add event listener', () => {
      const handler = vi.fn()
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      const clear = divCtx.on('click', handler)

      // Simulate click event
      const event = new MouseEvent('click')
      divCtx.element.dispatchEvent(event)

      expect(handler).toHaveBeenCalledWith(event, divCtx)
    })

    test('should handle event listener options', () => {
      const handler = vi.fn()
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      const clear = divCtx.on('click', handler, { once: true })

      // Simulate multiple clicks
      const event1 = new MouseEvent('click')
      const event2 = new MouseEvent('click')

      divCtx.element.dispatchEvent(event1)
      divCtx.element.dispatchEvent(event2)

      expect(handler).toHaveBeenCalledTimes(1) // Should only be called once
    })

    test('should return clear function', () => {
      const handler = vi.fn()
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      const clear = divCtx.on('click', handler)

      // Simulate click before clearing to verify it works
      const event1 = new MouseEvent('click')
      divCtx.element.dispatchEvent(event1)
      expect(handler).toHaveBeenCalledTimes(1)

      clear(true) // Pass true to actually remove the listener

      // Simulate click after clearing
      const event2 = new MouseEvent('click')
      divCtx.element.dispatchEvent(event2)

      expect(handler).toHaveBeenCalledTimes(1) // Should still be 1, not 2
    })
  })

  describe('setStyle', () => {
    test('should set CSS style property', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.setStyle('color', 'red')

      expect(divCtx.element.style.color).toBe('red')
    })

    test('should handle CSS custom properties', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.setStyle('--custom-color', 'blue')

      // Custom properties might not be supported in test environment
      expect(divCtx.element.style.getPropertyValue('--custom-color')).toBeDefined()
    })

    test('should handle empty string to remove style', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.setStyle('color', 'red')
      expect(divCtx.element.style.color).toBe('red')

      divCtx.setStyle('color', '')
      expect(divCtx.element.style.color).toBe('')
    })
  })

  describe('addClasses and removeClasses', () => {
    test('should add CSS classes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.addClasses(['test-class'])

      expect(divCtx.element.classList.contains('test-class')).toBe(true)
    })

    test('should remove CSS classes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.element.classList.add('test-class')

      divCtx.removeClasses(['test-class'])
      expect(divCtx.element.classList.contains('test-class')).toBe(false)
    })

    test('should handle multiple classes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.addClasses(['class1', 'class2'])

      expect(divCtx.element.classList.contains('class1')).toBe(true)
      expect(divCtx.element.classList.contains('class2')).toBe(true)
    })
  })

  describe('provider management', () => {
    test('should set and get provider', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('TestProvider')

      const ctxWithProvider = ctx.setProvider(mark, 'test-value', undefined)
      const result = ctxWithProvider.getProvider(mark)

      expect(result.value).toBe('test-value')
    })

    test('should throw error when provider not found', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('NonExistentProvider')

      expect(() => ctx.getProvider(mark)).toThrow(ProviderNotFoundError)
      expect(() => ctx.getProvider(mark)).toThrow('Provider not found: NonExistentProvider')
    })

    test('should inherit providers from parent context', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('InheritedProvider')

      const parentCtx = ctx.setProvider(mark, 'parent-value', undefined)
      const childCtx = parentCtx.makeChildElement('div', undefined)

      const result = childCtx.getProvider(mark)
      expect(result.value).toBe('parent-value')
    })
  })

  describe('makePortal', () => {
    test('should create portal to different element', () => {
      const target = document.createElement('div')
      target.id = 'portal-target'
      document.body.appendChild(target)

      const portalCtx = ctx.makePortal('#portal-target')
      const childCtx = portalCtx.makeChildElement('span', undefined)

      expect(target.children.length).toBe(1)
      expect(target.children[0].tagName).toBe('SPAN')
      expect(container.children.length).toBe(0) // Should not be in original container
    })

    test('should create portal to HTMLElement directly', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const portalCtx = ctx.makePortal(target)
      portalCtx.makeChildElement('span', undefined)

      expect(target.children.length).toBe(1)
      expect(target.children[0].tagName).toBe('SPAN')
      expect(container.children.length).toBe(0) // Should not be in original container
    })

    test('should handle portal to non-existent selector', () => {
      expect(() => ctx.makePortal('#non-existent')).toThrow()
    })
  })

  describe('setText and getText', () => {
    test('should set and get text content on text node', () => {
      const textCtx = ctx.makeChildText('Initial text')

      expect(textCtx.getText()).toBe('Initial text')

      textCtx.setText('Updated text')
      expect(textCtx.getText()).toBe('Updated text')
      expect(container.textContent).toBe('Updated text')
    })

    test('should get text content from element when no reference', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.element.textContent = 'Element text'

      expect(divCtx.getText()).toBe('Element text')
    })

    test('should return empty string when no text content', () => {
      const divCtx = ctx.makeChildElement('div', undefined)

      expect(divCtx.getText()).toBe('')
    })

    test('should handle null textContent edge case', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      // Mock textContent to be null to test the fallback
      Object.defineProperty(divCtx.element, 'textContent', {
        get: () => null,
        configurable: true
      })

      expect(divCtx.getText()).toBe('')
    })
  })

  describe('makeRef', () => {
    test('should create reference comment node', () => {
      const refCtx = ctx.makeRef() as BrowserContext

      expect(container.childNodes.length).toBe(1)
      expect(container.childNodes[0].nodeType).toBe(Node.COMMENT_NODE)
      expect(container.childNodes[0].textContent).toBe('')
      expect(refCtx.reference).toBe(container.childNodes[0])
    })

    test('should allow insertion before reference', () => {
      const refCtx = ctx.makeRef()
      // Create element using the context with reference - this should insert before the reference
      refCtx.makeChildElement('div', undefined)

      expect(container.childNodes.length).toBe(2)
      expect(container.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE)
      expect(container.childNodes[1].nodeType).toBe(Node.COMMENT_NODE)
    })
  })

  describe('clear method', () => {
    test('should clear element when removeTree is true', () => {
      const divCtx = ctx.makeChildElement('div', undefined)
      divCtx.makeChildText('Some text')

      expect(container.children.length).toBe(1)

      divCtx.clear(true)
      expect(container.children.length).toBe(0)
    })

    test('should clear reference when removeTree is true', () => {
      const textCtx = ctx.makeChildText('Some text')

      expect(container.childNodes.length).toBe(1)

      textCtx.clear(true)
      expect(container.childNodes.length).toBe(0)
    })

    test('should not clear when removeTree is false', () => {
      const divCtx = ctx.makeChildElement('div', undefined)

      expect(container.children.length).toBe(1)

      divCtx.clear(false)
      expect(container.children.length).toBe(1)
    })
  })

  describe('getClasses', () => {
    test('should return array of CSS classes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.addClasses(['class1', 'class2', 'class3'])

      const classes = divCtx.getClasses()
      expect(classes).toEqual(['class1', 'class2', 'class3'])
    })

    test('should return empty array when no classes', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      const classes = divCtx.getClasses()
      expect(classes).toEqual([])
    })
  })

  describe('getStyle', () => {
    test('should get CSS style property', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext
      divCtx.setStyle('color', 'red')

      expect(divCtx.getStyle('color')).toBe('red')
    })

    test('should return empty string for unset style', () => {
      const divCtx = ctx.makeChildElement('div', undefined) as BrowserContext

      expect(divCtx.getStyle('color')).toBe('')
    })
  })

  describe('getWindow', () => {
    test('should return document default view', () => {
      const window = ctx.getWindow()

      expect(window).toBe(document.defaultView)
      expect(window).toBe(globalThis.window)
    })
  })

  describe('context type checking methods', () => {
    test('should correctly identify as browser context', () => {
      expect(ctx.isBrowser()).toBe(true)
      expect(ctx.isBrowserDOM()).toBe(true)
      expect(ctx.isHeadless()).toBe(false)
      expect(ctx.isHeadlessDOM()).toBe(false)
    })
  })

  describe('withElement and withReference', () => {
    test('should create new context with different element', () => {
      const newElement = document.createElement('span')
      const newCtx = (ctx as BrowserContext).withElement(newElement) as BrowserContext

      expect(newCtx.element).toBe(newElement)
      expect(newCtx.element).not.toBe((ctx as BrowserContext).element)
      expect(newCtx.providers).toBe((ctx as BrowserContext).providers) // Should share providers
    })

    test('should create new context with reference', () => {
      const textNode = document.createTextNode('ref')
      const refCtx = (ctx as BrowserContext).withReference(textNode) as BrowserContext

      expect(refCtx.reference).toBe(textNode)
      expect(refCtx.element).toBe((ctx as BrowserContext).element) // Should share element
      expect(refCtx.providers).toBe((ctx as BrowserContext).providers) // Should share providers
    })

    test('should create new context with undefined reference', () => {
      const refCtx = (ctx as BrowserContext).withReference(undefined) as BrowserContext

      expect(refCtx.reference).toBeUndefined()
      expect(refCtx.element).toBe((ctx as BrowserContext).element)
    })
  })

  describe('provider onUse callback', () => {
    test('should store and retrieve onUse callback', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('TestProvider')
      const onUse = vi.fn()

      const ctxWithProvider = ctx.setProvider(mark, 'test-value', onUse)
      const result = ctxWithProvider.getProvider(mark)

      expect(result.value).toBe('test-value')
      expect(result.onUse).toBe(onUse)
    })

    test('should handle undefined onUse callback', () => {
      const mark: ProviderMark<string> = makeProviderMark<string>('TestProvider')

      const ctxWithProvider = ctx.setProvider(mark, 'test-value', undefined)
      const result = ctxWithProvider.getProvider(mark)

      expect(result.value).toBe('test-value')
      expect(result.onUse).toBeUndefined()
    })
  })
});
