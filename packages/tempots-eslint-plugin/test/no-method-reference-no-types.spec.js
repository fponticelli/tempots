import { RuleTester } from 'eslint'
import rule from '../src/rules/no-method-reference.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-method-reference (no type info)', rule, {
  valid: [],
  invalid: [
    {
      code: 'const x = 1',
      errors: [{ messageId: 'missingTypeInfo' }],
    },
    {
      code: `
        function foo() {
          return 42
        }
      `,
      errors: [{ messageId: 'missingTypeInfo' }],
    },
  ],
})
