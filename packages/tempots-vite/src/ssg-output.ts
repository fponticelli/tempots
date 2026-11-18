import * as fs from 'node:fs'
import * as path from 'node:path'
import type { RouteConfig } from './index'
import { getSsgOutputPath } from './ssg-path'

export class SsgBuildError extends Error {
  constructor(
    message: string,
    readonly cause: unknown
  ) {
    super(message)
  }
}

export class SsgRecoveryError extends SsgBuildError {}

export function makeSsgOutput(root: string, staging: string) {
  const pages = new Map<string, { route: RouteConfig; staged: string }>()

  const stage = (route: RouteConfig, html: string) => {
    const destination = getSsgOutputPath(route, root)
    if (pages.has(destination)) {
      throw new Error(`Multiple SSG routes use ${destination}`)
    }
    const staged = path.join(staging, 'pages', path.relative(root, destination))
    fs.mkdirSync(path.dirname(staged), { recursive: true })
    fs.writeFileSync(staged, html, { flag: 'wx' })
    pages.set(destination, { route, staged })
  }

  const publish = () => {
    const backupDir = path.join(staging, 'backups')
    fs.mkdirSync(backupDir)
    const prepared = Array.from(pages.values(), ({ route, staged }, index) => {
      const destination = getSsgOutputPath(route, root)
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      const existing = fs.lstatSync(destination, { throwIfNoEntry: false })
      if (existing !== undefined && !existing.isFile()) {
        throw new Error(`SSG output is not a file: ${destination}`)
      }
      const backup = existing ? path.join(backupDir, String(index)) : undefined
      if (backup) fs.copyFileSync(destination, backup)
      return { destination, staged, backup }
    })

    let published = 0
    try {
      for (const { destination, staged } of prepared) {
        fs.renameSync(staged, destination)
        published++
      }
    } catch (error) {
      const errors: unknown[] = [error]
      for (let i = published - 1; i >= 0; i--) {
        const { destination, backup } = prepared[i]
        try {
          if (backup) fs.renameSync(backup, destination)
          else fs.rmSync(destination)
        } catch (rollbackError) {
          errors.push(rollbackError)
        }
      }
      if (errors.length > 1) {
        throw new SsgRecoveryError(
          `SSG recovery files remain in ${staging}`,
          errors
        )
      }
      throw new SsgBuildError('Failed to publish SSG pages', error)
    }
  }
  return { stage, publish }
}
