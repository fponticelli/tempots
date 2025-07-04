import { describe, it, expect, beforeEach } from 'vitest'
import { AsyncResultView, type AsyncResultViewOptions } from '../src/renderables/async-result-view'
import { AsyncResult, sleep } from '@tempots/std'
import { prop, render, Signal } from '@tempots/dom'

describe('async-result-view.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('AsyncResultView with function options', () => {
    it('should render success state with function options', () => {
      const result = prop(AsyncResult.success('Hello World'))

      const view = AsyncResultView(result, (value: Signal<string>) =>
        value.map(v => `Success: ${v}`)
      )

      const clear = render(view, document.body)
      expect(document.body.textContent).toBe('Success: Hello World')
      clear()
    })

    it('should handle function options by converting to object options', () => {
      const result = prop(AsyncResult.success(42))

      // This tests lines 63-64 where function options are converted to object options
      const view = AsyncResultView(result, (value: Signal<number>) =>
        value.map(v => `Number: ${v}`)
      )

      const clear = render(view, document.body)
      expect(document.body.textContent).toBe('Number: 42')
      clear()
    })
  })

  describe('AsyncResultView with object options', () => {
    it('should render success state', () => {
      const result = prop(AsyncResult.success('test value'))

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Success: test value')
      clear()
    })

    it('should render failure state with custom failure handler', () => {
      const result = prop(AsyncResult.failure('test error'))

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `Custom Error: ${e}`)
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Custom Error: test error')
      clear()
    })

    it('should render failure state with default failure handler', () => {
      const result = prop(AsyncResult.failure('default error'))

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
        // No failure handler provided, should use default
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Error: default error')
      clear()
    })

    it('should render loading state with custom loading handler', () => {
      const result = prop(AsyncResult.loading('previous value'))

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        loading: (previousValue: Signal<string | undefined>) =>
          previousValue.map(prev => `Loading... (prev: ${prev})`)
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Loading... (prev: previous value)')
      clear()
    })

    it('should render loading state with default loading handler', () => {
      const result = prop(AsyncResult.loading())

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
        // No loading handler provided, should use default (Empty)
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('')
      clear()
    })

    it('should render notAsked state with custom notAsked handler', () => {
      const result = prop(AsyncResult.notAsked)

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        notAsked: () => 'Not requested yet'
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Not requested yet')
      clear()
    })

    it('should render notAsked state with default notAsked handler', () => {
      const result = prop(AsyncResult.notAsked)

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
        // No notAsked handler provided, should use default (Empty)
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('')
      clear()
    })
  })

  describe('Dynamic state changes', () => {
    it('should update view when result changes', async () => {
      const result = prop(AsyncResult.notAsked as AsyncResult<string, string>)

      const options: AsyncResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `Error: ${e}`),
        loading: () => 'Loading...',
        notAsked: () => 'Not asked'
      }

      const view = AsyncResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Not asked')

      result.value = AsyncResult.loading()
      await sleep(0) // Allow DOM to update
      expect(document.body.textContent).toBe('Loading...')

      result.value = AsyncResult.success('test')
      await sleep(0) // Allow DOM to update
      expect(document.body.textContent).toBe('Success: test')

      result.value = AsyncResult.failure('error')
      await sleep(0) // Allow DOM to update
      expect(document.body.textContent).toBe('Error: error')

      clear()
    })
  })
})
