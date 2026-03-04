import { describe, expect, test, beforeEach } from 'vitest'
import { isInputFocused } from '../src'

describe('isInputFocused', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('returns false when nothing is focused', () => {
    expect(isInputFocused()).toBe(false)
  })

  test('returns true when an input is focused', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    expect(isInputFocused()).toBe(true)
  })

  test('returns true when a textarea is focused', () => {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.focus()
    expect(isInputFocused()).toBe(true)
  })

  test('returns true when a select is focused', () => {
    const select = document.createElement('select')
    document.body.appendChild(select)
    select.focus()
    expect(isInputFocused()).toBe(true)
  })

  test('returns true when a contentEditable element is focused', () => {
    const div = document.createElement('div')
    div.contentEditable = 'true'
    document.body.appendChild(div)
    div.focus()
    expect(isInputFocused()).toBe(true)
  })

  test('returns false when a regular div is focused', () => {
    const div = document.createElement('div')
    div.tabIndex = 0
    document.body.appendChild(div)
    div.focus()
    expect(isInputFocused()).toBe(false)
  })

  test('returns false when a button is focused', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()
    expect(isInputFocused()).toBe(false)
  })

  test('accepts a custom document', () => {
    expect(isInputFocused(document)).toBe(false)
  })

  test('returns false for undefined document', () => {
    expect(isInputFocused(undefined)).toBe(false)
  })
})
