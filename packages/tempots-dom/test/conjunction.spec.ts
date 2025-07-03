import { describe, expect, test, beforeEach } from 'vitest'
import { Conjunction, render, html, runHeadless, prop } from '../src'
import { ElementPosition } from '../src/std/element-position'

describe('Conjunction', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    test('should render default separator for middle elements', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(() => html.span(', '), {})(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>, </span>')
      clear()
    })

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

      expect(document.body.innerHTML).toBe('<span>[first]</span>')
      clear()
    })

    test('should render last separator for last element', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(2, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          { lastSeparator: () => html.span('[last]') }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>[last]</span>')
      clear()
    })

    test('should use default separator when no specific separators provided', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(0, totalSignal))

      const clear = render(
        Conjunction(() => html.span('|'))(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>|</span>')
      clear()
    })

    test('should handle empty options object', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(() => html.span(' - '), {})(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> - </span>')
      clear()
    })

    test('should handle undefined options', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(() => html.span(' & '))(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> &amp; </span>')
      clear()
    })
  })

  describe('reactive behavior', () => {
    test('should debug position behavior', () => {
      const totalSignal = prop(3)

      // Test what ElementPosition actually reports
      const pos0 = new ElementPosition(0, totalSignal)
      const pos1 = new ElementPosition(1, totalSignal)
      const pos2 = new ElementPosition(2, totalSignal)

      expect(pos0.isFirst).toBe(true)
      expect(pos0.isLast.value).toBe(false) // counter 1 === total 3? false

      expect(pos1.isFirst).toBe(false)
      expect(pos1.isLast.value).toBe(false) // counter 2 === total 3? false

      expect(pos2.isFirst).toBe(false)
      expect(pos2.isLast.value).toBe(true) // counter 3 === total 3? true
    })

    test('should update when position changes', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(position),
        document.body
      )

      // Initially middle element (index 1 of 3 total)
      expect(document.body.innerHTML).toBe('<span>, </span>')

      // Change to first element (index 0)
      position.set(new ElementPosition(0, totalSignal))
      expect(document.body.innerHTML).toBe('<span>[FIRST]</span>')

      // Change to last element (index 2, which is position 3 of 3 total)
      position.set(new ElementPosition(2, totalSignal))
      expect(document.body.innerHTML).toBe('<span>[LAST]</span>')

      // Change back to middle
      position.set(new ElementPosition(1, totalSignal))
      expect(document.body.innerHTML).toBe('<span>, </span>')

      clear()
    })

    test('should handle position changes with only firstSeparator defined', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' | '),
          { firstSeparator: () => html.span('[START]') }
        )(position),
        document.body
      )

      // Initially middle element (uses default separator)
      expect(document.body.innerHTML).toBe('<span> | </span>')

      // Change to first element (uses firstSeparator)
      position.set(new ElementPosition(0, totalSignal))
      expect(document.body.innerHTML).toBe('<span>[START]</span>')

      // Change to last element (uses default separator since no lastSeparator)
      position.set(new ElementPosition(2, totalSignal))
      expect(document.body.innerHTML).toBe('<span> | </span>')

      clear()
    })

    test('should handle position changes with only lastSeparator defined', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' ~ '),
          { lastSeparator: () => html.span('[END]') }
        )(position),
        document.body
      )

      // Initially middle element (uses default separator)
      expect(document.body.innerHTML).toBe('<span> ~ </span>')

      // Change to last element (uses lastSeparator)
      position.set(new ElementPosition(2, totalSignal))
      expect(document.body.innerHTML).toBe('<span>[END]</span>')

      // Change to first element (uses default separator since no firstSeparator)
      position.set(new ElementPosition(0, totalSignal))
      expect(document.body.innerHTML).toBe('<span> ~ </span>')

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
        '<div><h4>First Item</h4><p>Starting here</p></div>'
      )

      // Change to last
      position.set(new ElementPosition(2, totalSignal))
      expect(document.body.innerHTML).toBe(
        '<section><h4>Last Item</h4><p>Ending here</p></section>'
      )

      // Change to middle
      position.set(new ElementPosition(1, totalSignal))
      expect(document.body.innerHTML).toBe(
        '<span><strong> and </strong><em>also</em></span>'
      )

      clear()
    })

    test('should handle text-only separators', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

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

      expect(document.body.innerHTML).toBe(', ')

      position.set(new ElementPosition(0, totalSignal))
      expect(document.body.innerHTML).toBe('FIRST: ')

      position.set(new ElementPosition(2, totalSignal))
      expect(document.body.innerHTML).toBe(' :LAST')

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

      position.set(new ElementPosition(1, totalSignal))
      expect(root.contentToHTML()).toBe('<span> | </span>')

      position.set(new ElementPosition(2, totalSignal))
      expect(root.contentToHTML()).toBe('<span>[LAST]</span>')

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
      expect(document.body.innerHTML).toBe('<span>[FIRST]</span>')

      clear()
    })

    test('should handle position with neither first nor last flags', () => {
      const totalSignal = prop(3)
      const position = prop(new ElementPosition(1, totalSignal))

      const clear = render(
        Conjunction(
          () => html.span(' DEFAULT '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(position),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span> DEFAULT </span>')

      clear()
    })
  })
})
