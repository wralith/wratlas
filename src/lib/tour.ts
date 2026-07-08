import { signal } from "@preact/signals"
import { type DriveStep, driver } from "driver.js"

const STORAGE_KEY = "wratlas.tours"

export type TourId = "canvas_intro" | "assets_intro" | "colors_intro"

const tours_seen = signal<Record<string, boolean>>(load_tours())

function load_tours(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save_tours(record: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // noop
  }
}

export const hasSeenTour = (tourId: TourId) => tours_seen.value[tourId] === true

export const markTourSeen = (tourId: TourId) => {
  tours_seen.value = { ...tours_seen.value, [tourId]: true }
  save_tours(tours_seen.value)
}

export const resetTour = (tourId: TourId) => {
  const next = { ...tours_seen.value }
  delete next[tourId]
  tours_seen.value = next
  save_tours(next)
}

let active_driver: ReturnType<typeof driver> | null = null
export const active_tour_id = signal<TourId | null>(null)

export const startTour = (tourId: TourId, steps: DriveStep[]) => {
  if (active_driver) {
    active_driver.destroy()
  }

  active_tour_id.value = tourId

  const d = driver({
    steps,
    showProgress: true,
    allowClose: true,
    animate: true,
    overlayColor: "rgba(0, 0, 0, 0.65)",
    smoothScroll: true,
    showButtons: ["next", "previous", "close"],
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Done",
    stageRadius: 0,
    popoverOffset: 8,
    popoverClass: "wratlas-driver",
    onPopoverRender: popover => {
      const bodyStyle = getComputedStyle(document.body)
      const bg = bodyStyle.backgroundColor
      const fg = bodyStyle.color

      Object.assign(popover.wrapper.style, {
        background: bg,
        color: fg,
        borderRadius: "0",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.75rem",
        border: `1px solid ${fg}22`,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
      })

      Object.assign(popover.title.style, {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.875rem",
        color: fg,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      })

      Object.assign(popover.description.style, {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.75rem",
        color: fg,
        opacity: "0.75",
        lineHeight: "1.5",
      })

      popover.arrow.style.display = "none"

      popover.progress.style.fontFamily = "'JetBrains Mono', monospace"
      popover.progress.style.fontSize = "0.625rem"

      ;[popover.previousButton, popover.closeButton].forEach(btn => {
        Object.assign(btn.style, {
          borderRadius: "0",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          background: "transparent",
          color: fg,
          border: `1px solid ${fg}33`,
          padding: "4px 12px",
        })
      })

      Object.assign(popover.nextButton.style, {
        borderRadius: "0",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.75rem",
        background: fg,
        color: bg,
        border: "1px solid transparent",
        padding: "4px 12px",
      })
    },
    onDestroyed: () => {
      markTourSeen(tourId)
      active_driver = null
      active_tour_id.value = null
    },
  })

  active_driver = d
  d.drive()

  return d
}

export const stopActiveTour = () => {
  if (active_driver) {
    active_driver.destroy()
  }
}

export type { DriveStep }
