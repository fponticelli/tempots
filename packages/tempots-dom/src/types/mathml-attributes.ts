/**
 * Represents the attributes used in MathML elements.
 *
 * @public
 */
export type MathMLAttributes = {
  accent: boolean | string
  accentunder: boolean | string
  actiontype: 'statusline' | 'tooltip' | 'input'
  align: 'left' | 'center' | 'right'
  altimg: string
  altimgheight: string
  altimgvalign: string
  altimgwidth: string
  alttext: string
  background: string
  base: string
  bevelled: boolean | string
  charalign: 'left' | 'center' | 'right'
  class: string
  close: string
  color: string
  columnalign: string
  columnlines: string
  columnspacing: string
  columnspan: number | string
  columnwidth: string
  crossout: string
  decimalpoint: string
  definitionurl: string
  denomalign: 'left' | 'center' | 'right'
  depth: string
  dir: 'ltr' | 'rtl'
  display: 'block' | 'inline'
  displaystyle: boolean | string
  edge: 'left' | 'right'
  encoding: string
  equalcolumns: boolean | string
  equalrows: boolean | string
  fence: boolean | string
  fontfamily: string
  fontsize: string
  fontstyle: 'normal' | 'italic'
  fontweight: 'normal' | 'bold'
  form: 'prefix' | 'infix' | 'postfix'
  frame: string
  groupalign: string
  height: string
  href: string
  id: string
  indentalign: 'left' | 'center' | 'right' | 'auto' | 'id'
  indentalignfirst: 'left' | 'center' | 'right' | 'auto' | 'id' | 'indentaling'
  indentalignlast: 'left' | 'center' | 'right' | 'auto' | 'id' | 'indentaling'
  indentshift: string
  indentshiftfirst: string
  indentshiftlast: string
  indenttarget: string
  infixlinebreakstyle: 'before' | 'after' | 'duplicate'
  intent: string
  largeop: boolean | string
  leftoverhang: string
  length: string
  linebreak: 'auto' | 'newline' | 'nobreak' | 'goodbreak' | 'badbreak'
  linebreakmultchar: string
  linebreakstyle: 'before' | 'after' | 'duplicate' | 'infixlinebreakstyle'
  lineleading: string
  linethickness: string
  location: string
  longdivstyle:
    | 'lefttop'
    | 'stackedrightright'
    | 'mediumstackedrightright'
    | 'shortstackedrightright'
    | 'righttop'
  lquote: string
  lspace: string
  mathbackground: string
  mathcolor: string
  mathdepth: string
  mathsize: string
  mathvariant:
    | 'normal'
    | 'bold'
    | 'italic'
    | 'bold-italic'
    | 'double-struck'
    | 'bold-fraktur'
    | 'script'
    | 'bold-script'
    | 'fraktur'
    | 'sans-serif'
    | 'bold-sans-serif'
    | 'sans-serif-italic'
    | 'sans-serif-bold-italic'
    | 'monospace'
    | 'initial'
    | 'tailed'
    | 'looped'
    | 'stretched'
  maxsize: string
  maxwidth: string
  minlabelspacing: string
  minsize: string
  movablelimits: boolean | string
  mslinethickness: string
  notation: string
  numalign: 'left' | 'center' | 'right'
  open: string
  other: string
  overflow: 'linebreak' | 'scroll' | 'elide' | 'truncate' | 'scale'
  position: string
  rightoverhang: string
  rowalign: string
  rowlines: string
  rowspacing: string
  rowspan: number | string
  rquote: string
  rspace: string
  scriptlevel: string
  scriptminsize: string
  scriptsizemultiplier: string
  selection: string
  separator: boolean | string
  separators: string
  shift: string
  side: 'left' | 'leftoverlap' | 'right' | 'rightoverlap'
  stackalign: 'left' | 'center' | 'right' | 'decimalpoint'
  stretchy: boolean | string
  style: string
  subscriptshift: string
  superscriptshift: string
  symmetric: boolean | string
  type: string
  valign: 'top' | 'bottom' | 'center' | 'baseline' | 'axis'
  voffset: string
  width: string
  xlink: string
  xmlns: string
  xref: string
}
