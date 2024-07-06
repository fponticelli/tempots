/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, afterEach, test } from 'vitest'
import { makeFlow } from '@tempots/std/flow';
import { OneOf } from '../src/components/OneOf'
import { Tempo } from '../src/core/tempo'
import { expectBody } from './common'

type CrossA = { type: 'A'; a: number }
type CrossB = { type: 'B'; b: boolean }
type CrossC = { type: 'C'; c: string }

type Cross = CrossA | CrossB | CrossC

describe('OneOf component', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  // test('OneOf', () => {
  //   const [signal, mutator] = makeFlow({ type: 'A', a: 1 } as Cross)

  //   const cancel = Tempo.mount(
  //     <OneOf
  //       match={signal.match({
  //         A: (v: CrossA) => ['A', v.a] as ['A', number],
  //         B: (v: CrossB) => ['B', v.b] as ['B', boolean],
  //         C: (v: CrossC) => ['C', v.c] as ['C', string]
  //       })}
  //       A={(v: Signal<number>) => `number: ${v.toText()}`}
  //       B={(v: Signal<boolean>) => `boolean: ${v.toText()}`}
  //       C={(v: Signal<string>) => `string: ${v}`}
  //     />
  //   )

  //   expectBody().toBe('number: 1')

  //   mutator.set({ type: 'B', b: true })
  //   expectBody().toBe('boolean: true')

  //   mutator.set({ type: 'B', b: true })
  //   expectBody().toBe('boolean: true')

  //   mutator.set({ type: 'C', c: 'a' })
  //   expectBody().toBe('string: a')
  //   cancel()
  //   expectBody().toBe('')
  // })

  test('OneOf', () => {
    const [value, valueM] = makeFlow({ type: 'A', a: 1 } as Cross)

    const cancel = Tempo.mount(
      <OneOf
        match={value.map(v => {
          switch (v.type) {
            case 'A':
              return ['A', v.a] as ['A', number]
            case 'B':
              return ['B', v.b] as ['B', boolean]
            case 'C':
              return ['C', v.c] as ['C', string]
          }
        })}
        A={(a: number) => `number: ${a}`}
        B={(b: boolean) => `boolean: ${b}`}
        C={(c: string) => `string: ${c}`}
      />
    )

    expectBody().toBe('number: 1')

    valueM.set({ type: 'B', b: true })
    expectBody().toBe('boolean: true')

    valueM.set({ type: 'B', b: true })
    expectBody().toBe('boolean: true')

    valueM.set({ type: 'C', c: 'a' })
    expectBody().toBe('string: a')
    cancel()
    expectBody().toBe('')
  })
})
