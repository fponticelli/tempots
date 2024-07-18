import { flattenArray, jsQuote, quote, trimChars } from '@tempots/std'

export function parseHTML(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body
}

function makeIndent(indent: number): string {
  return ' '.repeat(indent * 2)
}

function quoteValue(value: string): string {
  if (value === 'true' || value === 'false') {
    return value
  } else if (/^[-]?\d+(\.\d+)?$/.test(value)) {
    return value
  } else {
    return quote(value)
  }
}

function fieldAccess(name: string) {
  name = name
    .split('-')
    .map((v, i) => (i === 0 ? v : v[0].toUpperCase() + v.slice(1)))
    .join('')
  return `.${name}`
}

const commonAttributes = new Set(['class', 'id', 'style', 'title', 'role'])

export function domToTempo(node: Node, indent = 0): string[] {
  const indentContainer = makeIndent(indent)
  if (node.nodeType === Node.TEXT_NODE) {
    const content = node.textContent ?? ''
    if (content.trim() === '') {
      return []
    }
    return [
      indentContainer +
        jsQuote(
          trimChars(content, '\n ').split('\n').join(`\n${indentContainer}`)
        ) +
        ',',
    ]
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const tagName = el.tagName.toLowerCase()
    const attributes = Array.from(el.attributes)
    const children = flattenArray(
      Array.from(node.childNodes).map(v => domToTempo(v, indent + 1))
    )
    const isSVG = el.namespaceURI === 'http://www.w3.org/2000/svg'
    const buffer = [`${indentContainer}${isSVG ? 'svg' : 'html'}.${tagName}(`]
    const indentAttrs = makeIndent(indent + 1)
    buffer.push(
      ...attributes.map(attr => {
        if (attr.name.startsWith('aria-')) {
          return `${indentAttrs}aria${fieldAccess(attr.name.slice(5))}(${quoteValue(attr.value)}),`
        } else if (attr.name.startsWith('data-')) {
          return `${indentAttrs}data${fieldAccess(attr.name.slice(5))}(${quoteValue(attr.value)}),`
        } else {
          if (isSVG && !commonAttributes.has(attr.name)) {
            return `${indentAttrs}svgAttr${fieldAccess(attr.name)}(${quoteValue(attr.value)}),`
          } else {
            return `${indentAttrs}attr${fieldAccess(attr.name)}(${quoteValue(attr.value)}),`
          }
        }
      })
    )
    buffer.push(...children)
    if (children.length + attributes.length > 0) {
      buffer.push(`${indentContainer}),`)
    } else {
      buffer[buffer.length - 1] = buffer[buffer.length - 1] + `),`
    }
    return buffer
  } else {
    return []
  }
}

export function htmlToTempo(html: string) {
  const body = parseHTML(html)
  const children = Array.from(body.childNodes)
  if (children.length === 1) {
    const value = domToTempo(children[0]).join('\n')
    if (value.endsWith(',')) {
      return value.slice(0, -1)
    } else {
      return value
    }
  } else {
    return `Fragment(\n${children.map(v => domToTempo(v, 1).join('\n')).join(',\n')}\n)`
  }
}
