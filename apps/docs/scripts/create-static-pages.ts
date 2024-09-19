// import { renderSSR, FetchFunction } from '@tempots/ssr'
import { App } from '../src/components/app'
import * as fsp from 'fs/promises'
import * as fse from 'fs-extra'
import * as path from 'path'
import { runHeadless, ProvideGlobalProbe } from '@tempots/dom'

const htmlTemplate = (async () => {
  const htmlPath = path.resolve(process.cwd(), './dist/index.html')
  // console.log(`Reading ${htmlPath}`)
  const html = await fsp.readFile(htmlPath, 'utf-8')
  return html
})()

const jsonToc = (async () => {
  const tocPath = path.resolve(process.cwd(), './public/toc.json')
  // console.log(`Reading ${tocPath}`)
  const toc = JSON.parse( (await fsp.readFile(tocPath, 'utf-8')))
  return toc
})()

const makePoller = (delay: number = 0) => {
  let fetchCount = 0
  let outerResolve: () => void
  let done = new Promise<void>(resolve => {
    outerResolve = resolve
  })
  const start = () => {
    fetchCount++
    console.log('start', fetchCount)
  }
  const end = () => {
    fetchCount--
    console.log('end', fetchCount)
    if (fetchCount > 0) {
      return
    }
    console.log('resolve')
    setTimeout(outerResolve, delay)
  }
  return { start, end, done }
}

const renderPage = async (pageUrl: string) => {
  const url = `https://tempots.com${pageUrl}`
  const toc = await jsonToc
  const html = await htmlTemplate
  const { start, end, done } = makePoller()
  const makeFetch = (originalFetch) => {
    return (async (input: RequestInfo, init?: RequestInit) => {
      console.log('## FETCH', input)
      start()
      if (typeof input === 'string' && (input.startsWith('/'))) { // || input.startsWith('https://tempots.com/'))) {
        // console.log('# FETCH 1: ', input)
        // if (input.startsWith('https://tempots.com/')) {
        //   input = input.slice('https://tempots.com'.length)
        // }
        // console.log('# FETCH 2: ', input)
        try {
          const file = await fsp.readFile(path.resolve(process.cwd(), `./dist${input}`), 'utf-8')
          return new Response(file, { status: 200 })
        } catch (error) {
          console.error('Error fetching', input, error)
          return new Response('Not found', { status: 404 })
        } finally {
          end()
        }
      }
      start()
      return originalFetch(`https://tempots.com${input}`, init).finally(end)
    })
  }
  let originalFetch = fetch
  Reflect.set(globalThis, 'fetch', makeFetch(originalFetch))
  const app = App(toc)
  console.log('### RENDER', url)
  const { root } = runHeadless(app, url)
  // TODO
  return done.then(() => {
    const portals = root.getPortals()
    portals.forEach(p => {
      console.log('> PORTAL: ', p.selector, p.hasChildren(), p.hasClasses(), p.hasStyles(), p.hasAttributes(), p.hasHandlers(), p.hasRenderableProperties())
    })
    console.log('# DONE', url)
    Reflect.set(globalThis, 'fetch', originalFetch)
    try {
      const html = root.contentToHTML()
      console.log('# rendered html!')
      return html
    } catch (error) {
      console.error('Error rendering', url, error)
      return ''
    }
  })
  // return renderSSR({
  //   url,
  //   html,
  //   makeApp: () => App(toc),
  //   selector: 'body',
  //   makeFetch,
  //   waitFetch: true,
  // })
}

const extractURLs = (html: string) => {
  const urls = new Set<string>()
  const urlPattern = /href="([^"]+)"/g
  let match: RegExpExecArray | null
  while ((match = urlPattern.exec(html)) !== null) {
    urls.add(match[1])
  }
  return Array.from(urls)
}

const filterURLs = (urls: string[]) => {
  return urls
    .filter(url => url.startsWith('/'))
    .filter(url => !url.startsWith('/assets/'))
}

console.log('Creating static pages...')
const generated = new Set<string>([
  '/demos/hnpwa/index.html',
  '/demos/7guis/index.html',
  '/demos/counter/index.html',
  '/demos/todomvc/index.html'
])
const toGenerate = ['/']
while (toGenerate.length > 0) {
  // console.log('next ...', toGenerate.length)
  const url = toGenerate.pop()!
  try {
    const basePath = path.resolve(process.cwd(), './dist')
    const filePath = path.join(basePath, url === '/' ? '/index.html' : url)
    const dirPath = path.dirname(filePath)
    if (generated.has(url)) {
      // console.log('already generated', url)
      continue
    }
    generated.add(url)
    if (url !== '/' && await fse.exists(filePath)) {
      console.log(filePath)
      continue
    }
    // console.log('Render:', url)
    const html = await renderPage(url)
    // console.log('after render')
    const urls = filterURLs(extractURLs(html))
    const newUrls = urls.filter(url => !generated.has(url))
    // console.log(newUrls)
    toGenerate.push(...newUrls)

    // save html
    console.log(`#### SAVED TO ${filePath}`)

    await fse.ensureDir(dirPath)
    await fsp.writeFile(filePath, html)

    // console.log('generated', generated)
    // console.log('toGenerate', toGenerate.length)
  } catch (error) {
    console.error('Error rendering', url, error)
    continue
  }

  // console.log(`Writing ${url}, ${toGenerate.length} to go...`)
}
console.log(`Done, processed ${generated.size} files`)
