import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ResultView, type ResultViewOptions } from '../src/renderables/result-view'
import { Result } from '@tempots/std'
import { prop, render, Signal } from '@tempots/dom'
import { sleep } from '@tempots/std'

describe('result-view.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('ResultView with function options', () => {
    it('should render success state with function options', () => {
      const result = prop(Result.success('Hello World'))

      const view = ResultView(result, (value: Signal<string>) =>
        value.map(v => `Success: ${v}`)
      )

      const clear = render(view, document.body)
      expect(document.body.textContent).toBe('Success: Hello World')
      clear()
    })

    it('should handle function options by converting to object options', () => {
      const result = prop(Result.success(42))

      // This tests lines 48-49 where function options are converted to object options
      const view = ResultView(result, (value: Signal<number>) =>
        value.map(v => `Number: ${v}`)
      )

      const clear = render(view, document.body)
      expect(document.body.textContent).toBe('Number: 42')
      clear()
    })
  })

  describe('ResultView with object options', () => {
    it('should render success state', () => {
      const result = prop(Result.success('test value'))

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Success: test value')
      clear()
    })

    it('should render failure state with custom failure handler', () => {
      const result = prop(Result.failure('test error'))

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `Custom Error: ${e}`)
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Custom Error: test error')
      clear()
    })

    it('should render failure state with default failure handler', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = prop(Result.failure('default error'))

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
        // No failure handler provided, should use default
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Error: default error')

      clear()
      consoleSpy.mockRestore()
    })

    it('should log errors to console with default failure handler', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = prop(Result.failure('console error'))

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`)
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      // Wait a moment for the OnDispose to set up the error logging
      await sleep(10)

      expect(consoleSpy).toHaveBeenCalledWith('console error', undefined)

      clear()
      consoleSpy.mockRestore()
    })
  })

  describe('Dynamic state changes', () => {
    it('should update view when result changes', async () => {
      const result = prop(Result.success('initial') as Result<string, string>)

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `Error: ${e}`)
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      expect(document.body.textContent).toBe('Success: initial')

      result.value = Result.failure('error occurred')
      await sleep(0) // Allow DOM to update
      expect(document.body.textContent).toBe('Error: error occurred')

      result.value = Result.success('updated')
      await sleep(0) // Allow DOM to update
      expect(document.body.textContent).toBe('Success: updated')

      clear()
    })
  })

  describe('Type safety and edge cases', () => {
    it('should work with different value types', () => {
      const numberResult = prop(Result.success(123))
      const booleanResult = prop(Result.success(true))
      const objectResult = prop(Result.success({ name: 'test' }))

      const numberView = ResultView(numberResult, (value: Signal<number>) =>
        value.map(v => `Number: ${v}`)
      )

      const booleanView = ResultView(booleanResult, (value: Signal<boolean>) =>
        value.map(v => `Boolean: ${v}`)
      )

      const objectView = ResultView(objectResult, (value: Signal<{ name: string }>) =>
        value.map(v => `Object: ${v.name}`)
      )

      const clear1 = render(numberView, document.body)
      expect(document.body.textContent).toBe('Number: 123')
      clear1()

      document.body.innerHTML = ''
      const clear2 = render(booleanView, document.body)
      expect(document.body.textContent).toBe('Boolean: true')
      clear2()

      document.body.innerHTML = ''
      const clear3 = render(objectView, document.body)
      expect(document.body.textContent).toBe('Object: test')
      clear3()
    })

    it('should work with different error types', () => {
      const stringErrorResult = prop(Result.failure('string error'))
      const numberErrorResult = prop(Result.failure(404))
      const objectErrorResult = prop(Result.failure({ code: 500, message: 'Server error' }))

      const stringErrorView = ResultView(stringErrorResult, {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `String Error: ${e}`)
      })

      const numberErrorView = ResultView(numberErrorResult, {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<number>) => error.map(e => `Number Error: ${e}`)
      })

      const objectErrorView = ResultView(objectErrorResult, {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<{ code: number; message: string }>) =>
          error.map(e => `Object Error: ${e.code} - ${e.message}`)
      })

      const clear1 = render(stringErrorView, document.body)
      expect(document.body.textContent).toBe('String Error: string error')
      clear1()

      document.body.innerHTML = ''
      const clear2 = render(numberErrorView, document.body)
      expect(document.body.textContent).toBe('Number Error: 404')
      clear2()

      document.body.innerHTML = ''
      const clear3 = render(objectErrorView, document.body)
      expect(document.body.textContent).toBe('Object Error: 500 - Server error')
      clear3()
    })

    it('should handle complex nested results', () => {
      const nestedResult = prop(Result.success(Result.success('nested value')))

      const view = ResultView(nestedResult, (value: Signal<Result<string, string>>) =>
        value.map(innerResult =>
          Result.isSuccess(innerResult)
            ? `Nested Success: ${innerResult.value}`
            : `Nested Failure: ${innerResult.error}`
        )
      )

      const clear = render(view, document.body)
      expect(document.body.textContent).toBe('Nested Success: nested value')
      clear()
    })

    it('should handle rapid result changes', async () => {
      const result = prop(Result.success('initial') as Result<string, string>)

      const options: ResultViewOptions<string, string> = {
        success: (value: Signal<string>) => value.map(v => `Success: ${v}`),
        failure: (error: Signal<string>) => error.map(e => `Error: ${e}`)
      }

      const view = ResultView(result, options)
      const clear = render(view, document.body)

      // Rapidly change the result
      result.value = Result.failure('error1')
      result.value = Result.success('success1')
      result.value = Result.failure('error2')
      result.value = Result.success('final')

      await sleep(10)

      expect(document.body.textContent).toBe('Success: final')

      clear()
    })
  })
})
