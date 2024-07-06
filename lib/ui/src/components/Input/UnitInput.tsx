import { Signal } from '@tempots/dom'
import { Control } from '../Control/Control'
import { BaseFloatInput } from './FloatInput'
import { BaseNativeSelect } from './NativeSelect'

export interface UnitInputProps<T> {
  step?: Signal<number>
  value: Signal<number>
  unit: Signal<T>
  units: Signal<T[]>
  onChange: (value: number, unit: T) => void
  convert?: (from: T, to: T, value: number) => number
}

export function UnitInput<T>({
  value,
  onChange,
  step,
  unit,
  units,
  ...props
}: UnitInputProps<T>) {
  const convert = props.convert || ((from, to, value) => value)
  const onChangeValue = (value: number) => {
    onChange(value, unit.get())
  }
  const onChangeUnit = (newUnit: T) => {
    onChange(convert(unit.get(), newUnit, value.get()), newUnit)
  }
  return (
    <Control>
      <BaseFloatInput value={value} onChange={onChangeValue} step={step} />
      <BaseNativeSelect value={unit} onChange={onChangeUnit} options={units} />
    </Control>
  )
}
