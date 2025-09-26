import type { LocationHandle } from '@tempots/ui'

export const scrollIntoView = (selector: string): void => {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export const scrollToTop = (): void => {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export const navigateTo = (location: LocationHandle, href: string): void => {
  location.navigate(href)
  setTimeout(() => {
    const index = href.indexOf('#')
    if (index === -1) {
      scrollIntoView('#main-anchor')
    } else {
      const id = href.substring(index)
      scrollIntoView(id)
    }
  })
}
