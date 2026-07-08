import { useEffect } from "preact/hooks"
import { type DriveStep, hasSeenTour, startTour } from "@/lib/tour"
import { color_store } from "@/packages/colors/state"

export const STEPS: DriveStep[] = [
  {
    element: '[data-tour="colors-filters"]',
    popover: {
      title: "Filter Palettes",
      description: "Search your saved palettes by name to find what you need.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="colors-grid"]',
    popover: {
      title: "Color Palettes",
      description: "Click a palette to view its details. Right-click to copy colors or delete the palette.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="colors-card"]',
    popover: {
      title: "Palette Details",
      description:
        "Click a palette card to open the detail view. Explore harmonies with the color wheel and rename your palette.",
      side: "right",
    },
  },
  {
    popover: {
      title: "Generate Palettes",
      description:
        "Right-click an image on the canvas and choose <strong>Generate palette</strong> to extract a palette from its colors.",
      side: "bottom",
      align: "center",
    },
  },
]

const seed_initial_palette = () => {
  if (color_store.palettes.value.length > 0) return

  color_store.add_palette({
    name: "Sample Palette",
    colors: ["#c084fc", "#60a5fa", "#34d399", "#fbbf24", "#f472b6"],
    harmony: "none",
  })
}

export const ColorsTour = () => {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!hasSeenTour("colors_intro")) {
        seed_initial_palette()
        startTour("colors_intro", STEPS)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
