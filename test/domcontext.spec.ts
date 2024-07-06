import { DOMContext } from '../src/dom-context'

describe('DOMContext', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  test('setAttribute', () => {
    const ctx = DOMContext.of(document.createElement('div'))
    expect(ctx.getElement()).not.toBeNull()
    ctx.setAttribute('id', 'foo')
    expect(ctx.getElement().outerHTML).toBe('<div id="foo"></div>')
    ctx.setAttribute('id', null)
    expect(ctx.getElement().outerHTML).toBe('<div></div>')
  })

  test('setBooleanAttribute', () => {
    const ctx = DOMContext.of(document.createElement('div'))
    expect(ctx.getElement()).not.toBeNull()
    ctx.setBooleanAttribute('hidden', true)
    expect(ctx.getElement().outerHTML).toBe('<div hidden=""></div>')
    ctx.setBooleanAttribute('hidden', false)
    expect(ctx.getElement().outerHTML).toBe('<div></div>')
  })

  test('createClass', () => {
    const ctx = DOMContext.of(document.createElement('div'))
    const [setClass, clear] = ctx.createClass('foo')
    expect(ctx.getElement().outerHTML).toBe('<div class="foo"></div>')
    setClass('bar')
    expect(ctx.getElement().outerHTML).toBe('<div class="bar"></div>')
    clear(true)
    expect(ctx.getElement().outerHTML).toBe('<div></div>')
  })
})
