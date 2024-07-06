import { For, Signal } from "@tempots/dom"
import { Abilities, AbilityRegistry } from "../rpg/abilities"
import { SkillDescription, SkillRegistry, Skills } from "../rpg/skills"
import { DieType, dieFromSkillScore } from "../rpg/die"
import { TableStyles } from "./TableStyles"
import { Dependency } from "../rpg/dependency"
import { BaseIntInput, Button, Control, Size, Stack, Sx, Tooltip } from "@tempots/ui"
import { Category } from "../rpg/category"
import { Title, TitleOrder } from "./Title"

export interface SkillsGroupViewProps {
  abilities: Signal<Abilities>
  skillList: Signal<[number, SkillDescription][]>
  skills: Signal<Skills>
  abilityRegistry: Signal<AbilityRegistry>
  skillRegistry: Signal<SkillRegistry>
  setSkill: (id: string, value: number) => void
  dieRoll: (description: string, baseScore: number, dieType: DieType) => void
}

export function SkillsGroupView({ skillList, skills, skillRegistry, abilityRegistry, setSkill, abilities, dieRoll }: SkillsGroupViewProps) {
  return (
    <table>
      <TableStyles />
      <For of={skillList}>
        {(group: Signal<[number, SkillDescription]>) => {
          const description = group.at(1).at("description")
          const title = Signal.combine(
            [group.at(1), skillRegistry, abilityRegistry],
            (skillDescription: SkillDescription, skillRegistry: SkillRegistry, abilityRegistry: AbilityRegistry) => {
              return Dependency.display(skillDescription.dependsOn, skillRegistry, abilityRegistry)
            }
          )
          const calculated = Signal.combine(
            [group.at(0), group.at(1), abilities, skills, skillRegistry],
            (skillScore: number, skillDescription: SkillDescription, attrs: Abilities, skls: Skills, regs: SkillRegistry) => {
              return skillScore + Skills.calculateDependency(attrs, skls, regs, skillDescription.id)
            }
          )
          return (
            <tr>
              <td>
                <span>
                  <Tooltip>{description}</Tooltip>
                  {group.at(1).combine(skillRegistry, (des, reg) => reg[des.id].name)}
                </span>
              </td>
              <td>
                <Control>
                  <BaseIntInput min={Signal.of(0)} max={Signal.of(10)} value={group.at(0)} onChange={v => setSkill(group.at(1).at('id').get(), v)} />
                  <Tooltip>{title}</Tooltip>
                  <span>
                    <Sx sx={{ fontWeight: 'bolder', color: "#333" }} />
                    {calculated}
                  </span>
                  <Button
                      size={Signal.of<Size>('xs')}
                      compact={Signal.of(true)}
                      onClick={() => {
                        dieRoll(
                          group.at(1).combine(skillRegistry, (des, reg) => reg[des.id].name).get(),
                          calculated.get(),
                          dieFromSkillScore(group.at(0).get())
                        )
                      }}>
                    {group.at(0).map(v => `#${dieFromSkillScore(v)+1}`)}
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

export interface SkillsViewProps {
  abilities: Signal<Abilities>
  skills: Signal<Skills>
  abilityRegistry: Signal<AbilityRegistry>
  skillRegistry: Signal<SkillRegistry>
  setSkills: (skills: Skills) => void
  dieRoll: (description: string, baseScore: number, dieType: DieType) => void
}

export function SkillsView({ skills, abilities, abilityRegistry, skillRegistry, setSkills, dieRoll }: SkillsViewProps) {
  const grouped = skills.combine(skillRegistry, (skills, abilityRegistry) => Skills.getGrouped(skills, abilityRegistry))
  return (
    <For of={grouped}>
      {(group: Signal<{
        category: Category;
        skills: [number, SkillDescription][];
      }>) => {
        return (
          <Stack spacing={Signal.of(4)}>
            <Title order={Signal.of<TitleOrder>(3)}>
              {group.at('category')}
            </Title>
            <SkillsGroupView
              skills={skills}
              abilities={abilities}
              skillList={group.at('skills')}
              abilityRegistry={abilityRegistry}
              skillRegistry={skillRegistry}
              setSkill={(id, value) => setSkills(Skills.set(skills.get(), id, value))}
              dieRoll={dieRoll}
            />
          </Stack>
        )
      }}
    </For>
  )
}
