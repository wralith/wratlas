import { useSignalEffect } from "@preact/signals"
import type { FabricObject } from "fabric"
import { active_object, fabric_canvas, sidebar_version } from "../state"

export const useSelectionTracker = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const update = () => {
      active_object.value = canvas.getActiveObject() ?? null
    }

    const clear = () => {
      active_object.value = null
    }

    const handleModified = (e: { target?: FabricObject }) => {
      const obj = e.target
      if (!obj) return

      if (obj.type === "i-text" || obj.type === "textbox") {
        const scale = obj.scaleX ?? 1
        if (Math.abs(scale - 1) > 0.001) {
          const text = obj as unknown as { fontSize: number }
          obj.set({
            fontSize: Math.round((text.fontSize ?? 24) * scale),
            scaleX: 1,
            scaleY: 1,
          })
          obj.setCoords()
          canvas.requestRenderAll()
        }
      }

      sidebar_version.value++
    }

    canvas.on("selection:created", update)
    canvas.on("selection:updated", update)
    canvas.on("selection:cleared", clear)
    canvas.on("object:modified", handleModified)

    return () => {
      canvas.off("selection:created", update)
      canvas.off("selection:updated", update)
      canvas.off("selection:cleared", clear)
      canvas.off("object:modified", handleModified)
    }
  })
}
