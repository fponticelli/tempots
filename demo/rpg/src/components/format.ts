export const formatWeight = (n: number) => {
  if (n <= 0.0001) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 5 })
  } else if (n <= 0.001) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
  } else if (n <= 0.01) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 3 })
  } else if (n <= 0.1) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  } else if (n <= 1) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 1 })
  } else {
    return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
}