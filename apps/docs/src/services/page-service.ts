export type PageSnapshot = { path: string; html: string }

export const pageSnapshotKey = 'tempo-doc-page'
const pageSnapshotAttribute = `data-${pageSnapshotKey}`

export function readPageSnapshot(
  container: HTMLElement
): PageSnapshot | undefined {
  const article = container.querySelector(`[${pageSnapshotAttribute}]`)
  const path = article?.getAttribute(pageSnapshotAttribute)
  return article && path ? { path, html: article.innerHTML } : undefined
}

export function usePageContent(
  key: Signal<string>,
  initialPage?: PageSnapshot
) {
  const content = key.mapAsync<PageSnapshot | undefined>(
    async (path, { abortSignal }) => {
      if (initialPage?.path === path) return initialPage
      const file = pageContentFile(path)
        .split('/')
        .map(encodeURIComponent)
        .join('/')
      const response = await fetch(`/${file}`, { signal: abortSignal })
      if (!response.ok)
        throw new Error(`Page ${path} returned ${response.status}`)
      return { path, html: await response.text() }
    },
    initialPage,
    () => ({ path: key.value, html: 'Unable to load this page.' })
  )
  return computedOf(
    key,
    content
  )((path, page) => (page?.path === path ? page.html : 'loading...'))
}
import { computedOf, type Signal } from '@tempots/dom'
import { pageContentFile } from './content-paths'
