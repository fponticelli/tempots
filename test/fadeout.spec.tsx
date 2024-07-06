/**
 * @jsxImportSource ../src
 */

import { render, FadeOut, Prop, When } from '../src'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('FadeOut', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('removed with clear', async () => {
    const view = <div style="opacity: 1"><FadeOut duration={10} opacity={0} /></div>
    const clear = render(view, document.body)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
    clear()
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
    await sleep(1)
    expect(document.body.innerHTML).not.toBe('<div style="opacity: 1;"></div>')
    await sleep(20)
    expect(document.body.innerHTML).toBe('')
  })

  test('with delay', async () => {
    const cond = Prop.of(true)
    const view = <When is={cond}><div style="opacity: 1"><FadeOut delay={10} duration={10} opacity={0} /></div></When>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
    cond.set(false)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
    await sleep(1)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
    await sleep(20)
    expect(document.body.innerHTML).toBe('')
  })
})
