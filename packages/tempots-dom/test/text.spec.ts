import { describe, expect, test } from 'vitest'
import { render, TextNode, prop } from '../src'

describe('TextNode', () => {
  test('should handle static text (line 41-42)', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    // Test with static string value - this should call _staticText
    const clear = render(
      TextNode('Hello World'),
      element
    )

    expect(element.textContent).toBe('Hello World')
    clear()
    document.body.removeChild(element)
  })

  test('should handle signal text', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const textSignal = prop('Initial Text')

    // Test with signal value - this should call _signalText
    const clear = render(
      TextNode(textSignal),
      element
    )

    expect(element.textContent).toBe('Initial Text')

    // Update signal to verify reactivity
    textSignal.set('Updated Text')
    expect(element.textContent).toBe('Updated Text')

    clear()
    document.body.removeChild(element)
  })

  test('should handle empty string', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      TextNode(''),
      element
    )

    expect(element.textContent).toBe('')
    clear()
    document.body.removeChild(element)
  })

  test('should handle multiline text', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const clear = render(
      TextNode('Line 1\nLine 2\nLine 3'),
      element
    )

    expect(element.textContent).toBe('Line 1\nLine 2\nLine 3')
    clear()
    document.body.removeChild(element)
  })
})
