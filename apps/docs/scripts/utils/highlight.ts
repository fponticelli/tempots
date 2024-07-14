import hljs from 'highlight.js'

export const highlightTS = (code: string) => {
  return hljs.highlight(code, {
    language: 'typescript',
    ignoreIllegals: true,
  }).value
}

export const highlightShell = (code: string) => {
  return hljs.highlight(code, {
    language: 'sh',
    ignoreIllegals: true,
  }).value
}
