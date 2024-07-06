/**
 * @vitest-environment jsdom
 * @jsxImportSource ../src
 */

import { describe, expect, test, afterEach } from 'vitest'
import { makeFlow } from '@tempots/std/flow'
import { makeRendarableOfElement, Cancel } from '../src/core/render'
import { CancellableScope } from '../src/core/scope'
import { JSX } from '../src/jsx-runtime'

function render(node: JSX.Element): [HTMLElement, Cancel] {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const renderable = makeRendarableOfElement(node)
  const scope = new CancellableScope(el)
  const cancel =
    renderable?.(scope) ??
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (() => {})
  return [el, cancel]
}

function Component(props: { children?: JSX.Element; name?: string }) {
  return (
    <div>
      hello {props.name ?? 'world'}
      {props.children}
    </div>
  )
}

describe('tempo foundations', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('test jsdom environment (sanity check)', () => {
    const el = document.createElement('div')
    expect(el.outerHTML).toBe('<div></div>')
  })

  test('simple text node (tree removal)', () => {
    const [parent, cancel] = render('hello')
    expect(parent.innerHTML).toBe('hello')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('simple text node (no tree removal)', () => {
    const [parent, cancel] = render('hello')
    expect(parent.innerHTML).toBe('hello')
    cancel(false)
    expect(parent.innerHTML).toBe('hello')
  })

  test('empty div (tree removal)', () => {
    const [parent, cancel] = render(<div></div>)
    expect(parent.innerHTML).toBe('<div></div>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('empty div (no tree removal)', () => {
    const [parent, cancel] = render(<div></div>)
    expect(parent.innerHTML).toBe('<div></div>')
    cancel(false)
    expect(parent.innerHTML).toBe('<div></div>')
  })

  test('string attribute', () => {
    const [parent] = render(<div id="myid"></div>)
    expect(parent.innerHTML).toBe('<div id="myid"></div>')
  })

  test('Signal<string> attribute', () => {
    const [href, hrefM] = makeFlow('/')
    const [parent, cancel] = render(<a href={href}>link</a>)
    expect(parent.innerHTML).toBe('<a href="/">link</a>')
    hrefM.set('/page')
    expect(parent.innerHTML).toBe('<a href="/page">link</a>')
    hrefM.set(null as unknown as string)
    expect(parent.innerHTML).toBe('<a>link</a>')
    cancel(true)
    hrefM.set('/')
    expect(parent.innerHTML).toBe('')
  })

  test('Signal<string> text', () => {
    const [value, valueM] = makeFlow('hello')
    const [parent, cancel] = render(<span>{value}</span>)
    expect(parent.innerHTML).toBe('<span>hello</span>')
    valueM.set('hello world')
    expect(parent.innerHTML).toBe('<span>hello world</span>')
    cancel(true)
    valueM.set('?')
    expect(parent.innerHTML).toBe('')
  })

  test('Signal<string> text (no tree removal)', () => {
    const [value, valueM] = makeFlow('hello')
    const [parent, cancel] = render(value)
    expect(parent.innerHTML).toBe('hello')
    valueM.set('hello world')
    expect(parent.innerHTML).toBe('hello world')
    cancel(false)
    valueM.set('?')
    expect(parent.innerHTML).toBe('hello world')
  })

  test('undefined, array and null', () => {
    const [parent, cancel] = render(
      <span>
        {undefined}
        {['1', null]}a
      </span>
    )
    expect(parent.innerHTML).toBe('<span>1a</span>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })
  test('fragment', () => {
    const [parent, cancel] = render(
      <>
        <br />
        {undefined}a
      </>
    )
    expect(parent.innerHTML).toBe('<br>a')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('lifecycle', () => {
    const expectations = [] as string[]
    const mount = (el: HTMLDivElement) => {
      expect(el).not.toBeNull()
      expectations.push('mount')
      return el
    }
    const remove = ({
      value,
      element
    }: {
      value: HTMLDivElement
      element: HTMLDivElement
    }) => {
      expect(value).toBe(element)
      expectations.push('remove')
    }
    const [parent, cancel] = render(
      <div afterMount={mount} beforeRemove={remove}></div>
    )
    expect(parent.innerHTML).toBe('<div></div>')
    expect(expectations).toEqual(['mount'])
    cancel(true)
    expect(expectations).toEqual(['mount', 'remove'])
    expect(parent.innerHTML).toBe('')
  })

  test('svg', () => {
    const [parent, cancel] = render(
      <div>
        <svg>
          <rect x={0} y={0} width={100} height={100} />
        </svg>
      </div>
    )
    expect(parent.innerHTML).toBe(
      '<div><svg><rect x="0" y="0" width="100" height="100"></rect></svg></div>'
    )
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('svg only', () => {
    const [parent, cancel] = render(
      <svg>
        <rect x={0} y={0} width={100} height={100} />
      </svg>
    )
    expect(parent.innerHTML).toBe(
      '<svg><rect x="0" y="0" width="100" height="100"></rect></svg>'
    )
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('Component without props and children', () => {
    const [parent, cancel] = render(<Component />)
    expect(parent.innerHTML).toBe('<div>hello world</div>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('Component with props and no children', () => {
    const [parent, cancel] = render(<Component name="John" />)
    expect(parent.innerHTML).toBe('<div>hello John</div>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('Component with props and children', () => {
    const [parent, cancel] = render(<Component name="John"><br /></Component>)
    expect(parent.innerHTML).toBe('<div>hello John<br></div>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('onClick', () => {
    let triggered = 0
    const onClick = (e: MouseEvent) => {
      expect(e).not.toBeNull()
      triggered++
    }
    const [parent, cancel] = render(<div onClick={onClick}></div>)
    expect(triggered).toBe(0)
    expect(parent.innerHTML).toBe('<div></div>')
    const el = parent.querySelector('div')
    el?.click()
    expect(triggered).toBe(1)
    cancel(true)
    expect(parent.innerHTML).toBe('')
    el?.click()
    expect(triggered).toBe(1)
  })

  test('style string as text', () => {
    const [parent] = render(<div style="display: block;"></div>)
    expect(parent.innerHTML).toBe('<div style="display: block;"></div>')
  })

  test('style Signal as text', () => {
    const [style, styleM] = makeFlow('display: inline-block;')
    const [parent] = render(<div style={style}></div>)
    expect(parent.innerHTML).toBe('<div style="display: inline-block;"></div>')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const el = parent.querySelector('div')!
    expect(el.style.display).toBe('inline-block')
    styleM.set('display: block;')
    expect(parent.innerHTML).toBe('<div style="display: block;"></div>')
    expect(el.style.display).toBe('block')
    styleM.set('')
    expect(parent.innerHTML).toBe('<div style=""></div>')
    expect(el.style.display).toBe('')
  })

  test('style property', () => {
    const [parent] = render(<div style={{ display: 'block' }}></div>)
    expect(parent.innerHTML).toBe('<div style="display: block;"></div>')
  })

  test('style Signal property', () => {
    const [display, displayM] = makeFlow('block')
    const [parent] = render(<div style={{ display }}></div>)
    expect(parent.innerHTML).toBe('<div style="display: block;"></div>')
    displayM.set('')
    expect(parent.innerHTML).toBe('<div style=""></div>')
  })

  test('style numeric property', () => {
    const [parent, cancel] = render(<svg style={{ width: 100 }}></svg>)
    expect(parent.innerHTML).toBe('<svg style="width: 100px;"></svg>')
    cancel(true)
    expect(parent.innerHTML).toBe('')
  })

  test('style numeric property (no tree removal)', () => {
    const [parent, cancel] = render(<svg style={{ width: 100 }}></svg>)
    expect(parent.innerHTML).toBe('<svg style="width: 100px;"></svg>')
    cancel(false)
  })

  test('style Signal numeric property', () => {
    const [width, widthM] = makeFlow(100)
    const [parent] = render(<svg style={{ width }}></svg>)
    expect(parent.innerHTML).toBe('<svg style="width: 100px;"></svg>')
    widthM.set(50)
    expect(parent.innerHTML).toBe('<svg style="width: 50px;"></svg>')
    widthM.set(null as unknown as number)
    expect(parent.innerHTML).toBe('<svg style=""></svg>')
  })

  test('checked property as literal booean', () => {
    const [parent] = render(<input type="checkbox" checked={true} />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(el.checked).toBe(true)
    expect(parent.innerHTML).toBe('<input type="checkbox">')
  })

  test('checked property as Signal of booean', () => {
    const [checked, checkedM] = makeFlow(true)
    const [parent] = render(<input type="checkbox" checked={checked} />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(el.checked).toBe(true)
    expect(parent.innerHTML).toBe('<input type="checkbox">')
    checkedM.set(false)
    expect(el.checked).toBe(false)
    expect(parent.innerHTML).toBe('<input type="checkbox">')
  })

  test('contentEditable property as literal booean', () => {
    const [parent] = render(<div contentEditable={true} />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(el.contentEditable).toBe(true)
  })

  test('contentEditable property as Signal of booean', () => {
    const [contentEditable, contentEditableM] = makeFlow(true)
    const [parent] = render(<div contentEditable={contentEditable} />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(parent.innerHTML).toBe('<div></div>')
    expect(el.contentEditable).toBe(true)
    contentEditableM.set(false)
    expect(el.contentEditable).toBe(false)
    expect(parent.innerHTML).toBe('<div></div>')
  })

  test('value property as literal string', () => {
    const [parent] = render(<input type="text" value="t" />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(el.value).toBe('t')
    expect(parent.innerHTML).toBe('<input type="text">')
  })

  test('value property as Signal of string', () => {
    const [value, valueM] = makeFlow('t')
    const [parent] = render(<input type="text" value={value} />)
    const el = parent.firstElementChild as HTMLInputElement
    expect(el.value).toBe('t')
    expect(parent.innerHTML).toBe('<input type="text">')
    valueM.set('f')
    expect(el.value).toBe('f')
    expect(parent.innerHTML).toBe('<input type="text">')
    valueM.set(null as unknown as string)
    expect(el.value).toBe('')
  })

  test('className as literal string', () => {
    const [parent] = render(<div className="cls" />)
    // const el = parent.firstElementChild as HTMLInputElement
    expect(parent.innerHTML).toBe('<div class="cls"></div>')
  })

  test('className as Signal of string', () => {
    const [cls, clsM] = makeFlow('cls')
    const [parent] = render(<div class={cls}></div>)
    expect(parent.innerHTML).toBe('<div class="cls"></div>')
    clsM.set('other')
    expect(parent.innerHTML).toBe('<div class="other"></div>')
  })

  test('aria-role as literal string', () => {
    const [parent] = render(<button aria-role="button" />)
    expect(parent.innerHTML).toBe('<button aria-role="button"></button>')
  })

  test('aria-role as Signal of string', () => {
    const [role, roleM] = makeFlow('button')
    const [parent] = render(<button aria-role={role}></button>)
    expect(parent.innerHTML).toBe('<button aria-role="button"></button>')
    roleM.set('submit')
    expect(parent.innerHTML).toBe('<button aria-role="submit"></button>')
    roleM.set(null as unknown as string)
    expect(parent.innerHTML).toBe('<button></button>')
  })
})
