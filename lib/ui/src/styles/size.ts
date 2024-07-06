export type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export const getSize = <T>(
  size: Size | number | undefined | null,
  defaultSize: Size,
  sizes: Record<Size, T>
): T | number => {
  if (size == null) {
    return sizes[defaultSize]
  } else if (typeof size === 'string' && sizes[size] != null) {
    return sizes[size]
  } else {
    return size as number
  }
}

export const getSizeOrNull = <T>(
  size: Size | number | undefined | null,
  sizes: Record<Size, T>
): T | number | null => {
  if (size == null) {
    return null
  } else if (typeof size === 'string' && sizes[size] != null) {
    return sizes[size]
  } else {
    return size as number
  }
}

export const getRadiusSize = (
  size: Size | 'full' | number | undefined | null,
  defaultSize: Size | 'full',
  sizes: Record<Size, number>
): string | number => {
  if (size === 'full') {
    return '100%'
  } else if (size == null) {
    return defaultSize === 'full' ? '100%' : sizes[defaultSize]
  } else if (typeof size === 'string' && sizes[size] != null) {
    return sizes[size]
  } else {
    return size as number
  }
}

export const getSizeT = <T>(
  size: Size | number | undefined | null,
  defaultSize: Size,
  sizes: Record<Size, T>
): T => {
  if (typeof size === 'string' && sizes[size] != null) {
    return sizes[size]
  } else {
    return sizes[defaultSize]
  }
}
