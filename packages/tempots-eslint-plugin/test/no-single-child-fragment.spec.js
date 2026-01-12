import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-single-child-fragment.js'
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

ruleTester.run('no-single-child-fragment', rule, {
  valid: [
    {
      code: `
        const view = Fragment('a', 'b')
      `,
    },
    {
      code: `
        const view = Fragment()
      `,
    },
    {
      code: `
        const view = Fragment(...children)
      `,
    },
  ],

  invalid: [
    {
      code: `
        const view = Fragment(html.div('content'))
      `,
      output: `
        const view = html.div('content')
      `,
      errors: [{ messageId: 'singleChildFragment' }],
    },
    {
      code: `
        const view = Fragment(child)
      `,
      output: `
        const view = child
      `,
      errors: [{ messageId: 'singleChildFragment' }],
    },
    {
      code: `
        const view = Fragment([html.div('content')])
      `,
      output: `
        const view = [html.div('content')]
      `,
      errors: [{ messageId: 'singleChildFragment' }],
    },
  ],
})
