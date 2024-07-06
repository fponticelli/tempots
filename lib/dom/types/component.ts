import { Scope } from '../core/scope'
import { JSX } from './jsx'

export type Component<T> = (props: T, scope: Scope) => JSX.Element
