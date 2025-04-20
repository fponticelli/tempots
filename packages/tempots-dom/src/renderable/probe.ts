import { makeProviderMark } from '../dom/dom-context'
import { Provider } from './provider'

const probes = new Map<
  symbol,
  { counter: number; timeoutId: ReturnType<typeof setTimeout> }
>()

export type ProbeResolution = 'resolved' | 'timeout' | 'disposed'

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
      const wrappedCallback = (type: ProbeResolution) => {
        clearTimeout(timeoutId)
        probes.delete(identifier)
        callback(type)
      }
      if (probes.has(identifier)) {
        throw new Error(`Probe already exists: ${identifier.description}`)
      }

      const timeoutId = setTimeout(() => wrappedCallback('timeout'), timeout)
      const obj = { counter: 0, timeoutId }
      probes.set(identifier, obj)

      const probef = () => {
        clearTimeout(timeoutId)
        const probe = probes.get(identifier)
        if (probe == null) {
          // probe has been cleared
          return
        }
        if (--probe.counter === 0) {
          wrappedCallback('resolved')
        }
      }

      return {
        value: probef,
        dispose: () => wrappedCallback('disposed'),
        onUse: () => obj.counter++,
      }
    },
  }
}

export const GlobalProbe = makeProbe(Symbol('GlobalProbe'))
