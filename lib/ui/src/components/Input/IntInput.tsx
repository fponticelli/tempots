import { Signal } from '@tempots/dom'
import { Control } from '../Control/Control'
import { BaseInput } from './BaseInput'

export interface IntInputProps {
  max?: Signal<number>
  min?: Signal<number>
  value: Signal<number>
  onChange: (value: number) => void
}

export const IntInput = ({ value, onChange, max, min }: IntInputProps) => {
  return (
    <Control>
      <BaseIntInput value={value} onChange={onChange} max={max} min={min} />
    </Control>
  )
}

export const BaseIntInput = ({ value, onChange, max, min }: IntInputProps) => {
  const minSignal = (min ?? Signal.of(null as number | null)) as Signal<number | null>
  const maxSignal = (max ?? Signal.of(null as number | null)) as Signal<number | null>
  return (
    <BaseInput
      type="number"
      min={min}
      max={max}
      step={Signal.of(1)}
      value={Signal.combine(
        [value, minSignal, maxSignal],
        (v: number, mi: number | null, ma: number | null) => {
          if (mi !== null && v < mi) {
            return mi
          }
          if (ma !== null && v > ma) {
            return ma
          }
          return v
        }).map(String)}
      onChange={(value: string) => {
        const newValue = Math.round(Number(value))
        if (isFinite(newValue)) {
          onChange(Math.round(newValue))
        }
      }}
    />
  )
}
