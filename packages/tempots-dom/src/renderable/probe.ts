import { Renderable, TNode } from '../types/domain'
import { UseProvider } from './consumers'
import { makeProviderMark, WithProvider } from './providers'

/**
 * A provider mark for a signal representing the current appearance type.
 * @public
 */
export const probeMarker =
  makeProviderMark<(identifier: symbol) => void>('Probe')

const probes = new Map<symbol, number>()

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
export const ProvideProbe = (
  identifier: symbol,
  callback: () => void,
  child: TNode
): Renderable => {
  if (probes.has(identifier)) {
    throw new Error(`Probe already exists: ${identifier.description}`)
  }

  probes.set(identifier, 0)

  const probef = (identifier: symbol) => {
    let probe = probes.get(identifier)
    if (probe == null) {
      throw new Error(`Probe not found: ${identifier.description}`)
    }
    if (--probe === 0) {
      callback()
      probes.delete(identifier)
    } else {
      probes.set(identifier, probe)
    }
  }

  return WithProvider(probeMarker, probef, child)
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
      throw new Error(`Probe not found: ${identifier.description}`)
    }
    probes.set(identifier, probe + 1)
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
  callback: () => void,
  child: TNode
): Renderable => {
  return ProvideProbe(globalProbe, callback, child)
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
