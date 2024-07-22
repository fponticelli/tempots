import { promises as fsp } from 'fs'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import { ManglerOptions, markdownToHTML, markdownWithFM } from './utils/markdown'
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
const libraries = ['tempots-dom', 'tempots-ssr', 'tempots-std', 'tempots-color', 'tempots-ui']
const apiFolderDst = path.join(pubFolder, 'api')

const tocFile = path.join(pubFolder, 'toc.json')
const cnameFile = path.join(pubFolder, 'CNAME')
const nojekyll = path.join(pubFolder, '.nojekyll')

async function getDemos(folder: string): Promise<Demo[]> {
  const dirs = filterDirectories(await fsp.readdir(folder))
  const data = dirs.map(dir => ({
    dir: path.join(folder, dir),
    path: dir,
  }))
  const contents = await Promise.all(
    data.map(async o => {
      const { dir, path } = o
      // const dom = loadHtml(dir)
      const pack = await loadPackage(dir)
      // const { title, description, priority } = extractDemoInfo(dom)
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

async function createPages(src: string, dst: string, options: ManglerOptions = {}) {
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
    library
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
  const sections = await createPages(pagesFolderSrc, pagesFolderDst)

  // libraries
  const librariesData = await collectLibraries(libraries, librariesFolderSrc)

  const outputContent: Toc = {
    libraries: librariesData,
    demos,
    ...sections
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
      domMangler: (doc, currentPath) => {
        // find breadcrumbs
        const breadcrumbs = Array.from( doc.querySelectorAll('p')).filter(p => {
          return p.firstElementChild?.tagName === 'A' &&
                 (p.firstElementChild as HTMLElement)?.innerText.indexOf('@tempots/') >= 0
        })
        if (breadcrumbs.length > 0) {
          const bc = breadcrumbs[0]
          bc.classList.add('breadcrumbs')
          // console.log(bc.childNodes)
          for (let i = 0; i < bc.childNodes.length; i++) {
            if (bc.childNodes[i].nodeType === 3 && bc.childNodes[i].nodeValue === ' > ') { // text node
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
          // console.log(anchor.href)
        }
      }
    })
    api[library.name] = pages.pages
      .map(({path}) => path)
      .filter(v => v != 'index')
  }
  await fsp.writeFile(path.join(apiFolderDst, 'api.json'), JSON.stringify(api, null, 2))

  await fsp.writeFile(tocFile, JSON.stringify(outputContent, null, 2))

  // CNAME
  await fsp.writeFile(cnameFile, 'tempots.com')

  console.timeEnd('main')
}

main()
