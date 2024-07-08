import {
  attr,
  Child,
  handleAnchorClick,
  html,
  Mountable,
  on,
  Signal,
} from '@tempots/dom'
import { getCurrentPath, isGithub } from '../config'
import { Route, toTitle, toUrl } from '../route'
import { setGlobalRoute } from '../main'

export interface LinkRouteProps {
  route: Signal<Route>
  className?: string
  children?: Child
}

function toTarget(route: Route): string | undefined {
  return route.type === 'ExternalRoute' ? '_blank' : undefined
}

function toRel(route: Route): string | undefined {
  return route.type === 'ExternalRoute' ? 'noopener' : undefined
}

export function LinkRoute({
  route,
  className,
  children,
}: LinkRouteProps): Mountable {
  if (children == null || (Array.isArray(children) && children.length === 0)) {
    children = toTitle(route.get())
  }
  return html.a(
    attr.class(className),
    attr.href(route.map(toUrl)),
    attr.target(route.map(toTarget)),
    attr.rel(route.map(toRel)),
    on.click(
      handleAnchorClick(() => {
        const r = route.get()
        switch (r.type) {
          case 'ExternalRoute':
            return false
          case 'NotFoundRoute':
            return true
          default: {
            const url = toUrl(r)
            const urlToSet = isGithub ? `#${url}` : url
            history.pushState(url, '', urlToSet)
            setGlobalRoute(Route.fromUrl(getCurrentPath()))
            return true
          }
        }
      })
    ),
    children
  )
}