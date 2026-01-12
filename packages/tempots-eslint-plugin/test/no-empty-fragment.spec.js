import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-empty-fragment.js'
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

ruleTester.run('no-empty-fragment', rule, {
  valid: [
    {
      code: `
        const view = Fragment('content')
      `,
    },
    {
      code: `
        const view = Fragment(html.div('content'))
      `,
    },
    {
      code: `
        const view = Fragment(...children)
      `,
    },
    {
      code: `
        const view = OtherFragment()
      `,
    },
  ],

  invalid: [
    {
      code: `
        import { Empty, Fragment } from '@tempots/dom'
        const view = Fragment()
      `,
      output: `
        import { Empty, Fragment } from '@tempots/dom'
        const view = Empty
      `,
      errors: [{ messageId: 'emptyFragment' }],
    },
  ],
})
