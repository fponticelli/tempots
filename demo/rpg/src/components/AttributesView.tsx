import { Signal } from "@tempots/dom"
import { TableStyles } from "./TableStyles"
import { FloatInput } from "@tempots/ui"
import { formatWeight } from "./format"
import { Attributes } from "../rpg/attributes"

export interface AttributesViewProps {
  attributes: Signal<Attributes>
  setSize: (size: number) => void
}

export function AttributesView({ attributes, setSize }: AttributesViewProps) {
  const range = attributes.map(Attributes.getWeightRange)
  return (
    <table>
      <TableStyles />
      <tr>
        <td>Size</td>
        <td>
          <FloatInput
            min={Signal.of(0.01)}
            max={Signal.of(1000)}
            value={attributes.at('size')}
            onChange={v => setSize(v)}
          />
        </td>
      </tr>
      <tr>
        <td>
          Weight
        </td>
        <td>
          {range.at(0).map(formatWeight)}-{range.at(1).map(formatWeight)}kg
        </td>
      </tr>
    </table>
  );
}