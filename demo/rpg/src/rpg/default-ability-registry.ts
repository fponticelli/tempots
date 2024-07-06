import { AbilityRegistry, Abilities } from "./abilities"
import { Category } from "./category"

export const defaultAbilityRegistry: AbilityRegistry = {
  empathy: Abilities.description("empathy", "Empathy", "The ability to understand and share the feelings of others.", Category.Social),
  leadership: Abilities.description("leadership", "Leadership", "The ability to guide and direct others.", Category.Social),
  agility: Abilities.description("agility", "Agility", "The ability to move quickly and easily.", Category.Physical),
  combat: Abilities.description("combat", "Combat", "The ability to fight effectively.", Category.Physical),
  health: Abilities.description("health", "Health", "The ability to resist injury and disease.", Category.Physical),
  perception: Abilities.description("perception", "Perception", "The ability to notice and understand things.", Category.Mental),
  reflexes: Abilities.description("reflexes", "Reflexes", "The ability to react quickly and accurately.", Category.Physical),
  strength: Abilities.description("strength", "Strength", "The ability to exert force.", Category.Physical),
  logic: Abilities.description("logic", "Logic", "The ability to reason and solve problems.", Category.Mental),
  mnemonic: Abilities.description("mnemonic", "Mnemonic", "The ability to learn and to remember things.", Category.Mental),
  willpower: Abilities.description("willpower", "Willpower", "The ability to endure mental challenges.", Category.Mental),
}
