import { Marked } from 'marked'
import { markedHighlight } from "marked-highlight";
import fm from 'front-matter'
import hljs from 'highlight.js'
import { Browser, IOptionalBrowserSettings } from 'happy-dom'

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
)

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
  currentPath: string,
  { anchorMangler, domMangler }: ManglerOptions = {}
) => {
  content = content.replace(/export declare/g, 'declare')
  let rawHtml = await marked.parse(content, { gfm: true })

  // this is to avoid a bug with &lt; and &gt; being replaced by < and >
  rawHtml = rawHtml
    .replace(/&lt;/g, '↞↞↞')
    .replace(/&gt;/g, '↠↠↠')
  const browser = new Browser({ settings: browserSettings })
  const page = browser.newPage()
  page.content = rawHtml
  const document = page.mainFrame.document

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
    domMangler(document as any, currentPath)
  }

  const el = document.body

  let value = el.innerHTML
  value = value.replace(/↞↞↞/g, '&lt;').replace(/↠↠↠/g, '&gt;')

  return value
}

export type ManglerOptions = {
  anchorMangler?: (s: string) => string
  mdMangler?: (s: string) => string
  domMangler?: (doc: Document, currentPath: string) => void
}

const COMMENTS_PATTERN = /<!--[\s\S]*?--[!]?>|<!--[\s\S]*?$|^[\s\S]*?--[!]?>/g

const removeComments = (md: string) =>
  md.replace(COMMENTS_PATTERN, '')

export const markdownWithFM = async (
  content: string,
  currentPath: string,
  { anchorMangler, mdMangler, domMangler }: ManglerOptions = {}
) => {
  content = removeComments(content)
  const parsed = fm(mdMangler != null ? mdMangler(content) : content)
  const html = await markdownToHTML(parsed.body, currentPath, { anchorMangler, domMangler })

  return {
    html,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: parsed.attributes as any,
  }
}
