import { RuleTester } from 'eslint'
import rule from '../src/rules/no-method-reference.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-method-reference', rule, {
  valid: [
    // Calling methods with dot notation is fine
    {
      code: `
        const count = prop(0)
        count.dispose()
      `,
    },
    // Wrapped in lambda is fine
    {
      code: `
        signal.onDispose(() => other.dispose())
      `,
    },
    {
      code: `
        signal.on(v => prop.set(v))
      `,
    },
    {
      code: `
        signal.onChange(v => ctx.setText(v))
      `,
    },
    // Non-Tempo method names are fine
    {
      code: `
        arr.forEach(item.toString)
      `,
    },
    {
      code: `
        fn(obj.customMethod)
      `,
    },
    // Computed property access is fine (dynamic)
    {
      code: `
        fn(obj[method])
      `,
    },
    // Method chaining is fine
    {
      code: `
        const result = signal.map(x => x * 2).filter(x => x > 0)
      `,
    },
    // Using method result (calling it) is fine
    {
      code: `
        const value = signal.get()
      `,
    },
  ],

  invalid: [
    // Passing dispose by reference as argument
    {
      code: `
        signal.onDispose(other.dispose)
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
      code: `
        signal.on(prop.set)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'prop', method: 'set' },
        },
      ],
    },
    // Passing setText by reference
    {
      code: `
        signal.onChange(ctx.setText)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'ctx', method: 'setText' },
        },
      ],
    },
    // Assigning method to variable
    {
      code: `
        const fn = signal.dispose
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'signal', method: 'dispose' },
        },
      ],
    },
    // OnDispose with method reference
    {
      code: `
        OnDispose(count.dispose)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'count', method: 'dispose' },
        },
      ],
    },
    // Method reference in array
    {
      code: `
        const fns = [signal.dispose, other.clear]
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'signal', method: 'dispose' },
        },
        {
          messageId: 'noMethodReference',
          data: { object: 'other', method: 'clear' },
        },
      ],
    },
    // Assignment expression
    {
      code: `
        let fn
        fn = signal.get
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'signal', method: 'get' },
        },
      ],
    },
    // Return statement
    {
      code: `
        function getFn() {
          return ctx.clear
        }
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'ctx', method: 'clear' },
        },
      ],
    },
    // Object property value
    {
      code: `
        const obj = { cleanup: signal.dispose }
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'signal', method: 'dispose' },
        },
      ],
    },
    // Chained object access
    {
      code: `
        scope.onDispose(this.signal.dispose)
      `,
      errors: [
        {
          messageId: 'noMethodReference',
          data: { object: 'this.signal', method: 'dispose' },
        },
      ],
    },
  ],
})
