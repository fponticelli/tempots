/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, afterEach, test } from 'vitest'
import { Tempo } from '../src/core/tempo'
import { expectBody, expectHead } from './common'
import { Portal } from '../src/components/Portal'

describe('Portal component', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('attach to head', () => {
    const cancel = Tempo.mount(
      <Portal parent="head">
        <title>hello</title>
      </Portal>
    )
    expectBody().toBe('')
    expectHead().toBe('<title>hello</title>')
    cancel()
    expectBody().toBe('')
    expectHead().toBe('')
  })
})
