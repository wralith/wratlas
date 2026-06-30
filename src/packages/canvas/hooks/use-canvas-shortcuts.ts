import { useSignalEffect } from "@preact/signals"
import { Point } from "fabric"
import { is_editable_target, is_mod_key, sync_viewport_signals } from "../internal/controls"
import { canvas_controller, fabric_canvas } from "../state"

const is_shift_mod_combo = (e: KeyboardEvent, key: string) => is_mod_key(e) && e.shiftKey && e.key.toLowerCase() === key

const is_mod_combo = (e: KeyboardEvent, key: string) => is_mod_key(e) && e.key.toLowerCase() === key

export const useCanvasShortcuts = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (is_editable_target(e.target)) return

      const hasTextSelection = window.getSelection()?.toString().trim().length

      if (is_mod_combo(e, "z") && !e.shiftKey) {
        e.preventDefault()
        void canvas_controller.undo()
        return
      }

      if (is_shift_mod_combo(e, "z") || is_mod_combo(e, "y")) {
        e.preventDefault()
        void canvas_controller.redo()
        return
      }

      if (is_mod_combo(e, "0")) {
        e.preventDefault()
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        canvas.requestRenderAll()
        sync_viewport_signals(canvas)
        return
      }

      if (is_mod_combo(e, "=") || is_mod_combo(e, "+")) {
        e.preventDefault()
        const zoom = Math.min(canvas.getZoom() * 1.1, 20)
        const center = canvas.getCenterPoint()
        canvas.zoomToPoint(new Point(center.x, center.y), zoom)
        canvas.requestRenderAll()
        sync_viewport_signals(canvas)
        return
      }

      if (is_mod_combo(e, "-")) {
        e.preventDefault()
        const zoom = Math.max(canvas.getZoom() / 1.1, 0.1)
        const center = canvas.getCenterPoint()
        canvas.zoomToPoint(new Point(center.x, center.y), zoom)
        canvas.requestRenderAll()
        sync_viewport_signals(canvas)
        return
      }

      if (is_mod_combo(e, "c")) {
        if (hasTextSelection) return
        if (!canvas.getActiveObject()) return
        e.preventDefault()
        void canvas_controller.copy_image_to_clipboard()
        return
      }

      if (e.key === "Escape") {
        if (!canvas.getActiveObject()) return
        e.preventDefault()
        canvas.discardActiveObject()
        canvas.requestRenderAll()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
}
