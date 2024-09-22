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
    expect(root.contentToHTML(true)).toStrictEqual('<div data-tts-node><span>Hello World</span></div>')
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