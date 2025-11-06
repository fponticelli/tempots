import { RuleTester } from 'eslint'
import rule from '../src/rules/no-module-level-signals.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-module-level-signals', rule, {
  valid: [
    // Signal created inside renderable - OK
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div()
        }
      `,
    },
    // Signal transformation inside renderable - OK
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          const doubled = signal.map(x => x * 2)
          return html.div()
        }
      `,
    },
    // Non-signal .map() at module level - should NOT warn (false positive fix)
    {
      code: `
        const itemUrlDecoder = stringValue.map((s) => {
          if (s.indexOf('item?id=') >= 0) {
            return ItemUrl.internal
          } else {
            return ItemUrl.external(s)
          }
        })
      `,
    },
    // Array .map() at module level - should NOT warn
    {
      code: `
        const numbers = [1, 2, 3].map(x => x * 2)
      `,
    },
    // Signal inside any function - OK
    {
      code: `
        function helper() {
          const signal = prop(0)
          return signal
        }
      `,
    },
    // Signal transformation on non-tracked variable - should NOT warn
    {
      code: `
        const decoder = someDecoder.map(x => x.toUpperCase())
      `,
    },
  ],

  invalid: [
    // Signal created at module level
    {
      code: `
        const globalSignal = prop(0)
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'globalSignal',
            method: 'prop',
          },
        },
      ],
    },
    // Computed signal at module level
    {
      code: `
        const globalComputed = computed(() => 42)
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'globalComputed',
            method: 'computed',
          },
        },
      ],
    },
    // Signal transformation at module level
    {
      code: `
        const globalSignal = prop(0)
        const doubled = globalSignal.map(x => x * 2)
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'globalSignal',
            method: 'prop',
          },
        },
        {
          messageId: 'moduleLevelTransform',
          data: {
            name: 'doubled',
            method: 'map',
          },
        },
      ],
    },
    // Chained transformations at module level
    {
      code: `
        const globalSignal = signal(0)
        const doubled = globalSignal.map(x => x * 2)
        const filtered = doubled.filter(x => x > 5)
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'globalSignal',
            method: 'signal',
          },
        },
        {
          messageId: 'moduleLevelTransform',
          data: {
            name: 'doubled',
            method: 'map',
          },
        },
        {
          messageId: 'moduleLevelTransform',
          data: {
            name: 'filtered',
            method: 'filter',
          },
        },
      ],
    },
    // computedOf at module level
    {
      code: `
        const result = computedOf({ a: 1, b: 2 })
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'result',
            method: 'computedOf',
          },
        },
      ],
    },
    // Signal with deriveProp at module level
    {
      code: `
        const globalSignal = prop({ x: 1, y: 2 })
        const xProp = globalSignal.deriveProp('x')
      `,
      errors: [
        {
          messageId: 'moduleLevelSignal',
          data: {
            name: 'globalSignal',
            method: 'prop',
          },
        },
        {
          messageId: 'moduleLevelTransform',
          data: {
            name: 'xProp',
            method: 'deriveProp',
          },
        },
      ],
    },
  ],
})

