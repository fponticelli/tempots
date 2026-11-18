export type PageSnapshot = { path: string; html: string }

export const pageSnapshotKey = 'tempo-doc-page'
const pageSnapshotAttribute = `data-${pageSnapshotKey}`

export function pagePathFromRoute(pathname: string): string | undefined {
  if (pathname === '/') return 'index'
  return /^\/page\/([^/]+)\.html\/?$/.exec(pathname)?.[1]
}

export function readPageSnapshot(
  container: HTMLElement
): PageSnapshot | undefined {
  const article = container.querySelector(`[${pageSnapshotAttribute}]`)
  const path = article?.getAttribute(pageSnapshotAttribute)
  return article && path ? { path, html: article.innerHTML } : undefined
}

export async function fetchPage(path: string, signal: AbortSignal) {
  const response = await fetch(`/pages/${encodeURIComponent(path)}.html`, {
    signal,
  })
  if (!response.ok) throw new Error(`Page ${path} returned ${response.status}`)
  return response.text()
}
