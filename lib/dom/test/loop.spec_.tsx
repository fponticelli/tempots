/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, afterEach, test } from 'vitest'
import { Tempo } from '../src/core/tempo'
import { For } from '../src/components/For'
import { Repeat } from '../src/components/Repeat'
import { Entries } from '../src/components/Entries'
import { expectBody } from './common'
import { makeFlow } from '@tempots/std/flow'

describe('Loop components', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('Repeat', () => {
    const [value, valueM] = makeFlow(5)
    const cancel = Tempo.mount(
      <Repeat times={value}>{index => <li>{String(index + 1)}</li>}</Repeat>
    )
    expectBody().toBe('<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>')
    valueM.set(3)
    expectBody().toBe('<li>1</li><li>2</li><li>3</li>')
    valueM.set(4)
    expectBody().toBe('<li>1</li><li>2</li><li>3</li><li>4</li>')
    valueM.set(0)
    expectBody().toBe('')
    valueM.set(2)
    expectBody().toBe('<li>1</li><li>2</li>')
    cancel()
    expectBody().toBe('')
  })

  test('For', () => {
    const [values, valuesM] = makeFlow(['a', 'b', 'c'])
    Tempo.mount(
      <For of={values}>
        {(value, index) => (
          <li>
            {String(index + 1)}:{value}
          </li>
        )}
      </For>
    )
    expectBody().toBe('<li>1:a</li><li>2:b</li><li>3:c</li>')
    valuesM.set(['b'])
    expectBody().toBe('<li>1:b</li>')
    valuesM.set(['d', 'e', 'f'])
    expectBody().toBe('<li>1:d</li><li>2:e</li><li>3:f</li>')
    valuesM.set([])
    expectBody().toBe('')
    valuesM.set(['A', 'B', 'C'])
    expectBody().toBe('<li>1:A</li><li>2:B</li><li>3:C</li>')
    valuesM.set(['a', 'B', 'c'])
    expectBody().toBe('<li>1:a</li><li>2:B</li><li>3:c</li>')
  })

  test('Entries', () => {
    const [obj, objM] = makeFlow({
      a: 1,
      b: 2,
      c: 3
    } as { a?: number; b?: number; c?: number })
    const cancel = Tempo.mount(
      <Entries of={obj}>
        {(key, value) => {
          if (key === 'a') {
            return <a>{value.toText()}</a>
          } else if (key === 'b') {
            return <b>{value.toText()}</b>
          } else {
            return <i>{value.toText()}</i>
          }
        }}
      </Entries>
    )
    expectBody().toBe('<a>1</a><b>2</b><i>3</i>')
    objM.set({ a: 2, b: 5, c: 7 })
    expectBody().toBe('<a>2</a><b>5</b><i>7</i>')
    objM.set({ c: 3, a: 2, b: 1 })
    expectBody().toBe('<i>3</i><a>2</a><b>1</b>')
    objM.set({ a: 2, b: 5, c: 7 })
    expectBody().toBe('<a>2</a><b>5</b><i>7</i>')
    objM.set({ a: 2, c: 7 })
    expectBody().toBe('<a>2</a><i>7</i>')
    objM.set({ c: 2, a: 7 })
    expectBody().toBe('<i>2</i><a>7</a>')
    objM.set({ c: 8 })
    expectBody().toBe('<i>8</i>')
    objM.set({})
    expectBody().toBe('')
    objM.set({ a: 2, b: 5, c: 7 })
    expectBody().toBe('<a>2</a><b>5</b><i>7</i>')
    objM.set({})
    expectBody().toBe('')
    objM.set({ a: 2, c: 7 })
    expectBody().toBe('<a>2</a><i>7</i>')
    objM.set({ b: 1, a: 2, c: 7 })
    expectBody().toBe('<b>1</b><a>2</a><i>7</i>')
    cancel()
    expectBody().toBe('')
  })

  test('Entries starting empty', () => {
    const [obj, objM] = makeFlow({} as { a?: number; b?: number; c?: number })
    const cancel = Tempo.mount(
      <Entries of={obj}>
        {(key, value) => {
          if (key === 'a') {
            return <a>{value.toText()}</a>
          } else if (key === 'b') {
            return <b>{value.toText()}</b>
          } else {
            return <i>{value.toText()}</i>
          }
        }}
      </Entries>
    )
    expectBody().toBe('')
    objM.set({ a: 2, b: 5, c: 7 })
    expectBody().toBe('<a>2</a><b>5</b><i>7</i>')
    cancel()
    expectBody().toBe('')
  })
})
