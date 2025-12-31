import { promises as fsp } from 'fs'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import fm from 'front-matter'
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
const libraries = ['tempots-dom', 'tempots-std', 'tempots-ui']
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
      const { dir, path } = o
      const pack = await loadPackage(dir)
      return {
        priority: pack.priority,
        data: {
          path: path,
          version: pack.version,
          title: pack.title,
          description: pack.description,
        },
      }
    })
  )
  return contents.sort((a, b) => a.priority - b.priority).map(a => a.data)
}

async function loadPackage(dir: string) {
  const content = await fsp.readFile(path.join(dir, 'package.json'), 'utf8')
  return JSON.parse(content)
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

function normalizeLineEndings(content: string) {
  return replaceAll(content, '\r', '')
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
  const docs = await Promise.all(
    libraries.map(async library => {
      const packageJson = await fsp.readFile(
        path.join(src, library, 'package.json'),
        'utf8'
      )
      const pack = JSON.parse(packageJson)
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
    .map(doc => rewriteMarkdownLinks(doc.content.trim(), maps))
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
  const api = {}
  for (const library of librariesData) {
    const apiDir = path.join(librariesFolderSrc, `${library.name}/docs/output/`)
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
