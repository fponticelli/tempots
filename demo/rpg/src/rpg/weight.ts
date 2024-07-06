import { Volume } from "./volume";

export class Weight {
  constructor(
    public readonly value: number, // The number of the card.
  ) {}

  readonly toKilograms = (): number => this.value;

  readonly toGrams = (): number => this.value * 1000;

  readonly toPounds = (): number => this.value * 2.20462;

  readonly toMetricTons = (): number => this.value / 1000;

  readonly toVolume = (density: number): Volume => new Volume(this.value / density);
}
