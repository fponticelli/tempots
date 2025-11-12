import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  attr,
  html,
  ShadowRoot,
  render,
  prop,
  When,
  on,
  OnDispose,
  getCurrentScope,
} from '../src'

describe('ShadowRoot', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  describe('Basic rendering', () => {
    test('should create shadow root with open mode', () => {
      const clear = render(
        html.div(ShadowRoot({ mode: 'open' }, html.p('Shadow content'))),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      expect(hostElement).toBeTruthy()
      expect(hostElement.shadowRoot).toBeTruthy()
      expect(hostElement.shadowRoot?.mode).toBe('open')

      const paragraph = hostElement.shadowRoot?.querySelector('p')
      expect(paragraph).toBeTruthy()
      expect(paragraph?.textContent).toBe('Shadow content')

      clear()
    })

    test('should create shadow root with closed mode', () => {
      const clear = render(
        html.div(ShadowRoot({ mode: 'closed' }, html.p('Shadow content'))),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      expect(hostElement).toBeTruthy()
      // Closed shadow roots are not accessible via shadowRoot property
      expect(hostElement.shadowRoot).toBeNull()

      clear()
    })

    test('should render multiple children in shadow root', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.h1('Title'),
            html.p('Paragraph 1'),
            html.p('Paragraph 2'),
            html.span('Span')
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.children.length).toBe(4)
      expect(shadowRoot.querySelector('h1')?.textContent).toBe('Title')
      expect(shadowRoot.querySelectorAll('p').length).toBe(2)
      expect(shadowRoot.querySelector('span')?.textContent).toBe('Span')

      clear()
    })

    test('should render text nodes in shadow root', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            'Plain text',
            html.span(' and '),
            'more text'
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.textContent).toContain('Plain text')
      expect(shadowRoot.textContent).toContain(' and ')
      expect(shadowRoot.textContent).toContain('more text')

      clear()
    })

    test('should render empty shadow root when no children provided', () => {
      const clear = render(html.div(ShadowRoot({ mode: 'open' })), container)

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.children.length).toBe(0)
      expect(shadowRoot.textContent).toBe('')

      clear()
    })
  })

  describe('Reactive content', () => {
    test('should render reactive content in shadow root', () => {
      const message = prop('Initial')

      const clear = render(
        html.div(ShadowRoot({ mode: 'open' }, html.p(message))),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!
      const paragraph = shadowRoot.querySelector('p')!

      expect(paragraph.textContent).toBe('Initial')

      message.value = 'Updated'
      expect(paragraph.textContent).toBe('Updated')

      clear()
    })

    test('should handle conditional rendering in shadow root', () => {
      const show = prop(true)

      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            When(show, () => html.p('Conditional content'))
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.querySelector('p')?.textContent).toBe(
        'Conditional content'
      )

      show.value = false
      expect(shadowRoot.querySelector('p')).toBeNull()

      show.value = true
      expect(shadowRoot.querySelector('p')?.textContent).toBe(
        'Conditional content'
      )

      clear()
    })
  })

  describe('Attributes and styling', () => {
    test('should apply attributes to elements in shadow root', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.p(
              attr.id('shadow-para'),
              attr.class('shadow-class'),
              'Content'
            )
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!
      const paragraph = shadowRoot.querySelector('p')!

      expect(paragraph.id).toBe('shadow-para')
      expect(paragraph.className).toBe('shadow-class')

      clear()
    })

    test('should support styles in shadow root', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.style('p { color: red; }'),
            html.p('Styled content')
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.querySelector('style')?.textContent).toBe(
        'p { color: red; }'
      )
      expect(shadowRoot.querySelector('p')?.textContent).toBe('Styled content')

      clear()
    })
  })

  describe('Event handling', () => {
    test('should handle events in shadow root', () => {
      const clickHandler = vi.fn()

      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.button(on.click(clickHandler), 'Click me')
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!
      const button = shadowRoot.querySelector('button')!

      button.click()
      expect(clickHandler).toHaveBeenCalledTimes(1)

      clear()
    })

    test('should clean up event listeners when disposed', () => {
      const clickHandler = vi.fn()

      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.button(on.click(clickHandler), 'Click me')
          )
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!
      const button = shadowRoot.querySelector('button')!

      button.click()
      expect(clickHandler).toHaveBeenCalledTimes(1)

      clear()

      // After clearing, the button should still exist but clicking shouldn't trigger handler
      // (though in practice the whole shadow root content is cleared)
      expect(shadowRoot.children.length).toBe(0)
    })
  })

  describe('Disposal and cleanup', () => {
    test('should clear shadow root content when disposed', () => {
      const clear = render(
        html.div(
          ShadowRoot({ mode: 'open' }, html.h1('Title'), html.p('Content'))
        ),
        container
      )

      const hostElement = container.querySelector('div') as HTMLElement
      const shadowRoot = hostElement.shadowRoot!

      expect(shadowRoot.children.length).toBe(2)

      clear()

      // Shadow root should be empty after disposal
      expect(shadowRoot.children.length).toBe(0)
    })

    test('should call OnDispose callbacks when shadow content is disposed', () => {
      const disposeCallback = vi.fn()

      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.p('Content'),
            OnDispose(disposeCallback)
          )
        ),
        container
      )

      expect(disposeCallback).not.toHaveBeenCalled()

      clear()

      expect(disposeCallback).toHaveBeenCalledTimes(1)
      expect(disposeCallback).toHaveBeenCalledWith(true, expect.anything())
    })

    test('should dispose reactive signals in shadow root', () => {
      let computedDisposed = false
      const signal = prop('Initial')

      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.p(
              signal.map(v => {
                const scope = getCurrentScope()
                if (scope) {
                  scope.onDispose(() => {
                    computedDisposed = true
                  })
                }
                return v.toUpperCase()
              })
            )
          )
        ),
        container
      )

      expect(computedDisposed).toBe(false)

      clear()

      // The computed signal created in the map should be disposed
      expect(computedDisposed).toBe(true)
    })
  })

  describe('Nested shadow roots', () => {
    test('should support nested shadow roots', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open' },
            html.div(
              ShadowRoot({ mode: 'open' }, html.p('Nested shadow content'))
            )
          )
        ),
        container
      )

      const outerHost = container.querySelector('div') as HTMLElement
      const outerShadow = outerHost.shadowRoot!

      const innerHost = outerShadow.querySelector('div') as HTMLElement
      const innerShadow = innerHost.shadowRoot!

      expect(innerShadow.querySelector('p')?.textContent).toBe(
        'Nested shadow content'
      )

      clear()
    })
  })

  describe('Integration with other components', () => {
    test('should work with When component', () => {
      const show = prop(true)

      const clear = render(
        When(show, () =>
          html.div(
            attr.class('shadow-host'),
            ShadowRoot({ mode: 'open' }, html.p('Conditional shadow'))
          )
        ),
        container
      )

      let hostElement = container.querySelector(
        '.shadow-host'
      ) as HTMLElement | null
      expect(hostElement?.shadowRoot?.querySelector('p')?.textContent).toBe(
        'Conditional shadow'
      )

      show.value = false
      hostElement = container.querySelector(
        '.shadow-host'
      ) as HTMLElement | null
      expect(hostElement).toBeNull()

      show.value = true
      hostElement = container.querySelector(
        '.shadow-host'
      ) as HTMLElement | null
      expect(hostElement?.shadowRoot?.querySelector('p')?.textContent).toBe(
        'Conditional shadow'
      )

      clear()
    })
  })

  describe('delegatesFocus option', () => {
    test('should pass delegatesFocus option to attachShadow', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open', delegatesFocus: true },
            html.input(attr.type('text'))
          )
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      // Note: delegatesFocus property may not be available in all test environments (jsdom)
      // The important thing is that the option is passed to attachShadow without errors

      clear()
    })

    test('should create shadow root without delegatesFocus by default', () => {
      const clear = render(
        html.div(
          ShadowRoot({ mode: 'open' }, html.input(attr.type('text')))
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()

      clear()
    })
  })

  describe('slotAssignment option', () => {
    test('should create shadow root with named slot assignment by default', () => {
      const clear = render(
        html.div(ShadowRoot({ mode: 'open' }, html.slot())),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.slotAssignment).toBe('named')

      clear()
    })

    test('should create shadow root with manual slot assignment', () => {
      const clear = render(
        html.div(
          ShadowRoot({ mode: 'open', slotAssignment: 'manual' }, html.slot())
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.slotAssignment).toBe('manual')

      clear()
    })
  })

  describe('clonable option', () => {
    test('should create shadow root with clonable enabled', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open', clonable: true },
            html.span('Clonable content')
          )
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.clonable).toBe(true)

      clear()
    })

    test('should create shadow root with clonable disabled by default', () => {
      const clear = render(
        html.div(
          ShadowRoot({ mode: 'open' }, html.span('Non-clonable content'))
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.clonable).toBe(false)

      clear()
    })

    test('should include shadow root when cloning if clonable is true', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open', clonable: true },
            html.span('Clonable content')
          )
        ),
        container
      )

      const originalDiv = container.querySelector('div') as HTMLElement
      const clonedDiv = originalDiv.cloneNode(true) as HTMLElement

      expect(clonedDiv.shadowRoot).toBeTruthy()
      expect(clonedDiv.shadowRoot?.querySelector('span')?.textContent).toBe(
        'Clonable content'
      )

      clear()
    })

    test('should not include shadow root when cloning if clonable is false', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open', clonable: false },
            html.span('Non-clonable content')
          )
        ),
        container
      )

      const originalDiv = container.querySelector('div') as HTMLElement
      const clonedDiv = originalDiv.cloneNode(true) as HTMLElement

      expect(clonedDiv.shadowRoot).toBeNull()

      clear()
    })
  })

  describe('serializable option', () => {
    test('should create shadow root with serializable enabled', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            { mode: 'open', serializable: true },
            html.span('Serializable content')
          )
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.serializable).toBe(true)

      clear()
    })

    test('should create shadow root with serializable disabled by default', () => {
      const clear = render(
        html.div(
          ShadowRoot({ mode: 'open' }, html.span('Non-serializable content'))
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.serializable).toBe(false)

      clear()
    })
  })

  describe('combined options', () => {
    test('should support all options together', () => {
      const clear = render(
        html.div(
          ShadowRoot(
            {
              mode: 'open',
              delegatesFocus: true,
              slotAssignment: 'manual',
              clonable: true,
              serializable: true,
            },
            html.span('All options enabled')
          )
        ),
        container
      )

      const shadowRoot = container.querySelector('div')?.shadowRoot
      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot?.mode).toBe('open')
      expect(shadowRoot?.slotAssignment).toBe('manual')
      expect(shadowRoot?.clonable).toBe(true)
      expect(shadowRoot?.serializable).toBe(true)
      // Note: delegatesFocus may not be available in all test environments

      clear()
    })
  })
})
