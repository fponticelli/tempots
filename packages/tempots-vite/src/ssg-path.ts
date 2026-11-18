import { lstatSync } from 'node:fs'
import { join } from 'node:path'
import type { RouteConfig } from './index'

const isFileSegment = (segment: string): boolean =>
  segment !== '' &&
  !segment.endsWith('.') &&
  !segment.endsWith(' ') &&
  !/[\\/:]/.test(segment) &&
  !/^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(segment) &&
  !segment.includes('\0')

export function validateSsgRoutePath(route: string): void {
  if (route === '/') return
  if (route.startsWith('/') && !/[?#]/.test(route)) {
    const segments = route.slice(1).replace(/\/$/, '').split('/')
    try {
      if (
        segments.every(segment => isFileSegment(decodeURIComponent(segment)))
      ) {
        return
      }
    } catch {
      // Invalid URL encoding is rejected along with invalid path segments.
    }
  }
  throw new Error(`Invalid SSG route: ${JSON.stringify(route)}`)
}

export function getSsgOutputPath(route: RouteConfig, root: string): string {
  validateSsgRoutePath(route.path)
  const pathname = route.path.slice(1)
  const defaultOutput =
    route.path.endsWith('/') || pathname.endsWith('.html')
      ? pathname + (route.path.endsWith('/') ? 'index.html' : '')
      : `${pathname}/index.html`
  const output = route.output || defaultOutput
  const segments = output.split('/')
  if (!segments.every(isFileSegment)) {
    throw new Error(`Invalid SSG output path: ${JSON.stringify(output)}`)
  }

  let destination = root
  for (const segment of segments) {
    destination = join(destination, segment)
    if (lstatSync(destination, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error(`SSG output path contains a symlink: ${destination}`)
    }
  }
  return destination
}
