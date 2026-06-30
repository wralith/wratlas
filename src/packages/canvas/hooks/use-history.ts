import { useSignalEffect } from "@preact/signals"
import { canvas_controller, fabric_canvas } from "../state"

export const useHistory = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const capture = () => {
      canvas_controller.capture_history_snapshot()
    }

    const disposers = [
      canvas.on("object:added", capture),
      canvas.on("object:modified", capture),
      canvas.on("object:removed", capture),
      canvas.on("path:created", capture),
    ]

    return () => {
      disposers.forEach(dispose => {
        dispose()
      })
    }
  })
}
