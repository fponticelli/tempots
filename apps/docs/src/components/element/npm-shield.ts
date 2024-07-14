import { attr, html, Signal, Value } from '@tempots/dom'

export function NPMShield(name: Value<string>) {
  return html.a(
    attr.class('inline-block'),
    attr.target('_blank'),
    attr.href(Signal.map(name, n => `https://www.npmjs.com/package/${n}`)),
    html.img(
      attr.src(
        Signal.map(name, n => `https://img.shields.io/npm/v/${n}?label=${n}`)
      ),
      attr.alt(Signal.map(name, n => `npm install ${n}`))
    )
  )
}
