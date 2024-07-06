/**
 * @jsxImportSource ../src
 */

import { render } from '../src'

describe('render', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('render div', () => {
    const clear = render(<div>foo</div>, document.body)
    expect(document.body.innerHTML).toBe('<div>foo</div>')
    clear()
    expect(document.body.innerHTML).toBe('')
  })
})
