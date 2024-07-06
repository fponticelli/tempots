import { Character } from "../rpg/character";

export const defaultCharacter = Character.setSkills(
  Character.setAbilities(
    Character.createEmpty("Sample Character"),
    {
      empathy: 3,
      leadership: 3,
      agility: 4,
      combat: 3,
      health: 4,
      perception: 2,
      reflexes: 3,
      strength: 3,
      logic: 3,
      mnemonic: 3,
      willpower: 2
    }
  ),
  {
    acrobatics: 2,
    athletics: 3,
    brawling: 1,
    dodge: 2,
    closeCombat: 2,
    throwing: 1
  }
)