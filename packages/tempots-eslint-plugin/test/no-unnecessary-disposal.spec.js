import { RuleTester } from 'eslint'
import rule from '../src/rules/no-unnecessary-disposal.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-unnecessary-disposal', rule, {
  valid: [
    // Signal created outside renderable - not tracked
    {
      code: `
        const globalSignal = prop(0)
        const MyComponent = (ctx) => {
          return html.div(
            OnDispose(globalSignal.dispose)
          )
        }
      `,
    },
    // Signal created with untracked() - not auto-disposed
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = untracked(() => prop(0))
          return html.div(
            OnDispose(signal.dispose)
          )
        }
      `,
    },
    // OnDispose with custom callback
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(() => console.log('cleanup'))
          )
        }
      `,
    },
    // Signal not created in this scope
    {
      code: `
        const MyComponent = (ctx) => {
          return html.div(
            OnDispose(externalSignal.dispose)
          )
        }
      `,
    },
    // Not a renderable function
    {
      code: `
        function regularFunction() {
          const signal = prop(0)
          return OnDispose(signal.dispose)
        }
      `,
    },
  ],

  invalid: [
    // Pattern 1: OnDispose(signal.dispose)
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(signal.dispose)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Pattern 2: OnDispose(signal) - direct signal reference
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(signal)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
    // Pattern 3: OnDispose(() => signal.dispose())
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(() => signal.dispose())
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Pattern 3 with block statement
    {
      code: `
        const MyComponent = (ctx) => {
          const signal = prop(0)
          return html.div(
            OnDispose(() => {
              signal.dispose()
            })
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Signal transformation with Pattern 1
    {
      code: `
        const MyComponent = (ctx) => {
          const mapped = someSignal.map(x => x * 2)
          return html.div(
            OnDispose(mapped.dispose)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Signal transformation with Pattern 2
    {
      code: `
        const MyComponent = (ctx) => {
          const mapped = someSignal.map(x => x * 2)
          return html.div(
            OnDispose(mapped)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
    // Multiple signals, all unnecessary
    {
      code: `
        const MyComponent = (ctx) => {
          const signal1 = prop(0)
          const signal2 = computed(() => signal1.value * 2)
          return html.div(
            OnDispose(signal1),
            OnDispose(signal2.dispose)
          )
        }
      `,
      errors: [
        { messageId: 'unnecessaryDisposalDirect' },
        { messageId: 'unnecessaryDisposal' },
      ],
    },
    // Real-world example from user's code
    {
      code: `
        const MyComponent = (ctx) => {
          const sizeActiveTab = prop('overview')
          return html.div(
            OnDispose(sizeActiveTab),
            'content'
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
  ],
})
