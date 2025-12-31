import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Async, AsyncOptions } from '../src/renderable/async'
import { render, html, attr, runHeadless } from '../src'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 10))

// Helper function to create a delayed promise
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to create a promise that resolves with a value
const resolvedPromise = <T>(value: T, delayMs = 0): Promise<T> =>
  delayMs > 0 ? delay(delayMs).then(() => value) : Promise.resolve(value)

// Helper function to create a promise that rejects with an error
const rejectedPromise = <T = never>(error: unknown, delayMs = 0): Promise<T> =>
  delayMs > 0 ? delay(delayMs).then(() => Promise.reject(error)) : Promise.reject(error)

describe('Async Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    test('should render resolved promise with function options', async () => {
      const promise = resolvedPromise('Hello World')

      const clear = render(
        html.div(
          Async(promise, value => `Result: ${value}`)
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Result: Hello World')
      clear()
    })

    test('should render resolved promise with object options', async () => {
      const promise = resolvedPromise('Success')

      const clear = render(
        html.div(
          Async(promise, {
            then: value => `Success: ${value}`
          })
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Success: Success')
      clear()
    })

    test('should render pending state before resolution', async () => {
      const promise = resolvedPromise('Final Result', 50)

      const clear = render(
        html.div(
          Async(promise, {
            pending: () => 'Loading...',
            then: value => `Result: ${value}`
          })
        ),
        document.body
      )

      // Check pending state immediately
      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Loading...')

      // Wait for resolution
      await waitForUpdate()
      await delay(60)

      expect(div.textContent).toBe('Result: Final Result')
      clear()
    })

    test('should render error state on rejection', async () => {
      const promise = rejectedPromise(new Error('Something went wrong'))

      const clear = render(
        html.div(
          Async(promise, {
            then: value => `Success: ${value}`,
            error: error => `Error: ${(error as Error).message}`
          })
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Error: Something went wrong')
      clear()
    })

    test('should handle rejection without error handler', async () => {
      const promise = rejectedPromise(new Error('Unhandled error'))

      const clear = render(
        html.div(
          Async(promise, {
            then: value => `Success: ${value}`
          })
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      // Should render empty when no error handler is provided
      expect(div.textContent).toBe('')
      clear()
    })
  })

  describe('complex scenarios', () => {
    test('should handle promise that resolves with complex data', async () => {
      const complexData = { id: 1, name: 'John', items: ['a', 'b', 'c'] }
      const promise = resolvedPromise(complexData)

      const clear = render(
        html.div(
          Async(promise, data =>
            html.div(
              html.h2(data.name),
              html.p(`ID: ${data.id}`),
              html.ul(
                ...data.items.map(item => html.li(item))
              )
            )
          )
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.querySelector('h2')!.textContent).toBe('John')
      expect(div.querySelector('p')!.textContent).toBe('ID: 1')
      expect(div.querySelectorAll('li')).toHaveLength(3)
      expect(div.querySelector('li')!.textContent).toBe('a')
      clear()
    })

    test('should handle multiple async components', async () => {
      vi.useFakeTimers()
      try {
        const promise1 = resolvedPromise('First', 20)
        const promise2 = resolvedPromise('Second', 40)

        const clear = render(
          html.div(
            html.div(
              attr.id('first'),
              Async(promise1, value => `First: ${value}`)
            ),
            html.div(
              attr.id('second'),
              Async(promise2, value => `Second: ${value}`)
            )
          ),
          document.body
        )

        await vi.advanceTimersByTimeAsync(30)

        const firstDiv = document.getElementById('first')!
        const secondDiv = document.getElementById('second')!

        expect(firstDiv.textContent).toBe('First: First')
        expect(secondDiv.textContent).toBe('') // Still pending

        await vi.advanceTimersByTimeAsync(20)

        expect(secondDiv.textContent).toBe('Second: Second')
        clear()
      } finally {
        vi.useRealTimers()
      }
    })

    test('should handle promise with null/undefined values', async () => {
      const nullPromise = resolvedPromise(null)
      const undefinedPromise = resolvedPromise(undefined)

      // Create separate containers
      const container1 = document.createElement('div')
      const container2 = document.createElement('div')
      document.body.appendChild(container1)
      document.body.appendChild(container2)

      const clear1 = render(
        html.div(
          Async(nullPromise, value => `Value: ${value}`)
        ),
        container1
      )

      const clear2 = render(
        html.div(
          Async(undefinedPromise, value => `Value: ${value}`)
        ),
        container2
      )

      await waitForUpdate()

      expect(container1.textContent).toBe('Value: null')
      expect(container2.textContent).toBe('Value: undefined')

      clear1()
      clear2()
      container1.remove()
      container2.remove()
    })

    test('should handle different error types', async () => {
      const stringError = rejectedPromise('String error')
      const objectError = rejectedPromise({ message: 'Object error', code: 500 })
      const numberError = rejectedPromise(404)

      // Add error handlers to prevent unhandled rejections
      stringError.catch(() => {})
      objectError.catch(() => {})
      numberError.catch(() => {})

      // Create separate containers
      const container1 = document.createElement('div')
      const container2 = document.createElement('div')
      const container3 = document.createElement('div')
      document.body.appendChild(container1)
      document.body.appendChild(container2)
      document.body.appendChild(container3)

      const clear1 = render(
        html.div(
          Async(stringError, {
            then: value => `Success: ${value}`,
            error: error => `Error: ${error}`
          })
        ),
        container1
      )

      const clear2 = render(
        html.div(
          Async(objectError, {
            then: value => `Success: ${value}`,
            error: error => `Error: ${(error as any).message} (${(error as any).code})`
          })
        ),
        container2
      )

      const clear3 = render(
        html.div(
          Async(numberError, {
            then: value => `Success: ${value}`,
            error: error => `Error code: ${error}`
          })
        ),
        container3
      )

      await waitForUpdate()

      expect(container1.textContent).toBe('Error: String error')
      expect(container2.textContent).toBe('Error: Object error (500)')
      expect(container3.textContent).toBe('Error code: 404')

      clear1()
      clear2()
      clear3()
      container1.remove()
      container2.remove()
      container3.remove()
    })
  })

  describe('lifecycle and cleanup', () => {
    test('should cleanup properly when component is removed', async () => {
      const promise = resolvedPromise('Test Value', 100)

      const clear = render(
        html.div(
          Async(promise, {
            pending: () => 'Loading...',
            then: value => `Result: ${value}`
          })
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Loading...')

      // Remove component before promise resolves
      clear()

      // Wait for promise resolution time
      await delay(120)

      // Component should be removed and not cause any issues
      expect(document.querySelector('div')).toBe(null)
    })

    test('should handle rapid cleanup and recreation', async () => {
      for (let i = 0; i < 5; i++) {
        const promise = resolvedPromise(`Value ${i}`, 10)

        const clear = render(
          html.div(
            Async(promise, value => `Result: ${value}`)
          ),
          document.body
        )

        await delay(5) // Cleanup before resolution
        clear()
      }

      // Should not cause any errors or memory leaks
      expect(document.body.children.length).toBe(0)
    })
  })

  describe('headless environment', () => {
    test('should work in headless mode with resolved promise', async () => {
      const promise = resolvedPromise('Headless Result')

      const { root, clear } = runHeadless(() =>
        html.div(
          Async(promise, value => `Result: ${value}`)
        )
      )

      await waitForUpdate()

      expect(root.contentToHTML()).toContain('Result: Headless Result')
      clear()
    })

    test('should work in headless mode with pending state', async () => {
      const promise = resolvedPromise('Final', 50)

      const { root, clear } = runHeadless(() =>
        html.div(
          Async(promise, {
            pending: () => 'Loading in headless...',
            then: value => `Result: ${value}`
          })
        )
      )

      expect(root.contentToHTML()).toContain('Loading in headless...')

      await delay(60)

      expect(root.contentToHTML()).toContain('Result: Final')
      clear()
    })

    test('should work in headless mode with error state', async () => {
      const promise = rejectedPromise(new Error('Headless error'))

      const { root, clear } = runHeadless(() =>
        html.div(
          Async(promise, {
            then: value => `Success: ${value}`,
            error: error => `Error: ${(error as Error).message}`
          })
        )
      )

      await waitForUpdate()

      expect(root.contentToHTML()).toContain('Error: Headless error')
      clear()
    })
  })

  describe('edge cases', () => {
    test('should handle already resolved promise', async () => {
      const promise = Promise.resolve('Already resolved')

      const clear = render(
        html.div(
          Async(promise, value => `Result: ${value}`)
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Result: Already resolved')
      clear()
    })

    test('should handle already rejected promise', async () => {
      const promise = Promise.reject(new Error('Already rejected'))

      const clear = render(
        html.div(
          Async(promise, {
            then: value => `Success: ${value}`,
            error: error => `Error: ${(error as Error).message}`
          })
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Error: Already rejected')
      clear()
    })

    test('should handle empty pending function', async () => {
      const promise = resolvedPromise('Test', 30)

      const clear = render(
        html.div(
          Async(promise, {
            pending: () => '', // Empty pending
            then: value => `Result: ${value}`
          })
        ),
        document.body
      )

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('')

      await delay(40)

      expect(div.textContent).toBe('Result: Test')
      clear()
    })

    test('should handle function options shorthand', async () => {
      const promise = resolvedPromise('Shorthand')

      const clear = render(
        html.div(
          Async(promise, value => `Shorthand: ${value}`)
        ),
        document.body
      )

      await waitForUpdate()

      const div = document.querySelector('div')!
      expect(div.textContent).toBe('Shorthand: Shorthand')
      clear()
    })
  })
})
