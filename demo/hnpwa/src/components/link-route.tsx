import { JSX, isEmptyElement, handleAnchorClick, Signal } from '@tempots/dom'
import { getCurrentPath, isGithub } from '../config'
import { Route, toTitle, toUrl } from '../route'
import { setGlobalRoute } from '../main'

export interface LinkRouteProps {
  route: Signal<Route>
  className?: string
  children?: JSX.DOMNode
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
  children
}: LinkRouteProps): JSX.DOMNode {
  if (isEmptyElement(children)) {
    children = toTitle(route.get())
  }
  return (
    <a
      className={className}
      href={route.map(toUrl)}
      target={route.map(toTarget)}
      rel={route.map(toRel)}
      onClick={handleAnchorClick(() => {
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
      })}
    >
      {children}
    </a>
  )
}
