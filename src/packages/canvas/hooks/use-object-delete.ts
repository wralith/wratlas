import { useSignalEffect } from "@preact/signals"
import { remove_active_object } from "../actions"
import { fabric_canvas } from "../state"

export const useObjectDelete = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return
      if (!canvas.getActiveObject()) return

      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return

      e.preventDefault()
      remove_active_object(canvas)
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
}
