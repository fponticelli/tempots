import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from '../src/rules/no-renderable-signal-map.js'
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

ruleTester.run('no-renderable-signal-map', rule, {
  valid: [
    {
      code: `
        const count = prop(0)
        const doubled = count.map(v => v * 2)
        const view = html.div(doubled)
      `,
    },
    {
      code: `
        const items = [1, 2, 3]
        const nodes = items.map(v => html.div(v))
      `,
    },
    {
      code: `
        const count = prop(0)
        const label = count.map(v => formatLabel(v))
      `,
    },
    {
      code: `
        const count = prop(0)
        const view = computedOf(count)(v => v * 2)
      `,
    },
    {
      code: `
        const count = prop(0)
        const view = computed(() => count.value * 2, [count])
      `,
    },
    {
      code: `
        const view = prop('hello')
      `,
    },
  ],

  invalid: [
    {
      code: `
        const count = prop(0)
        const view = count.map(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    {
      code: `
        const view = prop(0).map(v => html.span(v))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    {
      code: `
        const count = prop(0)
        const view = count.map(v => MyComponent(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    {
      code: `
        const count = prop(0)
        const view = count.map(v => {
          return svg.circle(v)
        })
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    {
      code: `
        const count = prop(0)
        const doubled = count.map(v => v * 2)
        const view = doubled.map(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMap' }],
    },
    {
      code: `
        const count = prop(0)
        const view = computedOf(count)(v => html.div(v))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    {
      code: `
        const count = prop(0)
        const view = computed(() => html.div(count.value), [count])
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
    {
      code: `
        const view = prop(html.div('hello'))
      `,
      errors: [{ messageId: 'renderableSignalMapGeneric' }],
    },
  ],
})
