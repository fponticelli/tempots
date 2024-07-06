import { Signal } from '@tempots/dom'
import { Control } from '../Control/Control'
import { BaseInput } from './BaseInput'

export interface TextInputProps {
  value: Signal<string>
  onChange: (value: string) => void
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <Control>
      <BaseTextInput value={value} onChange={onChange} />
    </Control>
  )
}

export const BaseTextInput = ({
  value,
  onChange
}: TextInputProps) => {
  return <BaseInput type="text" value={value} onChange={onChange} />
}
