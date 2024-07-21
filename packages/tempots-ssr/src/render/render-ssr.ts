import {
  Browser,
  BrowserWindow,
  IOptionalBrowserSettings,
  PropertySymbol,
} from 'happy-dom'
import { Renderable, prepareSSR, render } from '@tempots/dom'
import { FetchFunction } from './fetch'

const transfer = [
  'fetch',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'queueMicrotask',
] as const

const setGlobals = (window: BrowserWindow) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = globalThis
  const origWindow = g.window
  const orig = transfer.reduce(
    (acc, name) => {
      acc[name] = g[name]
      return acc
    },
    {} as Record<string, unknown>
  )
  g.window = window
  for (const name of transfer) {
    g[name] = window[name]
  }
  return function unsetGlobals() {
    g.window = origWindow
    for (const name of transfer) {
      g[name] = orig[name]
    }
  }
}

const browserSettings: IOptionalBrowserSettings = {
  disableComputedStyleRendering: true,
  disableCSSFileLoading: true,
  disableJavaScriptEvaluation: true,
  disableJavaScriptFileLoading: true,
}

/**
 * Options for server-side rendering.
 * @public
 */
export type RenderSSROptions = {
  /**
   * The HTML content to be rendered.
   */
  html: string

  /**
   * The URL of the page being rendered.
   */
  url: string

  /**
   * The selector for the root element where the app will be mounted.
   */
  selector: string

  /**
   * A function that returns the renderable app component.
   */
  makeApp: () => Renderable

  /**
   * Make a fetch function to use for the app.
   */
  makeFetch?: (originalFetch: FetchFunction) => FetchFunction

  /**
   * If true, the rendering will wait for the fetch to complete before completing.
   */
  waitFetch?: boolean
}

/**
 * Renders a DOM tree to a string using a fake dom implementation.
 *
 * @param html - The static HTML where to render the app.
 * @param url - The URL to use for the fake window.
 * @param selector - The selector to use find the parent element for the app.
 * @param makeApp - A function that creates the app to render.
 * @public
 */
export async function renderSSR({
  html,
  url,
  selector,
  makeApp,
  makeFetch,
  waitFetch,
}: RenderSSROptions) {
  const browser = new Browser({ settings: browserSettings })
  const page = browser.newPage()
  page.content = html
  page.url = url

  const browserWindow = page.mainFrame.document[PropertySymbol.ownerWindow]
  const originalFetch: BrowserWindow['fetch'] =
    makeFetch != null
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (makeFetch(browserWindow.fetch as any) as any)
      : browserWindow.fetch

  let fetchPromise: Promise<void> = Promise.resolve()
  let fetch = originalFetch

  if (waitFetch) {
    let counter = 0
    fetchPromise = new Promise((resolve, reject) => {
      fetch = (async (input: RequestInfo, init?: RequestInit) => {
        counter++
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return await originalFetch(input as any, init as any)
        } catch (error) {
          console.error('Error fetching', input, error)
          reject(error)
        } finally {
          counter--
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
      const interval = setInterval(() => {
        if (counter === 0) {
          clearInterval(interval)
          resolve()
        }
      }, 10)
    })
  }
  browserWindow.fetch = fetch

  const unsetGlobals = setGlobals(browserWindow)

  const wait = prepareSSR()
  const App = makeApp()

  const clear = render(App, selector, {
    doc: page.mainFrame.document as never,
    clear: false,
  })

  await Promise.all([wait, fetchPromise])

  const rendered = page.content
  clear()

  browser.close() // not awaiting
  unsetGlobals()

  return rendered
}
