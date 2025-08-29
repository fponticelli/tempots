import { describe, expect, test, beforeEach, vi } from 'vitest'
import {
  on,
  OnChecked,
  emit,
  emitTarget,
  emitValue,
  emitValueAsNumber,
  emitValueAsDate,
  emitValueAsNullableDate,
  emitValueAsDateTime,
  emitValueAsNullableDateTime,
  emitChecked,
  render,
  html,
  attr,
  runHeadless,
} from '../src'

// Helper function to wait for DOM updates
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

describe('Event Handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('on proxy object', () => {
    test('should create click event handler', () => {
      const clickHandler = vi.fn()

      const clear = render(
        html.button(on.click(clickHandler), 'Click me'),
        document.body
      )

      const button = document.querySelector('button')!
      button.click()

      expect(clickHandler).toHaveBeenCalledTimes(1)
      expect(clickHandler).toHaveBeenCalledWith(
        expect.any(Event),
        expect.any(Object)
      )
      clear()
    })

    test('should create input event handler', () => {
      const inputHandler = vi.fn()

      const clear = render(html.input(on.input(inputHandler)), document.body)

      const input = document.querySelector('input')!
      input.value = 'test'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      expect(inputHandler).toHaveBeenCalledTimes(1)
      expect(inputHandler).toHaveBeenCalledWith(
        expect.any(Event),
        expect.any(Object)
      )
      clear()
    })

    test('should create multiple event handlers on same element', () => {
      const clickHandler = vi.fn()
      const mouseenterHandler = vi.fn()
      const mouseleaveHandler = vi.fn()

      const clear = render(
        html.div(
          on.click(clickHandler),
          on.mouseenter(mouseenterHandler),
          on.mouseleave(mouseleaveHandler),
          'Test element'
        ),
        document.body
      )

      const div = document.querySelector('div')!

      div.click()
      expect(clickHandler).toHaveBeenCalledTimes(1)

      div.dispatchEvent(new Event('mouseenter'))
      expect(mouseenterHandler).toHaveBeenCalledTimes(1)

      div.dispatchEvent(new Event('mouseleave'))
      expect(mouseleaveHandler).toHaveBeenCalledTimes(1)

      clear()
    })

    test('should work with keyboard events', () => {
      const keydownHandler = vi.fn()

      const clear = render(
        html.input(on.keydown(keydownHandler)),
        document.body
      )

      const input = document.querySelector('input')!
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      input.dispatchEvent(keyEvent)

      expect(keydownHandler).toHaveBeenCalledTimes(1)
      expect(keydownHandler).toHaveBeenCalledWith(
        expect.any(KeyboardEvent),
        expect.any(Object)
      )
      clear()
    })

    test('should work in headless environment', () => {
      const clickHandler = vi.fn()

      const { root, clear } = runHeadless(() =>
        html.button(on.click(clickHandler), 'Click me')
      )

      // In headless environment, we can't easily trigger events
      // but we can verify the handler was attached
      expect(root.contentToHTML()).toBe('<button>Click me</button>')
      clear()
    })
  })

  describe('OnChecked', () => {
    test('should handle checkbox click events', async () => {
      const checkedHandler = vi.fn()

      const clear = render(
        html.input(attr.type('checkbox'), OnChecked(checkedHandler)),
        document.body
      )

      const checkbox = document.querySelector('input')! as HTMLInputElement

      // Initially unchecked
      expect(checkbox.checked).toBe(false)

      // Simulate click (this will toggle the checkbox)
      checkbox.checked = true
      const clickEvent = new Event('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: checkbox })

      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')
      checkbox.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()

      // Wait for setTimeout in OnChecked
      await waitForUpdate()

      // OnChecked passes the inverted value (!value)
      expect(checkedHandler).toHaveBeenCalledWith(false, expect.any(Object))

      clear()
    })

    test('should handle checkbox without ownerDocument', async () => {
      const checkedHandler = vi.fn()

      const clear = render(
        html.input(attr.type('checkbox'), OnChecked(checkedHandler)),
        document.body
      )

      const checkbox = document.querySelector('input')! as HTMLInputElement

      // Mock ownerDocument to be null
      Object.defineProperty(checkbox, 'ownerDocument', { value: null })

      const clickEvent = new Event('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: checkbox })

      checkbox.dispatchEvent(clickEvent)

      await waitForUpdate()

      // Should not call handler when ownerDocument is null
      expect(checkedHandler).not.toHaveBeenCalled()

      clear()
    })
  })

  describe('emitValue', () => {
    test('should extract string value from input', () => {
      const valueHandler = vi.fn()
      const handler = emitValue(valueHandler)

      const mockEvent = {
        target: { value: 'test input' },
      } as unknown as Event

      handler(mockEvent)

      expect(valueHandler).toHaveBeenCalledWith('test input', mockEvent)
    })

    test('should work with empty string', () => {
      const valueHandler = vi.fn()
      const handler = emitValue(valueHandler)

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event

      handler(mockEvent)

      expect(valueHandler).toHaveBeenCalledWith('', mockEvent)
    })

    test('should work in real DOM input', () => {
      const valueHandler = vi.fn()

      const clear = render(
        html.input(on.input(emitValue(valueHandler))),
        document.body
      )

      const input = document.querySelector('input')!
      input.value = 'real input test'
      const inputEvent = new Event('input', { bubbles: true })
      input.dispatchEvent(inputEvent)

      expect(valueHandler).toHaveBeenCalledWith('real input test', inputEvent)
      clear()
    })
  })

  describe('emitValueAsNumber', () => {
    test('should extract numeric value from input', () => {
      const numberHandler = vi.fn()
      const handler = emitValueAsNumber(numberHandler)

      const mockEvent = {
        target: { valueAsNumber: 42 },
      } as unknown as Event

      handler(mockEvent)

      expect(numberHandler).toHaveBeenCalledWith(42, mockEvent)
    })

    test('should handle NaN for invalid numbers', () => {
      const numberHandler = vi.fn()
      const handler = emitValueAsNumber(numberHandler)

      const mockEvent = {
        target: { valueAsNumber: NaN },
      } as unknown as Event

      handler(mockEvent)

      expect(numberHandler).toHaveBeenCalledWith(NaN, mockEvent)
    })

    test('should work with real number input', () => {
      const numberHandler = vi.fn()

      const clear = render(
        html.input(
          attr.type('number'),
          on.input(emitValueAsNumber(numberHandler))
        ),
        document.body
      )

      const input = document.querySelector('input')! as HTMLInputElement
      input.value = '123'
      const inputEvent = new Event('input', { bubbles: true })
      input.dispatchEvent(inputEvent)

      expect(numberHandler).toHaveBeenCalledWith(123, inputEvent)
      clear()
    })
  })

  describe('emitValueAsDate', () => {
    test('should parse date from input value', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsDate(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).toHaveBeenCalledWith(
        new Date(2023, 11, 25),
        mockEvent
      ) // Month is 0-indexed
    })

    test('should not emit for empty string', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsDate(dateHandler)

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).not.toHaveBeenCalled()
    })

    test('should handle date with time component', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsDate(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25T10:30:00' },
      } as unknown as Event

      handler(mockEvent)

      // Should only parse the date part (first 2 characters of day part)
      expect(dateHandler).toHaveBeenCalledWith(
        new Date(2023, 11, 25),
        mockEvent
      )
    })
  })

  describe('emitValueAsNullableDate', () => {
    test('should parse date from input value', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDate(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).toHaveBeenCalledWith(
        new Date(2023, 11, 25),
        mockEvent
      )
    })

    test('should emit null for empty string', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDate(dateHandler)

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).toHaveBeenCalledWith(null, mockEvent)
    })
  })

  describe('emitValueAsDateTime', () => {
    test('should parse datetime from input value', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsDateTime(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25T14:30:45' },
      } as unknown as Event

      handler(mockEvent)

      const expectedDate = new Date(2023, 11, 25)
      expectedDate.setHours(14)
      expectedDate.setMinutes(30)
      expectedDate.setSeconds(45)

      expect(dateHandler).toHaveBeenCalledWith(expectedDate, mockEvent)
    })

    test('should not emit for empty string', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsDateTime(dateHandler)

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).not.toHaveBeenCalled()
    })
  })

  describe('emitValueAsNullableDateTime', () => {
    test('should parse datetime from input value', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDateTime(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25T14:30:45' },
      } as unknown as Event

      handler(mockEvent)

      const expectedDate = new Date(2023, 11, 25)
      expectedDate.setHours(14)
      expectedDate.setMinutes(30)
      expectedDate.setSeconds(45)

      expect(dateHandler).toHaveBeenCalledWith(expectedDate, mockEvent)
    })

    test('should emit null for empty string', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDateTime(dateHandler)

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).toHaveBeenCalledWith(null, mockEvent)
    })

    test('should emit null for invalid format', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDateTime(dateHandler)

      const mockEvent = {
        target: { value: 'invalid-format' },
      } as unknown as Event

      handler(mockEvent)

      expect(dateHandler).toHaveBeenCalledWith(null, mockEvent)
    })

    test('should handle missing time parts', () => {
      const dateHandler = vi.fn()
      const handler = emitValueAsNullableDateTime(dateHandler)

      const mockEvent = {
        target: { value: '2023-12-25T14' },
      } as unknown as Event

      handler(mockEvent)

      const expectedDate = new Date(2023, 11, 25)
      expectedDate.setHours(14)
      expectedDate.setMinutes(0)
      expectedDate.setSeconds(0)

      expect(dateHandler).toHaveBeenCalledWith(expectedDate, mockEvent)
    })
  })

  describe('emitChecked', () => {
    test('should extract checked state from checkbox', () => {
      const checkedHandler = vi.fn()
      const handler = emitChecked(checkedHandler)

      const mockEvent = {
        target: { checked: true },
      } as unknown as Event

      handler(mockEvent)

      expect(checkedHandler).toHaveBeenCalledWith(true, mockEvent)
    })

    test('should work with unchecked state', () => {
      const checkedHandler = vi.fn()
      const handler = emitChecked(checkedHandler)

      const mockEvent = {
        target: { checked: false },
      } as unknown as Event

      handler(mockEvent)

      expect(checkedHandler).toHaveBeenCalledWith(false, mockEvent)
    })

    test('should work in real DOM checkbox', () => {
      const checkedHandler = vi.fn()

      const clear = render(
        html.input(
          attr.type('checkbox'),
          on.change(emitChecked(checkedHandler))
        ),
        document.body
      )

      const checkbox = document.querySelector('input')! as HTMLInputElement
      checkbox.checked = true
      const changeEvent = new Event('change', { bubbles: true })
      checkbox.dispatchEvent(changeEvent)

      expect(checkedHandler).toHaveBeenCalledWith(true, changeEvent)
      clear()
    })
  })

  describe('emit with preventDefault option', () => {
    test('should prevent default and call function', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn, { preventDefault: true })

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })

    test('should work in real DOM event', () => {
      const mockFn = vi.fn()

      const clear = render(
        html.form(
          html.button(
            attr.type('submit'),
            on.click(emit(mockFn, { preventDefault: true })),
            'Submit'
          )
        ),
        document.body
      )

      const button = document.querySelector('button')!
      const clickEvent = new Event('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

      button.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(clickEvent)
      clear()
    })
  })

  describe('emit with stopPropagation option', () => {
    test('should stop propagation and call function', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn, { stopPropagation: true })

      const mockEvent = {
        stopPropagation: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.stopPropagation).toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })
  })

  describe('emit with stopImmediatePropagation option', () => {
    test('should stop immediate propagation and call function', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn, { stopImmediatePropagation: true })

      const mockEvent = {
        stopImmediatePropagation: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })
  })

  describe('emit', () => {
    test('should call function with event', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn)

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })

    test('should handle multiple options', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn, {
        preventDefault: true,
        stopPropagation: true,
        stopImmediatePropagation: true,
      })

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
      expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })

    test('should work without options', () => {
      const mockFn = vi.fn()
      const handler = emit(mockFn)

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled()
      expect(mockEvent.stopImmediatePropagation).not.toHaveBeenCalled()
      expect(mockFn).toHaveBeenCalledWith(mockEvent)
    })
  })

  describe('emitTarget', () => {
    test('should extract target element from event', () => {
      const targetHandler = vi.fn()
      const handler = emitTarget(targetHandler)

      const mockTarget = { value: 'test' }
      const mockEvent = {
        target: mockTarget,
      } as unknown as Event

      handler(mockEvent)

      expect(targetHandler).toHaveBeenCalledWith(mockTarget, mockEvent)
    })

    test('should work with options', () => {
      const targetHandler = vi.fn()
      const handler = emitTarget(targetHandler, { preventDefault: true })

      const mockTarget = { value: 'test' }
      const mockEvent = {
        target: mockTarget,
        preventDefault: vi.fn(),
      } as unknown as Event

      handler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(targetHandler).toHaveBeenCalledWith(mockTarget, mockEvent)
    })

    test('should work in real DOM', () => {
      const targetHandler = vi.fn()

      const clear = render(
        html.input(on.input(emitTarget(targetHandler))),
        document.body
      )

      const input = document.querySelector('input')!
      input.value = 'real target test'
      const inputEvent = new Event('input', { bubbles: true })
      input.dispatchEvent(inputEvent)

      expect(targetHandler).toHaveBeenCalledWith(input, inputEvent)
      clear()
    })
  })
})
