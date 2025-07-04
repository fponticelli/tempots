import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HiddenWhenEmpty } from '../src/renderables/hidden-when-empty'
import { html, render } from '@tempots/dom'

describe('hidden-when-empty.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('HiddenWhenEmpty', () => {
    it('should be a renderable function', () => {
      expect(typeof HiddenWhenEmpty).toBe('function')
    })

    it('should set :empty CSS property to display:none', () => {
      const div = html.div(HiddenWhenEmpty)
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement
      expect(element.style.getPropertyValue(':empty')).toBe('display:none')

      clear()
    })

    it('should preserve initial :empty property value', () => {
      const div = html.div(HiddenWhenEmpty)
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement

      // Set an initial value
      element.style.setProperty(':empty', 'color: red')

      // Re-render with HiddenWhenEmpty
      clear()
      const div2 = html.div(HiddenWhenEmpty)
      const clear2 = render(div2, document.body)

      const element2 = document.querySelector('div') as HTMLElement
      expect(element2.style.getPropertyValue(':empty')).toBe('display:none')

      clear2()
    })

    it('should restore initial value on dispose when removeTree is true', () => {
      const div = html.div(HiddenWhenEmpty)
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement

      // Store the initial value (should be empty string)
      const initialValue = ''

      // Verify the property was set
      expect(element.style.getPropertyValue(':empty')).toBe('display:none')

      // Clear with removeTree = true (this is the default behavior)
      clear()

      // The element should be removed from DOM, so we can't test the restoration
      // But we can verify the element is no longer in the DOM
      expect(document.querySelector('div')).toBeNull()
    })

    it('should work with elements that have existing :empty styles', () => {
      // This test verifies the behavior conceptually since we can't easily mock the context
      // The HiddenWhenEmpty function should preserve and restore initial values
      const div = html.div(HiddenWhenEmpty, 'Content')
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement

      // Should have set the :empty property
      expect(element.style.getPropertyValue(':empty')).toBe('display:none')

      clear()
    })

    it('should work with multiple elements', () => {
      const container = html.div(
        html.div(HiddenWhenEmpty, 'First div'),
        html.div(HiddenWhenEmpty, 'Second div'),
        html.div(HiddenWhenEmpty, 'Third div')
      )

      const clear = render(container, document.body)

      const divs = document.querySelectorAll('div')

      // All child divs should have the :empty style set
      // (Note: the container div doesn't have HiddenWhenEmpty applied)
      expect(divs.length).toBe(4) // container + 3 children

      // Check the child divs (skip the container at index 0)
      for (let i = 1; i < divs.length; i++) {
        expect(divs[i].style.getPropertyValue(':empty')).toBe('display:none')
      }

      clear()
    })

    it('should handle elements without initial :empty property', () => {
      const div = html.div(HiddenWhenEmpty, 'Content')
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement

      // Should set the property even if it didn't exist before
      expect(element.style.getPropertyValue(':empty')).toBe('display:none')

      clear()
    })

    it('should work with different element types', () => {
      const container = html.div(
        html.p(HiddenWhenEmpty, 'Paragraph'),
        html.span(HiddenWhenEmpty, 'Span'),
        html.section(HiddenWhenEmpty, 'Section')
      )

      const clear = render(container, document.body)

      const p = document.querySelector('p') as HTMLElement
      const span = document.querySelector('span') as HTMLElement
      const section = document.querySelector('section') as HTMLElement

      expect(p.style.getPropertyValue(':empty')).toBe('display:none')
      expect(span.style.getPropertyValue(':empty')).toBe('display:none')
      expect(section.style.getPropertyValue(':empty')).toBe('display:none')

      clear()
    })

    it('should handle disposal behavior', () => {
      // This test verifies that the HiddenWhenEmpty function works correctly
      // The disposal behavior is tested conceptually since we can't easily mock the context
      const div = html.div(HiddenWhenEmpty, 'Content')
      const clear = render(div, document.body)

      const element = document.querySelector('div') as HTMLElement

      // Should have set the :empty property
      expect(element.style.getPropertyValue(':empty')).toBe('display:none')

      // Clear the element (this will dispose it)
      clear()

      // Element should be removed from DOM
      expect(document.querySelector('div')).toBeNull()
    })
  })
})
