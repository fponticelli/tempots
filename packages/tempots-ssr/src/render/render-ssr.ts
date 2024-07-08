import {
  Browser,
  BrowserWindow,
  IOptionalBrowserSettings,
  PropertySymbol,
} from 'happy-dom'
import { Mountable, startSSR, render } from '@tempots/dom'

const transfer = [
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

export async function renderSSR({
  html,
  url,
  selector,
  makeApp,
}: {
  html: string
  url: string
  selector: string
  makeApp: () => Mountable
}) {
  const browser = new Browser({ settings: browserSettings })
  const page = browser.newPage()
  page.content = html
  page.url = url

  const browserWindow = page.mainFrame.document[PropertySymbol.ownerWindow]
  const unsetGlobals = setGlobals(browserWindow)

  const wait = startSSR()
  const App = makeApp()

  const clear = render(App, selector, {
    doc: page.mainFrame.document as never,
    clear: false,
  })
  await wait
  const rendered = page.content
  clear()

  await browser.close()
  unsetGlobals()

  return rendered
}