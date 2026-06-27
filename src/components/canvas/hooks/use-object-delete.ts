import { useSignalEffect } from "@preact/signals"
import { fabricCanvas } from "@/components/canvas/canvas.store"

export const useObjectDelete = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return

      const activeObj = canvas.getActiveObject()
      if (!activeObj) return

      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return

      e.preventDefault()
      canvas.remove(activeObj)
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
}
