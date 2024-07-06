export class Position {
  constructor(
    readonly index: number,
    readonly total: number
  ) {}

  get isFirst() {
    return this.index === 0
  }
  get isLast() {
    return this.index === this.total - 1
  }
  get isEven() {
    return this.index % 2 === 0
  }
  get isOdd() {
    return this.index % 2 === 1
  }
}
