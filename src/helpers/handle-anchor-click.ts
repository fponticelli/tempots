function shouldNotApplyCallback (
  e: MouseEvent,
  checkExtension: boolean,
  checkExternalUrl: boolean
): boolean {
  let target = e.target as HTMLElement | null
  while ((target != null) && !(target instanceof HTMLAnchorElement)) {
    target = target.parentElement
  }
  if (target == null) return true

  const anchor = target as HTMLAnchorElement;

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

  if (checkExternalUrl) {
    const { pathname, search, hash } = anchor
    const relativeUrl = pathname + search + hash

    // don't navigate if external link or has extension
    if (
      anchor.getAttribute('href') !== relativeUrl ||
      (checkExtension && !/\/[^/.]*$/.test(pathname))
    ) {
      return true
    }
  }

  return false
}

export const handleAnchorClick =
  (
    callback: () => boolean,
    options: { checkExtension?: boolean, checkExternalUrl?: boolean } = {
      checkExtension: true,
      checkExternalUrl: true
    }
  ) =>
    (e: MouseEvent) => {
      const { checkExtension, checkExternalUrl } = options
      if (
        shouldNotApplyCallback(
          e,
          checkExtension === true,
          checkExternalUrl === true
        )
      ) { return }
      if (callback()) e.preventDefault()
    }
