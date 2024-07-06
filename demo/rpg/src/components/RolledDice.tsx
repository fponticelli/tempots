import { Signal } from "@tempots/dom";
import { DieRoll } from "../model/die-roll";
import { TableStyles } from "./TableStyles";
import { For } from "@tempots/dom/index";
import { Tooltip } from "@tempots/ui";

export interface RolledDiceProps {
  rolledDice: Signal<DieRoll[]>
}

export function RolledDice({rolledDice} : RolledDiceProps) {
  return (
    <table>
      <TableStyles />
      <tr>
        <th>Skill/Ability</th>
        <th>Score</th>
        <th>Edges</th>
      </tr>
      <For of={rolledDice}>
        {(roll: Signal<DieRoll>) => {
          const tooltip = roll.map(r => {
            const bonus = r.roll.bonus;
            const totalScore = r.baseScore + r.roll.bonus;
            return r.baseScore + ((bonus < 0 ? " - " :  " + ") + Math.abs(bonus)) + " = " + totalScore
          })
          return <tr>
            <td>{roll.at('description')}</td>
            <td>
              <b>
                <Tooltip>{tooltip}</Tooltip>
                {roll.map(r => r.baseScore + r.roll.bonus)}
              </b>
            </td>
            <td>{roll.map(r => r.roll.edgeToString())}</td>
          </tr>
        }}
      </For>
    </table>)
}
