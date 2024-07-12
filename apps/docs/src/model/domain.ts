export type Library = {
  name: string
  title: string
  version: string
  keywords: string[]
  content: string
  description?: string
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
  libraries: Library[]
  demos: Demo[]
  pages: Page[]
  sections: Record<string, Section>
}

export type Section = {
  pages: Page[]
  sections: Record<string, Section>
}
