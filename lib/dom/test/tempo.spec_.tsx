/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, expect, afterEach, test } from 'vitest'
import { Tempo } from '../src'
import { expectBody } from './common'

describe('Tempo utilities', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('invalid selector throws', () => {
    expect(() => Tempo.mount(<div></div>, { parent: 'notexistant' })).toThrow()
  })

  test('valid string selector', () => {
    document.body.innerHTML = '<div id="id"></div>'
    Tempo.mount(<span></span>, { parent: '#id' })
    expectBody().toBe('<div id="id"><span></span></div>')
  })

  test('valid element', () => {
    document.body.innerHTML = '<div></div>'
    const parent = document.body.firstElementChild
    if (!parent) throw new Error('no parent')
    Tempo.mount(<span></span>, { parent })
    expectBody().toBe('<div><span></span></div>')
  })
})
