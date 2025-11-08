import { RuleTester } from 'eslint'
import rule from '../src/rules/no-redundant-listener-disposal.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-redundant-listener-disposal', rule, {
  valid: [
    // Listener without OnDispose wrapper - correct usage
    {
      code: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          outerSignal.on(value => console.log(value))
          return html.div('content')
        }
      `,
    },
    // onChange without OnDispose wrapper - correct usage
    {
      code: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          outerSignal.onChange(value => console.log(value))
          return html.div('content')
        }
      `,
    },
    // OnDispose with other callbacks
    {
      code: `
        const MyComponent = (ctx) => {
          return html.div(
            OnDispose(() => console.log('cleanup'))
          )
        }
      `,
    },
    // OnDispose with signal.dispose (not a listener)
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(signal.dispose)
          )
        }
      `,
    },
    // Manual cleanup stored in variable
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          const clear = signal.on(value => console.log(value))
          return html.div('content')
        }
      `,
    },
  ],

  invalid: [
    // OnDispose(signal.on(...)) - should be removed
    {
      code: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            OnDispose(outerSignal.on(value => console.log(value)))
          )
        }
      `,
      errors: [
        {
          messageId: 'redundantListenerDisposal',
          data: { method: 'on' },
        },
      ],
      output: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            outerSignal.on(value => console.log(value))
          )
        }
      `,
    },
    // OnDispose(signal.onChange(...)) - should be removed
    {
      code: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            OnDispose(outerSignal.onChange(value => console.log(value)))
          )
        }
      `,
      errors: [
        {
          messageId: 'redundantListenerDisposal',
          data: { method: 'onChange' },
        },
      ],
      output: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            outerSignal.onChange(value => console.log(value))
          )
        }
      `,
    },
    // Multiple OnDispose wrappers
    {
      code: `
        const MyComponent = (ctx) => {
          const signal1 = prop(0)
          const signal2 = prop(1)
          return html.div(
            OnDispose(signal1.on(v => console.log(v))),
            OnDispose(signal2.onChange(v => console.log(v)))
          )
        }
      `,
      errors: [
        {
          messageId: 'redundantListenerDisposal',
          data: { method: 'on' },
        },
        {
          messageId: 'redundantListenerDisposal',
          data: { method: 'onChange' },
        },
      ],
      output: `
        const MyComponent = (ctx) => {
          const signal1 = prop(0)
          const signal2 = prop(1)
          return html.div(
            signal1.on(v => console.log(v)),
            signal2.onChange(v => console.log(v))
          )
        }
      `,
    },
    // Nested in other expressions
    {
      code: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            html.span('test'),
            OnDispose(outerSignal.on(value => {
              console.log(value)
            })),
            html.span('test2')
          )
        }
      `,
      errors: [
        {
          messageId: 'redundantListenerDisposal',
          data: { method: 'on' },
        },
      ],
      output: `
        const MyComponent = (ctx) => {
          const outerSignal = prop(0)
          return html.div(
            html.span('test'),
            outerSignal.on(value => {
              console.log(value)
            }),
            html.span('test2')
          )
        }
      `,
    },
  ],
})

