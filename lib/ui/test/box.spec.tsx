/**
 * @vitest-environment jsdom
 * @jsxImportSource ../../dom/src
 */

import { describe, afterEach, test } from 'vitest'
import { Tempo } from '@tempots/dom'
import { Box } from '../src/components/Box'

describe('Box', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('todo', () => {
    // const box = <Box>Hello</Box>
    // Tempo.mount(box)
    // const el = document.createElement('div')
    // expect(el.outerHTML).toBe('<div></div>')
  })
})
