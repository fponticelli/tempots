import { format } from 'prettier'

const COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
  '<!--[\\s\\S]*?(?:-->)?'
  + '<!---+>?'  // A comment with no body
  + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
  + '|<[?][^>]*>?',  // A pseudo-comment
  'g')

export const formatHtml = (html: string) => {
  html = html.replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, '')
  try {
    return format(html, {
      htmlWhitespaceSensitivity: 'css',
      proseWrap: 'always',
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      parser: 'html'
    })
  } catch {
    // console.warn(`unable to format the following html\n${html}`)
    return html
  }
}
