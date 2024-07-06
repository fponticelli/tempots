import { isSignal, Property } from '@tempots/std/property'
import { makeRef, appendOrInsert, removeNode } from '../core/dom-helpers'
import { makeRendarableOfElement } from '../core/render'
import { JSX } from '../jsx-runtime'
import { keys as objectKeys } from '@tempots/std/objects'
import { diffOperations } from '@tempots/std/arrays'
import { AnyKey } from '@tempots/std/types/utility'
import { Scope } from '../core/scope'

export interface EntriesProps<T> {
  of: Property<T>
  children: (key: keyof T, value: Property<T[typeof key]>) => JSX.Element
}

// <Entries ofs={obj}>{(key, value) => <dt>key:</dt><dd>{value.toText()}</dd>}</For>
export function Entries<T extends Record<AnyKey, unknown>>({
  of,
  children: makeRenderable
}: EntriesProps<T>) {
  return (scope: Scope) => {
    const ref = makeRef()
    appendOrInsert(ref, scope.reference)

    let keys = objectKeys(of.get())
    const values = keys.map((key: keyof T) => of.at(key))

    const newScope = scope.withReference(ref)
    const items: [Node, (_: boolean) => void][] = values.map(
      (value: Property<T[keyof T]>, i: number) => {
        const itemRef = makeRef()
        appendOrInsert(itemRef, ref)
        const cancel = makeRendarableOfElement(
          makeRenderable(keys[i], value)
        )?.(newScope)
        return [
          itemRef,
          (removeTree: boolean) => {
            // value.complete()
            newScope.cancel()
            cancel?.(removeTree)
            if (removeTree) removeNode(itemRef)
          }
        ]
      }
    )
    const cancelSubscription = of.subscribe({
      onNext: (newObj: T) => {
        const newKeys = objectKeys(newObj)
        const ops = diffOperations(keys, newKeys, a => a)
        keys = newKeys

        for (const { at, qt } of ops.removals) {
          for (let i = qt - 1; i >= 0; i--) {
            removeNode(items[at + i][0])
            items[at + i][1](true)
          }
          items.splice(at, qt)
        }

        for (const { from, to } of ops.swaps) {
          const keyFrom = newKeys[from]
          const keyTo = newKeys[to]
          const fromValue = of.at(keyFrom)
          const toValue = of.at(keyTo)

          const fromItemRef = makeRef()
          const fromLocalRef = items[from][0]
          appendOrInsert(fromItemRef, fromLocalRef)

          const toItemRef = makeRef()
          const toLocalRef = items[to][0]
          appendOrInsert(toItemRef, toLocalRef)

          const fromScope = scope.withReference(fromItemRef)
          const _fromCancel = makeRendarableOfElement(
            makeRenderable(keyFrom, fromValue)
          )?.(fromScope)
          const fromCancel = (removeTree: boolean) => {
            // fromValue.complete()
            fromScope.cancel()
            _fromCancel?.(removeTree)
            if (removeTree) removeNode(fromItemRef)
          }

          const toScope = scope.withReference(toItemRef)
          const _toCancel = makeRendarableOfElement(
            makeRenderable(keyTo, toValue)
          )?.(toScope)
          const toCancel = (removeTree: boolean) => {
            // toValue.complete()
            toScope.cancel()
            _toCancel?.(removeTree)
            if (removeTree) removeNode(toItemRef)
          }

          const [origFromNode, origFromCancel] = items[from]
          removeNode(origFromNode)
          origFromCancel(true)
          items[from] = [fromItemRef, fromCancel]

          const [origToNode, origToCancel] = items[to]
          removeNode(origToNode)
          origToCancel(true)
          items[to] = [toItemRef, toCancel]
        }

        for (const { at, values } of ops.inserts) {
          const adds: [Node, (_: boolean) => void][] = values.map(key => {
            const value = of.at(key)
            const itemRef = makeRef()
            const localRef = at < items.length ? items[at][0] : ref
            appendOrInsert(itemRef, localRef)
            const newScope = scope.withReference(localRef)
            const cancel = makeRendarableOfElement(
              makeRenderable(key, value)
            )?.(newScope)
            return [
              itemRef,
              (removeTree: boolean) => {
                // value.complete()
                newScope.cancel()
                cancel?.(removeTree)
                if (removeTree) removeNode(itemRef)
              }
            ]
          })
          items.splice(at, 0, ...adds)
        }
      }
    })
    return (removeTree: boolean) => {
      cancelSubscription?.()
      values.forEach(value => (isSignal(value) ? value.cancel() : {}))
      items.forEach(([, cancel]) => cancel?.(removeTree))
      if (removeTree) {
        removeNode(ref)
      }
    }
  }
}
