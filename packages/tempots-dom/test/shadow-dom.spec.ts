import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { render } from '../src/renderable/render'
import { html } from '../src/renderable/element'

describe('Shadow DOM rendering', () => {
  let host: HTMLDivElement
  let shadowRoot: ShadowRoot

  beforeEach(() => {
    host = document.createElement('div')
    shadowRoot = host.attachShadow({ mode: 'open' })
    document.body.appendChild(host)
  })

  afterEach(() => {
    if (document.body.contains(host)) {
      document.body.removeChild(host)
    }
  })

  test('should render into shadow root without wrapper div', () => {
    const clear = render(html.div(html.p('Hello from Shadow DOM')), shadowRoot)

    // Content should be rendered directly into shadow root
    expect(shadowRoot.children.length).toBe(1)
    expect(shadowRoot.children[0].tagName).toBe('DIV')
    expect(shadowRoot.children[0].children[0].tagName).toBe('P')
    expect(shadowRoot.children[0].children[0].textContent).toBe(
      'Hello from Shadow DOM'
    )

    clear()
  })

  test('should clear shadow root content when clear option is true', () => {
    shadowRoot.innerHTML = '<p>Existing content</p>'
    expect(shadowRoot.children.length).toBe(1)

    const clear = render(html.div('New content'), shadowRoot, { clear: true })

    // Old content should be cleared
    expect(shadowRoot.children.length).toBe(1)
    expect(shadowRoot.children[0].textContent).toBe('New content')

    clear()
  })

  test('should not clear shadow root content when clear option is false', () => {
    shadowRoot.innerHTML = '<p>Existing content</p>'
    expect(shadowRoot.children.length).toBe(1)

    const clear = render(html.div('New content'), shadowRoot, { clear: false })

    // Both old and new content should exist
    expect(shadowRoot.children.length).toBe(2)
    expect(shadowRoot.children[0].textContent).toBe('Existing content')
    expect(shadowRoot.children[1].textContent).toBe('New content')

    clear()
  })

  test('should properly dispose rendered content', () => {
    const clear = render(html.div(html.p('Test content')), shadowRoot)

    expect(shadowRoot.children.length).toBe(1)

    clear()

    // After clearing, content should be removed
    expect(shadowRoot.children.length).toBe(0)
  })

  test('should handle disposeWithParent option gracefully', () => {
    // This test verifies that disposeWithParent doesn't cause errors with shadow root
    const clear = render(html.div('Content'), shadowRoot, {
      disposeWithParent: true,
    })

    expect(shadowRoot.children.length).toBe(1)

    clear()
  })

  test('should render multiple elements into shadow root', () => {
    const clear = render(
      html.div(html.h1('Title'), html.p('Paragraph 1'), html.p('Paragraph 2')),
      shadowRoot
    )

    expect(shadowRoot.children.length).toBe(1)
    const container = shadowRoot.children[0]
    expect(container.children.length).toBe(3)
    expect(container.children[0].tagName).toBe('H1')
    expect(container.children[1].tagName).toBe('P')
    expect(container.children[2].tagName).toBe('P')

    clear()
  })
})
