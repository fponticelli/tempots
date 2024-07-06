/**
 * @jsxImportSource ../src
 */

import { render, FadeIn } from '../src'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('FadeIn', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('with delay and start', async () => {
    const view = <div><FadeIn delay={10} duration={10} start={{ opacity: 0 }} opacity={1} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div style="opacity: 0;"></div>')
    await sleep(1)
    expect(document.body.innerHTML).toBe('<div style="opacity: 0;"></div>')
    await sleep(20)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
  })

  test('without delay and start', async () => {
    const view = <div><FadeIn duration={10} opacity={1} /></div>
    render(view, document.body)
    expect(document.body.innerHTML).toBe('<div style="opacity: 0;"></div>')
    await sleep(1)
    expect(document.body.innerHTML).not.toBe('<div style="opacity: 0;"></div>')
    await sleep(20)
    expect(document.body.innerHTML).toBe('<div style="opacity: 1;"></div>')
  })
})
