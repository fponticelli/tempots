import { describe, expect, test, beforeEach, vi } from 'vitest'
import { attr, dataAttr, aria, svgAttr, mathAttr } from '../src/renderable/attribute'
import { render, html, svg, math, runHeadless, prop } from '../src'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('Attribute Renderables', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('attr proxy object', () => {
    test('should create static attribute renderable', () => {
      const clear = render(
        html.div(
          attr.id('test-id'),
          attr.title('Test Title'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.id).toBe('test-id')
      expect(div.title).toBe('Test Title')
      clear()
    })

    test('should create signal attribute renderable', async () => {
      const idSignal = prop('initial-id')
      const titleSignal = prop('Initial Title')

      const clear = render(
        html.div(
          attr.id(idSignal),
          attr.title(titleSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.id).toBe('initial-id')
      expect(div.title).toBe('Initial Title')

      idSignal.set('updated-id')
      titleSignal.set('Updated Title')
      await waitForUpdate()

      expect(div.id).toBe('updated-id')
      expect(div.title).toBe('Updated Title')
      clear()
    })

    test('should handle boolean attributes', () => {
      const clear = render(
        html.input(
          attr.type('checkbox'),
          attr.checked(true),
          attr.disabled(false)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.type).toBe('checkbox')
      expect(input.checked).toBe(true)
      expect(input.disabled).toBe(false)
      clear()
    })

    test('should handle signal boolean attributes', async () => {
      const checkedSignal = prop(false)
      const disabledSignal = prop(true)

      const clear = render(
        html.input(
          attr.type('checkbox'),
          attr.checked(checkedSignal),
          attr.disabled(disabledSignal)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.checked).toBe(false)
      expect(input.disabled).toBe(true)

      checkedSignal.set(true)
      disabledSignal.set(false)
      await waitForUpdate()

      expect(input.checked).toBe(true)
      expect(input.disabled).toBe(false)
      clear()
    })

    test('should handle null and undefined values', () => {
      const clear = render(
        html.div(
          attr.title(null),
          attr.id(undefined),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.title).toBe('')
      expect(div.id).toBe('')
      clear()
    })

    test('should restore original attribute on cleanup', () => {
      const div = document.createElement('div')
      div.id = 'original-id'
      document.body.appendChild(div)

      const renderable = attr.id('new-id')
      const dispose = renderable({
        element: div,
        makeAccessors: (name) => ({
          get: () => (div as any)[name],
          set: (value) => { (div as any)[name] = value }
        })
      } as any)

      expect(div.id).toBe('new-id')

      dispose(true) // removeTree = true
      expect(div.id).toBe('original-id')
    })

    test('should not restore original attribute when removeTree is false', () => {
      const div = document.createElement('div')
      div.id = 'original-id'
      document.body.appendChild(div)

      const renderable = attr.id('new-id')
      const dispose = renderable({
        element: div,
        makeAccessors: (name) => ({
          get: () => (div as any)[name],
          set: (value) => { (div as any)[name] = value }
        })
      } as any)

      expect(div.id).toBe('new-id')

      dispose(false) // removeTree = false
      expect(div.id).toBe('new-id') // Should not restore
    })

    test('should handle class removal with removeTree=true (lines 16-17)', () => {
      const div = document.createElement('div')
      div.className = 'original-class'
      document.body.appendChild(div)

      const renderable = attr.class('new-class additional-class')
      const dispose = renderable({
        addClasses: (classes: string[]) => {
          classes.forEach((cls: string) => div.classList.add(cls))
        },
        removeClasses: (classes: string[]) => {
          classes.forEach((cls: string) => div.classList.remove(cls))
        }
      } as any)

      expect(div.className).toBe('original-class new-class additional-class')

      dispose(true) // removeTree = true - should call removeClasses (lines 16-17)
      expect(div.className).toBe('original-class')

      document.body.removeChild(div)
    })

    test('should handle signal attribute restoration with removeTree=true (lines 60-61)', () => {
      const div = document.createElement('div')
      div.title = 'original-title'
      document.body.appendChild(div)

      const titleSignal = prop('new-title')
      const renderable = attr.title(titleSignal)

      const dispose = renderable({
        getAttribute: () => 'original-title',
        setAttribute: (value: string) => { div.title = value },
        makeAccessors: (name: string) => ({
          get: () => div.getAttribute(name) || 'original-title',
          set: (value: string) => { div.title = value }
        })
      } as any)

      expect(div.title).toBe('new-title')

      // Update signal
      titleSignal.set('updated-title')
      expect(div.title).toBe('updated-title')

      dispose(true) // removeTree = true - should restore original (lines 60-61)
      expect(div.title).toBe('original-title')

      document.body.removeChild(div)
    })
  })

  describe('class attribute special handling', () => {
    test('should handle static class attribute', () => {
      const clear = render(
        html.div(
          attr.class('class1 class2 class3'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('class1')).toBe(true)
      expect(div.classList.contains('class2')).toBe(true)
      expect(div.classList.contains('class3')).toBe(true)
      clear()
    })

    test('should handle signal class attribute', async () => {
      const classSignal = prop('initial-class')

      const clear = render(
        html.div(
          attr.class(classSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('initial-class')).toBe(true)

      classSignal.set('updated-class another-class')
      await waitForUpdate()

      expect(div.classList.contains('initial-class')).toBe(false)
      expect(div.classList.contains('updated-class')).toBe(true)
      expect(div.classList.contains('another-class')).toBe(true)
      clear()
    })

    test('should handle empty class strings', () => {
      const clear = render(
        html.div(
          attr.class(''),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.className).toBe('')
      clear()
    })

    test('should handle class strings with extra spaces', () => {
      const clear = render(
        html.div(
          attr.class('  class1   class2  '),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('class1')).toBe(true)
      expect(div.classList.contains('class2')).toBe(true)
      expect(div.classList.length).toBe(2)
      clear()
    })

    test('should handle null class signal', async () => {
      const classSignal = prop<string | null>('initial-class')

      const clear = render(
        html.div(
          attr.class(classSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('initial-class')).toBe(true)

      classSignal.set(null)
      await waitForUpdate()

      expect(div.classList.contains('initial-class')).toBe(false)
      expect(div.className).toBe('')
      clear()
    })

    test('should clean up class signal properly', async () => {
      const classSignal = prop('test-class')

      const clear = render(
        html.div(
          attr.class(classSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('test-class')).toBe(true)

      clear() // This should clean up the signal listener

      classSignal.set('new-class')
      await waitForUpdate()

      // After cleanup, the signal listener should be removed so no new classes are added
      // The existing classes remain (this is the actual behavior)
      expect(div.classList.contains('test-class')).toBe(true)
      expect(div.classList.contains('new-class')).toBe(false)
    })
  })

  describe('dataAttr proxy object', () => {
    test('should create static data attribute', () => {
      const clear = render(
        html.div(
          dataAttr.testid('my-test-id'),
          dataAttr.value('some-value'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('data-testid')).toBe('my-test-id')
      expect(div.getAttribute('data-value')).toBe('some-value')
      clear()
    })

    test('should create signal data attribute', async () => {
      const testIdSignal = prop('initial-id')
      const valueSignal = prop('initial-value')

      const clear = render(
        html.div(
          dataAttr.testid(testIdSignal),
          dataAttr.value(valueSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('data-testid')).toBe('initial-id')
      expect(div.getAttribute('data-value')).toBe('initial-value')

      testIdSignal.set('updated-id')
      valueSignal.set('updated-value')
      await waitForUpdate()

      expect(div.getAttribute('data-testid')).toBe('updated-id')
      expect(div.getAttribute('data-value')).toBe('updated-value')
      clear()
    })

    test('should handle kebab-case data attributes', () => {
      const clear = render(
        html.div(
          dataAttr['my-custom-attr']('custom-value'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('data-my-custom-attr')).toBe('custom-value')
      clear()
    })
  })

  describe('aria proxy object', () => {
    test('should create static aria attributes', () => {
      const clear = render(
        html.button(
          aria.label('Click me'),
          aria.pressed(true),
          aria.expanded(false),
          'Button'
        ),
        document.body
      )

      const button = document.querySelector('button')!
      expect(button.getAttribute('aria-label')).toBe('Click me')
      expect(button.getAttribute('aria-pressed')).toBe('true')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      clear()
    })

    test('should create signal aria attributes', async () => {
      const labelSignal = prop('Initial label')
      const pressedSignal = prop(false as boolean | "true" | "false" | "mixed")

      const clear = render(
        html.button(
          aria.label(labelSignal),
          aria.pressed(pressedSignal),
          'Button'
        ),
        document.body
      )

      const button = document.querySelector('button')!
      expect(button.getAttribute('aria-label')).toBe('Initial label')
      expect(button.getAttribute('aria-pressed')).toBe('false')

      labelSignal.set('Updated label')
      pressedSignal.set(true)
      await waitForUpdate()

      expect(button.getAttribute('aria-label')).toBe('Updated label')
      expect(button.getAttribute('aria-pressed')).toBe('true')
      clear()
    })

    test('should handle aria attributes with null values', () => {
      const clear = render(
        html.div(
          aria.label(null),
          aria.describedby(undefined),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('aria-label')).toBe(null)
      expect(div.getAttribute('aria-describedby')).toBe(null)
      clear()
    })
  })

  describe('svgAttr proxy object', () => {
    test('should create static SVG attributes', () => {
      const clear = render(
        svg.svg(
          svgAttr.width(100),
          svgAttr.height(200),
          svgAttr.viewBox('0 0 100 200'),
          svg.rect(
            svgAttr.x(10),
            svgAttr.y(20),
            svgAttr.width(50),
            svgAttr.height(60)
          )
        ),
        document.body
      )

      const svgEl = document.querySelector('svg')!
      const rect = document.querySelector('rect')!

      expect(svgEl.getAttribute('width')).toBe('100')
      expect(svgEl.getAttribute('height')).toBe('200')
      expect(svgEl.getAttribute('viewBox')).toBe('0 0 100 200')
      expect(rect.getAttribute('x')).toBe('10')
      expect(rect.getAttribute('y')).toBe('20')
      clear()
    })

    test('should create signal SVG attributes', async () => {
      const widthSignal = prop(100)
      const heightSignal = prop(200)

      const clear = render(
        svg.svg(
          svgAttr.width(widthSignal),
          svgAttr.height(heightSignal)
        ),
        document.body
      )

      const svgEl = document.querySelector('svg')!
      expect(svgEl.getAttribute('width')).toBe('100')
      expect(svgEl.getAttribute('height')).toBe('200')

      widthSignal.set(150)
      heightSignal.set(250)
      await waitForUpdate()

      expect(svgEl.getAttribute('width')).toBe('150')
      expect(svgEl.getAttribute('height')).toBe('250')
      clear()
    })
  })

  describe('mathAttr proxy object', () => {
    test('should create static MathML attributes', () => {
      const clear = render(
        math.math(
          mathAttr.mathvariant('bold'),
          mathAttr.mathsize('large'),
          math.mi('x')
        ),
        document.body
      )

      const mathEl = document.querySelector('math')!
      expect(mathEl.getAttribute('mathvariant')).toBe('bold')
      expect(mathEl.getAttribute('mathsize')).toBe('large')
      clear()
    })

    test('should create signal MathML attributes', async () => {
      const variantSignal = prop('normal')
      const sizeSignal = prop('medium')

      const clear = render(
        math.math(
          mathAttr.mathvariant(variantSignal),
          mathAttr.mathsize(sizeSignal),
          math.mi('x')
        ),
        document.body
      )

      const mathEl = document.querySelector('math')!
      expect(mathEl.getAttribute('mathvariant')).toBe('normal')
      expect(mathEl.getAttribute('mathsize')).toBe('medium')

      variantSignal.set('bold')
      sizeSignal.set('large')
      await waitForUpdate()

      expect(mathEl.getAttribute('mathvariant')).toBe('bold')
      expect(mathEl.getAttribute('mathsize')).toBe('large')
      clear()
    })
  })

  describe('headless environment', () => {
    test('should work with attr in headless mode', () => {
      const { root, clear } = runHeadless(() =>
        html.div(
          attr.id('headless-id'),
          attr.class('headless-class'),
          'Headless content'
        )
      )

      expect(root.contentToHTML()).toContain('id="headless-id"')
      expect(root.contentToHTML()).toContain('class="headless-class"')
      expect(root.contentToHTML()).toContain('Headless content')
      clear()
    })

    test('should work with dataAttr in headless mode', () => {
      const { root, clear } = runHeadless(() =>
        html.div(
          dataAttr.testid('headless-test'),
          dataAttr.value('headless-value'),
          'Content'
        )
      )

      expect(root.contentToHTML()).toContain('data-testid="headless-test"')
      expect(root.contentToHTML()).toContain('data-value="headless-value"')
      clear()
    })

    test('should work with aria in headless mode', () => {
      const { root, clear } = runHeadless(() =>
        html.button(
          aria.label('Headless button'),
          aria.pressed(true),
          'Button'
        )
      )

      expect(root.contentToHTML()).toContain('aria-label="Headless button"')
      expect(root.contentToHTML()).toContain('aria-pressed="true"')
      clear()
    })

    test('should work with svgAttr in headless mode', () => {
      const { root, clear } = runHeadless(() =>
        svg.svg(
          svgAttr.width(100),
          svgAttr.height(200),
          svgAttr.viewBox('0 0 100 200')
        )
      )

      expect(root.contentToHTML()).toContain('width="100"')
      expect(root.contentToHTML()).toContain('height="200"')
      expect(root.contentToHTML()).toContain('viewBox="0 0 100 200"')
      clear()
    })

    test('should work with mathAttr in headless mode', () => {
      const { root, clear } = runHeadless(() =>
        math.math(
          mathAttr.mathvariant('bold'),
          mathAttr.mathsize('large')
        )
      )

      expect(root.contentToHTML()).toContain('mathvariant="bold"')
      expect(root.contentToHTML()).toContain('mathsize="large"')
      clear()
    })

    test('should handle signal attributes in headless mode', async () => {
      const idSignal = prop('initial-id')

      const { root, clear } = runHeadless(() =>
        html.div(
          attr.id(idSignal),
          'Content'
        )
      )

      expect(root.contentToHTML()).toContain('id="initial-id"')

      idSignal.set('updated-id')
      await waitForUpdate()

      expect(root.contentToHTML()).toContain('id="updated-id"')
      clear()
    })
  })

  describe('edge cases and error handling', () => {
    test('should handle multiple class attributes', () => {
      const clear = render(
        html.div(
          attr.class('class1 class2'),
          attr.class('class3 class4'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.classList.contains('class1')).toBe(true)
      expect(div.classList.contains('class2')).toBe(true)
      expect(div.classList.contains('class3')).toBe(true)
      expect(div.classList.contains('class4')).toBe(true)
      clear()
    })

    test('should handle rapid signal changes', async () => {
      const valueSignal = prop('initial')

      const clear = render(
        html.div(
          attr.title(valueSignal),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.title).toBe('initial')

      // Rapid changes
      valueSignal.set('change1')
      valueSignal.set('change2')
      valueSignal.set('change3')
      valueSignal.set('final')

      await waitForUpdate()
      expect(div.title).toBe('final')
      clear()
    })

    test('should handle complex attribute values', () => {
      const complexValue = 'value with spaces, symbols: !@#$%^&*()_+-=[]{}|;:,.<>?'

      const clear = render(
        html.div(
          attr.title(complexValue),
          dataAttr.complex(complexValue),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.title).toBe(complexValue)
      expect(div.getAttribute('data-complex')).toBe(complexValue)
      clear()
    })

    test('should handle numeric attribute values', () => {
      const clear = render(
        html.input(
          attr.tabindex(5),
          attr.maxlength(100),
          svgAttr.width(150)
        ),
        document.body
      )

      const input = document.querySelector('input')!
      expect(input.tabIndex).toBe(5)
      expect(input.maxLength).toBe(100)
      expect(input.getAttribute('width')).toBe('150')
      clear()
    })

    test('should handle signal cleanup on element removal', async () => {
      const valueSignal = prop('initial')
      const mockOnChange = vi.fn()

      // Listen to signal changes to verify cleanup
      const signalCleanup = valueSignal.on(mockOnChange)

      const clear = render(
        html.div(
          attr.title(valueSignal),
          'Content'
        ),
        document.body
      )

      expect(mockOnChange).toHaveBeenCalledWith('initial', undefined)
      mockOnChange.mockClear()

      clear() // This should clean up the attribute signal listener

      valueSignal.set('after-cleanup')
      await waitForUpdate()

      // The signal should still fire (our listener is still active)
      expect(mockOnChange).toHaveBeenCalledWith('after-cleanup', 'initial')

      signalCleanup()
    })

    test('should handle empty string data attribute names', () => {
      const clear = render(
        html.div(
          dataAttr['']('empty-name'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('data-')).toBe('empty-name')
      clear()
    })

    test('should handle special characters in data attribute names', () => {
      const clear = render(
        html.div(
          dataAttr['test-123']('value1'),
          dataAttr['test_456']('value2'),
          'Content'
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.getAttribute('data-test-123')).toBe('value1')
      expect(div.getAttribute('data-test_456')).toBe('value2')
      clear()
    })
  })
})
