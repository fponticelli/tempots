import { Abilities } from "./abilities"
import { Category } from "./category"
import { Dependency } from "./dependency"

export interface SkillDescription {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly dependsOn: Dependency
  readonly category: Category
}

export type SkillRegistry = Record<string, SkillDescription>

export const SkillRegistry = {
  has: (registry: SkillRegistry, id: string): boolean => {
    return registry[id] !== undefined;
  },
  get: (registry: SkillRegistry, id: string): SkillDescription | undefined => {
    return registry[id];
  },
  set: (registry: SkillRegistry, id: string, description: SkillDescription): SkillRegistry => {
    return {...registry, [id]: description};
  }
}

export type Skills = Record<string, number>

export const Skills = {
  getGrouped: (skills: Skills, registry: SkillRegistry): { category: Category, skills: [number, SkillDescription][] }[] => {
    const grouped: { category: Category, skills: [number, SkillDescription][] }[] = []
    for (const [name, value] of Object.entries(skills)) {
      const skill = registry[name]
      if (skill === undefined) {
        continue
      }
      const category = skill.category
      const group = grouped.find(g => g.category === category)
      if (group === undefined) {
        grouped.push({ category, skills: [[value, skill]] })
      } else {
        group.skills.push([value, skill])
      }
    }
    return grouped.filter(g => g.skills.length > 0)
  },
  set: (skills: Skills, id: string, value: number): Skills => {
    return {...skills, [id]: value};
  },
  get: (skills: Skills, id: string): number | undefined => {
    return skills[id];
  },
  has: (skills: Skills, id: string): boolean => {
    return skills[id] !== undefined;
  },
  calculateDependency: (abilities: Abilities, skills: Skills, registry: SkillRegistry, id: string): number => {
    const skill = registry[id]
    if (skill === undefined) {
      return 0
    }
    return Dependency.calculate(abilities, skills, skill.dependsOn)
  }
}
