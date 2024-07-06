/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, expect, afterEach, test } from 'vitest'

describe('If component', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('todo', () => {
    const el = document.createElement('div')
    expect(el.outerHTML).toBe('<div></div>')
  })
})
