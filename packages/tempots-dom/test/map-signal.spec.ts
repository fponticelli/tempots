import { describe, expect, test, beforeEach } from 'vitest'
import { MapSignal, render, html, runHeadless, prop } from '../src'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('MapSignal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('with static values', () => {
    test('should render static value directly', () => {
      const staticValue = 'Hello World'

      const clear = render(
        MapSignal(staticValue, value => html.div(value)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Hello World</div>')
      clear()
    })

    test('should handle static number values', () => {
      const staticValue = 42

      const clear = render(
        MapSignal(staticValue, value => html.span(`Count: ${value}`)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<span>Count: 42</span>')
      clear()
    })

    test('should handle static object values', () => {
      const staticValue = { name: 'John', age: 30 }

      const clear = render(
        MapSignal(staticValue, value => html.div(
          html.h3(value.name),
          html.p(`Age: ${value.age}`)
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div><h3>John</h3><p>Age: 30</p></div>')
      clear()
    })

    test('should handle static array values', () => {
      const staticValue = [1, 2, 3]

      const clear = render(
        MapSignal(staticValue, value => html.ul(
          ...value.map(item => html.li(item.toString()))
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<ul><li>1</li><li>2</li><li>3</li></ul>')
      clear()
    })
  })

  describe('with signals', () => {
    test('should render initial signal value', () => {
      const signal = prop('Initial')

      const clear = render(
        MapSignal(signal, value => html.div(value)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Initial</div><!---->')
      clear()
    })

    test('should update when signal value changes', async () => {
      const signal = prop('First')

      const clear = render(
        MapSignal(signal, value => html.div(value)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>First</div><!---->')

      signal.set('Second')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>Second</div><!---->')

      signal.set('Third')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>Third</div><!---->')

      clear()
    })

    test('should handle complex signal transformations', async () => {
      const signal = prop(1)

      const clear = render(
        MapSignal(signal, value => html.div(
          html.h2(`Number: ${value}`),
          html.p(`Squared: ${value * value}`),
          html.p(`Even: ${value % 2 === 0 ? 'Yes' : 'No'}`)
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe(
        '<div><h2>Number: 1</h2><p>Squared: 1</p><p>Even: No</p></div><!---->'
      )

      signal.set(4)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe(
        '<div><h2>Number: 4</h2><p>Squared: 16</p><p>Even: Yes</p></div><!---->'
      )

      clear()
    })

    test('should handle signal with object values', async () => {
      const signal = prop({ name: 'Alice', score: 100 })

      const clear = render(
        MapSignal(signal, value => html.div(
          html.h3(value.name),
          html.p(`Score: ${value.score}`)
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div><h3>Alice</h3><p>Score: 100</p></div><!---->')

      signal.set({ name: 'Bob', score: 85 })
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div><h3>Bob</h3><p>Score: 85</p></div><!---->')

      clear()
    })

    test('should handle signal with array values', async () => {
      const signal = prop(['apple', 'banana'])

      const clear = render(
        MapSignal(signal, value => html.ul(
          ...value.map(item => html.li(item))
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<ul><li>apple</li><li>banana</li></ul><!---->')

      signal.set(['cherry', 'date', 'elderberry'])
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<ul><li>cherry</li><li>date</li><li>elderberry</li></ul><!---->')

      clear()
    })
  })

  describe('cleanup and disposal', () => {
    test('should clean up signal subscription on disposal', () => {
      const signal = prop('Initial')

      const clear = render(
        MapSignal(signal, value => html.div(value)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Initial</div><!---->')

      // Dispose the component
      clear()
      expect(document.body.innerHTML).toBe('<!---->')

      // Signal changes after disposal should not affect DOM
      signal.set('After disposal')
      expect(document.body.innerHTML).toBe('<!---->')
    })

    test('should clean up properly with removeTree=true', () => {
      const signal = prop('Test')

      const clear = render(
        MapSignal(signal, value => html.div(value)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Test</div><!---->')

      clear()
      expect(document.body.innerHTML).toBe('<!---->')
    })

    test('should clean up properly with removeTree=false', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const signal = prop('Test')

      const clear = render(
        MapSignal(signal, value => html.div(value)),
        container
      )

      expect(container.innerHTML).toBe('<div>Test</div><!---->')

      clear()
      expect(container.innerHTML).toBe('<!---->')
    })

    test('should handle multiple rapid signal changes', async () => {
      const signal = prop(0)

      const clear = render(
        MapSignal(signal, value => html.div(`Count: ${value}`)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Count: 0</div><!---->')

      // Rapid changes - only check the final result since DOM updates are batched
      for (let i = 1; i <= 10; i++) {
        signal.set(i)
      }

      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>Count: 10</div><!---->')

      clear()
    })
  })

  describe('complex scenarios', () => {
    test('should handle nested MapSignal components', async () => {
      const outerSignal = prop('outer')
      const innerSignal = prop('inner')

      const clear = render(
        MapSignal(outerSignal, outerValue => html.div(
          html.h2(outerValue),
          MapSignal(innerSignal, innerValue => html.p(innerValue))
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div><h2>outer</h2><p>inner</p><!----></div><!---->')

      innerSignal.set('updated inner')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div><h2>outer</h2><p>updated inner</p><!----></div><!---->')

      outerSignal.set('updated outer')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div><h2>updated outer</h2><p>updated inner</p><!----></div><!---->')

      clear()
    })

    test('should work in headless environment', async () => {
      const signal = prop('headless test')

      const { root, clear } = runHeadless(() =>
        MapSignal(signal, value => html.div(value))
      )

      expect(root.contentToHTML()).toBe('<div>headless test</div>')

      signal.set('updated headless')
      await waitForUpdate()
      expect(root.contentToHTML()).toBe('<div>updated headless</div>')

      clear()
    })

    test('should handle text node rendering', async () => {
      const signal = prop('plain text')

      const clear = render(
        MapSignal(signal, value => value),
        document.body
      )

      expect(document.body.innerHTML).toBe('plain text<!---->')

      signal.set('updated text')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('updated text<!---->')

      clear()
    })

    test('should handle empty and null values', async () => {
      const signal = prop<string | null>('initial')

      const clear = render(
        MapSignal(signal, value => value ? html.div(value) : html.div('empty')),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>initial</div><!---->')

      signal.set(null)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>empty</div><!---->')

      signal.set('')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>empty</div><!---->')

      signal.set('restored')
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>restored</div><!---->')

      clear()
    })

    test('should handle boolean signal values', async () => {
      const signal = prop(true)

      const clear = render(
        MapSignal(signal, value => html.div(
          html.span(value ? 'ON' : 'OFF'),
          html.button(value ? 'Turn Off' : 'Turn On')
        )),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div><span>ON</span><button>Turn Off</button></div><!---->')

      signal.set(false)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div><span>OFF</span><button>Turn On</button></div><!---->')

      clear()
    })
  })

  describe('edge cases', () => {
    test('should handle undefined values', async () => {
      const signal = prop<string | undefined>('defined')

      const clear = render(
        MapSignal(signal, value => html.div(value || 'undefined')),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>defined</div><!---->')

      signal.set(undefined)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>undefined</div><!---->')

      clear()
    })

    test('should handle zero values', async () => {
      const signal = prop(0)

      const clear = render(
        MapSignal(signal, value => html.div(`Value: ${value}`)),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Value: 0</div><!---->')

      signal.set(42)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>Value: 42</div><!---->')

      signal.set(0)
      await waitForUpdate()
      expect(document.body.innerHTML).toBe('<div>Value: 0</div><!---->')

      clear()
    })
  })
})
