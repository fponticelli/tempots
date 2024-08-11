import { Merge } from '@tempots/std'

/**
 * Get the extension of a pathname. If the pathname has no extension, return undefined.
 * The path should not have query parameters or fragments.
 *
 * @param pathname - The pathname to get the extension from.
 * @returns The extension of the pathname or undefined if there is no extension.
 * @internal
 */
export const _getExtension = (pathname: string): string | undefined => {
  const lastPart = pathname.split('/').pop()
  if (lastPart == null) return undefined
  if (lastPart.startsWith('.')) return undefined
  const parts = lastPart.split('.') || []
  return parts.length > 1 ? '.' + parts.pop() : undefined
}

/**
 * @internal
 */
export const _checkExtensionCondition = (
  allowedExtensions: string[],
  pathname: string
): boolean => {
  const extension = _getExtension(pathname)
  if (extension != null) {
    if (
      allowedExtensions.length === 0 ||
      !allowedExtensions.some(ext => extension == ext)
    ) {
      return true
    }
  }
  return false
}

const shouldNotApplyCallback = (
  e: MouseEvent,
  ignoreUrlWithExtension: boolean,
  allowedExtensions: string[],
  ignoreExternalUrl: boolean
): boolean => {
  let target = e.target as HTMLElement | null
  while (target != null && !(target instanceof HTMLAnchorElement)) {
    target = target.parentElement
  }
  if (target == null) {
    return true
  }

  const anchor = target

  // Check for modifier keys and non-left-button, which indicate the user wants to control
  // navigation
  if (e.button !== 0 || e.ctrlKey || e.metaKey) {
    return true
  }

  // If there is a target and it is not `_self` then we take this
  // as a signal that it doesn't want to be intercepted.
  if (anchor.target !== '_self' && anchor.target !== '') {
    return true
  }

  if (anchor.getAttribute('download') != null) {
    return true // let the download happen
  }

  const { pathname, search, hash } = anchor
  if (ignoreExternalUrl) {
    const relativeUrl = pathname + search + hash

    // don't navigate if external link
    const href = anchor.getAttribute('href')
    if (!href?.startsWith('#') && href !== relativeUrl) {
      return true
    }
  }
  if (!ignoreUrlWithExtension) {
    return _checkExtensionCondition(allowedExtensions, pathname)
  }

  return false
}

/**
 * Options for handling anchor click events.
 * @public
 */
export type HandleAnchorClickOptions = Merge<
  | {
      /**
       * A boolean indicating whether to check the anchor's href for a file extension.
       * If `true`, the click handler will be applied only if the anchor's href doesn't have a file extension or if the anchor's href has a file extension that is in the `allowedExtensions` array.
       */
      ignoreUrlWithExtension?: true
      /**
       * An array of allowed extensions to check for. If the anchor's href has a file extension that is not in the `allowedExtensions` array, the click handler will not be applied.
       * If the `allowedExtensions` array is empty, the click handler will only be applied if the anchor's href doesn't have a file extension.
       */
      allowedExtensions?: string[]
    }
  | {
      /**
       * A boolean indicating whether to check the anchor's href for a file extension.
       * If `true`, the click handler will be applied only if the anchor's href doesn't have a file extension or if the anchor's href has a file extension that is in the `allowedExtensions` array.
       */
      ignoreUrlWithExtension: false
    },
  {
    /**
     * A boolean indicating whether to check if the anchor's href points to an external URL.
     */
    ignoreExternalUrl?: boolean
  }
>

/**
 * Handles anchor click events, optionally checking for external URLs and file extensions.
 *
 * @param callback - A function that is called when the anchor click should be handled. The function should return a boolean indicating whether the default anchor click behavior should be prevented.
 * @param options - An optional object of type `HandleAnchorClickOptions`.
 * @returns A function that handles the anchor click event, calling the provided callback and preventing the default behavior if the callback returns `true`.
 * @public
 */
export const handleAnchorClick = (
  callback: () => boolean,
  options: HandleAnchorClickOptions = {
    ignoreUrlWithExtension: true,
    allowedExtensions: [],
    ignoreExternalUrl: true,
  }
) => {
  const normalizedExtensions =
    options.ignoreUrlWithExtension === true &&
    Array.isArray(options.allowedExtensions)
      ? options.allowedExtensions.map(ext =>
          ext.startsWith('.') ? ext : '.' + ext
        )
      : []
  return (e: MouseEvent) => {
    if (
      shouldNotApplyCallback(
        e,
        options.ignoreUrlWithExtension ?? true,
        normalizedExtensions,
        options.ignoreExternalUrl ?? true
      )
    ) {
      return
    }
    if (callback()) e.preventDefault()
  }
}
