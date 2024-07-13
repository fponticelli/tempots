import showdown from 'showdown'
import fm from 'front-matter'
import { highlight } from './highlight'
import { Browser, IOptionalBrowserSettings } from 'happy-dom'

const converter = new showdown.Converter({
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
})

const renameHtml = (path: string) => {
  const hasLeadingHash = path.startsWith('#')
  const parts = path.split('#').filter(a => !!a)
  if (!parts[0].endsWith('.html')) return path
  function processPart(part: string) {
    return part
      .split('.')
      .map(p => p.replace(/^_+|_+$/g, ''))
      .join('.')
  }
  const res = parts[0].split('/').map(processPart).join('/')
  return (hasLeadingHash ? [''] : [])
    .concat([res].concat(parts.slice(1)))
    .join('#')
}

function getComments(el: Element) {
  const arr = [] as Node[]
  for (const i in el.childNodes) {
    const n = el.childNodes[i]
    if (n.nodeType === 8) {
      arr.push(n)
    } else if (n.nodeType === 1) {
      arr.push(...getComments(n as Element))
    }
  }
  return arr
}

const browserSettings: IOptionalBrowserSettings = {
  disableComputedStyleRendering: true,
  disableCSSFileLoading: true,
  disableJavaScriptEvaluation: true,
  disableJavaScriptFileLoading: true,
}

export const markdown = (
  content: string,
  anchorMangler: (s: string) => string
) => {
  const rawHtml = converter.makeHtml(content)
  const browser = new Browser({ settings: browserSettings })
  const page = browser.newPage()
  page.content = rawHtml
  const document = page.mainFrame.document
  const codes = document.querySelectorAll('.language-ts')
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    // code.parentElement?.classList.add('language-ts')
    code.setAttribute('data-prismjs-copy', 'Copy code')
    code.innerHTML = highlight(code.textContent || '')
  }

  const anchors = document.querySelectorAll('a')
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]
    const href = a.href
    if (href.startsWith('http:') || href.startsWith('https:')) continue
    a.href = renameHtml(anchorMangler(href))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments = getComments(document.body as any)
  const toDelete = [] as Node[]
  for (const comment of comments) {
    let next: ChildNode | null = comment as ChildNode
    toDelete.push(next)
    while ((next = next.nextSibling)) {
      if (next != null && next.nodeType === Node.TEXT_NODE) {
        toDelete.push(next)
      } else {
        break
      }
    }
  }
  toDelete.forEach(n => {
    n.parentElement?.removeChild(n)
  })

  const el = document.body
  // while (el.childNodes.length === 1) {
  //   if (!el.firstElementTNode) break
  //   el = el.firstElementTNode as HTMLElement
  // }
  // console.log(el.nodeName)
  return el.innerHTML
}

export const markdownWithFM = (
  content: string,
  anchorMangler: (s: string) => string
) => {
  const parsed = fm(content)
  const html = markdown(parsed.body, anchorMangler)
  return {
    html,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: parsed.attributes as any,
  }
}
