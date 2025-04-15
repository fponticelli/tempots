import { makeProviderMark } from '../dom/dom-context'
import { Provider } from './provider'

const probes = new Map<
  symbol,
  { counter: number; timeoutId: ReturnType<typeof setTimeout> }
>()

export type ProbeResolution = 'resolved' | 'timeout'

export type ProbeOptions = {
  callback?: (resolution: ProbeResolution) => void
  timeout?: number
}

export const makeProbe = (
  identifier: symbol
): Provider<() => void, ProbeOptions> => {
  return {
    mark: makeProviderMark<() => void>(`Probe(${identifier.description})`),
    create: ({ callback = () => {}, timeout = 10 }: ProbeOptions = {}) => {
      if (probes.has(identifier)) {
        throw new Error(`Probe already exists: ${identifier.description}`)
      }

      const timeoutId = setTimeout(() => callback('timeout'), timeout)
      const obj = { counter: 0, timeoutId }
      probes.set(identifier, obj)

      const probef = () => {
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

      return {
        value: probef,
        dispose: () => {
          clearTimeout(timeoutId)
          probes.delete(identifier)
        },
        onUse: () => obj.counter++,
      }
    },
  }
}

export const GlobalProbe = makeProbe(Symbol('GlobalProbe'))
