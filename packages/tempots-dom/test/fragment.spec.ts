import { describe, expect, test, vi } from 'vitest'
import { render, html, Fragment, prop } from '../src'

describe('Fragment', () => {
  test('should render multiple children', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(
        html.span('first'),
        html.span('second'),
        html.span('third')
      ),
      element
    )

    expect(element.innerHTML).toBe('<span>first</span><span>second</span><span>third</span>')
    clear()
    document.body.removeChild(element)
  })

  test('should render empty fragment', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(),
      element
    )

    expect(element.innerHTML).toBe('')
    clear()
    document.body.removeChild(element)
  })

  test('should render single child', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(html.div('only child')),
      element
    )

    expect(element.innerHTML).toBe('<div>only child</div>')
    clear()
    document.body.removeChild(element)
  })

  test('should render mixed content types', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(
        'text node',
        html.span('element'),
        'another text'
      ),
      element
    )

    expect(element.textContent).toContain('text node')
    expect(element.textContent).toContain('element')
    expect(element.textContent).toContain('another text')
    clear()
    document.body.removeChild(element)
  })

  test('should render nested fragments', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(
        Fragment(
          html.span('nested1'),
          html.span('nested2')
        ),
        html.span('sibling')
      ),
      element
    )

    expect(element.innerHTML).toBe('<span>nested1</span><span>nested2</span><span>sibling</span>')
    clear()
    document.body.removeChild(element)
  })

  test('should cleanup all children on clear', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(
        html.div('child1'),
        html.div('child2'),
        html.div('child3')
      ),
      element
    )

    expect(element.children.length).toBe(3)

    clear()

    expect(element.innerHTML).toBe('')
    document.body.removeChild(element)
  })

  test('should work with reactive children', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const text = prop('initial')

    const clear = render(
      Fragment(
        html.span(text),
        html.span('static')
      ),
      element
    )

    expect(element.innerHTML).toBe('<span>initial</span><span>static</span>')

    text.set('updated')
    expect(element.innerHTML).toBe('<span>updated</span><span>static</span>')

    clear()
    text.dispose()
    document.body.removeChild(element)
  })

  test('should work inside other elements', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      html.div(
        Fragment(
          html.span('a'),
          html.span('b')
        )
      ),
      element
    )

    expect(element.innerHTML).toBe('<div><span>a</span><span>b</span></div>')
    clear()
    document.body.removeChild(element)
  })

  test('should handle arrays as children', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      Fragment(
        [html.span('from array'), html.span('second')],
        html.span('static')
      ),
      element
    )

    expect(element.innerHTML).toBe('<span>from array</span><span>second</span><span>static</span>')
    clear()
    document.body.removeChild(element)
  })
})
