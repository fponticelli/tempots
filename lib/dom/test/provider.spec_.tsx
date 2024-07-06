/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, expect, beforeEach, afterEach, test } from 'vitest'
import { Tempo } from '../src/core/tempo'
import { expectBody } from './common'
import { createContext } from '../src/components/Provider'
import { Scope } from '../src'

let SC = createContext('X')
const SCNoDefault = createContext<string>()

describe('If component', () => {
  beforeEach(() => {
    SC = createContext('X')
  })
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('no provider, use default', () => {
    Tempo.mount(<SC.Consumer>{value => value}</SC.Consumer>)
    expectBody().toBe('X')
  })

  test('no provider, no default', () => {
    expect(() =>
      Tempo.mount(<SCNoDefault.Consumer>{value => value}</SCNoDefault.Consumer>)
    ).toThrow()
  })

  test('provide value', () => {
    Tempo.mount(
      <SC.Provider value="OK">
        <SC.Consumer>{value => value}</SC.Consumer>
      </SC.Provider>
    )
    expectBody().toBe('OK')
  })

  test('provide nested', () => {
    Tempo.mount(
      <>
        <SC.Consumer>{value => value}</SC.Consumer>,
        <SC.Provider value="A">
          <SC.Consumer>{value => value}</SC.Consumer>,
          <SC.Provider value="B">
            <SC.Consumer>{value => value}</SC.Consumer>,
            <SC.Provider value="C">
              <SC.Consumer>{value => value}</SC.Consumer>,
            </SC.Provider>
            <SC.Consumer>{value => value}</SC.Consumer>,
          </SC.Provider>
          <SC.Provider value="Y">
            <SC.Consumer>{value => value}</SC.Consumer>,
            <SC.Provider value="Z">
              <SC.Consumer>{value => value}</SC.Consumer>,
            </SC.Provider>
            <SC.Consumer>{value => value}</SC.Consumer>,
          </SC.Provider>
          <SC.Consumer>{value => value}</SC.Consumer>,
        </SC.Provider>
        <SC.Consumer>{value => value}</SC.Consumer>
      </>
    )
    expectBody().toBe('X,A,B,C,B,Y,Z,Y,A,X')
  })

  test('provide consume', () => {
    const Component = (_: unknown, { consume }: Scope) => {
      return <>{consume(SC)}</>
    }
    Tempo.mount(
      <>
        <Component />,
        <SC.Provider value="A">
          <Component />,
          <SC.Provider value="B">
            <Component />,
            <SC.Provider value="C">
              <Component />,
            </SC.Provider>
            <Component />,
          </SC.Provider>
          <SC.Provider value="Y">
            <Component />,
            <SC.Provider value="Z">
              <Component />,
            </SC.Provider>
            <Component />,
          </SC.Provider>
          <Component />,
        </SC.Provider>
        <Component />
      </>
    )
    expectBody().toBe('X,A,B,C,B,Y,Z,Y,A,X')
  })
})
