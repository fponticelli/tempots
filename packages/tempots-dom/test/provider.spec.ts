import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  WithProvider,
  Provide,
  Use,
  UseMany,
  Provider,
  render,
  runHeadless,
  html,
  prop,
  makeProviderMark,
  Fragment,
  OnDispose,
  ProviderNotFoundError
} from '../src'
import { sleep } from './helper'

describe('Provider', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('WithProvider', () => {
    test('should execute function with provider options', () => {
      const spy = vi.fn()

      const clear = render(
        WithProvider(({ use, set }) => {
          spy(use, set)
          return html.div('test')
        }),
        document.body
      )

      expect(spy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
      expect(document.body.innerHTML).toBe('<div>test</div>')
      clear()
    })

    test('should handle function returning void', () => {
      const spy = vi.fn()

      const clear = render(
        WithProvider(({ use, set }) => {
          spy()
          // Return void
        }),
        document.body
      )

      expect(spy).toHaveBeenCalled()
      expect(document.body.innerHTML).toBe('')
      clear()
    })

    test('should handle function returning null', () => {
      const spy = vi.fn()

      const clear = render(
        WithProvider(({ use, set }) => {
          spy()
          return null
        }),
        document.body
      )

      expect(spy).toHaveBeenCalled()
      expect(document.body.innerHTML).toBe('')
      clear()
    })

    test('should dispose providers when component is disposed', () => {
      const disposeSpy = vi.fn()
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: disposeSpy
        })
      }

      const clear = render(
        WithProvider(({ set }) => {
          set(testProvider)
          return html.div('test')
        }),
        document.body
      )

      clear()
      expect(disposeSpy).toHaveBeenCalled()
    })

    test('should call onUse when provider is used', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        WithProvider(({ use, set }) => {
          set(testProvider)
          const value = use(testProvider)
          return html.div(value)
        }),
        document.body
      )

      expect(onUseSpy).toHaveBeenCalled()
      expect(document.body.innerHTML).toBe('<div>test-value</div>')
      clear()
    })

    test('should create new context with provider', () => {
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined

      const clear = render(
        WithProvider(({ use, set }) => {
          set(testProvider)
          return WithProvider(({ use: innerUse }) => {
            capturedValue = innerUse(testProvider)
            return html.div(capturedValue)
          })
        }),
        document.body
      )

      expect(capturedValue).toBe('test-value')
      expect(document.body.innerHTML).toBe('<div>test-value</div>')
      clear()
    })
  })

  describe('Provide', () => {
    test('should provide value to child components', () => {
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string, { prefix: string }> = {
        mark: testMark,
        create: (options) => ({
          value: `${options?.prefix || ''}test-value`,
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          testProvider,
          { prefix: 'hello-' },
          () => Use(testProvider, value => html.div(value))
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>hello-test-value</div>')
      clear()
    })

    test('should dispose provider when component is disposed', () => {
      const disposeSpy = vi.fn()
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: disposeSpy
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => html.div('test')
        ),
        document.body
      )

      clear()
      expect(disposeSpy).toHaveBeenCalled()
    })

    test('should work with reactive values', async () => {
      const testMark = makeProviderMark<{ count: number }>('CountProvider')

      const testProvider: Provider<{ count: number }> = {
        mark: testMark,
        create: () => {
          const count = prop(0)
          return {
            value: { count: count.value },
            dispose: () => count.dispose()
          }
        }
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => Use(testProvider, value => html.div(`Count: ${value.count}`))
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Count: 0</div>')
      clear()
    })
  })

  describe('Use', () => {
    test('should consume provider value', () => {
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'consumed-value',
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => Use(testProvider, value => html.div(`Used: ${value}`))
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Used: consumed-value</div>')
      clear()
    })

    test('should throw error when provider not found', () => {
      const testMark = makeProviderMark<string>('NonExistentProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {}
        })
      }

      expect(() => {
        render(
          Use(testProvider, value => html.div(value)),
          document.body
        )
      }).toThrow(ProviderNotFoundError)
    })

    test('should work with nested providers', () => {
      const outerMark = makeProviderMark<string>('OuterProvider')
      const innerMark = makeProviderMark<number>('InnerProvider')

      const outerProvider: Provider<string> = {
        mark: outerMark,
        create: () => ({
          value: 'outer',
          dispose: () => {}
        })
      }

      const innerProvider: Provider<number> = {
        mark: innerMark,
        create: () => ({
          value: 42,
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          outerProvider,
          undefined,
          () => Provide(
            innerProvider,
            undefined,
            () => Fragment(
              Use(outerProvider, outer => html.div(`Outer: ${outer}`)),
              Use(innerProvider, inner => html.div(`Inner: ${inner}`))
            )
          )
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Outer: outer</div><div>Inner: 42</div>')
      clear()
    })
  })

  describe('UseMany', () => {
    test('should consume multiple providers', () => {
      const stringMark = makeProviderMark<string>('StringProvider')
      const numberMark = makeProviderMark<number>('NumberProvider')
      const booleanMark = makeProviderMark<boolean>('BooleanProvider')

      const stringProvider: Provider<string> = {
        mark: stringMark,
        create: () => ({
          value: 'hello',
          dispose: () => {}
        })
      }

      const numberProvider: Provider<number> = {
        mark: numberMark,
        create: () => ({
          value: 42,
          dispose: () => {}
        })
      }

      const booleanProvider: Provider<boolean> = {
        mark: booleanMark,
        create: () => ({
          value: true,
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(stringProvider, undefined, () =>
          Provide(numberProvider, undefined, () =>
            Provide(booleanProvider, undefined, () =>
              UseMany(stringProvider, numberProvider, booleanProvider)(
                (str, num, bool) => html.div(`${str}-${num}-${bool}`)
              )
            )
          )
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>hello-42-true</div>')
      clear()
    })

    test('should work with single provider', () => {
      const testMark = makeProviderMark<string>('TestProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'single-value',
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => UseMany(testProvider)(
            (value) => html.div(`Single: ${value}`)
          )
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>Single: single-value</div>')
      clear()
    })

    test('should throw error when any provider not found', () => {
      const existingMark = makeProviderMark<string>('ExistingProvider')
      const missingMark = makeProviderMark<number>('MissingProvider')

      const existingProvider: Provider<string> = {
        mark: existingMark,
        create: () => ({
          value: 'exists',
          dispose: () => {}
        })
      }

      const missingProvider: Provider<number> = {
        mark: missingMark,
        create: () => ({
          value: 42,
          dispose: () => {}
        })
      }

      expect(() => {
        render(
          Provide(
            existingProvider,
            undefined,
            () => UseMany(existingProvider, missingProvider)(
              (str, num) => html.div(`${str}-${num}`)
            )
          ),
          document.body
        )
      }).toThrow(ProviderNotFoundError)
    })
  })

  describe('Provider with options', () => {
    test('should pass options to provider create function', () => {
      const testMark = makeProviderMark<string>('OptionsProvider')
      const createSpy = vi.fn()

      const testProvider: Provider<string, { prefix: string; suffix: string }> = {
        mark: testMark,
        create: (options) => {
          createSpy(options)
          return {
            value: `${options?.prefix || ''}value${options?.suffix || ''}`,
            dispose: () => {}
          }
        }
      }

      const clear = render(
        Provide(
          testProvider,
          { prefix: 'start-', suffix: '-end' },
          () => Use(testProvider, value => html.div(value))
        ),
        document.body
      )

      expect(createSpy).toHaveBeenCalledWith({ prefix: 'start-', suffix: '-end' })
      expect(document.body.innerHTML).toBe('<div>start-value-end</div>')
      clear()
    })

    test('should handle undefined options', () => {
      const testMark = makeProviderMark<string>('UndefinedOptionsProvider')
      const createSpy = vi.fn()

      const testProvider: Provider<string, { optional?: string }> = {
        mark: testMark,
        create: (options) => {
          createSpy(options)
          return {
            value: options?.optional || 'default',
            dispose: () => {}
          }
        }
      }

      const payload = { optional: 'custom' }

      const clear = render(
        Provide(
          testProvider,
          payload,
          () => Use(testProvider, value => html.div(value))
        ),
        document.body
      )

      expect(createSpy).toHaveBeenCalledWith(payload)
      expect(document.body.innerHTML).toBe('<div>default</div>')
      clear()
    })
  })

  describe('Provider in headless environment', () => {
    test('should work with runHeadless', () => {
      const testMark = makeProviderMark<string>('HeadlessProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'headless-value',
          dispose: () => {}
        })
      }

      const { root, clear } = runHeadless(() =>
        Provide(
          testProvider,
          undefined,
          () => Use(testProvider, value => html.div(value))
        )
      )

      expect(root.contentToHTML()).toBe('<div>headless-value</div>')
      clear()
    })

    test('should dispose providers in headless environment', () => {
      const disposeSpy = vi.fn()
      const testMark = makeProviderMark<string>('HeadlessDisposeProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'dispose-test',
          dispose: disposeSpy
        })
      }

      const { clear } = runHeadless(() =>
        Provide(
          testProvider,
          undefined,
          () => html.div('test')
        )
      )

      clear()
      expect(disposeSpy).toHaveBeenCalled()
    })
  })

  describe('Provider lifecycle', () => {
    test('should call onUse multiple times when provider is used multiple times', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('MultiUseProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'multi-use',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => Fragment(
            Use(testProvider, value => html.div(`First: ${value}`)),
            Use(testProvider, value => html.div(`Second: ${value}`)),
            Use(testProvider, value => html.div(`Third: ${value}`))
          )
        ),
        document.body
      )

      expect(onUseSpy).toHaveBeenCalledTimes(3)
      expect(document.body.innerHTML).toBe(
        '<div>First: multi-use</div><div>Second: multi-use</div><div>Third: multi-use</div>'
      )
      clear()
    })

    test('should handle provider without onUse callback', () => {
      const testMark = makeProviderMark<string>('NoOnUseProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'no-onuse',
          dispose: () => {}
          // No onUse callback
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => Use(testProvider, value => html.div(value))
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>no-onuse</div>')
      clear()
    })

    test('should handle complex provider disposal with OnDispose', () => {
      const providerDisposeSpy = vi.fn()
      const componentDisposeSpy = vi.fn()
      const testMark = makeProviderMark<string>('ComplexDisposeProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'complex-dispose',
          dispose: providerDisposeSpy
        })
      }

      const clear = render(
        WithProvider(({ set }) => {
          set(testProvider)
          return Fragment(
            html.div('test'),
            OnDispose(componentDisposeSpy)
          )
        }),
        document.body
      )

      clear()
      expect(providerDisposeSpy).toHaveBeenCalled()
      expect(componentDisposeSpy).toHaveBeenCalled()
    })
  })
})
