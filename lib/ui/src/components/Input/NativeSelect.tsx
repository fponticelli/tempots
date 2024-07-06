import { For, Signal } from '@tempots/dom'
import { strictEqual } from '@tempots/std/equals'
import { Control } from '../Control/Control'
import { Spacing } from '../styling/Spacing'
import { Sx } from '../styling/Sx'

export interface NativeSelectProps<T> {
  value: Signal<T>
  options: Signal<T[]>
  onChange?: (value: T) => void
  display?: (value: T) => string
  equality?: (a: T, b: T) => boolean
  disabled?: (value: T) => boolean
}

export function NativeSelect<T>({
  value,
  onChange,
  options,
  display,
  equality,
  disabled
}: NativeSelectProps<T>) {
  return (
    <Control>
      <BaseNativeSelect
        value={value}
        onChange={onChange}
        options={options}
        display={display}
        equality={equality}
        disabled={disabled}
      />
    </Control>
  )
}

export function BaseNativeSelect<T>(props: NativeSelectProps<T>) {
  const options = props.options
  const equality = props.equality ?? strictEqual
  const display = props.display ?? String
  const disabled = props.disabled ?? (() => false)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = props.onChange ?? (() => { })
  return (
    <select
      onChange={e => {
        const target = e.target as HTMLSelectElement
        const index = Number(target.value)
        onChange(options.get()[index])
      }}
    >
      <Sx
        sx={{
          ':focus': {
            outline: 'none',
            background: 'rgba(10%, 10%, 100%, 0.2)' // TODO
          }
        }}
      />
      <Spacing ph={8} />
      <For of={options}>
        {(option: Signal<T>, index: number) => (
          <option
            disabled={option.map(disabled)}
            selected={option.combine(props.value, equality)}
            value={String(index)}
          >
            {option.map(display)}
          </option>
        )}
      </For>
    </select>
  )
}
