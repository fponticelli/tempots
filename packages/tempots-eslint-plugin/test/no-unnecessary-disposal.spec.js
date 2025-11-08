import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-unnecessary-disposal.js'
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
    // Factory function returning style.* - should be caught by heuristic
    // This is valid because the signal is passed directly to style.color, not to OnDispose
    {
      code: `
        const MyStyle = () => {
          const signal = prop('red')
          return style.color(signal)
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
    // Factory function without ctx parameter - should be caught by type-aware detection
    // This reproduces the user's issue where the rule doesn't warn
    {
      code: `
        const MyComponent = () => {
          const sizeActiveTab = prop('overview')
          return html.div(
            OnDispose(sizeActiveTab)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
    // Factory function with Pattern 1 (signal.dispose)
    {
      code: `
        const MyComponent = () => {
          const signal = prop(0)
          return html.div(
            OnDispose(signal.dispose)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Factory function with Pattern 3 (arrow function)
    {
      code: `
        const MyComponent = () => {
          const signal = prop(0)
          return html.div(
            OnDispose(() => signal.dispose())
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposal' }],
    },
    // Factory function returning svg.* - should be caught by heuristic
    {
      code: `
        const MyIcon = () => {
          const signal = prop(0)
          return svg.circle(
            OnDispose(signal)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
    // Factory function returning math.* - should be caught by heuristic
    {
      code: `
        const MyFormula = () => {
          const signal = prop(0)
          return math.mrow(
            OnDispose(signal)
          )
        }
      `,
      errors: [{ messageId: 'unnecessaryDisposalDirect' }],
    },
  ],
})
