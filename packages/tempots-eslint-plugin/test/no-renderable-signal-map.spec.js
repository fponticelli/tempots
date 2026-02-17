import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-renderable-signal-map.js'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*', '*.js*'],
      },
      tsconfigRootDir: __dirname,
    },
  },
})

// Type stubs so the type checker can resolve Tempo types.
// Prepended to every test snippet.
const T = `
type Clear = (removeTree: boolean) => void
interface DOMContext { readonly document: Document }
type Renderable = (ctx: DOMContext) => Clear
interface Signal<T> {
  readonly value: T
  map<U>(fn: (value: T) => U): Signal<U>
  filter(fn: (value: T) => boolean): Signal<T>
  flatMap<U>(fn: (value: T) => Signal<U>): Signal<U>
  on(fn: (value: T) => void): () => void
  dispose(): void
}
interface Prop<T> extends Signal<T> { set(value: T): void }
interface Computed<T> extends Signal<T> {}
declare function prop<T>(value: T): Prop<T>
declare function signal<T>(value: T): Signal<T>
declare function computed<T>(fn: () => T, deps?: unknown[]): Computed<T>
declare function computedOf(...signals: Signal<any>[]): <R>(fn: (...args: any[]) => R) => Computed<R>
declare function untracked<T>(fn: () => T): T
declare const html: { [K: string]: (...args: any[]) => Renderable }
declare const svg: { [K: string]: (...args: any[]) => Renderable }
declare function Fragment(...args: unknown[]): Renderable
declare function MyComponent(...args: unknown[]): Renderable
declare function formatLabel(v: unknown): string
declare function getItems(): { key: string; active: boolean; name: string }[]
`

ruleTester.run('no-renderable-signal-map', rule, {
  valid: [
    // Signal.map to non-renderable is fine
    {
      code:
        T +
        `
        const count = prop(0)
        const doubled = count.map(v => v * 2)
        const view = html.div(doubled)
      `,
    },
    // Array.map returning renderables is fine (not a Signal)
    {
      code:
        T +
        `
        const items = [1, 2, 3]
        const nodes = items.map(v => html.div(v))
      `,
    },
    // Signal.map to non-renderable is fine
    {
      code:
        T +
        `
        const count = prop(0)
        const label = count.map(v => formatLabel(v))
      `,
    },
    // computedOf returning non-renderable is fine
    {
      code:
        T +
        `
        const count = prop(0)
        const view = computedOf(count)(v => v * 2)
      `,
    },
    // computed returning non-renderable is fine
    {
      code:
        T +
        `
        const count = prop(0)
        const view = computed(() => count.value * 2, [count])
      `,
    },
    // prop of non-renderable is fine
    {
      code:
        T +
        `
        const view = prop('hello')
      `,
    },
    // Array.filter() result used with .map() should NOT warn
    {
      code:
        T +
        `
        const objectKeys = ['a', 'b', 'c']
        const extraKeys = objectKeys.filter(k => k !== 'a')
        html.div(...extraKeys.map(key => html.span(key)))
      `,
    },
    // Array.map() result used with .map() should NOT warn
    {
      code:
        T +
        `
        const items = [{ key: 'a' }, { key: 'b' }]
        const itemStates = items.map(item => ({ ...item, isActive: true }))
        html.div(...itemStates.map(({ key }) => html.button(key)))
      `,
    },
    // computedOf returning a number via Number() should NOT warn
    {
      code:
        T +
        `
        const contentWidth = prop(100n)
        const visibleAreaWidth = prop(50)
        const scrollRatio = computedOf(contentWidth, visibleAreaWidth)(
          (cw, vw) => Number(cw) / Math.max(1, vw)
        )
      `,
    },
    // Chained array methods should NOT warn
    {
      code:
        T +
        `
        const allItems = getItems()
        const filtered = allItems.filter(x => x.active)
        const mapped = filtered.map(x => html.li(x.name))
      `,
    },
    // Signal.map with String() should NOT warn (not a renderable)
    {
      code:
        T +
        `
        const count = prop(0)
        const label = count.map(v => String(v))
      `,
    },
  ],

  invalid: [
    // Signal.map to renderable should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const view = count.map(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    // Inline prop().map() to renderable should warn
    {
      code:
        T +
        `
        const view = prop(0).map(v => html.span(v))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    // Signal.map to component should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const view = count.map(v => MyComponent(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    // Signal.map returning svg renderable should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const view = count.map(v => {
          return svg.circle(v)
        })
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    // Chained signal transforms to renderable should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const doubled = count.map(v => v * 2)
        const view = doubled.map(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    // computedOf to renderable should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const view = computedOf(count)(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    // computed to renderable should warn
    {
      code:
        T +
        `
        const count = prop(0)
        const view = computed(() => html.div(count.value), [count])
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    // prop of renderable should warn
    {
      code:
        T +
        `
        const view = prop(html.div('hello'))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    // Signal chain: signal.filter().map() to renderable should still warn
    {
      code:
        T +
        `
        const count = prop(0)
        const positive = count.filter(v => v > 0)
        const view = positive.map(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
  ],
})
