import { renderSSR, FetchFunction } from '@tempots/ssr'
import { App } from '../src/components/app'
import * as fsp from 'fs/promises'
import * as fse from 'fs-extra'
import * as path from 'path'

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

const renderPage = async (pageUrl: string) => {
  const url = `https://tempots.com${pageUrl}`
  const toc = await jsonToc
  const html = await htmlTemplate
  const makeFetch = (originalFetch) => {
    return (async (input: RequestInfo, init?: RequestInit) => {
      if (typeof input === 'string' && input.startsWith('/')) {
        try {
          const file = await fsp.readFile(path.resolve(process.cwd(), `./dist${input}`), 'utf-8')
          return new Response(file, { status: 200 })
        } catch (error) {
          console.error('Error fetching', input, error)
          return new Response('Not found', { status: 404 })
        }
      }
      return originalFetch(`https://tempots.com${input}`, init)
    }) as FetchFunction
  }
  // console.log('before renderSSR', url)
  return renderSSR({
    url,
    html,
    makeApp: () => App(toc),
    selector: 'body',
    makeFetch,
    waitFetch: true,
  })
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
    .filter(url => url.split('.').length === 1)
}

console.log('Creating static pages...')
const generated = new Set<string>()
const toGenerate = ['/']
while (toGenerate.length > 0) {
  // console.log('next ...', toGenerate.length)
  const url = toGenerate.pop()!
  try {
    // console.log('url', url)
    if (generated.has(url)) {
      // console.log('already generated', url)
      continue
    }
    generated.add(url)
    // console.log('before render')
    const html = await renderPage(url)
    // console.log('after render')
    const urls = filterURLs(extractURLs(html))
    const newUrls = urls.filter(url => !generated.has(url))
    toGenerate.push(...newUrls)

    // save html
    const basePath = path.resolve(process.cwd(), './dist')
    const filePath = path.join(basePath, url === '/' ? '/index.html' : url + '/index.html')

    await fse.ensureDir(path.dirname(filePath))
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
