import { attr, makeComputed, html, Value } from '@tempots/dom'

export function GithubStars(user: Value<string>, repo: Value<string>) {
  const userSignal = Value.toSignal(user)
  const repoSignal = Value.toSignal(repo)
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
