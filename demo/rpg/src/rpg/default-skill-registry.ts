import { Category } from "./category";
import { Dependency } from "./dependency";
import { SkillRegistry } from "./skills";

export const defaultSkillRegistry: SkillRegistry = {
  acrobatics: {
    id: "acrobatics",
    name: "Acrobatics",
    description: "The ability to move quickly and gracefully.",
    dependsOn: Dependency.average(
      Dependency.ability('agility'),
      Dependency.ability('reflexes'),
    ),
    category: Category.Physical
  },
  athletics: {
    id: "athletics",
    name: "Athletics",
    description: "Athletics is a term used to describe a collection of physical activities that involve running, jumping, throwing, and walking. The primary objective is to test and showcase an individual's speed, strength, and endurance",
    dependsOn: Dependency.average(
      Dependency.ability('health'),
      Dependency.ability('strength'),
    ),
    category: Category.Physical
  },
  brawling: {
    id: "brawling",
    name: "Brawling",
    description: "The ability to fight with bare hands.",
    dependsOn: Dependency.average(
      Dependency.ability('combat'),
      Dependency.ability('strength'),
    ),
    category: Category.Physical
  },
  dodge: {
    id: "dodge",
    name: "Dodge",
    description: "The ability to avoid attacks.",
    dependsOn:
    Dependency.sum(
      Dependency.average(
        Dependency.ability('agility'),
        Dependency.ability('reflexes'),
      ),
      Dependency.fixed(-2)
    ),
    category: Category.Physical
  },
  closeCombat: {
    id: "closeCombat",
    name: "Close Combat",
    description: "The ability to fight with melee weapons.",
    dependsOn: Dependency.average(
      Dependency.ability('combat'),
      Dependency.ability('reflexes'),
    ),
    category: Category.Physical
  },
  throwing: {
    id: "throwing",
    name: "Throwing",
    description: "The ability to throw objects.",
    dependsOn: Dependency.average(
      Dependency.ability('combat'),
      Dependency.ability('agility'),
    ),
    category: Category.Physical
  },
};
