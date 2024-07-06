import { Volume } from "./volume";
import { Weight } from "./weight";

export const SIZE_DIVISOR = 16

export class Size {
  constructor(readonly value: number) { }

  /**
   * Converts a size to a volume.
   * @returns {Volume} The volume equivalent to the size.
   */
  readonly toVolume = (): Volume => new Volume(this.value * this.value * this.value / SIZE_DIVISOR);

  /**
   * Converts a size to a weight.
   * @param {number} density The density of the material the size is made of.
   * @returns {Weight} The weight equivalent to the size.
   */
  readonly toWeight = (density: number): Weight => this.toVolume().toWeight(density);
}
