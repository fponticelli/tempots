import { describe, expect, test, beforeEach, vi } from 'vitest'
import { Task, render, html, runHeadless } from '../src'
import { sleep } from './helper'

describe('Task', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    test('should render pending state initially', () => {
      const task = () => new Promise<string>(resolve => {
        setTimeout(() => resolve('success'), 100)
      })

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')
      clear()
    })

    test('should render success state after promise resolves', async () => {
      const task = () => Promise.resolve('success')

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Result: success</div><!---->')
      clear()
    })

    test('should render error state after promise rejects', async () => {
      const task = () => Promise.reject(new Error('Task failed'))

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`),
          error: (error) => html.div(`Error: ${(error as Error).message}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Error: Task failed</div><!---->')
      clear()
    })

    test('should handle function shorthand for then option', async () => {
      const task = () => Promise.resolve('success')

      const clear = render(
        Task(task, (value) => html.div(`Result: ${value}`)),
        document.body
      )

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Result: success</div><!---->')
      clear()
    })

    test('should handle task without pending option', async () => {
      const task = () => Promise.resolve('success')

      const clear = render(
        Task(task, {
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      // Should render empty initially
      expect(document.body.innerHTML).toBe('<!---->')

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Result: success</div><!---->')
      clear()
    })

    test('should handle task without error option', async () => {
      const task = () => Promise.reject(new Error('Task failed'))

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      await sleep(10)
      // Should render empty on error when no error handler
      expect(document.body.innerHTML).toBe('<!---->')
      clear()
    })
  })

  describe('lifecycle and cleanup', () => {
    test('should not update after component is disposed', async () => {
      let resolveTask: (value: string) => void
      const task = () => new Promise<string>(resolve => {
        resolveTask = resolve
      })

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      // Dispose the component before the task resolves
      clear()
      expect(document.body.innerHTML).toBe('')

      // Resolve the task after disposal
      resolveTask!('success')
      await sleep(10)

      // Should remain empty since component was disposed
      expect(document.body.innerHTML).toBe('')
    })

    test('should not update after component is disposed (error case)', async () => {
      let rejectTask: (error: Error) => void
      const task = () => new Promise<string>((resolve, reject) => {
        rejectTask = reject
      })

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`),
          error: (error) => html.div(`Error: ${(error as Error).message}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      // Dispose the component before the task rejects
      clear()
      expect(document.body.innerHTML).toBe('')

      // Reject the task after disposal
      rejectTask!(new Error('Task failed'))
      await sleep(10)

      // Should remain empty since component was disposed
      expect(document.body.innerHTML).toBe('')
    })

    test('should clean up properly with removeTree=true', async () => {
      const task = () => Promise.resolve('success')

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        document.body
      )

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Result: success</div><!---->')

      clear()
      expect(document.body.innerHTML).toBe('')
    })

    test('should clean up properly with removeTree=false', async () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const task = () => Promise.resolve('success')

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        }),
        container
      )

      await sleep(10)
      expect(container.innerHTML).toBe('<div>Result: success</div><!---->')

      // Clear with removeTree=false should still clean up
      clear()
      expect(container.innerHTML).toBe('')
    })
  })

  describe('complex scenarios', () => {
    test('should handle multiple state transitions', async () => {
      let resolveTask: (value: string) => void
      const task = () => new Promise<string>(resolve => {
        resolveTask = resolve
      })

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`),
          error: (error) => html.div(`Error: ${(error as Error).message}`)
        }),
        document.body
      )

      // Initial pending state
      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      // Resolve the task
      resolveTask!('success')
      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Result: success</div><!---->')

      clear()
    })

    test('should handle task with complex return values', async () => {
      const task = () => Promise.resolve({ id: 1, name: 'Test', items: [1, 2, 3] })

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (data) => html.div(
            html.h3(data.name),
            html.p(`ID: ${data.id}`),
            html.ul(...data.items.map(item => html.li(item.toString())))
          )
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      await sleep(10)
      expect(document.body.innerHTML).toBe(
        '<div><h3>Test</h3><p>ID: 1</p><ul><li>1</li><li>2</li><li>3</li></ul></div><!---->'
      )
      clear()
    })

    test('should work in headless environment', async () => {
      const task = () => Promise.resolve('headless success')

      const { root, clear } = runHeadless(() =>
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`)
        })
      )

      expect(root.contentToHTML()).toBe('<div>Loading...</div>')

      await sleep(10)
      expect(root.contentToHTML()).toBe('<div>Result: headless success</div>')
      clear()
    })

    test('should handle error with non-Error objects', async () => {
      const task = () => Promise.reject('String error')

      const clear = render(
        Task(task, {
          pending: () => html.div('Loading...'),
          then: (value) => html.div(`Result: ${value}`),
          error: (error) => html.div(`Error: ${String(error)}`)
        }),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Loading...</div><!---->')

      await sleep(10)
      expect(document.body.innerHTML).toBe('<div>Error: String error</div><!---->')
      clear()
    })
  })
})
