import { attr, computed, html, OnDispose, Value } from '@tempots/dom'

export function CommitsShield(user: Value<string>, repo: Value<string>) {
  const userSignal = Value.toSignal(user)
  const repoSignal = Value.toSignal(repo)
  const fullRepo = computed(
    () => `${userSignal.value}/${repoSignal.value}`,
    [userSignal, repoSignal]
  )
  return html.a(
    OnDispose(fullRepo),
    attr.target('_blank'),
    attr.href(fullRepo.map(n => `https://github.com/${n}`)),
    html.img(
      attr.src(
        fullRepo.map(
          n => `https://img.shields.io/github/commit-activity/t/${n}`
        )
      )
    )
  )
}
