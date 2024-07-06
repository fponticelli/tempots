import { Formula } from "./formula"
import { Name } from "./name"
import { EONTypeModel } from "./type"
import { EONValue } from "./value"

/*
data a = 1 // type is int
data b = a // = 1 type is int
data c = a + b + 1 // = 3 type is int

a = 2 type is int
// c = 5 type is int

b = 3.5 type is float
// c = 6.5 type is float
*/

export type Listener<T> = (value: T) => void

function getOrSetListener<T>(map: Map<string, Listener<EONValue>[]>, key: string, listener: Listener<EONValue>): void {
  let listeners = map.get(key)
  if (listeners == null) {
    listeners = []
    map.set(key, listeners)
  }
  listeners.push(listener)
}

export class EONProject {
  private models = new Map<string, EONTypeModel>()
  private formulae = new Map<string, Formula>()
  private values = new Map<string, EONValue>()
  private listeners = new Map<string, Listener<EONValue>[]>()

  setModel(model: EONTypeModel): void {
    const fqn = Name.toFullyQualifiedName(model.name)
    this.models.set(fqn, model)
  }

  removeModel(name: Name): void {
    const fqn = Name.toFullyQualifiedName(name)
    this.models.delete(fqn)
  }

  getModel(name: Name): EONTypeModel | undefined {
    return this.models.get(Name.toFullyQualifiedName(name))
  }

  hasModel(name: Name): boolean {
    return this.models.has(Name.toFullyQualifiedName(name))
  }

  resolve(formula: Formula): EONValue {
    switch (formula.kind) {
      case "value":
        return formula.value
      case "ref": {
        const fqn = Name.toFullyQualifiedName(formula.name)
        const value = this.values.get(fqn)
        if (value == null) {
          return EONValue.invalid(`Reference to ${fqn} not found`)
        }
        return value
      }
      case "sum": {
        const left = this.resolve(formula.left)
        const right = this.resolve(formula.right)
        if (EONValue.isInvalid(left)) return left
        if (EONValue.isInvalid(right)) return right
        if (typeof left !== "number" || typeof right !== "number") {
          return EONValue.invalid("Sum of non-numbers")
        }
        return left + right
      }
    }
  }

  setFormula(name: Name, formula: Formula): void {
    const fqn = Name.toFullyQualifiedName(name)
    this.formulae.set(fqn, formula)
    switch (formula.kind) {
      case "value":
        if (this.values.get(fqn) === formula.value) return
        this.values.set(fqn, formula.value)
        this.listeners.get(fqn)?.forEach((listener) => listener(formula.value));
        break
      case "ref": {
        // name (fqn) is B
        // ref is A
        // B value is the same as A value

        const refName = Name.toFullyQualifiedName(formula.name)
        // get referenced value, if same as current value, return
        const value = this.values.get(refName)
        if (value === this.values.get(fqn)) return

        // if not, set value to referenced value
        getOrSetListener(this.listeners, refName, (value) => {
          this.values.set(fqn, value)
          this.listeners.get(fqn)?.forEach((listener) => listener(value));
        });
        break
      }
      case "sum":
        // resolve left and right
        // const left = this.values.get(Name.toFullyQualifiedName(formula.left))
        // if left and right are floats, add them
        // if left and right are strings, concatenate them
        // if left and right are arrays, concatenate them
        // if left and right are objects, merge them
        // if left and right are ints, add them
        // else error

        this.values.set(fqn, { type: "formulaerror", message: "Not implemented yet" })
        break
    }
  }

  removeFormula(name: Name): void {
    const fqn = Name.toFullyQualifiedName(name)
    this.formulae.delete(fqn)
  }

  getFormula(name: Name): Formula | undefined {
    return this.formulae.get(Name.toFullyQualifiedName(name))
  }

  hasFormula(name: Name): boolean {
    return this.formulae.has(Name.toFullyQualifiedName(name))
  }
}

