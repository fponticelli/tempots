import { describe, expect, test } from 'vitest'
import { render, html, input } from '../src'

describe('Element', () => {
  test('should handle null child (line 23)', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    // Test with null child - this should render as Empty
    const clear = render(
      html.div(null),
      element
    )

    expect(element.innerHTML).toBe('<div></div>')
    clear()
    document.body.removeChild(element)
  })

  test('should throw error for unknown child type (lines 33-34)', () => {
    const element = document.createElement('div')

    // Test with an unsupported child type (object that's not a signal or function)
    const invalidChild = { invalid: 'object' } as any

    expect(() => {
      render(
        html.div(invalidChild),
        element
      )
    }).toThrow("Unknown type: 'object' for child: [object Object]")
  })

  test('should create input elements with types (lines 121-124)', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    // Test various input types to cover the input proxy
    const clear1 = render(input.text(), element)
    expect(element.innerHTML).toBe('<input type="text">')
    clear1()

    const clear2 = render(input.password(), element)
    expect(element.innerHTML).toBe('<input type="password">')
    clear2()

    const clear3 = render(input.email(), element)
    expect(element.innerHTML).toBe('<input type="email">')
    clear3()

    const clear4 = render(input.number(), element)
    expect(element.innerHTML).toBe('<input type="number">')
    clear4()

    const clear5 = render(input.checkbox(), element)
    expect(element.innerHTML).toBe('<input type="checkbox">')
    clear5()

    const clear6 = render(input.radio(), element)
    expect(element.innerHTML).toBe('<input type="radio">')
    clear6()

    const clear7 = render(input.submit(), element)
    expect(element.innerHTML).toBe('<input type="submit">')
    clear7()

    const clear8 = render(input.reset(), element)
    expect(element.innerHTML).toBe('<input type="reset">')
    clear8()

    const clear9 = render(input.button(), element)
    expect(element.innerHTML).toBe('<input type="button">')
    clear9()

    const clear10 = render(input.file(), element)
    expect(element.innerHTML).toBe('<input type="file">')
    clear10()

    const clear11 = render(input.hidden(), element)
    expect(element.innerHTML).toBe('<input type="hidden">')
    clear11()

    const clear12 = render(input.image(), element)
    expect(element.innerHTML).toBe('<input type="image">')
    clear12()

    const clear13 = render(input.range(), element)
    expect(element.innerHTML).toBe('<input type="range">')
    clear13()

    const clear14 = render(input.search(), element)
    expect(element.innerHTML).toBe('<input type="search">')
    clear14()

    const clear15 = render(input.tel(), element)
    expect(element.innerHTML).toBe('<input type="tel">')
    clear15()

    const clear16 = render(input.url(), element)
    expect(element.innerHTML).toBe('<input type="url">')
    clear16()

    const clear17 = render(input.color(), element)
    expect(element.innerHTML).toBe('<input type="color">')
    clear17()

    const clear18 = render(input.date(), element)
    expect(element.innerHTML).toBe('<input type="date">')
    clear18()

    const clear19 = render(input.time(), element)
    expect(element.innerHTML).toBe('<input type="time">')
    clear19()

    const clear20 = render(input.datetime(), element)
    expect(element.innerHTML).toBe('<input type="datetime">')
    clear20()

    const clear21 = render(input.datetimeLocal(), element)
    expect(element.innerHTML).toBe('<input type="datetimeLocal">')
    clear21()

    const clear22 = render(input.month(), element)
    expect(element.innerHTML).toBe('<input type="month">')
    clear22()

    const clear23 = render(input.week(), element)
    expect(element.innerHTML).toBe('<input type="week">')
    clear23()

    document.body.removeChild(element)
  })

  test('should handle undefined child', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    // Test with undefined child - this should render as Empty
    const clear = render(
      html.div(undefined),
      element
    )

    expect(element.innerHTML).toBe('<div></div>')
    clear()
    document.body.removeChild(element)
  })
})
