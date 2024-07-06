import { Signal } from '@tempots/dom'
import { Sx } from '../styling/Sx'

export interface BaseInputProps {
  max?: Signal<number>
  min?: Signal<number>
  type: string
  value: Signal<string>
  step?: Signal<number>
  onChange: (value: string) => void
}

export const BaseInput = ({
  max,
  min,
  value,
  onChange,
  step,
  type
}: BaseInputProps) => {
  return (
    <input
      min={min as Signal<string | number>}
      max={max as Signal<string | number>}
      type={type}
      value={value}
      step={step}
      onInput={e => {
        const target = e.target as HTMLInputElement
        onChange(target.value)
      }}
    >
      <Sx
        sx={{
          width: '100%',
          backgroundColor: 'transparent',
          flexGrow: '1 1 auto',
          textAlign: type === 'number' ? 'right' : undefined,
          padding: '0 8px',
          ':focus': {
            outline: 'none'
          }
        }}
      />
    </input>
  )
}
