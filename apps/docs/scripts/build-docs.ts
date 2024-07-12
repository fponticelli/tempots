import { promises as fsp } from 'fs'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import { trimChars } from '@tempots/std/string'
import { markdown, markdownWithFM } from './utils/markdown'
import { Demo, Page, Library, Toc, Section } from '../src/model/domain'

const rootFolder = '../..'
const docsFolder = path.join(rootFolder, 'apps/docs')
const pubFolder = path.join(docsFolder, 'public')
const demoFolderSrc = path.join(rootFolder, 'demo')
const demoFolderDst = path.join(pubFolder, 'demo')
const pagesFolderSrc = path.join(docsFolder, 'pages')
const pagesFolderDst = path.join(pubFolder, 'pages')
const librariesFolderSrc = path.join(rootFolder, 'packages')
const libraries = ['tempots-dom', 'tempots-ssr', 'tempots-std', 'tempots-color', 'tempots-ui']
const apiFolderDst = path.join(pubFolder, 'api')

const tocFile = path.join(pubFolder, 'toc.json')
const cnameFile = path.join(pubFolder, 'CNAME')
const nojekyll = path.join(pubFolder, '.nojekyll')

const renameHtml = (path: string) => {
  const hasLeadingHash = path.startsWith('#')
  const parts = path.split('#').filter(a => !!a)
  if (!parts[0].endsWith('.html')) return path
  function processPart(part: string) {
    return part
      .split('.')
      .map(p => trimChars(p, '_'))
      .join('.')
  }
  const res = parts[0].split('/').map(processPart).join('/')
  return (hasLeadingHash ? [''] : [])
    .concat([res].concat(parts.slice(1)))
    .join('#')
}

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
  anchorMangler: (url: string) => string
) {
  const content = await fsp.readFile(mdFile, 'utf8')
  return markdownWithFM(content, anchorMangler)
}

function renameMdToHtml(file: string) {
  return file.substring(0, file.length - 3) + '.html'
}

function manglePageHref(url: string) {
  if (url.startsWith('./')) url = url.substring(2)
  return url
}

async function createPages(src: string, dst: string) {
  const mdFiles = await listAllMDFiles(src)
  const data = await Promise.all(
    mdFiles.map(async file => ({
      dest: renameHtml(renameMdToHtml(file)),
      ...(await makeHtml(path.join(src, file), manglePageHref)),
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
        path: d.dest,
        title: d.data.title,
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
  const content = markdown(
    fs.existsSync(libraryPath) ? await fsp.readFile(libraryPath, 'utf8') : '',
    s => s
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
  // await prepDir(assetsFolderDst)
  // await fse.copy(assetsFolderSrc, assetsFolderDst)

  // copy binaries
  // await fse.copy(binFolderSrc, binFolderDst)

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
  for (const library of librariesData) {
    const apiFile = path.join(librariesFolderSrc, `${library.name}/docs/api.json`)
    fs.copyFileSync(apiFile, path.join(apiFolderDst, `${library.name}.json`))
  }

  await fsp.writeFile(tocFile, JSON.stringify(outputContent, null, 2))

  // CNAME
  await fsp.writeFile(cnameFile, 'tempots.com')

  console.timeEnd('main')
}

main()
