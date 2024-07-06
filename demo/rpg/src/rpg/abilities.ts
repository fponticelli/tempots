import { Category, categorySequence } from "./category";
import { Size } from "./size";
import { Volume } from "./volume";
import { Weight } from "./weight";

export type AbilityRegistry = Record<string, AbilityDescription>

export interface AbilityDescription {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: Category
}

export type Abilities = Record<string, number>

export const Abilities = {
  has: (abilities: Abilities, name: string): boolean => {
    return abilities[name] !== undefined;
  },
  get: (abilities: Abilities, name: string, alt = 0): number => {
    return abilities[name] ?? alt;
  },
  set: (abilities: Abilities, name: string, value: number): Abilities => {
    return {...abilities, [name]: value};
  },
  getSum(abilities: Abilities, ...names: string[]): number {
    return names.reduce((sum, name) => {
      const value = Abilities.get(abilities, name)
      if (value === 0) {
        return 0
      }
      return sum + value
    }, 0);
  },
  getAverage: (abilities: Abilities, ...names: string[]): number => {
    const sum = Abilities.getSum(abilities, ...names)
    if (sum === 0) {
      return 0
    }
    return Math.floor(sum / names.length)
  },
  getSize: (abilities: Abilities): Size =>
    new Size(Abilities.get(abilities, "size")),
  getDensity: (abilities: Abilities): number =>
    Abilities.get(abilities, "density", 0.985),
  getVolume: (abilities: Abilities): Volume =>
    Abilities.getSize(abilities).toVolume(),
  getWeight: (abilities: Abilities): Weight =>
    Abilities.getSize(abilities).toWeight(Abilities.getDensity(abilities)),
  getInitiative: (abilities: Abilities): number =>
    Abilities.getSum(abilities, "reflexes", "agility", "combat"),
  description: (
    id: string,
    name: string,
    description: string,
    category: Category
  ): AbilityDescription => ({ id, name, description, category }),
  getGrouped: (abilities: Abilities, registry: AbilityRegistry): { category: Category, abilities: [number, AbilityDescription][] }[] => {
    const grouped: { category: Category, abilities: [number, AbilityDescription][] }[] = []
    for (const category of categorySequence) {
      grouped.push({ category, abilities: [] })
    }
    for (const [name, value] of Object.entries(abilities)) {
      const description = registry[name]
      if (description == null) {
        continue
      }
      const group = grouped.find(g => g.category === description.category)
      if (group == null) {
        continue
      }
      group.abilities.push([value, description])
    }
    for (const group of grouped) {
      group.abilities.sort((a, b) => a[1].name.localeCompare(b[1].name))
    }

    return grouped.filter(g => g.abilities.length > 0)
  },
}
