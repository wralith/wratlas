import { useEffect } from "preact/hooks"
import { type DriveStep, hasSeenTour, startTour } from "@/lib/tour"
import { active_canvas, active_tool, canvas_controller, canvas_ready } from "./state"

export const STEPS: DriveStep[] = [
  {
    popover: {
      title: "Welcome to Wratlas",
      description: "A canvas editor for creative work. Let's walk through the basics.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="canvas-combobox"]',
    popover: {
      title: "Canvas Switcher",
      description: "Create, rename, and switch between multiple canvases. Each canvas has its own undo history.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="canvas-tools"]',
    popover: {
      title: "Tools",
      description: "Select to move and transform. Rectangle to draw shapes. Text to type anywhere on the canvas.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="canvas-area"]',
    popover: {
      title: "The Canvas",
      description: "This is your workspace. Draw shapes, place text, or drag-and-drop images from your computer.",
      side: "top",
      align: "center",
    },
  },
  {
    element: '[data-tour="canvas-sidebar"]',
    popover: {
      title: "Properties Panel",
      description: "When you select an object or activate a tool, options and properties appear here. Try it out!",
      side: "left",
    },
    onHighlightStarted: () => {
      active_tool.value = "text"
    },
    onDeselected: () => {
      active_tool.value = "select"
    },
  },
  {
    element: '[data-tour="canvas-navigation"]',
    popover: {
      title: "Navigation",
      description: "Use the minimap to pan around and the zoom slider to get closer or farther from your work.",
      side: "top",
      align: "end",
    },
  },
  {
    element: '[data-tour="canvas-file-ops"]',
    popover: {
      title: "Import & Export",
      description: "Import or export canvases as ZIP files, or download your work as a PNG image.",
      side: "bottom",
    },
  },
  {
    popover: {
      title: "Need Help?",
      description:
        "Click the <strong>?</strong> button in the header anytime to replay this tour. Press <strong>Cmd+K</strong> to see all keyboard shortcuts.",
      side: "bottom",
      align: "center",
    },
  },
]

export const CanvasTour = () => {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!hasSeenTour("canvas_intro")) {
        startTour("canvas_intro", STEPS)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!canvas_ready.value) return
    if (hasSeenTour("canvas_intro")) return
    if (active_canvas.value.objects.length > 0) return

    const check_and_seed = async () => {
      await new Promise(r => setTimeout(r, 500))
      if (canvas_controller.is_hydrating.value) {
        const unsub = canvas_controller.is_hydrating.subscribe(v => {
          if (!v) {
            unsub()
            void seed_demo_image()
          }
        })
        return
      }
      if (active_canvas.value.objects.length === 0) {
        await seed_demo_image()
      }
    }

    const seed_demo_image = async () => {
      try {
        const res = await fetch("/domuz.jpeg")
        if (!res.ok) return
        const blob = await res.blob()
        const file = new File([blob], "domuz.jpeg", { type: blob.type || "image/jpeg" })
        await canvas_controller.add_image([file])
      } catch {}
    }

    void check_and_seed()
  }, [canvas_ready.value])

  return null
}
