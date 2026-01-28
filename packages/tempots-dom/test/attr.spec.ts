import { describe, expect, test, beforeEach } from 'vitest'
import { _makeSetter, _makeGetter } from '../src/dom/attr'

describe('Attribute Utils', () => {
  let element: HTMLElement
  let input: HTMLInputElement
  let select: HTMLSelectElement

  beforeEach(() => {
    element = document.createElement('div')
    input = document.createElement('input')
    select = document.createElement('select')

    // Add option to select for testing
    const option = document.createElement('option')
    option.value = 'test'
    option.textContent = 'Test Option'
    select.appendChild(option)
  })

  describe('_makeSetter', () => {
    describe('boolean attributes (selected)', () => {
      test('should set selected attribute when true', () => {
        const option = document.createElement('option')
        const setter = _makeSetter('selected', option)

        setter(true)
        expect(option.hasAttribute('selected')).toBe(true)
        expect(option.getAttribute('selected')).toBe('')
      })

      test('should remove selected attribute when false', () => {
        const option = document.createElement('option')
        option.setAttribute('selected', '')
        const setter = _makeSetter('selected', option)

        setter(false)
        expect(option.hasAttribute('selected')).toBe(false)
      })

      test('should remove selected attribute when null', () => {
        const option = document.createElement('option')
        option.setAttribute('selected', '')
        const setter = _makeSetter('selected', option)

        setter(null)
        expect(option.hasAttribute('selected')).toBe(false)
      })
    })

    describe('boolean properties (checked, disabled, hidden)', () => {
      test('should set checked property when true', () => {
        const setter = _makeSetter('checked', input)

        setter(true)
        expect(input.checked).toBe(true)
      })

      test('should set checked property to false when false', () => {
        input.checked = true
        const setter = _makeSetter('checked', input)

        setter(false)
        expect(input.checked).toBe(false)
      })

      test('should set checked property to null when null', () => {
        const setter = _makeSetter('checked', input)

        setter(null)
        expect(input.checked).toBe(false) // null becomes falsy
      })

      test('should handle disabled property', () => {
        const setter = _makeSetter('disabled', input)

        setter(true)
        expect(input.disabled).toBe(true)

        setter(false)
        expect(input.disabled).toBe(false)
      })

      test('should handle hidden property', () => {
        const setter = _makeSetter('hidden', element)

        setter(true)
        expect((element as any).hidden).toBe(true)

        setter(false)
        expect((element as any).hidden).toBe(false)
      })

      test('should handle multiple property', () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        const setter = _makeSetter('multiple', fileInput)

        setter(true)
        expect(fileInput.multiple).toBe(true)

        setter(false)
        expect(fileInput.multiple).toBe(false)
      })

      test('should handle readonly property', () => {
        const input = document.createElement('input')
        const setter = _makeSetter('readonly', input)

        setter(true)
        expect(input.readOnly).toBe(true)

        setter(false)
        expect(input.readOnly).toBe(false)
      })
    })

    describe('number properties (rowSpan, colSpan, tabIndex, valueAsNumber)', () => {
      test('should set tabIndex as number', () => {
        const setter = _makeSetter('tabIndex', element)

        setter('5')
        expect(element.tabIndex).toBe(5)

        setter(10)
        expect(element.tabIndex).toBe(10)
      })

      test('should set valueAsNumber on input', () => {
        input.type = 'number'
        const setter = _makeSetter('valueAsNumber', input)

        setter('42')
        expect(input.valueAsNumber).toBe(42)

        setter(100)
        expect(input.valueAsNumber).toBe(100)
      })

      test('should handle null for number properties', () => {
        const setter = _makeSetter('tabIndex', element)

        setter(null)
        expect(element.tabIndex).toBe(0) // null becomes 0 for numbers
      })

      test('should handle rowSpan and colSpan', () => {
        const td = document.createElement('td')

        const rowSpanSetter = _makeSetter('rowSpan', td)
        rowSpanSetter(3)
        expect((td as any).rowSpan).toBe(3)

        const colSpanSetter = _makeSetter('colSpan', td)
        colSpanSetter(2)
        expect((td as any).colSpan).toBe(2)
      })
    })

    describe('date properties (valueAsDate)', () => {
      test('should set valueAsDate on date input', () => {
        input.type = 'date'
        const setter = _makeSetter('valueAsDate', input)
        const testDate = new Date('2023-01-01')

        setter(testDate)
        expect(input.valueAsDate?.getTime()).toBe(testDate.getTime())
      })

      test('should handle null for date properties', () => {
        input.type = 'date'
        const setter = _makeSetter('valueAsDate', input)

        setter(null)
        expect(input.valueAsDate).toBe(null)
      })
    })

    describe('string properties (value, textContent, innerHTML, etc.)', () => {
      test('should set value as string', () => {
        const setter = _makeSetter('value', input)

        setter('test value')
        expect(input.value).toBe('test value')

        setter(123)
        expect(input.value).toBe('123')
      })

      test('should set textContent as string', () => {
        const setter = _makeSetter('textContent', element)

        setter('hello world')
        expect(element.textContent).toBe('hello world')

        setter(42)
        expect(element.textContent).toBe('42')
      })

      test('should handle null for string properties', () => {
        const setter = _makeSetter('value', input)

        setter(null)
        expect(input.value).toBe('') // null becomes empty string
      })

      test('should handle className', () => {
        const setter = _makeSetter('className', element)

        setter('test-class another-class')
        expect(element.className).toBe('test-class another-class')
      })

      test('should handle innerHTML', () => {
        const setter = _makeSetter('innerHTML', element)

        setter('<span>test</span>')
        expect(element.innerHTML).toBe('<span>test</span>')
      })
    })

    describe('generic attributes', () => {
      test('should set custom attribute', () => {
        const setter = _makeSetter('data-test', element)

        setter('custom value')
        expect(element.getAttribute('data-test')).toBe('custom value')
      })

      test('should remove custom attribute when null', () => {
        element.setAttribute('data-test', 'value')
        const setter = _makeSetter('data-test', element)

        setter(null)
        expect(element.hasAttribute('data-test')).toBe(false)
      })

      test('should handle id attribute', () => {
        const setter = _makeSetter('id', element)

        setter('test-id')
        expect(element.getAttribute('id')).toBe('test-id')
        expect(element.id).toBe('test-id')
      })
    })
  })

  describe('_makeGetter', () => {
    describe('boolean attributes (selected)', () => {
      test('should get selected attribute state', () => {
        const option = document.createElement('option')
        const getter = _makeGetter('selected', option)

        expect(getter()).toBe(false)

        option.setAttribute('selected', '')
        expect(getter()).toBe(true)
      })
    })

    describe('boolean properties (checked, disabled, hidden)', () => {
      test('should get checked property as boolean', () => {
        const getter = _makeGetter('checked', input)

        expect(getter()).toBe(false)

        input.checked = true
        expect(getter()).toBe(true)
      })

      test('should get disabled property as boolean', () => {
        const getter = _makeGetter('disabled', input)

        expect(getter()).toBe(false)

        input.disabled = true
        expect(getter()).toBe(true)
      })
    })

    describe('number properties', () => {
      test('should get tabIndex as number', () => {
        const getter = _makeGetter('tabIndex', element)

        element.tabIndex = 5
        expect(getter()).toBe(5)
      })

      test('should get valueAsNumber from input', () => {
        input.type = 'number'
        input.valueAsNumber = 42
        const getter = _makeGetter('valueAsNumber', input)

        expect(getter()).toBe(42)
      })
    })

    describe('date properties', () => {
      test('should get valueAsDate from date input', () => {
        input.type = 'date'
        const testDate = new Date('2023-01-01')
        input.valueAsDate = testDate
        const getter = _makeGetter('valueAsDate', input)

        expect((getter() as Date)?.getTime()).toBe(testDate.getTime())
      })
    })

    describe('string properties', () => {
      test('should get value as string', () => {
        input.value = 'test value'
        const getter = _makeGetter('value', input)

        expect(getter()).toBe('test value')
      })

      test('should get textContent as string', () => {
        element.textContent = 'hello world'
        const getter = _makeGetter('textContent', element)

        expect(getter()).toBe('hello world')
      })
    })

    describe('generic attributes', () => {
      test('should get custom attribute', () => {
        element.setAttribute('data-test', 'custom value')
        const getter = _makeGetter('data-test', element)

        expect(getter()).toBe('custom value')
      })

      test('should return null for non-existent attribute', () => {
        const getter = _makeGetter('data-nonexistent', element)

        expect(getter()).toBe(null)
      })
    })
  })
});
