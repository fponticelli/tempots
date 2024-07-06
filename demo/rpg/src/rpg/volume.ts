import { Size, SIZE_DIVISOR } from "./size";
import { Weight } from "./weight";

export class Volume {
  constructor(
    public readonly value: number,
  ) {}

  /**
   * Convert the volume to its equivalent size.
   */
  readonly toSize = (): Size => new Size(Math.pow(this.value * SIZE_DIVISOR, 1/3));

  /**
   * Convert the volume to liters.
   */
  readonly toLiters = (): number => this.value;

  /**
   * Convert the volume to weight using a given density.
   */
  readonly toWeight = (density: number): Weight => new Weight(this.value * density);
}
