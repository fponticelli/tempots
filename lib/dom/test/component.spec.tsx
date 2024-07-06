/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, afterEach, test } from 'vitest'
import { DOMContext, Prop } from '../src'
import { expectBody } from './common'
import { makeRenderable } from '../src/jsx-runtime'

export const Custom = ({ name, email }: { name: Prop<string>, email: string }) => {
  return (
    <div>
      {name}: {email}
    </div>
  )
}

describe('Component', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('should access scope', () => {
    // Tempo.mount(<Custom name="some" />)
    makeRenderable(<Custom name={Prop.of("foo")} email="bar@gmail.com" />).appendTo(DOMContext.of(document.body))
    expectBody().toBe('<div>some9</div>')
  })
})
