import { describe, test, expect } from 'vitest'
import { RuleTester } from 'eslint'
import tsParser from '@typescript-eslint/parser'
import rule from '../src/rules/require-signal-disposal.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: false,
      },
    },
  },
})

describe('require-signal-disposal', () => {
  test('rule definition', () => {
    expect(rule).toBeDefined()
    expect(rule.meta).toBeDefined()
    expect(rule.create).toBeDefined()
  })

  ruleTester.run('require-signal-disposal', rule, {
    valid: [
      // Signal properly disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const signal = prop(0)
            return Fragment(
              OnDispose(signal.dispose),
              html.div('content')
            )
          }
        `,
      },
      // Signal transformation properly disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const mapped = someSignal.map(x => x * 2)
            return Fragment(
              OnDispose(mapped.dispose),
              html.div(mapped)
            )
          }
        `,
      },
      // Signal passed directly to OnDispose
      {
        code: `
          const MyComponent = (ctx) => {
            const signal = prop(0)
            return Fragment(
              OnDispose(signal),
              html.div('content')
            )
          }
        `,
      },
      // Signal disposed with arrow function
      {
        code: `
          const MyComponent = (ctx) => {
            const signal = prop(0)
            return Fragment(
              OnDispose(() => signal.dispose()),
              html.div('content')
            )
          }
        `,
      },
      // Signal disposed in block statement
      {
        code: `
          const MyComponent = (ctx) => {
            const signal = prop(0)
            return Fragment(
              OnDispose(() => {
                signal.dispose()
              }),
              html.div('content')
            )
          }
        `,
      },
      // Not a renderable function (no ctx parameter)
      {
        code: `
          const helper = () => {
            const signal = prop(0)
            return signal
          }
        `,
      },
      // Signal passed as parameter (not created locally)
      {
        code: `
          const MyComponent = (ctx) => {
            return html.div(externalSignal)
          }
        `,
      },
      // High-level component with Renderable return type - properly disposed
      {
        code: `
          function MyComponent(): Renderable {
            const signal = prop(0)
            return Fragment(
              OnDispose(signal.dispose),
              html.div('content')
            )
          }
        `,
      },
      // High-level component returning html - properly disposed
      {
        code: `
          function MyComponent(): Renderable {
            const mapped = someSignal.map(x => x * 2)
            return Fragment(
              OnDispose(mapped.dispose),
              html.div(mapped)
            )
          }
        `,
      },
      // High-level component returning NotEmpty - properly disposed
      {
        code: `
          function Comments({ items }): Renderable {
            const newItems = items.map(items => items.filter(i => i.content != null))
            return Fragment(
              OnDispose(newItems.dispose),
              NotEmpty(items, items =>
                html.ul(
                  ForEach(newItems, ({ at }) => html.li(at('title')))
                )
              )
            )
          }
        `,
      },
      // OnDispose inside callback to NotEmpty
      {
        code: `
          function Comments({ items }): Renderable {
            const newItems = items.map(items => items.filter(i => i.content != null))
            return NotEmpty(items, items =>
              html.ul(
                OnDispose(newItems.dispose),
                ForEach(newItems, ({ at }) => html.li(at('title')))
              )
            )
          }
        `,
      },
      // OnDispose inside callback to When
      {
        code: `
          function MyComponent({ condition }): Renderable {
            const derived = condition.map(x => x * 2)
            return When(
              condition,
              () => html.div(OnDispose(derived.dispose), derived),
              () => html.span('empty')
            )
          }
        `,
      },
      // OnDispose inside callback to Ensure
      {
        code: `
          function MyComponent({ maybeValue }): Renderable {
            const transformed = maybeValue.map(x => x.toUpperCase())
            return Ensure(maybeValue, value =>
              html.div(OnDispose(transformed.dispose), transformed)
            )
          }
        `,
      },
      // OnDispose with direct signal inside callback to NotEmpty
      {
        code: `
          function Comments({ items }): Renderable {
            const newItems = items.map(items => items.filter(i => i.content != null))
            return NotEmpty(items, items =>
              html.ul(
                OnDispose(newItems),
                ForEach(newItems, ({ at }) => html.li(at('title')))
              )
            )
          }
        `,
      },
      // OnDispose with direct signal inside callback to When
      {
        code: `
          function MyComponent({ condition }): Renderable {
            const derived = condition.map(x => x * 2)
            return When(
              condition,
              () => html.div(OnDispose(derived), derived),
              () => html.span('empty')
            )
          }
        `,
      },
      // OnDispose with direct signal inside callback to Ensure
      {
        code: `
          function MyComponent({ maybeValue }): Renderable {
            const transformed = maybeValue.map(x => x.toUpperCase())
            return Ensure(maybeValue, value =>
              html.div(OnDispose(transformed), transformed)
            )
          }
        `,
      },
      // Arrow function returning html.div
      {
        code: `
          const MyComponent = () => html.div('content')
        `,
      },
      // Function declaration returning Fragment
      {
        code: `
          function MyComponent() {
            return Fragment(html.div('content'))
          }
        `,
      },
      // Parent signal disposed, derived signals should not be flagged
      {
        code: `
          function Crud(): Renderable {
            const person = prop({ name: '', surname: '' })
            const isValid = person.map(person => person.name === '' || person.surname === '')
            const name = person.map(p => p.name)
            const surname = person.map(p => p.surname)
            return flex.row(
              OnDispose(person),
              html.div(name),
              html.div(surname),
              html.div(isValid)
            )
          }
        `,
      },
      // Parent signal disposed with .dispose, derived signals should not be flagged
      {
        code: `
          function MyComponent(): Renderable {
            const parent = prop(0)
            const derived1 = parent.map(x => x * 2)
            const derived2 = parent.map(x => x * 3)
            return Fragment(
              OnDispose(parent.dispose),
              html.div(derived1),
              html.div(derived2)
            )
          }
        `,
      },
      // computed with all dependencies disposed
      {
        code: `
          function Crud(): Renderable {
            const db = prop({})
            const filter = prop('')
            const filteredList = computed(() => {
              return Object.entries(db.value).filter(([k, v]) =>
                k.includes(filter.value)
              )
            }, [db, filter])
            return flex.row(
              OnDispose(db, filter),
              html.div(filteredList)
            )
          }
        `,
      },
      // computedOf with all dependencies disposed
      {
        code: `
          function MyComponent(): Renderable {
            const a = prop(1)
            const b = prop(2)
            const sum = computedOf(a, b)((a, b) => a + b)
            return Fragment(
              OnDispose(a, b),
              html.div(sum)
            )
          }
        `,
      },
      // Array.prototype.filter() should not be flagged as signal transformation
      {
        code: `
          function Crud(): Renderable {
            const db = prop({})
            const filter = prop('')
            const filteredList = computed(() => {
              const filtered = filter.value.toLocaleLowerCase()
              const values = Object.entries(db.value).filter(
                ([, { name, surname }]) =>
                  name.toLocaleLowerCase().includes(filtered) ||
                  surname.toLocaleLowerCase().includes(filtered)
              )
              return values
            }, [db, filter])
            return flex.row(
              OnDispose(db, filter),
              html.div(filteredList)
            )
          }
        `,
      },
      // ForEach callback parameter transformations are managed by ForEach
      {
        code: `
          function Crud(): Renderable {
            const db = prop({})
            const filter = prop('')
            const filteredList = computed(() => [], [db, filter])
            return Fragment(
              OnDispose(db, filter),
              ForEach(filteredList, el => {
                const id = el.map(el => el[0])
                const label = el.map(el => el[1])
                return html.option(attr.value(id), label)
              })
            )
          }
        `,
      },
      // Transitive disposal: deleteDisabled depends on count which depends on accounts
      {
        code: `
          function ForEachDemo(): Renderable {
            const accounts = prop([])
            const count = accounts.map(v => v.length)
            const deleteDisabled = count.map(c => c === 0)
            return Fragment(
              OnDispose(accounts),
              html.div(count),
              html.div(deleteDisabled)
            )
          }
        `,
      },
      // Computed with mixed dependencies: parameter + disposed signal
      {
        code: `
          function CircleDrawer(): Renderable {
            const circles = prop([])
            const currentId = prop(null)
            return Fragment(
              OnDispose(circles, currentId),
              ForEach(circles, ($circle) => {
                const selectedClass = computed(
                  () => currentId.value === $circle.value.id ? 'selected' : '',
                  [currentId, $circle]
                )
                return html.div(attr.class(selectedClass))
              })
            )
          }
        `,
      },

      // Conditional disposal with Value.map
      {
        code: `
          function NPMShield(name) {
            const imgSrc = Value.map(name, n => {
              const base = \`https://img.shields.io/npm/v/\${n}\`
              return \`\${base}?style=flat-square\`
            })
            return html.a(
              Signal.is(imgSrc) ? OnDispose(imgSrc) : null,
              html.img(attr.src(imgSrc))
            )
          }
        `,
      },
    ],

    invalid: [
      // Signal created but not disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const signal = prop(0)
            return html.div('content')
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'signal', method: 'prop' },
          },
        ],
      },
      // Signal transformation not disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const mapped = someSignal.map(x => x * 2)
            return html.div(mapped)
          }
        `,
        errors: [
          {
            messageId: 'undisposedTransform',
            data: { name: 'mapped', method: 'map' },
          },
        ],
      },
      // Multiple signals, one not disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const signal1 = prop(0)
            const signal2 = prop(1)
            return Fragment(
              OnDispose(signal1.dispose),
              html.div('content')
            )
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'signal2', method: 'prop' },
          },
        ],
      },
      // Filter transformation not disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const filtered = someSignal.filter(x => x > 0)
            return html.div(filtered)
          }
        `,
        errors: [
          {
            messageId: 'undisposedTransform',
            data: { name: 'filtered', method: 'filter' },
          },
        ],
      },
      // Computed signal not disposed
      {
        code: `
          const MyComponent = (ctx) => {
            const comp = computed(() => a.value + b.value, [a, b])
            return html.div(comp)
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'comp', method: 'computed' },
          },
        ],
      },
      // High-level component with Renderable return type - signal not disposed
      {
        code: `
          function MyComponent(): Renderable {
            const signal = prop(0)
            return html.div('content')
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'signal', method: 'prop' },
          },
        ],
      },
      // High-level component - transformation not disposed
      {
        code: `
          function MyComponent(): Renderable {
            const mapped = someSignal.map(x => x * 2)
            return html.div(mapped)
          }
        `,
        errors: [
          {
            messageId: 'undisposedTransform',
            data: { name: 'mapped', method: 'map' },
          },
        ],
      },
      // High-level component like Comments - transformation not disposed
      {
        code: `
          function Comments({ items }): Renderable {
            const newItems = items.map(items => items.filter(i => i.content != null))
            return NotEmpty(items, items =>
              html.ul(
                ForEach(newItems, ({ at }) => html.li(at('title')))
              )
            )
          }
        `,
        errors: [
          {
            messageId: 'undisposedTransform',
            data: { name: 'newItems', method: 'map' },
          },
        ],
      },
      // Function returning Fragment - signal not disposed
      {
        code: `
          function MyComponent() {
            const signal = prop(0)
            return Fragment(html.div(signal))
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'signal', method: 'prop' },
          },
        ],
      },
      // Arrow function returning html - transformation not disposed
      {
        code: `
          const MyComponent = () => {
            const doubled = count.map(x => x * 2)
            return html.div(doubled)
          }
        `,
        errors: [
          {
            messageId: 'undisposedTransform',
            data: { name: 'doubled', method: 'map' },
          },
        ],
      },
      // computed with only some dependencies disposed
      {
        code: `
          function MyComponent(): Renderable {
            const a = prop(1)
            const b = prop(2)
            const sum = computed(() => a.value + b.value, [a, b])
            return Fragment(
              OnDispose(a),
              html.div(sum)
            )
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'b', method: 'prop' },
          },
          {
            messageId: 'undisposedSignal',
            data: { name: 'sum', method: 'computed' },
          },
        ],
      },
      // computedOf with only some dependencies disposed
      {
        code: `
          function MyComponent(): Renderable {
            const a = prop(1)
            const b = prop(2)
            const sum = computedOf(a, b)((a, b) => a + b)
            return Fragment(
              OnDispose(b),
              html.div(sum)
            )
          }
        `,
        errors: [
          {
            messageId: 'undisposedSignal',
            data: { name: 'a', method: 'prop' },
          },
          {
            messageId: 'undisposedSignal',
            data: { name: 'sum', method: 'computedOf' },
          },
        ],
      },
    ],
  })
})
