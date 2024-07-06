import { AbilityRegistry, Abilities } from "./abilities"
import { Attributes } from "./attributes"
import { defaultAbilityRegistry } from "./default-ability-registry"
import { defaultSkillRegistry } from "./default-skill-registry"
import { SkillRegistry, Skills } from "./skills"

export interface CharacterProfile {
  readonly name: string
}

export interface Character {
  readonly attributes: Attributes
  readonly profile: CharacterProfile
  readonly abilities: Abilities
  readonly abilityRegistry: AbilityRegistry
  readonly skills: Skills
  readonly skillRegistry: SkillRegistry
}

export const Character = {
  createEmpty: (name: string): Character => ({
    attributes: {
      size: 10,
      density: 0.985
    },
    profile: { name },
    abilities: {},
    abilityRegistry: defaultAbilityRegistry,
    skills: {},
    skillRegistry: defaultSkillRegistry
  }),
  setProfile: (character: Character, profile: CharacterProfile): Character => ({
    ...character,
    profile
  }),
  setName: (character: Character, name: string): Character => Character.setProfile(character, { ...character.profile, name }),
  setAbility: (character: Character, ability: string, value: number): Character => ({
    ...character,
    abilities: Abilities.set(character.abilities, ability, value)
  }),
  setAbilities: (character: Character, abilities: Abilities): Character => ({
    ...character,
    abilities: { ...character.abilities, ...abilities }
  }),
  setSkill: (character: Character, skill: string, value: number): Character => ({
    ...character,
    skills: Skills.set(character.skills, skill, value)
  }),
  setSkills: (character: Character, skills: Skills): Character => ({
    ...character,
    skills: { ...character.skills, ...skills }
  }),
  setAbilityRegistry: (character: Character, abilityRegistry: AbilityRegistry): Character => ({
    ...character,
    abilityRegistry
  }),
  setSkillRegistry: (character: Character, skillRegistry: SkillRegistry): Character => ({
    ...character,
    skillRegistry
  }),
  setSize: (character: Character, size: number): Character => ({
    ...character,
    attributes: Attributes.setSize(character.attributes, size)
  }),
}

