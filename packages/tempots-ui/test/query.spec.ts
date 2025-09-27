import { prop, render } from "@tempots/dom"
import { Query } from "../src/renderables/query"
import { beforeEach, describe, expect, test } from "vitest"
import { sleep } from "@tempots/std"

describe("query", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  test('query basics', async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      await sleep(5)
      if (request > 2) {
        throw 'test'
      }
      return request
    }
    const convertError = String
    const renderable = Query({
      request,
      load,
      convertError,
      success: ({ value }) => value.map(v => `success: ${v}`),
      failure: ({ error }) => error.map(v => `error: ${v}`),
      pending: ({ previous }) => previous.map(v => 'loading...' + (v ?? '')),
    })
    expect(renderable).toBeDefined()
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe('loading...')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1')
    request.value = 2
    await sleep(0)
    expect(document.body.innerHTML).toBe('loading...1')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2')
    request.value = 3
    await sleep(0)
    expect(document.body.innerHTML).toBe('loading...2')
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test')
    clear()
  })

  test('query basics sync', async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      if (request > 2) {
        throw 'test'
      }
      return request
    }
    const convertError = String
    const renderable = Query({
      request,
      load,
      convertError,
      success: ({ value }) => value.map(v => `success: ${v}`),
      failure: ({ error }) => error.map(v => `error: ${v}`),
      pending: () => 'loading...',
    })
    expect(renderable).toBeDefined()
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe('loading...')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1')
    request.value = 2
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2')
    request.value = 3
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test')
    clear()
  })

  test('query inline type inference', async () => {
    const renderable = Query({
      request: 1,
      load: async ({ request }) => {
        if (request > 2) {
          throw 'test'
        }
        return request
      },
      convertError: String,
      success: ({ value }) => value.map(v => `success: ${v}`),
      failure: ({ error }) => error.map(v => `error: ${v}`),
      pending: () => 'loading...',
    })
    expect(renderable).toBeDefined()
  })

  test("query no default loading", async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      if (request > 2) {
        throw "test"
      }
      return request
    }
    const convertError = String
    const renderable = Query({
      request,
      load,
      convertError,
      success: ({ value }) => value.map(v => `success: ${v}`),
    })
    expect(renderable).toBeDefined()
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe("")
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 1")
    request.value = 2
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 2")
    request.value = 3
    await sleep(5)
    expect(document.body.innerHTML).toBe("Error: test")
    clear()
  })
})
