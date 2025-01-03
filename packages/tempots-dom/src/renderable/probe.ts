import { Renderable, TNode } from '../types/domain'
import { UseProvider } from './consumers'
import { Fragment } from './fragment'
import { OnDispose } from './on-dispose'
import { makeProviderMark, WithProvider } from './providers'

/**
 * A provider mark for a signal representing the current appearance type.
 * @public
 */
export const probeMarker =
  makeProviderMark<(identifier: symbol) => void>('Probe')

const probes = new Map<
  symbol,
  { counter: number; timeoutId: ReturnType<typeof setTimeout> }
>()

export type ProbeResolution = 'resolved' | 'timeout'

/**
 * Provides a child component with a probe, which can be used to trigger a callback when all probes with the same identifier are resolved.
 * To resolve a probe, call the `done` function passed using the `UseProbe` renderable.
 *
 * @param identifier - The identifier for the probe.
 * @param callback - The callback to be triggered when the probe is no longer needed.
 * @param child - The child component to be provided with the probe.
 * @returns The child component with the probe.
 * @public
 */
export const ProvideProbe = ({
  identifier,
  callback = () => {},
  child,
  timeout = 10,
}: {
  identifier: symbol
  callback?: (resolution: ProbeResolution) => void
  child: TNode
  timeout?: number
}): Renderable => {
  if (probes.has(identifier)) {
    throw new Error(`Probe already exists: ${identifier.description}`)
  }

  const timeoutId = setTimeout(() => callback('timeout'), timeout)
  probes.set(identifier, {
    counter: 0,
    timeoutId,
  })

  const probef = (identifier: symbol) => {
    clearTimeout(timeoutId)
    const probe = probes.get(identifier)
    if (probe == null) {
      throw new Error(`Probe not found: ${identifier.description}`)
    }
    if (--probe.counter === 0) {
      callback('resolved')
      probes.delete(identifier)
    } else {
      probes.set(identifier, probe)
    }
  }

  return Fragment(
    OnDispose(() => clearTimeout(timeoutId)),
    WithProvider(probeMarker, probef, child)
  )
}

/**
 * Uses a probe, which can be used to trigger a callback when all probes with the same identifier are resolved.
 * To resolve a probe, call the `done` function.
 *
 * @param identifier - The identifier for the probe.
 * @param fn - The callback to be triggered when the probe is no longer needed.
 * @returns The child component with the probe.
 * @public
 */
export const UseProbe = (
  identifier: symbol,
  fn: (done: () => void) => TNode
): Renderable => {
  return UseProvider(probeMarker, probefn => {
    const probe = probes.get(identifier)
    if (probe == null) {
      return fn(() => {}) // don't do anything if ProvideProbe is not found
      // throw new Error(`Probe not found: ${identifier.description}`)
    }
    clearTimeout(probe.timeoutId)
    probe.counter++
    return fn(() => probefn(identifier))
  })
}

const globalProbe = Symbol('globalProbe')

/**
 * Provides a global probe, which can be used to trigger a callback when all probes with the same identifier are resolved.
 * To resolve a probe, call the `done` function passed using the `UseProbe` renderable.
 *
 * @param callback - The callback to be triggered when the probe is no longer needed.
 * @param child - The child component to be provided with the probe.
 * @returns The child component with the probe.
 * @public
 */
export const ProvideGlobalProbe = (
  {
    callback,
    timeout,
  }: { callback?: (resolution: ProbeResolution) => void; timeout?: number },
  child: TNode
): Renderable => {
  return ProvideProbe({ identifier: globalProbe, callback, child, timeout })
}

/**
 * Uses a global probe, which can be used to trigger a callback when all probes with the same identifier are resolved.
 * To resolve a probe, call the `done` function.
 *
 * @param fn - The callback to be triggered when the probe is no longer needed.
 * @returns The child component with the probe.
 * @public
 */
export const UseGlobalProbe = (fn: (done: () => void) => TNode): Renderable => {
  return UseProbe(globalProbe, fn)
}
