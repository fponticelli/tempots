import { beforeEach, describe, expect, test } from "vitest";
import { attr, html, Portal, render, restoreTempoPlaceholders, runHeadless } from "../src";

describe("Headless Placeholders", () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test("default doesn't generate placeholders", async () => {
    const app = () => html.div(
      html.span('Hello World')
    )
    const { root } = runHeadless(app)
    expect(root.contentToHTML()).toStrictEqual('<div><span>Hello World</span></div>')
  })

  test("children are marked as placeholders", async () => {
    const app = () => html.div(
      html.span('Hello World')
    )
    const { root } = runHeadless(app)
    const output = root.contentToHTML(true)
    const container = document.createElement('main')
    container.innerHTML = output
    expect(container.querySelector('div')?.getAttribute('data-tempo-position')).toBe(':0')
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-tempo-position')).toBe(':0')
    expect(span?.firstChild?.nodeValue).toBe('tempo-node:text::0')
    expect(span?.textContent).toBe('Hello World')
  })

  test('serialized markers are excluded from raw text fields in both output modes', async () => {
    const { root, clear } = runHeadless(() => html.textarea('Example'))
    const htmlString = root.contentToHTML(true)
    let streamed = ''
    for await (const chunk of root.contentToHTMLStream({ generatePlaceholders: true })) {
      streamed += chunk
    }
    const container = document.createElement('main')
    container.innerHTML = htmlString
    expect(container.querySelector('textarea')?.value).toBe('Example')
    expect(streamed).toBe(htmlString)
    clear()
  })

  test('restore placeholders', async () => {
    const body = document.body
    body.innerHTML = `<div id="body" class="body-cls" data-tts-class="orig">
      <span title="orig1">
        Hello World 1
      </span>
      <span data-tts-attrs="{&quot;title&quot;: &quot;orig2&quot;}" title="other">
        Hello World 2
      </span>
      <span data-tts-node>Hello World</span>
    </div>`
    restoreTempoPlaceholders()
    expect(body.innerHTML).toStrictEqual(`<div id="body" class="orig">
      <span title="orig1">
        Hello World 1
      </span>
      <span title="orig2">
        Hello World 2
      </span>
      
    </div>`)
  })
})
