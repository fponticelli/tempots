import Prism from 'prismjs'

// import ts from 'prismjs/components/prism-typescript'

export const highlight = (code: string) => {
  return Prism.highlight(code, Prism.languages.typescript, 'typescript')
}
