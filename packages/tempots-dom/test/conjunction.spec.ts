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

      console.log('pos0:', { index: 0, counter: pos0.counter, isFirst: pos0.isFirst, isLast: pos0.isLast.value })
      console.log('pos1:', { index: 1, counter: pos1.counter, isFirst: pos1.isFirst, isLast: pos1.isLast.value })
      console.log('pos2:', { index: 2, counter: pos2.counter, isFirst: pos2.isFirst, isLast: pos2.isLast.value })
      console.log('totalSignal.value:', totalSignal.value)

      expect(pos0.isFirst).toBe(true)
      expect(pos0.isLast.value).toBe(false) // counter 1 === total 3? false

      expect(pos1.isFirst).toBe(false)
      expect(pos1.isLast.value).toBe(false) // counter 2 === total 3? false

      expect(pos2.isFirst).toBe(false)
      expect(pos2.isLast.value).toBe(true) // counter 3 === total 3? true
    })

    test('should debug conjunction mapping with actual conjunction logic', () => {
      const totalSignal = prop(3)
      const middlePosition = prop(new ElementPosition(1, totalSignal))

      // Debug what the actual conjunction mapping produces (mimicking the real code)
      const mappedValue = middlePosition.map(v => {
        console.log('Conjunction mapping input:', {
          index: v.index,
          counter: v.counter,
          isFirst: v.isFirst,
          isLast: v.isLast, // This is a Signal<boolean>
          isLastValue: v.isLast.value
        })
        if (v.isFirst) {
          console.log('Returning: first')
          return 'first'
        } else if (v.isLast) { // This is the actual code in conjunction.ts
          console.log('Returning: last (because v.isLast is truthy)')
          return 'last'
        } else {
          console.log('Returning: other')
          return 'other'
        }
      })

      console.log('Mapped value:', mappedValue.value)
      // The actual conjunction code checks v.isLast (a Signal) which is always truthy
      expect(mappedValue.value).toBe('last')
    })

    test('should render different separators for different positions', () => {
      const totalSignal = prop(3)

      // Test first position
      const firstPosition = prop(new ElementPosition(0, totalSignal))
      const clearFirst = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(firstPosition),
        document.body
      )
      expect(document.body.innerHTML).toBe('<span>[FIRST]</span>')
      clearFirst()

      // Test middle position
      const middlePosition = prop(new ElementPosition(1, totalSignal))
      const clearMiddle = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(middlePosition),
        document.body
      )
      expect(document.body.innerHTML).toBe('<span>, </span>')
      clearMiddle()

      // Test last position
      const lastPosition = prop(new ElementPosition(2, totalSignal))
      const clearLast = render(
        Conjunction(
          () => html.span(', '),
          {
            firstSeparator: () => html.span('[FIRST]'),
            lastSeparator: () => html.span('[LAST]')
          }
        )(lastPosition),
        document.body
      )
      expect(document.body.innerHTML).toBe('<span>[LAST]</span>')
      clearLast()
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
