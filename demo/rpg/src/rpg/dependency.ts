import { AbilityRegistry, Abilities } from "./abilities";
import { SkillRegistry, Skills } from "./skills";
import { joinWithConjunction } from "@tempots/std/arrays";

export interface AbilityDependency {
  readonly type: "AbilityDependency";
  readonly ability: string;
}

export interface SkillDependency {
  readonly type: "SkillDependency";
  readonly skill: string;
}

export interface AverageDependency {
  readonly type: "AverageDependency";
  readonly dependencies: Dependency[];
}

export interface SumDependency {
  readonly type: "SumDependency";
  readonly dependencies: Dependency[];
}

export interface MaxDependency {
  readonly type: "MaxDependency";
  readonly dependencies: Dependency[];
}

export interface FixedValue {
  readonly type: "FixedValue";
  readonly value: number;
}

export type Dependency = FixedValue | AbilityDependency | SkillDependency | AverageDependency | SumDependency | MaxDependency;

export const Dependency = {
  fixed: (value: number): FixedValue => ({ type: "FixedValue", value }),
  ability: (ability: string): AbilityDependency => ({ type: "AbilityDependency", ability }),
  skill: (skill: string): SkillDependency => ({ type: "SkillDependency", skill }),
  average: (...dependencies: Dependency[]): AverageDependency => ({ type: "AverageDependency", dependencies }),
  sum: (...dependencies: Dependency[]): SumDependency => ({ type: "SumDependency", dependencies }),
  max: (...dependencies: Dependency[]): MaxDependency => ({ type: "MaxDependency", dependencies }),
  calculate: (abilities: Abilities, skills: Skills, dependency: Dependency): number => {
    switch (dependency.type) {
      case "FixedValue":
        return dependency.value;
      case "AbilityDependency":
        return Abilities.get(abilities, dependency.ability);
      case "SkillDependency":
        return Skills.get(skills, dependency.skill) ?? 0;
      case "AverageDependency":
        return Math.floor(dependency.dependencies.reduce((sum, d) => sum + Dependency.calculate(abilities, skills, d), 0) / dependency.dependencies.length);
      case "SumDependency":
        return dependency.dependencies.reduce((sum, d) => sum + Dependency.calculate(abilities, skills, d), 0);
      case "MaxDependency":
        return Math.max(...dependency.dependencies.map(d => Dependency.calculate(abilities, skills, d)));
    }
  },
  display: (dependency: Dependency, skillRegistry: SkillRegistry, abilityRegistry: AbilityRegistry, level = 0): string => {
    switch (dependency.type) {
      case "FixedValue":
        return dependency.value.toString();
      case "AbilityDependency":
        return abilityRegistry[dependency.ability].name;
      case "SkillDependency":
        return skillRegistry[dependency.skill].name;
      case "AverageDependency": {
        const phrase = `Average of ${joinWithConjunction(dependency.dependencies.map(d => Dependency.display(d, skillRegistry, abilityRegistry, level + 1)))}`
        if (level > 0) {
          return `(${phrase})`;
        }
        return phrase;
      }
      case "SumDependency": {
        const buff = [Dependency.display(dependency.dependencies[0], skillRegistry, abilityRegistry, level + 1)];
        for (let i = 1; i < dependency.dependencies.length; i++) {
          const dep = dependency.dependencies[i];
          if (dep.type === "FixedValue" && dep.value < 0) {
            buff.push(" - " + Dependency.display(dep, skillRegistry, abilityRegistry, level + 1).substring(1));
            continue;
          }

          buff.push(" + " + Dependency.display(dep, skillRegistry, abilityRegistry, level + 1));
        }
        return buff.join("");
      }
      case "MaxDependency": {
        const phrase = `Max of ${joinWithConjunction(dependency.dependencies.map(d => Dependency.display(d, skillRegistry, abilityRegistry, level + 1)), " or ")}`
        if (level > 0) {
          return `(${phrase})`;
        }
        return phrase;
      }
    }
  }
}
