import { marked } from 'marked'
import fm from 'front-matter'
import { highlightShell, highlightTS } from './highlight'
import { Browser, IOptionalBrowserSettings } from 'happy-dom'

// const renameHtml = (path: string) => {
//   const hasLeadingHash = path.startsWith('#')
//   const parts = path.split('#').filter(a => !!a)
//   if (!parts[0].endsWith('.html')) return path
//   function processPart(part: string) {
//     return part
//       .split('.')
//       .map(p => p.replace(/^_+|_+$/g, ''))
//       .join('.')
//   }
//   const res = parts[0].split('/').map(processPart).join('/')
//   return (hasLeadingHash ? [''] : [])
//     .concat([res].concat(parts.slice(1)))
//     .join('#')
// }

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

export const markdownToHTML = async (
  content: string,
  { anchorMangler, domMangler }: ManglerOptions = {}
) => {
  const rawHtml = await marked(content)
  const browser = new Browser({ settings: browserSettings })
  const page = browser.newPage()
  page.content = rawHtml
  const document = page.mainFrame.document
  let codes = document.querySelectorAll('.language-ts,.language-typescript')
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    code.innerHTML = highlightTS(code.textContent || '')
  }
  codes = document.querySelectorAll('.language-sh,.language-bash,.language-shell')
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    code.innerHTML = highlightShell(code.textContent || '')
  }

  const anchors = document.querySelectorAll('a')
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]
    const href = a.href
    if (href.startsWith('http:') || href.startsWith('https:')) continue
    a.href = anchorMangler?.(href) ?? href
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments = getComments(document.body as any)
  const toDelete = [] as Node[]
  for (const comment of comments) {
    let next: ChildNode | null = comment as ChildNode
    toDelete.push(next)
    while ((next = next.nextSibling)) {
      if (next != null && next.nodeType === 3) { // Node.TEXT_NODE
        toDelete.push(next)
      } else {
        break
      }
    }
  }
  toDelete.forEach(n => {
    n.parentElement?.removeChild(n)
  })

  if (domMangler != null) {
    domMangler(document as any)
  }

  const el = document.body
  // while (el.childNodes.length === 1) {
  //   if (!el.firstElementTNode) break
  //   el = el.firstElementTNode as HTMLElement
  // }
  // console.log(el.nodeName)
  return el.innerHTML
}

export type ManglerOptions = {
  anchorMangler?: (s: string) => string
  mdMangler?: (s: string) => string
  domMangler?: (doc: Document) => void
}

function removeComments(md: string) {
  return md.replace(/<!--[\s\S]*?-->/g, '').replace(/<!--[\s\S]*?$/, '').replace(/^[\s\S]*?-->/, '')
}

export const markdownWithFM = async (
  content: string,
  { anchorMangler, mdMangler, domMangler }: ManglerOptions = {}
) => {
  content = removeComments(content)
  const parsed = fm(mdMangler != null ? mdMangler(content) : content)
  const html = await markdownToHTML(parsed.body, { anchorMangler, domMangler })

  return {
    html,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: parsed.attributes as any,
  }
}
