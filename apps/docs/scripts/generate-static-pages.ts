import { App } from '../src/components/app'
import * as fsp from 'fs/promises'
import * as fse from 'fs-extra'
import * as path from 'path'
import { runHeadless } from '@tempots/dom'
import * as cheerio from 'cheerio';

const main = async () => {
  const htmlTemplate = (async () => {
    const htmlPath = path.resolve(process.cwd(), './dist/index.html')
    const html = await fsp.readFile(htmlPath, 'utf-8')
    return html
  })()

  const jsonToc = (async () => {
    const tocPath = path.resolve(process.cwd(), './public/toc.json')
    const toc = JSON.parse( (await fsp.readFile(tocPath, 'utf-8')))
    return toc
  })()

  const makePoller = (delay: number = 0, initialWait: number = 10) => {
    let fetchCount = 0
    let outerResolve: () => void
    let done = new Promise<void>(resolve => {
      outerResolve = resolve
    })
    let initialTimer = setTimeout(() => {
      // Resolve if there are no outstanding fetches
      if (fetchCount === 0) {
        outerResolve()
      }
    }, initialWait)
    const start = () => {
      clearTimeout(initialTimer)
      fetchCount++
    }
    const end = () => {
      fetchCount--
      if (fetchCount > 0) {
        return
      }
      setTimeout(outerResolve, delay)
    }
    return { start, end, done }
  }

  const renderPage = async (pageUrl: string) => {
    const url = `https://tempots.com${pageUrl}`
    try {
      const toc = await jsonToc
      const $ = cheerio.load(await htmlTemplate)
      const { start, end, done } = makePoller()

      const makeFetch = (originalFetch) => {
        return (async (input, init?: RequestInit) => {
          start()
          if (typeof input === 'string' && (input.startsWith('/'))) { // || input.startsWith('https://tempots.com/'))) {
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
          return originalFetch(`https://tempots.com${input}`, init).finally(end)
        })
      }
      const originalFetch = fetch
      global.fetch = makeFetch(originalFetch)
      // Reflect.set(this, 'fetch', makeFetch(fetch))
      const app = App(toc)
      const { root } = runHeadless(app, url)
      // TODO
      await done

      const portals = root.getPortals()
      portals.forEach(p => {
        if (p.selector === ':root') {
          $('body').prepend(p.contentToHTML())
        } else if (p.hasRenderableProperties()) {
          const el = $(p.selector)
          if (p.hasInnerHTML()) {
            el.html(p.getInnerHTML())
          }
          if (p.hasInnerText()) {
            el.text(p.getInnerText())
          }
          if (p.hasChildren()) {
            el.append(p.contentToHTML())
          }
          if (p.hasClasses()) {
            el.addClass(p.getClasses().join(' '))
          }
          if (p.hasStyles()) {
            el.css(p.getStyles())
          }
          if (p.hasAttributes()) {
            el.attr(Object.fromEntries(p.getAttributes()) as Record<string, string>)
          }
        }
      })
      global.fetch = originalFetch
      return $.html()
    } catch (error) {
      console.error('Error rendering', url, error)
      return ''
    }
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
        // console.log(filePath)
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
      // console.log(`#### SAVED TO ${filePath}`)

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
}

main()
  .catch(error => {
    console.error('Error', error)
    process.exit(1)
  })