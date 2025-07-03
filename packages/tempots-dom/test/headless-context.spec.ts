import { describe, expect, test, beforeEach, vi } from 'vitest'
import { HeadlessContext, HeadlessElement, HeadlessNode } from '../src/dom/headless-context'
import { ProviderNotFoundError } from '../src/dom/errors'
import { ProviderMark } from '../src/types/domain'
import { prop } from '../src/std/signal'
import { makeProviderMark } from '../src'

describe('HeadlessContext', () => {
  let ctx: HeadlessContext

  beforeEach(() => {
    const element = new HeadlessElement('div', undefined, undefined)
    const container = { currentURL: prop('https://example.com') }
    ctx = new HeadlessContext(element, undefined, container, {})
  })

  describe('HeadlessContext creation', () => {
    test('should create headless context with tag name', () => {
      const element = new HeadlessElement('span', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const context = new HeadlessContext(element, undefined, container, {})

      expect((context.element as any).tagName).toBe('span')
      expect(context.element.isElement()).toBe(true)
    })

    test('should create context with providers', () => {
      const providers = { test: 'value' }
      const element = new HeadlessElement('div', undefined, undefined)
      const container = { currentURL: prop('https://example.com') }
      const context = new HeadlessContext(element, undefined, container, providers)

      expect(context.providers).toBe(providers)
    })
  })



  describe('makeChildElement', () => {
    test('should create and append child element', () => {
      const childCtx = ctx.makeChildElement('span', undefined) as HeadlessContext

      expect(ctx.element.children.length).toBe(1)
      expect((ctx.element.children[0] as any).tagName).toBe('span')
      expect(childCtx.element).toBe(ctx.element.children[0])
    })

    test('should create nested elements', () => {
      const divCtx = ctx.makeChildElement('div', undefined)
      const spanCtx = divCtx.makeChildElement('span', undefined)

      expect(ctx.element.children.length).toBe(1)
      expect((ctx.element.children[0] as any).children.length).toBe(1)
      expect((ctx.element.children[0] as any).children[0].tagName).toBe('span')
    })
  })



  describe('makeChildText', () => {
    test('should create and append text node', () => {
      const textCtx = ctx.makeChildText('Hello, World!')

      expect(ctx.element.children.length).toBe(1)
      expect(ctx.element.children[0].isText()).toBe(true)
      expect(ctx.element.children[0].getText()).toBe('Hello, World!')
    })

    test('should handle special characters', () => {
      const specialText = 'Special chars: <>&"\'`'
      const textCtx = ctx.makeChildText(specialText)

      expect(ctx.element.children[0].getText()).toBe(specialText)
    })
  })

  describe('makeAccessors', () => {
    test('should create accessors for attributes', () => {
      const { get, set } = ctx.makeAccessors('id')

      set('test-id')
      expect(get()).toBe('test-id')
    })

    test('should handle boolean attributes', () => {
      const { get, set } = ctx.makeAccessors('checked')

      set(true)
      expect(get()).toBe(true)
    })

    test('should handle null values', () => {
      const { get, set } = ctx.makeAccessors('data-test')

      set('value')
      expect(get()).toBe('value')

      set(null)
      expect(get()).toBe(null)
    })

    test('should handle class attribute', () => {
      const { get, set } = ctx.makeAccessors('class')

      set('test-class another-class')
      expect(get()).toBe('test-class another-class')

      // Use addClasses for actual class management
      ctx.addClasses(['test-class', 'another-class'])
      expect(ctx.element.getClasses()).toContain('test-class')
      expect(ctx.element.getClasses()).toContain('another-class')
    })

    test('should return undefined for non-existent attribute', () => {
      const { get } = ctx.makeAccessors('non-existent')
      expect(get()).toBe(undefined)
    })
  })

  describe('on method', () => {
    test('should add event handler', () => {
      const handler = vi.fn()

      const clear = ctx.on('click', handler)

      // Simulate event
      ctx.element.trigger('click', { type: 'click' })

      expect(handler).toHaveBeenCalledWith({ type: 'click' }, ctx)
    })

    test('should handle multiple handlers for same event', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      ctx.on('click', handler1)
      ctx.on('click', handler2)

      ctx.element.trigger('click', { type: 'click' })

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    test('should return clear function', () => {
      const handler = vi.fn()

      const clear = ctx.on('click', handler)
      clear(true)

      ctx.element.trigger('click', { type: 'click' })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('setStyle', () => {
    test('should set style property', () => {
      ctx.setStyle('color', 'red')

      expect(ctx.element.getStyle('color')).toBe('red')
    })

    test('should handle null values to remove style', () => {
      ctx.setStyle('color', 'red')
      ctx.setStyle('color', '')

      expect(ctx.element.getStyle('color')).toBe('')
    })

    test('should handle CSS custom properties', () => {
      ctx.setStyle('--custom-color', 'blue')

      expect(ctx.element.getStyle('--custom-color')).toBe('blue')
    })
  })

  describe('addClasses and removeClasses', () => {
    test('should add CSS classes', () => {
      ctx.addClasses(['test-class'])

      expect(ctx.element.getClasses()).toContain('test-class')
    })

    test('should remove CSS classes', () => {
      ctx.addClasses(['test-class'])
      ctx.removeClasses(['test-class'])

      expect(ctx.element.getClasses()).not.toContain('test-class')
    })

    test('should handle multiple classes', () => {
      ctx.addClasses(['class1', 'class2'])

      const classes = ctx.element.getClasses()
      expect(classes).toContain('class1')
      expect(classes).toContain('class2')
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
    test('should create portal context', () => {
      const portalCtx = ctx.makePortal('#portal-target')

      expect(portalCtx).toBeInstanceOf(HeadlessContext)
      // In headless mode, portal just creates a new context
    })

    test('should handle any selector in headless mode', () => {
      const portalCtx = ctx.makePortal('#any-selector')

      expect(portalCtx).toBeInstanceOf(HeadlessContext)
    })
  })

  describe('text extraction', () => {
    test('should extract text from nested elements', () => {
      const divCtx = ctx.makeChildElement('div', undefined)
      divCtx.makeChildText('Hello ')
      const spanCtx = divCtx.makeChildElement('span', undefined)
      spanCtx.makeChildText('World')
      divCtx.makeChildText('!')

      expect(ctx.element.getText()).toBe('Hello World!')
    })

    test('should extract text from innerHTML', () => {
      const { set } = ctx.makeAccessors('innerHTML')
      set('<span>HTML content</span>')

      expect(ctx.element.getText()).toBe('HTML content')
    })

    test('should extract text from innerText', () => {
      const { set } = ctx.makeAccessors('innerText')
      set('Inner text content')

      expect(ctx.element.getText()).toBe('Inner text content')
    })

    test('should prefer innerText over innerHTML', () => {
      const { set: setInnerHTML } = ctx.makeAccessors('innerHTML')
      const { set: setInnerText } = ctx.makeAccessors('innerText')

      setInnerHTML('<span>HTML content</span>')
      setInnerText('Inner text content')

      expect(ctx.element.getText()).toBe('Inner text content')
    })
  })

  describe('element removal', () => {
    test('should remove child element', () => {
      const childCtx = ctx.makeChildElement('span', undefined) as HeadlessContext

      expect(ctx.element.children.length).toBe(1)

      ctx.element.removeChild(childCtx.element as HeadlessNode)

      expect(ctx.element.children.length).toBe(0)
    })

    test('should handle removing non-existent child', () => {
      const otherElement = new HeadlessElement('div', undefined, undefined)

      expect(() => ctx.element.removeChild(otherElement)).not.toThrow()
    })
  })
});
