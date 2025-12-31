import { DOMContext } from '../dom/dom-context'
import { Clear, ProviderMark, Renderable, TNode } from '../types/domain'
import { renderableOfTNode } from './element'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { domRenderable } from '../types/domain'

/**
 * Converts an array of `Provider` types `T` into an array of their corresponding types.
 * @public
 */
export type ToProviderTypes<T extends unknown[]> = T extends []
  ? []
  : T extends [Provider<infer K>]
    ? [K]
    : T extends [Provider<infer K>, ...infer R]
      ? [K, ...ToProviderTypes<R>]
      : never

/**
 * Represents a provider for a specific type `T`.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider<T, O = any> = {
  /** The provider mark. */
  mark: ProviderMark<T>
  /** The function to create the provider. */
  create: (
    options: O | undefined,
    ctx: DOMContext
  ) => {
    value: T
    dispose: () => void
    onUse?: () => void
  }
}

/**
 * Represents an object with provider options.
 * @public
 */
export type ProviderOptions = {
  /** The function to use a provider. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: <T, O = any>(provider: Provider<T, O>) => T
  /** The function to set a provider. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: <T, O = any>(provider: Provider<T, O>, options?: O) => void
}

/**
 * Returns a renderable object that executes the given function with the
 * current DOMContext as argument.
 * The given function can return a TNode or void. If you need to perform some
 * actions when the Renderable is disposed, you can use `OnDispose` as the
 * return value.
 *
 * @param fn - The function to be executed with the DOMContext argument.
 * @returns A Clear function that can be used to clean up any resources associated with the execution.
 * @public
 */
export const WithProvider = (
  fn: (opts: ProviderOptions) => TNode | void
): Renderable =>
  domRenderable((ctx: DOMContext): Clear => {
    let newCtx = ctx
    function getCtx() {
      return newCtx
    }
    function setCtx(ctx: DOMContext) {
      newCtx = ctx
    }
    const disposers: (() => void)[] = []
    const result = fn({
      use: ({ mark }) => {
        const { value, onUse } = getCtx().getProvider(mark)
        onUse?.()
        return value
      },
      set: ({ mark, create }, options) => {
        const { value, dispose, onUse } = create(options, getCtx())
        disposers.push(dispose)
        setCtx(getCtx().setProvider(mark, value, onUse))
      },
    })
    if (result == null) {
      return () => {}
    }
    return Fragment(
      renderableOfTNode(result),
      OnDispose(() => disposers.forEach(fn => fn()))
    ).render(getCtx())
  })

/**
 * Makes a provider available to all child components in the component tree.
 *
 * This function creates a provider context that child components can access using `Use`.
 * The provider is automatically disposed when the component is unmounted.
 *
 * @example
 * ```typescript
 * // Create a theme provider
 * const ThemeProvider: Provider<Signal<string>> = {
 *   mark: makeProviderMark<Signal<string>>('Theme'),
 *   create: () => {
 *     const theme = prop('light')
 *     return {
 *       value: theme,
 *       dispose: () => theme.dispose()
 *     }
 *   }
 * }
 *
 * // Provide the theme to child components
 * const App = () =>
 *   Provide(
 *     ThemeProvider,
 *     {}, // options
 *     () => html.div(
 *       html.h1('My App'),
 *       ThemeToggle(), // Can access the theme
 *       MainContent()  // Can also access the theme
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // Provider with options
 * const ConfigProvider: Provider<Config, { apiUrl: string }> = {
 *   mark: makeProviderMark<Config>('Config'),
 *   create: (options) => {
 *     const config = new Config(options.apiUrl)
 *     return {
 *       value: config,
 *       dispose: () => config.cleanup()
 *     }
 *   }
 * }
 *
 * // Provide with specific options
 * Provide(
 *   ConfigProvider,
 *   { apiUrl: 'https://api.example.com' },
 *   () => AppContent()
 * )
 * ```
 *
 * @typeParam T - The type of value provided by the provider
 * @typeParam O - The type of options passed to the provider
 * @param provider - The provider definition containing mark and create function
 * @param options - Options to pass to the provider's create function
 * @param child - Function that returns the child components that can access the provider
 * @returns A renderable that provides the value to its children
 * @public
 */
export const Provide = <T, O>(
  provider: Provider<T, O>,
  options: O,
  child: () => TNode
): Renderable =>
  WithProvider(({ set }) => {
    set(provider, options)
    return child()
  })

/**
 * Consumes a provider value and makes it available to a child component.
 *
 * This function looks up a provider in the component tree and passes its value
 * to the child function. The provider must have been made available by a parent
 * component using `Provide`.
 *
 * @example
 * ```typescript
 * // Use a theme provider
 * const ThemeToggle = () =>
 *   Use(
 *     ThemeProvider,
 *     (theme) => html.button(
 *       on.click(() => {
 *         theme.value = theme.value === 'light' ? 'dark' : 'light'
 *       }),
 *       'Current theme: ', theme
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // Use multiple properties from a provider
 * const UserProfile = () =>
 *   Use(
 *     UserProvider,
 *     (user) => html.div(
 *       html.h2('Welcome, ', user.map(u => u.name)),
 *       html.p('Email: ', user.map(u => u.email)),
 *       html.p('Role: ', user.map(u => u.role))
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // Use provider in conditional rendering
 * const ConditionalContent = () =>
 *   Use(
 *     AuthProvider,
 *     (auth) => auth.map(a => a.isLoggedIn)
 *       ? html.div('Welcome back!')
 *       : html.div('Please log in')
 *   )
 * ```
 *
 * @typeParam T - The type of value provided by the provider
 * @param provider - The provider to consume (must be available in parent components)
 * @param child - Function that receives the provider value and returns content to render
 * @returns A renderable that consumes the provider and renders the child content
 * @throws {ProviderNotFoundError} When the provider is not found in the component tree
 * @public
 */
export const Use = <T>(
  provider: Provider<T>,
  child: (provider: T) => TNode
): Renderable => WithProvider(({ use }) => child(use(provider)))

/**
 * Consumes multiple providers and makes their values available to a child component.
 *
 * This function is a convenience wrapper for consuming multiple providers at once.
 * It's equivalent to nesting multiple `Use` calls but provides a cleaner API when
 * you need access to several providers simultaneously.
 *
 * @example
 * ```typescript
 * // Use multiple providers together
 * const Dashboard = () =>
 *   UseMany(
 *     UserProvider,
 *     ThemeProvider,
 *     ConfigProvider
 *   )(
 *     (user, theme, config) => html.div(
 *       attr.class(theme.map(t => `theme-${t}`)),
 *       html.h1('Dashboard for ', user.map(u => u.name)),
 *       html.p('API URL: ', config.map(c => c.apiUrl)),
 *       html.p('Current theme: ', theme)
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // Equivalent to nested Use calls
 * const Dashboard = () =>
 *   Use(UserProvider, user =>
 *     Use(ThemeProvider, theme =>
 *       Use(ConfigProvider, config =>
 *         html.div(
 *           // Same content as above
 *         )
 *       )
 *     )
 *   )
 * ```
 *
 * @example
 * ```typescript
 * // Type-safe access to multiple providers
 * const SettingsPanel = () =>
 *   UseMany(
 *     PreferencesProvider,
 *     UserProvider
 *   )(
 *     (preferences, user) => html.div(
 *       html.h2('Settings for ', user.map(u => u.name)),
 *       html.label(
 *         'Theme: ',
 *         html.select(
 *           attr.value(preferences.map(p => p.theme)),
 *           on.change(emitValue(value => {
 *             preferences.update(p => ({ ...p, theme: value }))
 *           })),
 *           html.option(attr.value('light'), 'Light'),
 *           html.option(attr.value('dark'), 'Dark')
 *         )
 *       )
 *     )
 *   )
 * ```
 *
 * @typeParam T - Tuple type representing the types of all providers
 * @param providers - Variable number of providers to consume
 * @returns Function that takes a child function and returns a renderable
 * @throws {ProviderNotFoundError} When any of the providers is not found in the component tree
 * @public
 */
export const UseMany =
  <T extends Provider<unknown>[]>(...providers: T) =>
  (child: (...values: ToProviderTypes<T>) => TNode): Renderable =>
    WithProvider(({ use }) => {
      const args = providers.map(use) as ToProviderTypes<T>
      return child(...args)
    })
