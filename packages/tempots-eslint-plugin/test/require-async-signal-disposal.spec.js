import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/require-async-signal-disposal.js'
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
  map<U>(fn: (value: T) => U): Signal<U>
  filter(fn: (value: T) => boolean): Signal<T>
  on(fn: (value: T) => void): () => void
  dispose(): void
}
interface Prop<T> extends Signal<T> { set(value: T): void }
interface Computed<T> extends Signal<T> {}
declare function prop<T>(value: T): Prop<T>
declare function signal<T>(value: T): Signal<T>
declare function computed<T>(fn: () => T, deps?: unknown[]): Computed<T>
declare function untracked<T>(fn: () => T): T
declare function someFunction(...args: any[]): void
`

ruleTester.run('require-async-signal-disposal', rule, {
  valid: [
    // Signal creation outside async context is fine
    {
      code:
        T +
        `
        const count = prop(0)
        const doubled = count.map(v => v * 2)
      `,
    },
    // Array.filter() in async context should NOT warn
    {
      code:
        T +
        `
        async function process() {
          const nodes = [{ text: 'hello' }, { text: '' }]
          const markNodes = nodes.filter(node => node.text.length > 0)
        }
      `,
    },
    // Array.map() in async context should NOT warn
    {
      code:
        T +
        `
        async function process() {
          const items = [{ name: 'a' }, { name: 'b' }]
          const names = items.map(item => item.name)
        }
      `,
    },
    // Array method chains in async context should NOT warn
    {
      code:
        T +
        `
        async function process() {
          const items = [1, 2, 3]
          const filtered = items.filter(x => x > 1)
          const mapped = filtered.map(x => x * 2)
        }
      `,
    },
    // Signal creation wrapped in untracked() is fine
    {
      code:
        T +
        `
        async function setup() {
          const s = untracked(() => prop(0))
        }
      `,
    },
  ],

  invalid: [
    // Signal creation in async function should warn
    {
      code:
        T +
        `
        async function setup() {
          const count = prop(0)
        }
      `,
      errors: [{ messageId: 'asyncSignalDisposal' }],
    },
    // Signal transform on actual signal in async should warn
    {
      code:
        T +
        `
        async function setup() {
          const count = prop(0)
          const doubled = count.map(v => v * 2)
        }
      `,
      errors: [
        { messageId: 'asyncSignalDisposal' },
        { messageId: 'asyncSignalDisposal' },
      ],
    },
    // Inline signal creation in async should warn
    {
      code:
        T +
        `
        async function setup() {
          someFunction(prop(0))
        }
      `,
      errors: [{ messageId: 'asyncSignalDisposalGeneric' }],
    },
    // Signal in setTimeout should warn
    {
      code:
        T +
        `
        setTimeout(() => {
          const count = prop(0)
        }, 100)
      `,
      errors: [{ messageId: 'asyncSignalDisposal' }],
    },
    // Signal in .then() should warn
    {
      code:
        T +
        `
        declare function fetch(url: string): Promise<any>
        fetch('/api').then(() => {
          const count = prop(0)
        })
      `,
      errors: [{ messageId: 'asyncSignalDisposal' }],
    },
  ],
})
