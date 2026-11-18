export const libraryOverviewDirectory = 'library-overviews'
const libraryPrefix = 'library/'

export function libraryOverviewKey(name: string): string {
  return libraryPrefix + name
}

export function pageContentFile(key: string): string {
  return key.startsWith(libraryPrefix)
    ? `${libraryOverviewDirectory}/${key.slice(libraryPrefix.length)}.html`
    : `pages/${key}.html`
}

export function pagePathFromRoute(pathname: string): string | undefined {
  if (pathname === '/') return 'index'
  return /^\/page\/([^/]+)\.html\/?$/.exec(pathname)?.[1]
}

export function libraryFromRoute(pathname: string) {
  const id = /^\/library\/([^/]+?)(?:\.html)?\/?$/.exec(pathname)?.[1]
  if (id === undefined) return
  const [name, ...parts] = id.split('.')
  return { name, apiPath: parts.length ? parts.join('.') : undefined }
}
