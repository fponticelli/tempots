export const withViewTransition = (callback: () => void) => {
  if (document.startViewTransition) {
    document.startViewTransition(callback)
  } else {
    callback()
  }
}
