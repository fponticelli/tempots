export function ceilDiv(x: bigint, y: bigint): bigint {
  if (y < 0n) {
    x = -x
    y = -y
  }
  return x <= 0n ? x / y : (x - 1n) / y + 1n
}

export function floorDiv(x: bigint, y: bigint): bigint {
  if (y < 0n) {
    x = -x
    y = -y
  }
  return x >= 0n ? x / y : (x + 1n) / y - 1n
}

export function compare(x: bigint, y: bigint): number {
  return x < y ? -1 : x > y ? 1 : 0
}

export function abs(x: bigint): bigint {
  return x < 0n ? -x : x
}

export function min(x: bigint, y: bigint): bigint {
  return x < y ? x : y
}

export function max(x: bigint, y: bigint): bigint {
  return x > y ? x : y
}

export function pow(x: bigint, y: bigint): bigint {
  if (y < 0n) throw new Error("negative exponent")
  let result = 1n
  while (y > 0n) {
    if (y & 1n) result *= x
    y >>= 1n
    x *= x
  }
  return result
}

export function gcd(x: bigint, y: bigint): bigint {
  x = abs(x)
  y = abs(y)
  while (y > 0n) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function lcm(x: bigint, y: bigint): bigint {
  return abs(x * y) / gcd(x, y)
}

export function isPrime(x: bigint): boolean {
  if (x < 2n) return false
  if (x === 2n || x === 3n) return true
  if (x % 2n === 0n || x % 3n === 0n) return false
  let i = 5n
  while (i * i <= x) {
    if (x % i === 0n || x % (i + 2n) === 0n) return false
    i += 6n
  }
  return true
}

export function nextPrime(x: bigint): bigint {
  if (x < 2n) return 2n
  if (x === 2n) return 3n
  if (x % 2n === 0n) x++
  else x += 2n
  while (!isPrime(x)) x += 2n
  return x
}

export function prevPrime(x: bigint): bigint {
  if (x <= 2n) throw new Error("no previous prime")
  if (x === 3n) return 2n
  if (x % 2n === 0n) x--
  else x -= 2n
  while (!isPrime(x)) x -= 2n
  return x
}

export function isEven(x: bigint): boolean {
  return x % 2n === 0n
}

export function isOdd(x: bigint): boolean {
  return x % 2n !== 0n
}

export function isZero(x: bigint): boolean {
  return x === 0n
}

export function isOne(x: bigint): boolean {
  return x === 1n
}

export function isNegative(x: bigint): boolean {
  return x < 0n
}

export function isPositive(x: bigint): boolean {
  return x > 0n
}

