export const DIE_VALUES = [
  {
    bonus:   [-3, -2, -2, -1, -1,  0,  0,  1,  1,  2,  2,  3],
    edge: [-3, -2, -1,  0,  0,  0,  0,  0,  0,  1,  2,  3]
  }, {
    bonus:   [-2, -2, -1, -1,  0,  0,  1,  1,  2,  2,  3,  3],
    edge: [-2, -1,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3]
  }, {
    bonus:   [-2, -1, -1,  0,  0,  1,  1,  2,  2,  3,  3,  4],
    edge: [-1, -1,  0,  0,  0,  0,  0,  0,  1,  2,  2,  3]
  }, {
    bonus:   [-1, -1,  0,  0,  1,  1,  2,  2,  3,  3,  4,  4],
    edge: [-1,  0,  0,  0,  0,  0,  0,  1,  2,  2,  3,  4]
  }
]

export enum DieType {
  Die1 = 0,
  Die2 = 1,
  Die3 = 2,
  Die4 = 3
}

export function dieFromAbilityScore(score: number) {
  if (score <= 4) {
    return DieType.Die1
  } else if (score <= 6) {
    return DieType.Die2
  } else if (score <= 8) {
    return DieType.Die3
  } else {
    return DieType.Die4
  }
}

export function dieFromSkillScore(score: number) {
  if (score <= 2) {
    return DieType.Die1
  } else if (score <= 4) {
    return DieType.Die2
  } else if (score <= 6) {
    return DieType.Die3
  } else {
    return DieType.Die4
  }
}

export function rollOnce(dieType: DieType) {
  const value = Math.floor(Math.random() * 12)
  const { bonus, edge } = DIE_VALUES[dieType]
  return [value, bonus[value], edge[value]]
}

export function roll(dieType: DieType) {
  let bonus = 0;
  let edge = 0;
  let value = 0;
  let rolls = -1;
  do {
    rolls++
    const [v, b, s] = rollOnce(dieType);
    value = v;
    bonus += b;
    edge += s;
  } while (value <= 0 || value >= 12);
  return new Roll(bonus, edge, rolls)
}

export class Roll {
  constructor(
    readonly bonus: number,
    readonly edge: number,
    readonly rolls: number
  ) {}

  readonly bonusToString = () => {
    return this.bonus > 0 ? `+${this.bonus}` : this.bonus === 0 ? "-" : this.bonus
  }

  readonly edgeToString = () => {
    return this.edge > 0 ? "🎯 ".repeat(this.edge).trim() : this.edge === 0 ? "" : "🚫 ".repeat(-this.edge).trim()
  }

  readonly rollsToString = () => {
    return this.rolls > 0 ? `[${this.rolls}]` : ""
  }

  readonly toString = () => {
    const bonus = this.bonusToString()
    const edge = this.edgeToString()
    const rolls = this.rollsToString()
    return [bonus, edge, rolls].filter(x => x !== "").join(" ")
  }
}
