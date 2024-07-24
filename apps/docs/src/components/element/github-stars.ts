import { attr, makeComputed, html, Signal, Value } from '@tempots/dom'

export function GithubStars(user: Value<string>, repo: Value<string>) {
  const userSignal = Signal.wrap(user)
  const repoSignal = Signal.wrap(repo)
  const fullRepo = makeComputed(
    () => `${userSignal.value}/${repoSignal.value}`,
    [userSignal, repoSignal]
  )
  return html.a(
    attr.target('_blank'),
    attr.href(fullRepo.map(n => `https://github.com/${n}`)),
    html.img(
      attr.src(fullRepo.map(n => `https://img.shields.io/github/stars/${n}`))
    )
  )
}
