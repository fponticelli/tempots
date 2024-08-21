import { attr, html, Value } from '@tempots/dom'

export function NPMShield(name: Value<string>, label?: string | null) {
  const imgSrc = Value.map(name, n => {
    const base = `https://img.shields.io/npm/v/${n}`
    if (label === null) return `${base}?label=&style=flat-square`
    if (label != null) return `${base}?label=${label}&style=flat-square`
    return `${base}?style=flat-square`
  })
  return html.a(
    attr.class('inline-block'),
    attr.target('_blank'),
    attr.href(Value.map(name, n => `https://www.npmjs.com/package/${n}`)),
    html.img(
      attr.class('h-[20px]'),
      attr.src(imgSrc),
      attr.alt(Value.map(name, n => `npm install ${n}`))
    )
  )
}
