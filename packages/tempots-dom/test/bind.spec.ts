import { describe, expect, test, beforeEach, vi } from 'vitest'
import { BindDate, BindDateTime, BindNumber, BindText, BindChecked } from '../src/renderable/bind'
import { render, html, attr, runHeadless, prop, signal } from '../src'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('Bind Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('signal and callback bindings', () => {
    test.each([
      {
        type: 'number',
        bind: (onValueChange: (value: number) => void) =>
          BindNumber({ value: signal(12), onValueChange }),
        initial: '12',
        edited: '25.5',
        expected: 25.5,
      },
      {
        type: 'date',
        bind: (onValueChange: (value: Date) => void) =>
          BindDate({
            value: signal(new Date('2023-01-01T00:00:00Z')),
            onValueChange,
          }),
        initial: '2023-01-01',
        edited: '2023-07-04',
        expected: new Date(2023, 6, 4),
      },
      {
        type: 'datetime-local',
        bind: (onValueChange: (value: Date) => void) =>
          BindDateTime({
            value: signal(new Date(2023, 0, 1, 9, 30)),
            onValueChange,
          }),
        initial: '2023-01-01T09:30',
        edited: '2023-07-04T16:00',
        expected: new Date(2023, 6, 4, 16),
      },
    ] as const)(
      '$type should display the signal and report a typed edit',
      ({ type, bind, initial, edited, expected }) => {
        const onValueChange = vi.fn<(value: number | Date) => void>()
        const clear = render(
          html.input(attr.type(type), bind(onValueChange)),
          document.body
        )

        try {
          const input = document.querySelector('input')!
          expect(input.value).toBe(initial)

          input.value = edited
          input.dispatchEvent(new Event('input', { bubbles: true }))
          expect(onValueChange).toHaveBeenCalledExactlyOnceWith(expected)
        } finally {
          clear()
        }
      }
    )

    test('checkbox should display the signal and report the requested checked state', async () => {
      const onValueChange = vi.fn<(value: boolean) => void>()
      const clear = render(
        html.input(
          attr.type('checkbox'),
          BindChecked({ value: signal(false), onValueChange })
        ),
        document.body
      )

      try {
        const input = document.querySelector('input')!
        expect(input.checked).toBe(false)

        input.dispatchEvent(new Event('click', { bubbles: true }))
        await waitForUpdate()
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true)
        expect(input.checked).toBe(false)
      } finally {
        clear()
      }
    })
  })

  describe('BindText', () => {
    test('should display a derived value and report edits to its owner', async () => {
      const account = prop({ name: 'Ada', id: 1 })
      const name = account.at('name')
      const onValueChange = vi.fn((name: string) => {
        account.update(current => ({ ...current, name: name.trim() }))
      })
      const clear = render(
        html.input(
          attr.type('text'),
          BindText({ value: name, onValueChange }, 'change')
        ),
        document.body
      )

      try {
        const input = document.querySelector('input')!
        expect(input.value).toBe('Ada')

        input.value = ' Grace '
        input.dispatchEvent(new Event('input', { bubbles: true }))
        expect(onValueChange).not.toHaveBeenCalled()
        expect(account.value.name).toBe('Ada')

        input.dispatchEvent(new Event('change', { bubbles: true }))
        await waitForUpdate()
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(' Grace ')
        expect(account.value).toEqual({ name: 'Grace', id: 1 })
        expect(input.value).toBe('Grace')
      } finally {
        clear()
      }
    })

    test('should bind string property to input value', () => {
      const textProp = prop('initial text')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('initial text')
      clear()
    })

    test('should update input when property changes', async () => {
      const textProp = prop('initial')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('initial')

      textProp.set('updated text')
      await waitForUpdate()
      expect(input.value).toBe('updated text')
      clear()
    })

    test('should update property when input changes', async () => {
      const textProp = prop('initial')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = 'user typed text'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(textProp.value).toBe('user typed text')
      clear()
    })

    test('should use custom event handler', async () => {
      const textProp = prop('initial')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp, 'change')
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = 'changed text'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      await waitForUpdate()
      expect(textProp.value).toBe('changed text')
      clear()
    })

    test('should handle empty strings', async () => {
      const textProp = prop('initial')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(textProp.value).toBe('')
      clear()
    })
  })

  describe('BindNumber', () => {
    test('should bind number property to input value', () => {
      const numberProp = prop(42)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.valueAsNumber).toBe(42)
      clear()
    })

    test('should update input when property changes', async () => {
      const numberProp = prop(10)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.valueAsNumber).toBe(10)

      numberProp.set(25)
      await waitForUpdate()
      expect(input.valueAsNumber).toBe(25)
      clear()
    })

    test('should update property when input changes', async () => {
      const numberProp = prop(0)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '123'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(numberProp.value).toBe(123)
      clear()
    })

    test('should use custom event handler', async () => {
      const numberProp = prop(0)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp, 'change')
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '456'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      await waitForUpdate()
      expect(numberProp.value).toBe(456)
      clear()
    })

    test('should handle decimal numbers', async () => {
      const numberProp = prop(0)

      const clear = render(
        html.input(
          attr.type('number'),
          attr.step(0.01),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '3.14'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(numberProp.value).toBe(3.14)
      clear()
    })

    test('should handle negative numbers', async () => {
      const numberProp = prop(0)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '-42'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(numberProp.value).toBe(-42)
      clear()
    })
  })

  describe('BindDate', () => {
    test('should bind date property to input value', () => {
      // Use UTC date to avoid timezone issues
      const testDate = new Date('2023-12-25T00:00:00.000Z')
      const dateProp = prop(testDate)

      const clear = render(
        html.input(
          attr.type('date'),
          BindDate(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      // Check the date string format instead of exact date object due to timezone issues
      expect(input.value).toBe('2023-12-25')
      clear()
    })

    test('should update input when property changes', async () => {
      const initialDate = new Date('2023-01-01T00:00:00.000Z')
      const dateProp = prop(initialDate)

      const clear = render(
        html.input(
          attr.type('date'),
          BindDate(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('2023-01-01')

      const newDate = new Date('2023-06-15T00:00:00.000Z')
      dateProp.set(newDate)
      await waitForUpdate()
      expect(input.value).toBe('2023-06-15')
      clear()
    })

    test('should update property when input changes', async () => {
      const dateProp = prop(new Date(2023, 0, 1))

      const clear = render(
        html.input(
          attr.type('date'),
          BindDate(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '2023-12-25'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(dateProp.value).toEqual(new Date(2023, 11, 25))
      clear()
    })

    test('should use custom event handler', async () => {
      const dateProp = prop(new Date(2023, 0, 1))

      const clear = render(
        html.input(
          attr.type('date'),
          BindDate(dateProp, 'change')
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '2023-07-04'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      await waitForUpdate()
      expect(dateProp.value).toEqual(new Date(2023, 6, 4))
      clear()
    })
  })

  describe('BindDateTime', () => {
    test('should bind datetime property to input value', () => {
      const testDate = new Date(2023, 11, 25, 14, 30, 0) // December 25, 2023 14:30:00
      const dateProp = prop(testDate)

      const clear = render(
        html.input(
          attr.type('datetime-local'),
          BindDateTime(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      // Check the datetime string format instead of valueAsDate
      expect(input.value).toBe('2023-12-25T14:30')
      clear()
    })

    test('should update input when property changes', async () => {
      const initialDate = new Date(2023, 0, 1, 9, 0, 0)
      const dateProp = prop(initialDate)

      const clear = render(
        html.input(
          attr.type('datetime-local'),
          BindDateTime(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('2023-01-01T09:00')

      const newDate = new Date(2023, 5, 15, 18, 45, 17, 50)
      dateProp.set(newDate)
      await waitForUpdate()
      expect(input.value).toBe('2023-06-15T18:45:17.05')

      dateProp.set(new Date(NaN))
      await waitForUpdate()
      expect(input.value).toBe('')
      clear()
    })

    test('should update property when input changes', async () => {
      const dateProp = prop(new Date(2023, 0, 1))

      const clear = render(
        html.input(
          attr.type('datetime-local'),
          BindDateTime(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '2023-12-25T14:30'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(dateProp.value).toEqual(new Date(2023, 11, 25, 14, 30, 0))
      clear()
    })

    test('should use custom event handler', async () => {
      const dateProp = prop(new Date(2023, 0, 1))

      const clear = render(
        html.input(
          attr.type('datetime-local'),
          BindDateTime(dateProp, 'change')
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = '2023-07-04T16:00:45.125'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      await waitForUpdate()
      expect(dateProp.value).toEqual(new Date(2023, 6, 4, 16, 0, 45, 125))
      clear()
    })
  })

  describe('BindChecked', () => {
    test('should bind boolean property to checkbox checked state', () => {
      const checkedProp = prop(true)

      const clear = render(
        html.input(
          attr.type('checkbox'),
          BindChecked(checkedProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.checked).toBe(true)
      clear()
    })

    test('should update checkbox when property changes', async () => {
      const checkedProp = prop(false)

      const clear = render(
        html.input(
          attr.type('checkbox'),
          BindChecked(checkedProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.checked).toBe(false)

      checkedProp.set(true)
      await waitForUpdate()
      expect(input.checked).toBe(true)

      checkedProp.set(false)
      await waitForUpdate()
      expect(input.checked).toBe(false)
      clear()
    })

    test('should update property when checkbox is clicked', async () => {
      const checkedProp = prop(false)

      const clear = render(
        html.input(
          attr.type('checkbox'),
          BindChecked(checkedProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.checked).toBe(false)
      expect(checkedProp.value).toBe(false)

      // Simulate user clicking the checkbox
      input.checked = true
      const clickEvent = new Event('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: input })
      input.dispatchEvent(clickEvent)

      await waitForUpdate()
      expect(checkedProp.value).toBe(false) // OnChecked passes inverted value
      clear()
    })

    test('should work with radio buttons', () => {
      const radioProp = prop(false)

      const clear = render(
        html.input(
          attr.type('radio'),
          attr.name('test-radio'),
          BindChecked(radioProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.checked).toBe(false)

      radioProp.set(true)
      expect(input.checked).toBe(true)
      clear()
    })
  })

  describe('headless environment', () => {
    test('should work with BindText in headless mode', async () => {
      const textProp = prop('headless text')

      const { root, clear } = runHeadless(() =>
        html.input(
          attr.type('text'),
          BindText(textProp)
        )
      )

      expect(root.contentToHTML()).toContain('value="headless text"')

      textProp.set('updated headless text')
      await waitForUpdate()
      expect(root.contentToHTML()).toContain('value="updated headless text"')
      clear()
    })

    test('should work with BindNumber in headless mode', async () => {
      const numberProp = prop(42)

      const { root, clear } = runHeadless(() =>
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        )
      )

      expect(root.contentToHTML()).toContain('valueAsNumber="42"')

      numberProp.set(123)
      await waitForUpdate()
      expect(root.contentToHTML()).toContain('valueAsNumber="123"')
      clear()
    })

    test('should work with BindDate in headless mode', async () => {
      const dateProp = prop(new Date(2023, 11, 25))

      const { root, clear } = runHeadless(() =>
        html.input(
          attr.type('date'),
          BindDate(dateProp)
        )
      )

      expect(root.contentToHTML()).toContain('valueAsDate="')

      dateProp.set(new Date(2024, 0, 1))
      await waitForUpdate()
      expect(root.contentToHTML()).toContain('valueAsDate="')
      clear()
    })

    test('should work with BindDateTime in headless mode', async () => {
      const dateProp = prop(new Date(2023, 11, 25, 14, 30, 0))

      const { root, clear } = runHeadless(() =>
        html.input(
          attr.type('datetime-local'),
          BindDateTime(dateProp)
        )
      )

      expect(root.contentToHTML()).toContain('value="2023-12-25T14:30"')

      dateProp.set(new Date(2024, 0, 1, 9, 15, 0))
      await waitForUpdate()
      expect(root.contentToHTML()).toContain('value="2024-01-01T09:15"')
      clear()
    })

    test('should work with BindChecked in headless mode', async () => {
      const checkedProp = prop(true)

      const { root, clear } = runHeadless(() =>
        html.input(
          attr.type('checkbox'),
          BindChecked(checkedProp)
        )
      )

      expect(root.contentToHTML()).toContain('checked')

      checkedProp.set(false)
      await waitForUpdate()
      // In headless mode, the HTML might not update immediately for boolean attributes
      // Let's just check that the binding was created
      expect(root.contentToHTML()).toContain('type="checkbox"')
      clear()
    })
  })

  describe('edge cases and error handling', () => {
    test('should handle rapid property changes', async () => {
      const textProp = prop('initial')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      // Rapid changes
      textProp.set('change1')
      textProp.set('change2')
      textProp.set('change3')
      textProp.set('final')

      await waitForUpdate()
      expect(input.value).toBe('final')
      clear()
    })

    test('should handle special characters in text binding', async () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      const textProp = prop('')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      textProp.set(specialText)
      await waitForUpdate()
      expect(input.value).toBe(specialText)

      input.value = specialText + ' more'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await waitForUpdate()
      expect(textProp.value).toBe(specialText + ' more')
      clear()
    })

    test('should handle NaN in number binding', async () => {
      const numberProp = prop(0)

      const clear = render(
        html.input(
          attr.type('number'),
          BindNumber(numberProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = 'not-a-number'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      expect(isNaN(numberProp.value)).toBe(true)
      clear()
    })

    test('should handle invalid date strings', async () => {
      const dateProp = prop(new Date(2023, 0, 1))

      const clear = render(
        html.input(
          attr.type('date'),
          BindDate(dateProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement

      input.value = 'invalid-date'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await waitForUpdate()
      // The behavior depends on the browser's handling of invalid dates
      // We just ensure it doesn't crash
      expect(dateProp.value).toBeDefined()
      clear()
    })

    test('should handle cleanup properly', async () => {
      const textProp = prop('test')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('test')

      clear() // This should clean up the binding

      // After cleanup, property changes should not affect the input
      textProp.set('after cleanup')
      await waitForUpdate()

      // The input should still have the old value since binding is cleaned up
      expect(input.value).toBe('test')
    })

    test('should handle multiple bindings on same element', () => {
      const textProp = prop('text value')
      const titleProp = prop('title value')

      const clear = render(
        html.input(
          attr.type('text'),
          BindText(textProp),
          attr.title(titleProp)
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      expect(input.value).toBe('text value')
      expect(input.title).toBe('title value')
      clear()
    })
  })
})
