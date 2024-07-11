import { Project } from 'ts-morph'
import { moduleFromSourceFile } from './parse/module'
import * as path from 'path'
import { Module } from './template/module'
import * as fse from 'fs-extra'
import * as fs from 'fs'
import { formatHtml } from './template/html'
import { State } from './template/state'
import { ApiRef } from '../src/toc'
import { renderSSR } from '@tempots/ssr'
import { signal } from '@tempots/dom'

const getModules = async (basePath: string, name: string) => {
  const projectPath = path.join(basePath, name)
  const srcPath = path.join(projectPath, 'src')
  const tsConfigFilePath = path.join(projectPath, 'tsconfig.json')
  const project = new Project({
    skipAddingFilesFromTsConfig: false,
    tsConfigFilePath,
    skipFileDependencyResolution: true,
  })

  const dir = project.addDirectoryAtPath(srcPath)

  const sources = project.getSourceFiles()
  return Promise.all(sources.map(s => moduleFromSourceFile(dir, s)))
}

const moduleToHtmlPath = (mod: string) => {
  return mod.substring(0, mod.length - 3) + '.html'
}

const processProject =
  (
    destPath: string,
    basePath: string,
    renderModule: (module: State) => Promise<string>
  ) =>
  async (name: string) => {
    const modules = await getModules(basePath, name)
    modules.forEach(async module => {
      const state = {
        module,
        project: name,
      }
      // console.log(`> ${state.module.path}`)
      const html = await renderModule(state)
      const destFile = path.join(destPath, name, moduleToHtmlPath(module.path))
      fse.ensureDirSync(path.dirname(destFile))
      fs.writeFileSync(destFile, html, 'utf8')
    })

    return modules.map(m => {
      const path = moduleToHtmlPath(m.path)
      return {
        path,
        id: path,
        title: m.title,
        type: 'module',
      }
    })
  }

const makeHtml = async (state: State) => {
  const html = await renderSSR({
    html: '<html><body></body></html>',
    url: 'https://tempots.com',
    makeApp: () => Module(signal(state)),
    selector: 'body',
  })
  // const dom = new JSDOM()
  // const ctx = DOMContext.fromElement(dom.window.document.body, () => ({}))
  // childOrBuilderToTemplate(module).render(ctx, state)
  return formatHtml(html)
}

export const generateDocs = async (
  projects: string[],
  basePath: string,
  destPath: string
): Promise<Record<string, ApiRef[]>> => {
  await fse.emptyDir(destPath)
  const process = processProject(destPath, basePath, makeHtml)
  return projects.reduce(async (acc, project) => {
    console.log('Processing', project)
    const modules = await process(project)
    return {
      ...acc,
      [project]: modules,
    }
  }, {})
}
