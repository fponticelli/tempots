import { type JSX } from '../jsx-runtime'
import { type Signal } from '../prop'
import { OneOfImpl } from './OneOf'

export interface IfProps {
  is: Signal<boolean>
  then?: () => JSX.DOMNode
  otherwise?: () => JSX.DOMNode
}

export function If ({ is, then, otherwise }: IfProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { then: true } : { otherwise: false }),
    {
      then: then || (() => null),
      otherwise: otherwise || (() => null)
    }
  )
}

export interface WhenProps {
  is: Signal<boolean>
  children?: () => JSX.DOMNode
}

export function When ({ is, children }: WhenProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { then: true } : { otherwise: false }),
    {
      then: children,
      otherwise: (() => null)
    }
  )
}

export function Unless ({ is, children }: WhenProps): JSX.DOMNode {
  return new OneOfImpl(
    is.map(v => v ? { then: true } : { otherwise: false }),
    {
      then: (() => null),
      otherwise: children
    }
  )
}
