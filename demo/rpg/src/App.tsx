import { Prop, Signal,  Tween,  When } from '@tempots/dom'
import { StyleProvider, Box, Button, TextInput, Stack, Size, Group, Position, Sx } from '@tempots/ui'
import { Character } from './rpg/character'
import { DieType, roll } from './rpg/die'
import { defaultCharacter } from './model/default-character'
import { DieRoll } from './model/die-roll'
import { Title, TitleOrder } from './components/Title'
import { AttributesView } from './components/AttributesView'
import { AbilitiesView } from './components/AbilitiesView'
import { SkillsView } from './components/SkillsView'
import { RolledDice } from './components/RolledDice'

export const App = () => {
  return <StyleProvider><Content /></StyleProvider>
}

export const Content = () => {
  const character = Prop.of(defaultCharacter)
  const rolledDice = Prop.of([] as DieRoll[])

  const rollDie = (description: string, baseScore: number, dieType: DieType) => {
    rolledDice.update(v => [{ description, roll: roll(dieType), baseScore }, ...v.slice(0, 10)])
  }

  const displayFade = Prop.of(true)

  return (
    <Box
      p="lg"
      sx={{
        height: '100%',
        padding: 20
      }}
    >
      <Stack>
        <Button onClick={() => displayFade.update(v => !v)}>Toggle</Button>
        <When is={displayFade}>
          <div>
            <Tween
              style={{ translateX: 0 }}
              enter={[{ style: { translateX: 400 }, duration: 1000 }]}
              exit={[{  style: { translateX: 0 },   duration: 1000 }]}
            />
              hello
          </div>
        </When>
        <TextInput value={character.at('profile').at('name')} onChange={v => character.update(c => Character.setName(c, v))} />
        <Group>
          <Stack spacing={Signal.of(2)}>
            <Title order={Signal.of<TitleOrder>(2)}>
              Attributes
            </Title>
            <AttributesView
              attributes={character.at('attributes')}
              setSize={v => character.update(c => Character.setSize(c, v))}
            />
          </Stack>
          <Stack spacing={Signal.of(2)}>
            <Title order={Signal.of<TitleOrder>(2)}>
              Abilities
            </Title>
            <AbilitiesView
              abilities={character.at('abilities')}
              registry={character.at('abilityRegistry')}
              setAbilities={abilities => character.update(c => Character.setAbilities(c, abilities))}
              dieRoll={rollDie}
            />
          </Stack>
          <Stack spacing={Signal.of(2)}>
            <Title order={Signal.of<TitleOrder>(2)}>
              Skills
            </Title>
            <SkillsView
              abilities={character.at('abilities')}
              skills={character.at('skills')}
              abilityRegistry={character.at('abilityRegistry')}
              skillRegistry={character.at('skillRegistry')}
              setSkills={skills => character.update(c => Character.setSkills(c, skills))}
              dieRoll={rollDie}
            />
          </Stack>
          <When is={rolledDice.map(v => v.length > 0)}>
            <Stack spacing={Signal.of('xs' as Size)}>
              <Group position={Signal.of("apart" as Position)}>
                <Title order={Signal.of<TitleOrder>(2)}>
                  Dice Rolls
                </Title>
                <Button onClick={() => rolledDice.update(() => [])}>Reset</Button>
              </Group>
              <RolledDice rolledDice={rolledDice} />
            </Stack>
          </When>
        </Group>
      </Stack>
    </Box>
  )
}
