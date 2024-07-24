function shouldNotApplyCallback(
  e: MouseEvent,
  checkExtension: boolean | string[],
  checkExternalUrl: boolean
): boolean {
  let target = e.target as HTMLElement | null
  while (target != null && !(target instanceof HTMLAnchorElement)) {
    target = target.parentElement
  }
  if (target == null) {
    // console.log('no target element')
    return true
  }

  const anchor = target

  // Check for modifier keys and non-left-button, which indicate the user wants to control
  // navigation
  if (e.button !== 0 || e.ctrlKey || e.metaKey) {
    // console.log('modifier keys or non-left-button')
    return true
  }

  // If there is a target and it is not `_self` then we take this
  // as a signal that it doesn't want to be intercepted.
  if (anchor.target !== '_self' && anchor.target !== '') {
    // console.log('target is not _self')
    return true
  }

  if (anchor.getAttribute('download') != null) {
    // console.log('download attribute')
    return true // let the download happen
  }

  if (checkExternalUrl) {
    const { pathname, search, hash } = anchor
    const relativeUrl = pathname + search + hash

    // don't navigate if external link or has extension
    const href = anchor.getAttribute('href')
    if (!href?.startsWith('#') && href !== relativeUrl) {
      // console.log('external link', relativeUrl, href)
      return true
    }
    if (checkExtension === true && !/\/[^/.]*$/.test(pathname)) {
      // console.log('has extension')
      return true
    }
    if (
      Array.isArray(checkExtension) &&
      !checkExtension.some(ext => pathname.endsWith(ext))
    ) {
      // console.log('extension not in list', pathname)
      return true
    }
  }

  return false
}

/**
 * Options for handling anchor click events.
 * @public
 */
export type HandleAnchorClickOptions = {
  /**
   * A boolean indicating whether to check the anchor's href for a file extension.
   */
  checkExtension?: boolean | string[]
  /**
   * A boolean indicating whether to check if the anchor's href points to an external URL.
   */
  checkExternalUrl?: boolean
}

/**
 * Handles anchor click events, optionally checking for external URLs and file extensions.
 *
 * @param callback - A function that is called when the anchor click should be handled. The function should return a boolean indicating whether the default anchor click behavior should be prevented.
 * @param options - An optional object with the following properties:
 *   - `checkExtension`: A boolean indicating whether to check the anchor's href for a file extension. Defaults to `true`.
 *   - `checkExternalUrl`: A boolean indicating whether to check if the anchor's href points to an external URL. Defaults to `true`.
 * @returns A function that handles the anchor click event, calling the provided callback and preventing the default behavior if the callback returns `true`.
 * @public
 */
export const handleAnchorClick =
  (
    callback: () => boolean,
    {
      checkExtension = ['.html'],
      checkExternalUrl = true,
    }: HandleAnchorClickOptions = {}
  ) =>
  (e: MouseEvent) => {
    if (shouldNotApplyCallback(e, checkExtension, checkExternalUrl)) {
      return
    }
    if (callback()) e.preventDefault()
  }
