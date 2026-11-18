import { afterEach, describe, expect, it, onTestFinished } from 'vitest'
import { HiddenWhenEmpty } from '../src/renderables/hidden-when-empty'
import { html, render } from '@tempots/dom'

describe('HiddenWhenEmpty', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('hides only opted-in elements and responds to content changes', () => {
    const clear = render(
      html.div(html.p(HiddenWhenEmpty), html.p()),
      document.body
    )

    onTestFinished(() => clear())

    const [optedIn, sibling] = document.querySelectorAll('p')
    expect(getComputedStyle(optedIn).display).toBe('none')
    expect(getComputedStyle(sibling).display).not.toBe('none')

    const content = document.createElement('span')
    content.textContent = 'Content'
    optedIn.appendChild(content)
    expect(getComputedStyle(optedIn).display).not.toBe('none')
    content.remove()
    expect(getComputedStyle(optedIn).display).toBe('none')
  })

  it('removes the rule when the last opted-in element is disposed', () => {
    const clearFirst = render(html.div(HiddenWhenEmpty), document.body)
    const clearSecond = render(html.p(HiddenWhenEmpty), document.body, {
      clear: false,
    })

    clearFirst()
    clearFirst()
    expect(getComputedStyle(document.querySelector('p')!).display).toBe('none')

    clearSecond()
    expect(document.head.querySelector('style')).toBeNull()
  })

  it('applies within a shadow root', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = host.attachShadow({ mode: 'open' })
    const target = document.createElement('section')
    root.appendChild(target)
    const clear = render(html.p(HiddenWhenEmpty), target)

    expect(getComputedStyle(target.querySelector('p')!).display).toBe('none')

    clear()
    expect(root.querySelector('style')).toBeNull()
  })
})
