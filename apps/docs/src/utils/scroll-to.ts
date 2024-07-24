import { Prop } from '@tempots/dom'
import { LocationData, setLocationFromUrl } from '@tempots/ui'

export const scrollIntoView = (selector: string): void => {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export const scrollToTop = (): void => {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export const navigateTo = (
  location: Prop<LocationData>,
  href: string
): void => {
  setLocationFromUrl(location, href)
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
