import { describe, expect, test, beforeEach } from 'vitest'
import { Conjunction, render, html, runHeadless, prop } from '../src'
import { ElementPosition } from '@tempots/core'

describe('Conjunction', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    test('should render first separator for first element', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          { firstSeparator: () => html.span('[first]') }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[first]</span><!---->')
      clear()
    })

    test('should render default separator when no specific separators provided', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(() => html.span('|'))(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>|</span><!---->')
      clear()
    })

    test('should handle empty options object', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(() => html.span(' - '), {})(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> - </span><!---->')
      clear()
    })

    test('should handle undefined options', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(() => html.span(' & '))(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> &amp; </span><!---->')
      clear()
    })
  })

  describe('correct position handling', () => {
    test('should correctly distinguish first, last, and middle positions', () => {
      const totalSignal = prop(3)
      const middlePosition = prop(new ElementPosition(1, totalSignal))

      const mappedValue = middlePosition.map(v => {
        if (v.isFirst) {
          return 'first'
        } else if (v.isLast.value) {
          return 'last'
        } else {
          return 'other'
        }
      })

      expect(mappedValue.value).toBe('other')
    })

    test('should render first separator for first position', () => {
      const totalSignal = prop(3)
      const firstPosition = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(firstPosition),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[FIRST]</span><!---->')
      clear()
    })

    test('should render default separator for middle positions', () => {
      const totalSignal = prop(3)
      const middlePosition = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(middlePosition),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>, </span><!---->')
      clear()
    })

    test('should render last separator for last position', () => {
      const totalSignal = prop(3)
      const lastPosition = prop(new ElementPosition(2, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(lastPosition),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[LAST]</span><!---->')
      clear()
    })
  })

  describe('options handling', () => {
    test('should handle only firstSeparator defined', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' | '),
          { firstSeparator: () => html.span('[START]') }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[START]</span><!---->')
      clear()
    })

    test('should handle only lastSeparator defined for last position', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(2, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' ~ '),
          { lastSeparator: () => html.span('[END]') }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[END]</span><!---->')
      clear()
    })

    test('should use default separator for middle position when only lastSeparator defined', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' ~ '),
          { lastSeparator: () => html.span('[END]') }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> ~ </span><!---->')
      clear()
    })
  })

  describe('complex separators', () => {
    test('should handle complex HTML separators', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(
            html.strong(' and '),
            html.em('also')
          ),
          {
            firstSeparator: () => html.div(
              html.h4('First Item'),
              html.p('Starting here')
            ),
            lastSeparator: () => html.section(
              html.h4('Last Item'),
              html.p('Ending here')
            )
          }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe(
        '<div><h4>First Item</h4><p>Starting here</p></div><!---->'
      )
      clear()
    })

    test('should handle text-only separators', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => ', ',
          {
            firstSeparator: () => 'FIRST: ',
            lastSeparator: () => ' :LAST'
          }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('FIRST: <!---->')
      clear()
    })
  })

  describe('headless environment', () => {
    test('should work in headless environment', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const { root, clear } = runHeadless(() =>
        Conjunction(
          () => html.span(' | '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(position)
      )

      expect(root.contentToHTML()).toBe('<span>[FIRST]</span>')
      clear()
    })
  })

  describe('edge cases', () => {
    test('should handle single element (both first and last)', () => {
      const totalSignal = prop(1)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' | '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(position),
        document.body
      )

      // When both isFirst and isLast are true, isFirst takes precedence
      expect(document.body.innerHTML).toBe('<span>[FIRST]</span><!---->')
      clear()
    })

    test('should correctly identify middle position in mapping logic', () => {
      const totalSignal = prop(5)
      const position = new ElementPosition(2, totalSignal)

      const mappedValue = (() => {
        if (position.isFirst) {
          return 'first'
        } else if (position.isLast.value) {
          return 'last'
        } else {
          return 'other'
        }
      })()

      expect(mappedValue).toBe('other')
      expect(position.isFirst).toBe(false)
      expect(position.isLast.value).toBe(false)
    })
  })
})
