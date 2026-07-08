import { useEffect } from "preact/hooks"
import { type DriveStep, hasSeenTour, startTour } from "@/lib/tour"
import { asset_store } from "@/packages/assets/state"

export const STEPS: DriveStep[] = [
  {
    element: '[data-tour="assets-filters"]',
    popover: {
      title: "Search & Filter",
      description: "Search your assets by name or filter by tags to quickly find what you need.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="assets-import"]',
    popover: {
      title: "Import Assets",
      description: "Add images from your computer to the asset library.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="assets-grid"]',
    popover: {
      title: "Asset Grid",
      description:
        "Your images appear here. Click an asset to view its details. Right-click to send it to the canvas, delete, or download.",
      side: "top",
      align: "center",
    },
  },
  {
    popover: {
      title: "Asset Details",
      description: "Click any asset card to open the details panel. Edit the name, add tags, and write notes.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="assets-select-all"]',
    popover: {
      title: "Batch Operations",
      description: "Use Select All to pick every asset, then bulk-delete, add tags, or send them to a canvas.",
      side: "top",
    },
  },
]

const seed_initial_asset = async () => {
  if (asset_store.assets.value.length > 0) return

  try {
    const res = await fetch("/domuz.jpeg")
    if (!res.ok) return
    const blob = await res.blob()
    const file = new File([blob], "domuz.jpeg", { type: blob.type || "image/jpeg" })
    await asset_store.add_asset(file, { name: "Sample Image", tags: ["sample"] })
  } catch {}
}

export const AssetsTour = () => {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!hasSeenTour("assets_intro")) {
        void seed_initial_asset().then(() => {
          startTour("assets_intro", STEPS)
        })
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
