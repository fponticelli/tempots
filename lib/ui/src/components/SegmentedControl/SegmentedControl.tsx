import { For, JSX, Signal } from "@tempots/dom"
import { strictEqual } from "@tempots/std/equals"
import { Box } from "../Box/Box"
import { Control } from "../Control/Control"
import { Sx } from "../styling/Sx"

export interface SegmentedControlProps<T> {
  options: Signal<T[]>
  value: Signal<T>
  onChange?: (value: T) => void
  display?: (value: T) => JSX.DOMNode
  equality?: (a: T, b: T) => boolean
}

interface SegmentProps<T> {
  value: Signal<T>
  display: (value: T) => JSX.DOMNode
  selected: Signal<boolean>
  onChange: (value: T) => void
}

function Segment<T>({ value, display, selected, onChange }: SegmentProps<T>) {
  return (
    <Box>
      <button onClick={() => onChange(value.get())} disabled={selected}>
        { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Sx sx={{ display: 'inline', fontWeight: selected.map<any>(v => v ? 'bold' : 'normal') }} />
        {value.map(display)}
      </button>
    </Box>
  )
}

export function SegmentedControl<T>(props: SegmentedControlProps<T>): JSX.DOMNode {
  const options = props.options
  const equality = props.equality || strictEqual
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = props.onChange || (() => { })
  return (<Control>
    <For of={options}>{
      (option: Signal<T>) =>
        <Segment<T>
          value={option}
          display={props.display ?? String}
          selected={option.combine(props.value, equality)}
          onChange={onChange} />
    }</For>
  </Control>)
}
