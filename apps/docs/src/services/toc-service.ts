export type Project = {
  name: string
  title: string
  version: string
  keywords: string[]
  content: string
}
export type Demo = {
  path: string
  version: string
  title: string
  description: string
}
export type Page = {
  title: string
  path: string
}

export type Toc = {
  projects: Project[]
  demos: Demo[]
  pages: Page[]
}

export async function fetchToc(): Promise<Toc> {
  const response = await fetch('/toc.json')
  return response.json()
}

export function tocAsMap(toc: Toc): {
  projects: Map<string, Project>
  demos: Map<string, Demo>
  pages: Map<string, Page>
} {
  return {
    projects: new Map(toc.projects.map(project => [project.name, project])),
    demos: new Map(toc.demos.map(demo => [demo.path, demo])),
    pages: new Map(toc.pages.map(page => [page.path, page])),
  }
}
