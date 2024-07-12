import { attr, computed, html, Signal, Value } from '@tempots/dom'

export function CommitsShield(user: Value<string>, repo: Value<string>) {
  const userSignal = Signal.wrap(user)
  const repoSignal = Signal.wrap(repo)
  const fullRepo = computed(
    () => `${userSignal.value}/${repoSignal.value}`,
    [userSignal, repoSignal]
  )
  return html.a(
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
