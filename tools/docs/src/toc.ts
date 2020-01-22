export interface PageRef {
  path: string
  title: string
}

export interface DemoRef {
  path: string
  title: string
  description: string
}

export interface ApiRef {
  path: string
  id: string
  title: string
  sidebar_label: string
}

export interface SectionRef {
  pages: PageRef[]
  sections: Record<string, SectionRef>
}

export interface Toc {
  demos: DemoRef[]
  pages: PageRef[]
  sections: Record<string, SectionRef>
  apis: Record<string, ApiRef[]>
  projects: Record<string, ProjectRef[]>
}

export interface ProjectRef {
  title: string
  name: string
  description: string | undefined
  version: string
  keywords: string[]
}
