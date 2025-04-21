import { prop, render } from "@tempots/dom"
import { Resource } from "../src/renderables/resource"
import { beforeEach, describe, expect, test } from "vitest"
import { sleep } from "@tempots/std"

describe("resource", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  test("resource basics", async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      await sleep(5)
      if (request > 2) {
        throw "test"
      }
      return request
    }
    const convertError = String
    const renderable = Resource({
      request,
      load,
      mapError: convertError
    })({
      success: v => v.map(v => `success: ${v}`),
      failure: e => e.map(v => `error: ${v}`),
      loading: p => p.map(v => "loading..." + (v ?? '')),
    })
    expect(renderable).toBeDefined()
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe("loading...")
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 1")
    request.value = 2
    await sleep(0)
    expect(document.body.innerHTML).toBe("loading...1")
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 2")
    request.value = 3
    await sleep(0)
    expect(document.body.innerHTML).toBe("loading...2")
    await sleep(5)
    expect(document.body.innerHTML).toBe("error: test")
    clear()
  })

  test("resource basics sync", async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      if (request > 2) {
        throw "test"
      }
      return request
    }
    const convertError = String
    const renderable = Resource({
      request,
      load,
      mapError: convertError
    })({
      success: v => v.map(v => `success: ${v}`),
      failure: e => e.map(v => `error: ${v}`),
      loading: () => "loading...",
    })
    expect(renderable).toBeDefined()
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe("loading...")
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 1")
    request.value = 2
    await sleep(5)
    expect(document.body.innerHTML).toBe("success: 2")
    request.value = 3
    await sleep(5)
    expect(document.body.innerHTML).toBe("error: test")
    clear()
  })

  test("resource no default loading", async () => {
    const request = prop(1)
    const load = async ({ request }: { request: number }) => {
      if (request > 2) {
        throw "test"
      }
      return request
    }
    const convertError = String
    const renderable = Resource({
      request,
      load,
      mapError: convertError
    })({
      success: v => v.map(v => `success: ${v}`),
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
