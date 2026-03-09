import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  WithProvider,
  Provide,
  Use,
  UseMany,
  UseOptional,
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

      const clear = render(
        Provide(
          testProvider,
          undefined as unknown as { optional?: string },
          () => Use(testProvider, value => html.div(value))
        ),
        document.body
      )

      expect(createSpy).toHaveBeenCalledWith(undefined)
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

  describe('UseOptional', () => {
    test('should return undefined when provider is not found (no fallback)', () => {
      const testMark = makeProviderMark<string>('MissingProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined = 'initial'

      const clear = render(
        UseOptional(testProvider, value => {
          capturedValue = value
          return html.div(value ?? 'not-provided')
        }),
        document.body
      )

      expect(capturedValue).toBeUndefined()
      expect(document.body.innerHTML).toBe('<div>not-provided</div>')
      clear()
    })

    test('should return provider value when provider is available (no fallback)', () => {
      const testMark = makeProviderMark<string>('AvailableProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'available-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => UseOptional(testProvider, value => {
            capturedValue = value
            return html.div(value ?? 'not-provided')
          })
        ),
        document.body
      )

      expect(capturedValue).toBe('available-value')
      expect(document.body.innerHTML).toBe('<div>available-value</div>')
      clear()
    })

    test('should use fallback when provider is not found', () => {
      const testMark = makeProviderMark<string>('MissingWithFallback')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined

      const clear = render(
        UseOptional(testProvider, 'fallback-value', value => {
          capturedValue = value
          return html.div(value)
        }),
        document.body
      )

      expect(capturedValue).toBe('fallback-value')
      expect(document.body.innerHTML).toBe('<div>fallback-value</div>')
      clear()
    })

    test('should use provider value instead of fallback when provider is available', () => {
      const testMark = makeProviderMark<string>('AvailableWithFallback')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'real-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => UseOptional(testProvider, 'fallback-value', value => {
            capturedValue = value
            return html.div(value)
          })
        ),
        document.body
      )

      expect(capturedValue).toBe('real-value')
      expect(document.body.innerHTML).toBe('<div>real-value</div>')
      clear()
    })

    test('should not throw when provider is missing (unlike Use)', () => {
      const testMark = makeProviderMark<string>('SafeProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {}
        })
      }

      // Use throws
      expect(() => {
        render(
          Use(testProvider, value => html.div(value)),
          document.body
        )
      }).toThrow(ProviderNotFoundError)

      document.body.innerHTML = ''

      // UseOptional does not throw
      const clear = render(
        UseOptional(testProvider, value => html.div(value ?? 'safe')),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>safe</div>')
      clear()
    })

    test('should call onUse when provider is found', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('OnUseOptional')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'on-use-value',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        Provide(
          testProvider,
          undefined,
          () => UseOptional(testProvider, value => html.div(value ?? 'missing'))
        ),
        document.body
      )

      expect(onUseSpy).toHaveBeenCalledTimes(1)
      expect(document.body.innerHTML).toBe('<div>on-use-value</div>')
      clear()
    })

    test('should not call onUse when provider is not found', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('NoOnUseOptional')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'test-value',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        UseOptional(testProvider, value => html.div(value ?? 'missing')),
        document.body
      )

      expect(onUseSpy).not.toHaveBeenCalled()
      expect(document.body.innerHTML).toBe('<div>missing</div>')
      clear()
    })

    test('should work with nested providers where inner is optional', () => {
      const outerMark = makeProviderMark<string>('OuterRequired')
      const innerMark = makeProviderMark<number>('InnerOptional')

      const outerProvider: Provider<string> = {
        mark: outerMark,
        create: () => ({
          value: 'outer-value',
          dispose: () => {}
        })
      }

      const innerProvider: Provider<number> = {
        mark: innerMark,
        create: () => ({
          value: 99,
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          outerProvider,
          undefined,
          () => Fragment(
            Use(outerProvider, outer => html.div(`Outer: ${outer}`)),
            UseOptional(innerProvider, inner =>
              html.div(`Inner: ${inner ?? 'none'}`)
            )
          )
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe(
        '<div>Outer: outer-value</div><div>Inner: none</div>'
      )
      clear()
    })

    test('should work with fallback of complex type', () => {
      type Config = { theme: string; debug: boolean }
      const configMark = makeProviderMark<Config>('ConfigProvider')

      const configProvider: Provider<Config> = {
        mark: configMark,
        create: () => ({
          value: { theme: 'dark', debug: true },
          dispose: () => {}
        })
      }

      const defaultConfig: Config = { theme: 'light', debug: false }

      let capturedConfig: Config | undefined

      const clear = render(
        UseOptional(configProvider, defaultConfig, config => {
          capturedConfig = config
          return html.div(`${config.theme}-${config.debug}`)
        }),
        document.body
      )

      expect(capturedConfig).toEqual(defaultConfig)
      expect(document.body.innerHTML).toBe('<div>light-false</div>')
      clear()
    })

    test('should work in headless environment', () => {
      const testMark = makeProviderMark<string>('HeadlessOptional')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'headless-value',
          dispose: () => {}
        })
      }

      // Without provider
      const { root: root1, clear: clear1 } = runHeadless(() =>
        UseOptional(testProvider, value => html.div(value ?? 'missing'))
      )
      expect(root1.contentToHTML()).toBe('<div>missing</div>')
      clear1()

      // With provider
      const { root: root2, clear: clear2 } = runHeadless(() =>
        Provide(
          testProvider,
          undefined,
          () => UseOptional(testProvider, value => html.div(value ?? 'missing'))
        )
      )
      expect(root2.contentToHTML()).toBe('<div>headless-value</div>')
      clear2()
    })

    test('should work with headless environment and fallback', () => {
      const testMark = makeProviderMark<string>('HeadlessFallback')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'headless-value',
          dispose: () => {}
        })
      }

      const { root, clear } = runHeadless(() =>
        UseOptional(testProvider, 'default', value => html.div(value))
      )
      expect(root.contentToHTML()).toBe('<div>default</div>')
      clear()
    })

    test('should work with tryUse in WithProvider', () => {
      const testMark = makeProviderMark<string>('TryUseProvider')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'try-use-value',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined = 'initial'

      // tryUse without provider set
      const clear1 = render(
        WithProvider(({ tryUse }) => {
          capturedValue = tryUse(testProvider)
          return html.div(capturedValue ?? 'not-found')
        }),
        document.body
      )

      expect(capturedValue).toBeUndefined()
      expect(document.body.innerHTML).toBe('<div>not-found</div>')
      clear1()

      document.body.innerHTML = ''

      // tryUse with provider set
      const clear2 = render(
        WithProvider(({ set, tryUse }) => {
          set(testProvider)
          capturedValue = tryUse(testProvider)
          return html.div(capturedValue ?? 'not-found')
        }),
        document.body
      )

      expect(capturedValue).toBe('try-use-value')
      expect(document.body.innerHTML).toBe('<div>try-use-value</div>')
      clear2()
    })

    test('should work with provider override (inner overrides outer)', () => {
      const testMark = makeProviderMark<string>('OverrideProvider')

      const outerProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'outer',
          dispose: () => {}
        })
      }

      const innerProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'inner',
          dispose: () => {}
        })
      }

      let capturedValue: string | undefined

      const clear = render(
        Provide(
          outerProvider,
          undefined,
          () => Provide(
            innerProvider,
            undefined,
            () => UseOptional({ mark: testMark, create: () => ({ value: '', dispose: () => {} }) }, value => {
              capturedValue = value
              return html.div(value ?? 'missing')
            })
          )
        ),
        document.body
      )

      expect(capturedValue).toBe('inner')
      expect(document.body.innerHTML).toBe('<div>inner</div>')
      clear()
    })

    test('should handle null fallback correctly', () => {
      const testMark = makeProviderMark<string | null>('NullFallbackProvider')

      const testProvider: Provider<string | null> = {
        mark: testMark,
        create: () => ({
          value: 'non-null',
          dispose: () => {}
        })
      }

      let capturedValue: string | null | undefined = 'initial'

      const clear = render(
        UseOptional(testProvider, null, value => {
          capturedValue = value
          return html.div(String(value))
        }),
        document.body
      )

      expect(capturedValue).toBeNull()
      expect(document.body.innerHTML).toBe('<div>null</div>')
      clear()
    })
  })

  describe('tryUse in WithProvider', () => {
    test('should call onUse when tryUse finds provider', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('TryUseOnUse')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'value',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        WithProvider(({ set, tryUse }) => {
          set(testProvider)
          tryUse(testProvider)
          return html.div('test')
        }),
        document.body
      )

      expect(onUseSpy).toHaveBeenCalledTimes(1)
      clear()
    })

    test('should not call onUse when tryUse does not find provider', () => {
      const onUseSpy = vi.fn()
      const testMark = makeProviderMark<string>('TryUseNoOnUse')

      const testProvider: Provider<string> = {
        mark: testMark,
        create: () => ({
          value: 'value',
          dispose: () => {},
          onUse: onUseSpy
        })
      }

      const clear = render(
        WithProvider(({ tryUse }) => {
          tryUse(testProvider)
          return html.div('test')
        }),
        document.body
      )

      expect(onUseSpy).not.toHaveBeenCalled()
      clear()
    })

    test('should allow mixing use and tryUse', () => {
      const requiredMark = makeProviderMark<string>('Required')
      const optionalMark = makeProviderMark<number>('Optional')

      const requiredProvider: Provider<string> = {
        mark: requiredMark,
        create: () => ({
          value: 'required-value',
          dispose: () => {}
        })
      }

      const optionalProvider: Provider<number> = {
        mark: optionalMark,
        create: () => ({
          value: 42,
          dispose: () => {}
        })
      }

      const clear = render(
        Provide(
          requiredProvider,
          undefined,
          () => WithProvider(({ use, tryUse }) => {
            const req = use(requiredProvider)
            const opt = tryUse(optionalProvider)
            return html.div(`${req}-${opt ?? 'none'}`)
          })
        ),
        document.body
      )

      expect(document.body.innerHTML).toBe('<div>required-value-none</div>')
      clear()
    })
  })
})
