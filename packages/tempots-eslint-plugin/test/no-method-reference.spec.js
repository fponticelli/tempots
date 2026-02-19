import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-method-reference.js'
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
const T = `
interface Signal<T> {
  readonly value: T
  get(): T
  map<U>(fn: (value: T) => U): Signal<U>
  filter(fn: (value: T) => boolean): Signal<T>
  flatMap<U>(fn: (value: T) => Signal<U>): Signal<U>
  on(fn: (value: T) => void): () => void
  onChange(fn: (value: T) => void): () => void
  dispose(): void
  onDispose(fn: () => void): void
}
interface Prop<T> extends Signal<T> { set(value: T): void }
interface Computed<T> extends Signal<T> {}
declare function prop<T>(value: T): Prop<T>
declare function signal<T>(value: T): Signal<T>

interface DOMContext {
  setText(text: string): void
  clear(removeTree: boolean): void
}
`

ruleTester.run('no-method-reference', rule, {
  valid: [
    // Calling methods with dot notation is fine
    {
      code: `${T}
        const count = prop(0)
        count.dispose()
      `,
    },
    // Wrapped in lambda is fine
    {
      code: `${T}
        const s = signal(0)
        s.onDispose(() => s.dispose())
      `,
    },
    {
      code: `${T}
        const s = signal(0)
        const p = prop(0)
        s.on(v => p.set(v))
      `,
    },
    // Property access (not method) is fine: .value
    {
      code: `${T}
        const p = prop('hello')
        const v = p.value
      `,
    },
    // Non-Signal objects are fine even with matching method names
    {
      code: `${T}
        const arr = [1, 2, 3]
        const fn = arr.filter
      `,
    },
    {
      code: `${T}
        const m = new Map()
        const fn = m.set
      `,
    },
    {
      code: `${T}
        const obj = { at: 5, filter: 'all' }
        const x = obj.filter
      `,
    },
    // Plain object property named 'filter' in object literal
    {
      code: `${T}
        const action = { type: 'ToggleFilter' as const, filter: 'all' }
        const state = { filter: action.filter }
      `,
    },
    // Method chaining (calling) is fine
    {
      code: `${T}
        const s = signal(0)
        const result = s.map(x => x * 2)
      `,
    },
    // Using method result (calling it) is fine
    {
      code: `${T}
        const s = signal(0)
        const value = s.get()
      `,
    },
    // Computed property access is fine
    {
      code: `${T}
        const s = signal(0)
        const method = 'dispose'
        const fn = s[method]
      `,
    },
  ],

  invalid: [
    // Passing dispose by reference as argument
    {
      code: `${T}
        const s = signal(0)
        const other = signal(1)
        s.onDispose(other.dispose)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'other', method: 'dispose' },
        },
      ],
    },
    // Passing set by reference as argument
    {
      code: `${T}
        const s = signal(0)
        const p = prop(0)
        s.on(p.set)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'p', method: 'set' },
        },
      ],
    },
    // Assigning method to variable
    {
      code: `${T}
        const s = signal(0)
        const fn = s.dispose
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 's', method: 'dispose' },
        },
      ],
    },
    // Method reference in array
    {
      code: `${T}
        const s = signal(0)
        const fns = [s.dispose]
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 's', method: 'dispose' },
        },
      ],
    },
    // Assignment expression
    {
      code: `${T}
        const s = signal(0)
        let fn: any
        fn = s.get
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 's', method: 'get' },
        },
      ],
    },
    // Return statement
    {
      code: `${T}
        const s = signal(0)
        function getFn() {
          return s.dispose
        }
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 's', method: 'dispose' },
        },
      ],
    },
    // Object property value
    {
      code: `${T}
        const s = signal(0)
        const obj = { cleanup: s.dispose }
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 's', method: 'dispose' },
        },
      ],
    },
    // Prop.set as variable
    {
      code: `${T}
        const p = prop('hello')
        const setter = p.set
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'p', method: 'set' },
        },
      ],
    },
    // Prop.set as callback
    {
      code: `${T}
        const p = prop('hello')
        const opts = { onChange: p.set }
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'p', method: 'set' },
        },
      ],
    },
  ],
})
