import { DieType, roll } from "../rpg/die";

const repeat = 1000000;

export function sortKeys(a: { bonus: string }, b: { bonus: string }) {
  const na = a.bonus === '-' ? 0 : Number(a.bonus)
  const nb = b.bonus === '-' ? 0 : Number(b.bonus)
  return na - nb;
}

export function caculateAtLeastAndAtMost(result: { chance: number, bonus: string, atLeast: number, atMost: number }[]) {
  let atLeast = 1;
  let atMost = 0;
  result.forEach(r => {
    r.atLeast = atLeast;
    atLeast -= r.chance;
    atMost += r.chance;
    r.atMost = atMost;
  });
}

export function rollStatistics(repeats: number, die: DieType) {
  const results: Record<string, number> = {}
  for(let i = 0; i < repeats; i++) {
    const r = roll(die);
    const b = r.bonusToString();
    results[b] = (results[b] ?? 0) + 1;
  }

  const result = Object
    .keys(results)
    .map(k => ({ chance: results[k] / repeats, bonus: k}))
    .map(r => ({
      ...r,
      atLeast: 0.0,
      atMost: 0.0,
    }));

  result.sort(sortKeys);
  caculateAtLeastAndAtMost(result);

  return result.filter(r => r.chance > 0.005)
}

// console.log("Die #1");
// console.table(rollStatistics(repeat, DieType.Die1));
// console.log("Die #2");
// console.table(rollStatistics(repeat, DieType.Die2));
// console.log("Die #3");
// console.table(rollStatistics(repeat, DieType.Die3));
// console.log("Die #4");
// console.table(rollStatistics(repeat, DieType.Die4));