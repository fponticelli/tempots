import { describe, expect, test, beforeEach } from 'vitest'
import { _removeDOMNode, _getSelfOrParentElement, _isElement } from '../src/dom/dom-utils'

describe('DOM Utils', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  describe('_removeDOMNode', () => {
    test('should remove element from DOM', () => {
      const element = document.createElement('div')
      container.appendChild(element)
      
      expect(container.contains(element)).toBe(true)
      
      _removeDOMNode(element)
      
      expect(container.contains(element)).toBe(false)
    })

    test('should handle element with onblur handler', () => {
      const element = document.createElement('input') as HTMLInputElement
      element.onblur = () => {}
      container.appendChild(element)
      
      expect(element.onblur).not.toBe(null)
      
      _removeDOMNode(element)
      
      expect(element.onblur).toBe(null)
      expect(container.contains(element)).toBe(false)
    })

    test('should handle node without parent', () => {
      const element = document.createElement('div')
      // Don't append to container
      
      expect(() => _removeDOMNode(element)).not.toThrow()
    })

    test('should handle node with undefined ownerDocument', () => {
      const mockNode = {
        ownerDocument: undefined,
        parentElement: null
      } as unknown as Node
      
      expect(() => _removeDOMNode(mockNode)).not.toThrow()
    })

    test('should handle null/undefined node', () => {
      expect(() => _removeDOMNode(null as any)).not.toThrow()
      expect(() => _removeDOMNode(undefined as any)).not.toThrow()
    })

    test('should handle text node', () => {
      const textNode = document.createTextNode('test')
      container.appendChild(textNode)
      
      expect(container.contains(textNode)).toBe(true)
      
      _removeDOMNode(textNode)
      
      expect(container.contains(textNode)).toBe(false)
    })
  })

  describe('_isElement', () => {
    test('should return true for element nodes', () => {
      const element = document.createElement('div')
      expect(_isElement(element)).toBe(true)
    })

    test('should return true for input elements', () => {
      const input = document.createElement('input')
      expect(_isElement(input)).toBe(true)
    })

    test('should return false for text nodes', () => {
      const textNode = document.createTextNode('test')
      expect(_isElement(textNode)).toBe(false)
    })

    test('should return false for comment nodes', () => {
      const comment = document.createComment('test comment')
      expect(_isElement(comment)).toBe(false)
    })

    test('should return false for document fragments', () => {
      const fragment = document.createDocumentFragment()
      expect(_isElement(fragment)).toBe(false)
    })
  })

  describe('_getSelfOrParentElement', () => {
    test('should return element itself if node is element', () => {
      const element = document.createElement('div')
      const result = _getSelfOrParentElement(element)
      
      expect(result).toBe(element)
    })

    test('should return parent element for text node', () => {
      const element = document.createElement('div')
      const textNode = document.createTextNode('test')
      element.appendChild(textNode)
      
      const result = _getSelfOrParentElement(textNode)
      
      expect(result).toBe(element)
    })

    test('should return parent element for comment node', () => {
      const element = document.createElement('div')
      const comment = document.createComment('test comment')
      element.appendChild(comment)
      
      const result = _getSelfOrParentElement(comment)
      
      expect(result).toBe(element)
    })

    test('should handle nested elements', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      const textNode = document.createTextNode('nested text')
      
      parent.appendChild(child)
      child.appendChild(textNode)
      
      const result = _getSelfOrParentElement(textNode)
      
      expect(result).toBe(child)
    })
  })
});
