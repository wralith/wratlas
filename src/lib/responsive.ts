export const MOBILE_MAX = 767
export const TABLET_MAX = 1023
export const DESKTOP_MIN = 1024

export const is_touch_device =
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
