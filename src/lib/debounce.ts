export const debounce = <TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  wait: number,
): ((...args: TArgs) => void) & { cancel: () => void } => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  return debounced
}
