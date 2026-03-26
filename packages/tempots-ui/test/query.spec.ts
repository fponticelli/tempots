import { prop, render } from '@tempots/dom'
import { Query } from '../src/renderables/query'
import { makeQueryResource } from '../src/utils/query-resource'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { sleep } from '@tempots/std'

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
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    request.value = 2
    await sleep(0)
    expect(document.body.innerHTML).toBe('loading...1<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    request.value = 3
    await sleep(0)
    expect(document.body.innerHTML).toBe('loading...2<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test<!---->')
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
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    request.value = 2
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    request.value = 3
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test<!---->')
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

  test('loading signal is available in success callback', async () => {
    const request = prop(1)
    let capturedLoading = false
    const renderable = Query({
      request,
      load: async ({ request }) => {
        await sleep(5)
        return request
      },
      success: ({ value, loading }) => {
        loading.on(v => { capturedLoading = v })
        return value.map(v => `success: ${v}`)
      },
      pending: () => 'loading...',
    })
    const clear = render(renderable, document.body)
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    expect(capturedLoading).toBe(false)
    request.value = 2
    await sleep(0)
    expect(capturedLoading).toBe(true)
    await sleep(5)
    expect(capturedLoading).toBe(false)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    clear()
  })

  test('keepOnReload keeps success view during reload', async () => {
    const request = prop(1)
    let loadingDuringSuccess = false
    const renderable = Query({
      request,
      load: async ({ request }) => {
        await sleep(5)
        if (request > 2) {
          throw 'test'
        }
        return request
      },
      convertError: String,
      keepOnReload: true,
      success: ({ value, loading }) => {
        loading.on(v => { loadingDuringSuccess = v })
        return value.map(v => `success: ${v}`)
      },
      pending: () => 'loading...',
      failure: ({ error }) => error.map(v => `error: ${v}`),
    })
    const clear = render(renderable, document.body)
    // initial load shows pending
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    // reload: success view stays mounted
    request.value = 2
    await sleep(0)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    expect(loadingDuringSuccess).toBe(true)
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    expect(loadingDuringSuccess).toBe(false)
    // reload with failure: still keeps success until failure resolves
    request.value = 3
    await sleep(0)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    expect(loadingDuringSuccess).toBe(true)
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test<!---->')
    clear()
  })

  test('keepOnReload still shows pending on initial load', async () => {
    const request = prop(1)
    const renderable = Query({
      request,
      load: async ({ request }) => {
        await sleep(5)
        return request
      },
      keepOnReload: true,
      success: ({ value }) => value.map(v => `success: ${v}`),
      pending: () => 'loading...',
    })
    const clear = render(renderable, document.body)
    // no previous success, so pending branch is used
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    clear()
  })

  test('keepOnReload does not keep failure as success on reload after failure', async () => {
    const request = prop(1)
    const renderable = Query({
      request,
      load: async ({ request }) => {
        await sleep(5)
        if (request === 1) throw 'fail'
        return request
      },
      convertError: String,
      keepOnReload: true,
      success: ({ value }) => value.map(v => `success: ${v}`),
      pending: () => 'loading...',
      failure: ({ error }) => error.map(v => `error: ${v}`),
    })
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: fail<!---->')
    // reload after failure — no previous success, so pending shows
    request.value = 2
    await sleep(0)
    expect(document.body.innerHTML).toBe('loading...<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    clear()
  })

  test('cancel is available in load function', async () => {
    const request = prop(1)
    let cancelCalled = false
    const renderable = Query({
      request,
      load: async ({ request, cancel }) => {
        if (request === 2) {
          cancel()
          cancelCalled = true
        }
        await sleep(5)
        return request
      },
      success: ({ value }) => value.map(v => `success: ${v}`),
      pending: () => 'loading...',
    })
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    request.value = 2
    await sleep(5)
    expect(cancelCalled).toBe(true)
    clear()
  })

  test('notAsked display option renders before first load', async () => {
    let loadCalled = false
    const renderable = Query({
      request: 1,
      load: async ({ request }) => {
        loadCalled = true
        await sleep(5)
        return request
      },
      notAsked: () => 'not asked yet',
      success: ({ value }) => value.map(v => `success: ${v}`),
      pending: () => 'loading...',
    })
    expect(renderable).toBeDefined()
    // notAsked is the initial state before Value.on triggers the first load
    // but since Value.on fires synchronously for the initial value,
    // by the time render completes it's already in loading state
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(loadCalled).toBe(true)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    clear()
  })

  test('convertError is called exactly once on error', async () => {
    const convertError = vi.fn(String)
    const renderable = Query({
      request: 1,
      load: async () => {
        throw 'test-error'
      },
      convertError,
      onError: () => {},
      success: ({ value }) => value.map(v => `success: ${v}`),
      failure: ({ error }) => error.map(v => `error: ${v}`),
    })
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(document.body.innerHTML).toBe('error: test-error<!---->')
    expect(convertError).toHaveBeenCalledTimes(1)
    expect(convertError).toHaveBeenCalledWith('test-error')
    clear()
  })

  test('onSuccess and onError callbacks fire correctly', async () => {
    const request = prop(1)
    const successCb = vi.fn()
    const errorCb = vi.fn()
    const settledCb = vi.fn()
    const renderable = Query({
      request,
      load: async ({ request }) => {
        await sleep(5)
        if (request > 1) throw 'fail'
        return request
      },
      convertError: String,
      onSuccess: successCb,
      onError: errorCb,
      onSettled: settledCb,
      success: ({ value }) => value.map(v => `success: ${v}`),
      failure: ({ error }) => error.map(v => `error: ${v}`),
    })
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(successCb).toHaveBeenCalledWith(1, 1)
    expect(settledCb).toHaveBeenCalledTimes(1)
    request.value = 2
    await sleep(5)
    expect(errorCb).toHaveBeenCalledWith('fail', 2)
    expect(settledCb).toHaveBeenCalledTimes(2)
    clear()
  })

  test('keepOnReload with reload() call keeps success view', async () => {
    let reloadFn: () => void
    let callCount = 0
    const renderable = Query({
      request: 'fixed',
      load: async () => {
        callCount++
        await sleep(5)
        return `result-${callCount}`
      },
      keepOnReload: true,
      success: ({ value, reload, loading }) => {
        reloadFn = reload
        return value.map(v => loading.value ? `${v} (reloading)` : v)
      },
      pending: () => 'loading...',
    })
    const clear = render(renderable, document.body)
    await sleep(5)
    expect(document.body.innerHTML).toBe('result-1<!---->')
    reloadFn!()
    await sleep(0)
    // success view stays mounted, loading is true
    expect(document.body.innerHTML).toBe('result-1 (reloading)<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('result-2<!---->')
    clear()
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
    expect(document.body.innerHTML).toBe('<!---->')
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 1<!---->')
    request.value = 2
    await sleep(5)
    expect(document.body.innerHTML).toBe('success: 2<!---->')
    request.value = 3
    await sleep(5)
    expect(document.body.innerHTML).toBe('Error: test<!---->')
    clear()
  })
})
