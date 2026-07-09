import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"

export const MOBILE_MAX = 767
export const TABLET_MAX = 1023
export const DESKTOP_MIN = 1024

const make_query = (query: string) => {
  const mql = window.matchMedia(query)
  const s = signal(mql.matches)
  const handler = (e: MediaQueryListEvent) => {
    s.value = e.matches
  }
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", handler)
  } else {
    mql.addListener(handler)
  }
  return s
}

const create_responsive_signals = () => {
  if (typeof window === "undefined") {
    return {
      is_mobile: signal(false),
      is_tablet: signal(false),
      is_desktop: signal(true),
      is_touch_device: signal(false),
    }
  }

  const mobile = make_query(`(max-width: ${MOBILE_MAX}px)`)
  const tablet = make_query(`(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`)
  const desktop = make_query(`(min-width: ${DESKTOP_MIN}px)`)

  const touch = signal("ontouchstart" in window || navigator.maxTouchPoints > 0)

  return {
    is_mobile: mobile,
    is_tablet: tablet,
    is_desktop: desktop,
    is_touch_device: touch,
  }
}

const signals = create_responsive_signals()

export const is_mobile = signals.is_mobile
export const is_tablet = signals.is_tablet
export const is_desktop = signals.is_desktop
export const is_touch_device = signals.is_touch_device

export const useResponsiveListener = () => {
  useEffect(() => {
    return () => {}
  }, [])
}
