import { Roll } from "../rpg/die";

export interface DieRoll {
  description: string;
  roll: Roll;
  baseScore: number;
}