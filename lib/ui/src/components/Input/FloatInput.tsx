import { Signal } from '@tempots/dom'
import { Control } from '../Control/Control'
import { BaseInput } from './BaseInput'

export interface FloatInputProps {
  min?: Signal<number>
  max?: Signal<number>
  step?: Signal<number>
  value: Signal<number>
  onChange: (value: number) => void
}

export const FloatInput = ({
  min,
  max,
  value,
  onChange,
  step
}: FloatInputProps) => {
  return (
    <Control>
      <BaseFloatInput min={min} max={max} value={value} onChange={onChange} step={step} />
    </Control>
  )
}

export const BaseFloatInput = ({
  min,
  max,
  value,
  onChange,
  step
}: FloatInputProps) => {
  return (
    <BaseInput
      min={min}
      max={max}
      type="number"
      step={step}
      value={value.map(String)}
      onChange={value => {
        const newValue = parseFloat(value)
        if (!isNaN(newValue)) {
          onChange(newValue)
        }
      }}
    />
  )
}
