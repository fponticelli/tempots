import { Size } from "./size";

export interface Attributes {
  size: number;
  density: number;
}

export const Attributes = {
  setSize: (attributes: Attributes, size: number): Attributes => {
    return {...attributes, size};
  },
  getSize: (attributes: Attributes): Size => {
    return new Size(attributes.size);
  },
  setDensity: (attributes: Attributes, density: number): Attributes => {
    return {...attributes, density};
  },
  getDensity: (attributes: Attributes): number => {
    return attributes.density;
  },
  getWeight: (attributes: Attributes): number => {
    return Attributes.getSize(attributes).toWeight(attributes.density).value;
  },
  getWeightRange: (attributes: Attributes): [number, number] => {
    const offset = ((s) => {
      if (s < 0.01) {
        return 0.001;
      } else if (s < 0.1) {
        return 0.01;
      } else if (s < 1) {
        return 0.1;
      } else {
        return 1;
      }
    })(attributes.size);
    const upper = Attributes.getWeight(Attributes.setSize(attributes, attributes.size + offset));
    const lower = Attributes.getWeight(Attributes.setSize(attributes, attributes.size - offset));
    const middle = Attributes.getWeight(attributes);
    return [(lower + middle) / 2, (upper + middle) / 2];
  }
}
