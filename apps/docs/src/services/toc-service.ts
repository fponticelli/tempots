import { Demo, Page, Library, Toc } from '../model/domain'

export async function fetchToc(): Promise<Toc> {
  const response = await fetch('/toc.json')
  const json: Toc = await response.json()
  return json
}

export function tocAsMap(toc: Toc): {
  libraries: Map<string, Library>
  demos: Map<string, Demo>
  pages: Map<string, Page>
} {
  return {
    libraries: new Map(toc.libraries.map(library => [library.name, library])),
    demos: new Map(toc.demos.map(demo => [demo.path, demo])),
    pages: new Map(toc.pages.map(page => [page.path, page])),
  }
}
