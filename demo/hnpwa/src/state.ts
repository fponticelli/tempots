import { makeRouteFlow, Route } from './route'

export const globalRoute = makeRouteFlow()
export const setGlobalRoute = (v: Route) => globalRoute.set(v)
