import { type Clear } from '../clean'
import { LifecycleImpl } from './Lifecycle'

export interface OnRemoveProps {
  clear: Clear
}

export function OnRemove (props: OnRemoveProps): LifecycleImpl {
  return new LifecycleImpl(() => { }, (_, removeTree) => { props.clear(removeTree) })
}
