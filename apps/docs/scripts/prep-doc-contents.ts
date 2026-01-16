import { promises as fsp } from 'fs'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import fm from 'front-matter'
import * as cheerio from 'cheerio'
import type { AnyNode, Element as DomElement } from 'domhandler'
import {
  ManglerOptions,
  markdownToHTML,
  markdownWithFM,
} from './utils/markdown'
import { Demo, Page, Library, Toc, Section } from '../src/model/domain'

const rootFolder = '../..'
const docsFolder = path.join(rootFolder, 'apps/docs')
const pubFolder = path.join(docsFolder, 'public')
const assetsFolderSrc = path.join(docsFolder, 'assets')
const assetsFolderDst = path.join(pubFolder, 'assets')
const demoFolderSrc = path.join(rootFolder, 'demo')
const demoFolderDst = path.join(pubFolder, 'demos')
const pagesFolderSrc = path.join(docsFolder, 'pages')
const pagesFolderDst = path.join(pubFolder, 'pages')
const librariesFolderSrc = path.join(rootFolder, 'packages')
const libraries = ['tempots-dom', 'tempots-std', 'tempots-ui', 'tempots-server', 'tempots-client', 'tempots-vite']
const apiFolderDst = path.join(pubFolder, 'api')

const tocFile = path.join(pubFolder, 'toc.json')
const combinedMarkdownFile = path.join(pubFolder, 'tempo-docs.md')
const cnameFile = path.join(pubFolder, 'CNAME')
const nojekyll = path.join(pubFolder, '.nojekyll')

const COMMENTS_PATTERN = /<!--[\s\S]*?--[!]?>|<!--[\s\S]*?$|^[\s\S]*?--[!]?>/g

type MarkdownDoc = {
  content: string
  order?: number
  title?: string
  path?: string
  anchorId?: string
}

type PackageMeta = {
  title?: string
  name?: string
  description?: string
  version?: string
  keywords?: string[]
  priority?: number
  docsExclude?: boolean
}

const removeMarkdownComments = (md: string) => md.replace(COMMENTS_PATTERN, '')

async function getDemos(folder: string): Promise<Demo[]> {
  const dirs = filterDirectories(await fsp.readdir(folder))
  const data = dirs
    .map(dir => ({
      dir: path.join(folder, dir),
      path: dir,
    }))
    .filter(({ dir, path: demoPath }) => {
      const packageJson = path.join(dir, 'package.json')
      if (!fs.existsSync(packageJson)) {
        console.warn(`Skipping demo without package.json: ${demoPath}`)
        return false
      }
      return true
    })
  const contents = await Promise.all(
    data.map(async o => {
      const { dir, path: demoPath } = o
      const pack = await loadPackage(dir)
      // Skip demos marked for exclusion from docs
      if (pack.docsExclude) {
        return null
      }
      const priority = typeof pack.priority === 'number' ? pack.priority : 0
      return {
        priority,
        data: {
          path: demoPath,
          version: pack.version ?? '0.0.0',
          title: pack.title ?? demoPath,
          description: pack.description ?? '',
        },
      }
    })
  )
  return contents
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.priority - b.priority)
    .map(a => a.data)
}

async function loadPackage<T extends PackageMeta = PackageMeta>(dir: string) {
  const content = await fsp.readFile(path.join(dir, 'package.json'), 'utf8')
  return JSON.parse(content) as T
}

function filterDirectories(dirs: string[]) {
  return dirs.filter(dir => !dir.startsWith('.'))
}

async function prepDir(dir: string) {
  await fse.ensureDir(dir)
  await fse.emptyDir(dir)
}

async function listAllMDFiles(src: string): Promise<string[]> {
  const files = await fsp.readdir(src)
  const filtered = filterDirectories(files)
  const buff: string[] = []
  for (const file of filtered) {
    if (file.endsWith('.md')) {
      buff.push(file)
    } else {
      const filePath = path.join(src, file)
      if ((await fsp.stat(filePath)).isDirectory()) {
        const collect = await listAllMDFiles(filePath)
        buff.push(...collect.map(c => path.join(file, c)))
      }
    }
  }
  return buff
}

async function makeHtml(
  mdFile: string,
  currentPath: string,
  options?: ManglerOptions
) {
  const content = await fsp.readFile(mdFile, 'utf8')
  return markdownWithFM(content, currentPath, options)
}

function renameMd(file: string) {
  return file.substring(0, file.length - 3) + '.html'
}

function manglePageHref(url: string) {
  if (url.startsWith('./')) url = url.substring(2)
  if (url.startsWith('/')) url = url.substring(1)
  return `/${url}`
}

async function createPages(
  src: string,
  dst: string,
  options: ManglerOptions = {}
) {
  const mdFiles = await listAllMDFiles(src)
  const data = await Promise.all(
    mdFiles.map(async file => ({
      dest: renameMd(file),
      ...(await makeHtml(path.join(src, file), file, {
        anchorMangler: options.anchorMangler ?? manglePageHref,
        mdMangler: options.mdMangler,
        domMangler: options.domMangler,
      })),
    }))
  )
  await Promise.all(
    data.map(async o => {
      const p = path.join(dst, o.dest)
      const base = path.dirname(p)
      await fse.ensureDir(base)
      await fsp.writeFile(p, o.html)
    })
  )
  const section = {
    pages: [] as Page[],
    sections: {} as Record<string, Section>,
  }
  data
    .sort((a, b) => a.data.order - b.data.order)
    .forEach(d => {
      const subs = d.dest.split('/')
      subs.pop()
      let sect = section
      for (const sub in subs) {
        if (!sect.sections[sub]) {
          sect.sections = {
            ...sect.sections,
            [sub]: {
              pages: [],
              sections: {},
            },
          }
        }
        sect = sect.sections[sub]
      }
      sect.pages.push({
        path: d.dest.substring(0, d.dest.length - 5), // remove .html
        title: d.data.title,
        description: d.data.description,
      })
    })
  return section
}

async function collectLibrary(
  library: string,
  src: string
): Promise<{ priority: number; data: Library }> {
  const p = path.join(src, library, 'package.json')
  const packageJson = await fsp.readFile(p, 'utf8')
  const pack = JSON.parse(packageJson)
  const libraryPath = path.join(src, library, 'PROJECT.md')
  const apiDocsPath = path.join(src, library, 'docs/output/')
  const content = await markdownToHTML(
    fs.existsSync(libraryPath) ? await fsp.readFile(libraryPath, 'utf8') : '',
    library,
    {
      domMangler: doc => {
        addIdToHeaders(doc)
      },
    }
  )
  return {
    priority: pack.priority ?? 0,
    data: {
      name: library,
      title: pack.title ?? pack.name ?? library,
      description: pack.description,
      version: pack.version,
      keywords: pack.keywords ?? [],
      content,
      hasApiDocs: fs.existsSync(apiDocsPath),
    },
  }
}

const tokenize = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
}

const addIdToHeaders = (doc: Document) => {
  for (const header of Array.from(
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  )) {
    header.id = tokenize((header as HTMLElement).innerText)
  }
}

async function collectLibraries(libraries: string[], src: string) {
  const list = await Promise.all(
    libraries.map(async library => ({
      library,
      data: await collectLibrary(library, src),
    }))
  )
  return list
    .sort((a, b) => a.data.priority - b.data.priority)
    .map(a => a.data.data)
}

function replaceAll(value: string, search: string, replace: string) {
  return value.split(search).join(replace)
}

function transformCodeBlocks(content: string, fn: (content: string) => string) {
  const parts = content.split('```')
  const buff = [] as string[]
  for (let i = 0; i < parts.length; i++) {
    if ((i + 1) % 2 === 0) {
      buff.push(fn(parts[i]))
    } else {
      buff.push(parts[i])
    }
  }
  return buff.join('```')
}

function transformNonCodeBlocks(
  content: string,
  fn: (content: string) => string
) {
  const parts = content.split('```')
  const buff: string[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      buff.push(fn(parts[i]))
    } else {
      buff.push(parts[i])
    }
  }
  return buff.join('```')
}

function normalizeLineEndings(content: string) {
  return replaceAll(content, '\r', '')
}

const HTML_TAG_PATTERN =
  /<(?:\/)?(a|p|div|span|br|hr|pre|code|ul|ol|li|table|thead|tbody|tr|th|td|strong|b|em|i|blockquote|img|h[1-6]|kbd|details|summary|section|article|header|footer)\b/i

const BLOCK_TAGS = new Set([
  'p',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'blockquote',
  'pre',
  'ul',
  'ol',
  'table',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
])

type HtmlNode = AnyNode
type HtmlElement = DomElement

function normalizeMarkdownWhitespace(content: string) {
  const lines = content.replace(/\r/g, '').split('\n')
  const normalized: string[] = []
  let blankCount = 0
  for (const line of lines) {
    if (line.trim().length === 0) {
      blankCount += 1
      if (blankCount > 2) {
        continue
      }
      normalized.push('')
      continue
    }
    blankCount = 0
    if (/\s{2}$/.test(line)) {
      normalized.push(line)
      continue
    }
    normalized.push(line.replace(/[ \t]+$/g, ''))
  }
  return normalized.join('\n').trim()
}

function wrapBlock(content: string) {
  const trimmed = content.trim()
  if (!trimmed) return ''
  return `\n\n${trimmed}\n\n`
}

function formatInlineCode(value: string) {
  const trimmed = value.trim()
  let fence = '`'
  while (trimmed.includes(fence)) {
    fence += '`'
  }
  return `${fence}${trimmed}${fence}`
}

function renderInline(nodes: HtmlNode[], $: cheerio.CheerioAPI, depth: number) {
  return renderNodes(nodes, $, depth)
    .replace(/\s*\n\s*/g, ' ')
    .trim()
}

function renderList(
  el: HtmlElement,
  $: cheerio.CheerioAPI,
  ordered: boolean,
  depth: number
) {
  const items = (el.children ?? []).filter(
    (child): child is HtmlElement =>
      child.type === 'tag' && child.name === 'li'
  )
  return items
    .map((item, index) => renderListItem(item, $, ordered, depth, index))
    .filter(Boolean)
    .join('\n')
}

function renderListItem(
  el: HtmlElement,
  $: cheerio.CheerioAPI,
  ordered: boolean,
  depth: number,
  index: number
) {
  const indent = '  '.repeat(depth)
  const marker = ordered ? `${index + 1}.` : '-'
  const content = renderNodes(el.children ?? [], $, depth + 1).trim()
  if (!content) return ''
  const lines = content.split('\n')
  const first = lines.shift() ?? ''
  let rendered = `${indent}${marker} ${first}`
  if (lines.length > 0) {
    rendered += `\n${lines.map(line => `${indent}  ${line}`).join('\n')}`
  }
  return rendered
}

function renderTable(el: HtmlElement, $: cheerio.CheerioAPI, depth: number) {
  const rows = $(el).find('tr').toArray() as HtmlElement[]
  if (rows.length === 0) {
    return $.html(el) ?? ''
  }
  const renderedRows = rows.map(row =>
    $(row)
      .find('th,td')
      .toArray()
      .map(cell => {
        const raw = renderInline((cell as HtmlElement).children ?? [], $, depth)
        return raw.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()
      })
  )
  const headerIndex = renderedRows.findIndex(
    (_, idx) => $(rows[idx]).find('th').length
  )
  const header =
    headerIndex >= 0 ? renderedRows.splice(headerIndex, 1)[0] : renderedRows[0]
  if (!header || header.length === 0) {
    return $.html(el) ?? ''
  }
  if (headerIndex < 0) {
    renderedRows.shift()
  }
  const headerLine = `| ${header.join(' | ')} |`
  const separatorLine = `| ${header.map(() => '---').join(' | ')} |`
  const bodyLines = renderedRows.map(row => `| ${row.join(' | ')} |`)
  return [headerLine, separatorLine, ...bodyLines].join('\n')
}

function renderBlockquote(content: string) {
  const lines = content.trim().split('\n')
  return lines.map(line => `> ${line}`.trimEnd()).join('\n')
}

function renderDetails(el: HtmlElement, $: cheerio.CheerioAPI, depth: number) {
  const summaryEl = (el.children ?? []).find(
    (child): child is HtmlElement =>
      child.type === 'tag' && child.name === 'summary'
  )
  const summary = summaryEl
    ? renderInline(summaryEl.children ?? [], $, depth)
    : ''
  const bodyNodes = summaryEl
    ? (el.children ?? []).filter(child => child !== summaryEl)
    : (el.children ?? [])
  const body = renderNodes(bodyNodes, $, depth).trim()
  return wrapBlock(
    `<details>\n<summary>${summary}</summary>\n\n${body}\n</details>`
  )
}

function renderNode(node: HtmlNode, $: cheerio.CheerioAPI, depth: number) {
  if (node.type === 'text') {
    return node.data ?? ''
  }
  if (node.type === 'comment') {
    return ''
  }
  if (node.type !== 'tag') {
    return ''
  }
  const el = node as HtmlElement
  const tag = el.name?.toLowerCase()
  if (!tag) {
    return ''
  }
  if (tag === 'br') {
    return '\n'
  }
  if (tag === 'hr') {
    return '\n\n---\n\n'
  }
  if (tag === 'strong' || tag === 'b') {
    return `**${renderInline(el.children ?? [], $, depth)}**`
  }
  if (tag === 'em' || tag === 'i') {
    return `*${renderInline(el.children ?? [], $, depth)}*`
  }
  if (tag === 'code') {
    const text = $(el).text()
    if (text.includes('\n')) {
      return wrapBlock(`\`\`\`\n${text.trim()}\n\`\`\``)
    }
    return formatInlineCode(text)
  }
  if (tag === 'pre') {
    const codeEl = (el.children ?? []).find(
      (child): child is HtmlElement =>
        child.type === 'tag' && child.name === 'code'
    )
    const codeText = codeEl ? $(codeEl).text() : $(el).text()
    const className = codeEl?.attribs?.class ?? ''
    const langMatch = className.match(/language-([a-z0-9-]+)/i)
    const lang = langMatch ? langMatch[1] : ''
    const fence = lang ? `\`\`\`${lang}\n` : '```\n'
    return wrapBlock(`${fence}${codeText.trim()}\n\`\`\``)
  }
  if (tag === 'a') {
    const href = el.attribs?.href ?? ''
    const text = renderInline(el.children ?? [], $, depth) || href
    if (!href) return text
    return `[${text}](${href})`
  }
  if (tag === 'img') {
    const src = el.attribs?.src ?? ''
    const alt = el.attribs?.alt ?? ''
    return src ? `![${alt}](${src})` : ''
  }
  if (tag === 'ul' || tag === 'ol') {
    return wrapBlock(renderList(el, $, tag === 'ol', depth))
  }
  if (tag === 'table') {
    return wrapBlock(renderTable(el, $, depth))
  }
  if (tag === 'blockquote') {
    return wrapBlock(renderBlockquote(renderNodes(el.children ?? [], $, depth)))
  }
  if (tag.startsWith('h')) {
    const level = Number(tag.substring(1))
    if (level >= 1 && level <= 6) {
      const heading = renderInline(el.children ?? [], $, depth)
      return wrapBlock(`${'#'.repeat(level)} ${heading}`.trim())
    }
  }
  if (tag === 'kbd') {
    return formatInlineCode($(el).text())
  }
  if (tag === 'details') {
    return renderDetails(el, $, depth)
  }
  if (tag === 'span') {
    return renderInline(el.children ?? [], $, depth)
  }
  if (BLOCK_TAGS.has(tag)) {
    return wrapBlock(renderNodes(el.children ?? [], $, depth))
  }
  return $.html(el) ?? ''
}

function renderNodes(nodes: HtmlNode[], $: cheerio.CheerioAPI, depth: number) {
  const parts: string[] = []
  for (const node of nodes) {
    const rendered = renderNode(node, $, depth)
    if (!rendered) continue
    parts.push(rendered)
  }
  return parts.join('')
}

function convertHtmlToMarkdown(content: string) {
  return transformNonCodeBlocks(content, block => {
    if (!HTML_TAG_PATTERN.test(block)) {
      return block
    }
    const $ = cheerio.load(block, { xml: { decodeEntities: false } })
    const rendered = renderNodes($.root().contents().toArray(), $, 0)
    return normalizeMarkdownWhitespace(rendered)
  })
}

function slugifyAnchor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function ensureHeading(content: string, title: string, anchorId?: string) {
  const anchor = anchorId ? `<a id="${anchorId}"></a>\n\n` : ''
  const trimmed = content.trimStart()
  if (trimmed.startsWith('#')) {
    return `${anchor}${content.trim()}`
  }
  return `${anchor}# ${title}\n\n${content.trim()}`
}

function stripApiBreadcrumb(content: string) {
  const lines = content.split('\n')
  let index = 0
  while (index < lines.length && lines[index].trim() === '') {
    index++
  }
  if (
    index < lines.length &&
    lines[index].includes('[Home]') &&
    lines[index].includes('&gt;')
  ) {
    lines.splice(index, 1)
    if (lines[index]?.trim() === '') {
      lines.splice(index, 1)
    }
  }
  return lines.join('\n')
}

function fileNameToTitle(file: string) {
  const base = path.basename(file, '.md')
  return base.replace(/\./g, ' ').replace(/-/g, ' ')
}

function prefixApiHeadings(content: string, prefix: string) {
  const lines = content.split('\n')
  let inFence = false
  const normalizedPrefix = prefix.toLowerCase()
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) {
      continue
    }
    const match = /^(#{2,6})\s+(.*)$/.exec(line)
    if (!match) {
      continue
    }
    const heading = match[2].trim()
    const normalizedHeading = heading.toLowerCase()
    if (
      normalizedHeading.startsWith(`${normalizedPrefix}: `) ||
      normalizedHeading.startsWith(`${normalizedPrefix} `)
    ) {
      continue
    }
    lines[i] = `${match[1]} ${prefix}: ${heading}`
  }
  return lines.join('\n')
}

async function collectPageDocs(src: string): Promise<MarkdownDoc[]> {
  const mdFiles = await listAllMDFiles(src)
  const docs = await Promise.all(
    mdFiles.map(async file => {
      const raw = await fsp.readFile(path.join(src, file), 'utf8')
      const parsed = fm(normalizeLineEndings(removeMarkdownComments(raw)))
      const data = parsed.attributes as { title?: string; order?: number }
      const title = data.title ?? file
      const anchorId = slugifyAnchor(title)
      const body = normalizeLineEndings(parsed.body).trim()
      return {
        order: Number(data.order ?? 0),
        title,
        path: file.replace(/\.md$/, ''),
        anchorId,
        content: ensureHeading(body, title, anchorId),
      }
    })
  )
  return docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

async function collectLibraryDocs(src: string): Promise<MarkdownDoc[]> {
  const docs: Array<MarkdownDoc | null> = await Promise.all(
    libraries.map(async library => {
      const packageJson = await fsp.readFile(
        path.join(src, library, 'package.json'),
        'utf8'
      )
      const pack = JSON.parse(packageJson) as PackageMeta
      const title = pack.title ?? pack.name ?? library
      const anchorId = slugifyAnchor(title)
      const contentPath = path.join(src, library, 'PROJECT.md')
      if (!fs.existsSync(contentPath)) {
        return null
      }
      const raw = await fsp.readFile(contentPath, 'utf8')
      const body = normalizeLineEndings(removeMarkdownComments(raw)).trim()
      if (body.length === 0) {
        return null
      }
      return {
        order: Number(pack.priority ?? 0),
        title,
        path: library,
        anchorId,
        content: ensureHeading(body, title, anchorId),
      }
    })
  )
  return docs
    .filter((doc): doc is MarkdownDoc => doc != null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function apiFileTitle(library: string, file: string) {
  if (file === 'index.md') {
    return `${library} api index`
  }
  return fileNameToTitle(file)
}

async function collectApiDocs(src: string): Promise<MarkdownDoc[]> {
  const docs: MarkdownDoc[] = []
  for (const library of libraries) {
    const apiDir = path.join(src, library, 'docs/output')
    if (!fs.existsSync(apiDir)) {
      continue
    }
    const mdFiles = await listAllMDFiles(apiDir)
    const sorted = mdFiles.sort((a, b) => {
      if (a === 'index.md') return -1
      if (b === 'index.md') return 1
      return a.localeCompare(b)
    })
    for (const file of sorted) {
      const raw = await fsp.readFile(path.join(apiDir, file), 'utf8')
      let body = normalizeLineEndings(removeMarkdownComments(raw)).trim()
      body = stripApiBreadcrumb(body).trim()
      if (body.length === 0) {
        continue
      }
      const apiPrefix =
        file === 'index.md' ? library : path.basename(file, '.md')
      body = prefixApiHeadings(body, apiPrefix)
      const title = apiFileTitle(library, file)
      const anchorId = slugifyAnchor(title)
      docs.push({
        title,
        path: file,
        anchorId,
        content: ensureHeading(body, title, anchorId),
      })
    }
  }
  return docs
}

type LinkMaps = {
  pageAnchors: Map<string, string>
  libraryAnchors: Map<string, string>
  apiAnchors: Map<string, string>
}

function rewriteMarkdownLinks(content: string, maps: LinkMaps) {
  return content.replace(
    /(!?)\[([^\]]+)\]\(([^)]+)\)/g,
    (match, marker, label, url) => {
      const updated = rewriteMarkdownLink(url, maps)
      if (updated === url) {
        return match
      }
      return `${marker}[${label}](${updated})`
    }
  )
}

function rewriteMarkdownLink(url: string, maps: LinkMaps) {
  if (url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/.test(url)) {
    return url
  }
  const [rawPath, rawHash] = url.split('#')
  const hash = rawHash != null && rawHash.length > 0 ? `#${rawHash}` : ''
  if (rawPath.startsWith('/page/')) {
    const page = rawPath.replace(/^\/page\//, '').replace(/\.html$/, '')
    const anchor = maps.pageAnchors.get(page)
    return anchor ? `#${anchor}` : url
  }
  if (rawPath.startsWith('/library/')) {
    const lib = rawPath.replace(/^\/library\//, '').replace(/\.html$/, '')
    const anchor = maps.libraryAnchors.get(lib)
    return anchor ? `#${anchor}` : url
  }
  if (rawPath.startsWith('/demo/') || rawPath.startsWith('/tool/')) {
    return `https://tempo-ts.com${rawPath}${hash}`
  }
  if (rawPath.startsWith('/assets/')) {
    return `https://tempo-ts.com${rawPath}`
  }
  const normalized = rawPath.replace(/^\.\//, '')
  if (normalized.endsWith('.md')) {
    const anchor = maps.apiAnchors.get(normalized)
    return anchor ? `#${anchor}` : url
  }
  return url
}

async function buildCombinedMarkdown(): Promise<string> {
  const pages = await collectPageDocs(pagesFolderSrc)
  const libraryDocs = await collectLibraryDocs(librariesFolderSrc)
  const apiDocs = await collectApiDocs(librariesFolderSrc)
  const maps: LinkMaps = {
    pageAnchors: new Map(
      pages
        .filter(doc => doc.path && doc.anchorId)
        .map(doc => [doc.path!, doc.anchorId!])
    ),
    libraryAnchors: new Map(
      libraryDocs
        .filter(doc => doc.path && doc.anchorId)
        .map(doc => [doc.path!, doc.anchorId!])
    ),
    apiAnchors: new Map(
      apiDocs
        .filter(doc => doc.path && doc.anchorId)
        .map(doc => [doc.path!, doc.anchorId!])
    ),
  }
  const allDocs = [...pages, ...libraryDocs, ...apiDocs]
    .map(doc => convertHtmlToMarkdown(doc.content.trim()))
    .map(doc => rewriteMarkdownLinks(doc, maps))
    .filter(doc => doc.length > 0)
  const header =
    '# Tempo Documentation\n\nThis file is generated from the Tempo documentation site.'
  if (allDocs.length === 0) {
    return `${header}\n`
  }
  return `${header}\n\n${allDocs.join('\n\n---\n\n')}\n`
}

async function main() {
  console.time('main')

  const demos = await getDemos(demoFolderSrc)

  await prepDir(pubFolder)

  // copy demos
  await Promise.all(
    demos.map(demo => {
      let src = path.join(demoFolderSrc, demo.path, 'dist')
      fse.copy(src, path.join(demoFolderDst, demo.path))
    })
  )

  // copy assets
  await fse.copy(assetsFolderSrc, assetsFolderDst)

  // ensure no jekyll
  await fse.createFile(nojekyll)

  // pages
  await prepDir(pagesFolderDst)
  const sections = await createPages(pagesFolderSrc, pagesFolderDst, {
    domMangler: doc => {
      addIdToHeaders(doc)
    },
  })

  // libraries
  const librariesData = await collectLibraries(libraries, librariesFolderSrc)

  const outputContent: Toc = {
    libraries: librariesData,
    demos,
    ...sections,
  }

  // api
  await prepDir(apiFolderDst)
  const api: Record<string, string[]> = {}
  for (const library of librariesData) {
    const apiDir = path.join(librariesFolderSrc, `${library.name}/docs/output/`)
    // Skip libraries without API documentation
    if (!fs.existsSync(apiDir)) {
      api[library.name] = []
      continue
    }
    const dst = path.join(apiFolderDst, library.name)
    const pages = await createPages(apiDir, dst, {
      mdMangler: content => {
        const pos = content.indexOf('&gt;')
        if (pos >= 0) {
          content = content.substring(pos + 5)
        }
        content = replaceAll(content, '\r', '')
        content = replaceAll(content, '\n**Returns:**\n\n', '\n\n**Returns:** ')
        content = transformCodeBlocks(content, code =>
          replaceAll(replaceAll(code, '<', '&lt;'), '>', '&gt;')
        )
        return content
      },
      domMangler: doc => {
        // find breadcrumbs
        const breadcrumbs = Array.from(doc.querySelectorAll('p')).filter(p => {
          return (
            p.firstElementChild?.tagName === 'A' &&
            (p.firstElementChild as HTMLElement)?.innerText.indexOf(
              '@tempots/'
            ) >= 0
          )
        })
        if (breadcrumbs.length > 0) {
          const bc = breadcrumbs[0]
          bc.classList.add('breadcrumbs')
          for (let i = 0; i < bc.childNodes.length; i++) {
            if (
              bc.childNodes[i].nodeType === 3 &&
              bc.childNodes[i].nodeValue === ' > '
            ) {
              // text node
              bc.childNodes[i].nodeValue = ' › '
            }
          }
          const last = bc.lastElementChild as HTMLElement | undefined
          if (last != null && last.tagName === 'A') {
            const span = doc.createElement('span')
            span.classList.add('current')
            span.innerText = last.innerText
            last.replaceWith(span)
          }
        }
        // fix anchor hrefs
        for (const anchor of Array.from(doc.querySelectorAll('a'))) {
          const parts = anchor.href.substring(1).slice(0, -3).split('.')
          const lib = `/library/tempots-${parts.shift()}`
          if (parts.length === 0) {
            anchor.href = `${lib}.html`
          } else {
            anchor.href = `${lib}.${parts.join('.')}.html`
          }
        }
        // add ID to headers
        addIdToHeaders(doc)
      },
    })
    api[library.name] = pages.pages
      .map(({ path }) => path)
      .filter(v => v != 'index')
  }
  await fsp.writeFile(
    path.join(apiFolderDst, 'api.json'),
    JSON.stringify(api, null, 2)
  )

  await fsp.writeFile(tocFile, JSON.stringify(outputContent, null, 2))
  await fsp.writeFile(combinedMarkdownFile, await buildCombinedMarkdown())

  // CNAME
  await fsp.writeFile(cnameFile, 'tempo-ts.com')

  console.timeEnd('main')
}

await main()
