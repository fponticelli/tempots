import { For, Prop, Signal } from "@tempots/dom"
import { Abilities, AbilityDescription, AbilityRegistry } from "../rpg/abilities"
import { DieType, dieFromAbilityScore } from "../rpg/die"
import { TableStyles } from "./TableStyles"
import { BaseIntInput, Button, Control, Popover, Size, Stack, Sx, Tooltip } from "@tempots/ui"
import { Category } from "../rpg/category"
import { Title, TitleOrder } from "./Title"

export interface AbilitiesGroupViewProps {
  abilities: Signal<[number, AbilityDescription][]>
  registry: Signal<AbilityRegistry>
  setAbility: (id: string, value: number) => void
  dieRoll: (description: string, baseScore: number, dieType: DieType) => void
}

export function AbilitiesGroupView({ abilities, registry, setAbility, dieRoll }: AbilitiesGroupViewProps) {
  return (
    <table>
      <TableStyles />
      <For of={abilities}>
      {(group: Signal<[number, AbilityDescription]>) => {
          const opened = Prop.of(false)
          const description = Signal.combine(
            [group.at(1), registry],
            (skillDescription: AbilityDescription, abilityRegistry: AbilityRegistry) => {
              return abilityRegistry[skillDescription.id].description
            }
          )
          return (
            <tr>
              <td>
                <span>
                  <Tooltip>{description}</Tooltip>
                  {group.at(1).combine(registry, (des, reg) => reg[des.id].name)}
                </span>
              </td>
              <td>
                <Control>
                  <Popover opened={opened}>
                    <Stack>
                      <div>
                        some content here
                      </div>
                      <Button onClick={() => opened.set(false)}>
                        Open Dialog
                      </Button>
                    </Stack>
                  </Popover>
                  <BaseIntInput min={Signal.of(0)} max={Signal.of(10)} value={group.at(0)} onChange={v => setAbility(group.at(1).at('id').get(), v)} />
                  <Button
                      size={Signal.of<Size>('xs')}
                      compact={Signal.of(true)}
                      onClick={() => {
                        dieRoll(
                          group.at(1).combine(registry, (des, reg) => reg[des.id].name).get(),
                          group.at(0).get(),
                          dieFromAbilityScore(group.at(0).get())
                        )
                      }}>
                    {group.at(0).map(v => `#${dieFromAbilityScore(v)+1}`)}
                  </Button>
                </Control>
              </td>
            </tr>
          )
        }}
      </For>
    </table>
  )
}

export interface AbilitiesViewProps {
  abilities: Signal<Abilities>
  registry: Signal<AbilityRegistry>
  setAbilities: (abilities: Abilities) => void
  dieRoll: (description: string, baseScore: number, dieType: DieType) => void
}

export function AbilitiesView({ abilities, registry, setAbilities, dieRoll }: AbilitiesViewProps) {
  const grouped = abilities.combine(registry, (abilities, registry) => Abilities.getGrouped(abilities, registry))
  return (
    <For of={grouped}>
      {(group: Signal<{
          category: Category;
          abilities: [number, AbilityDescription][];
        }>) => {
            return (
              <Stack spacing={Signal.of(4)}>
                <Title order={Signal.of<TitleOrder>(3)}>{group.at('category')}</Title>
                <AbilitiesGroupView
                  abilities={group.at('abilities')}
                  registry={registry}
                  setAbility={(id, value) => setAbilities(Abilities.set(abilities.get(), id, value))}
                  dieRoll={dieRoll}
                />
              </Stack>
            )
          }}
    </For>
  )
}
