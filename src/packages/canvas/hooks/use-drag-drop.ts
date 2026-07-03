import { useSignalEffect } from "@preact/signals"
import { is_editable_target } from "../internal/controls"
import { canvas_controller, fabric_canvas } from "../state"

const MAX_IMAGE_SIZE = 50 * 1024 * 1024

const filterOversized = (files: File[]): File[] =>
  files.filter(f => {
    if (f.size > MAX_IMAGE_SIZE) {
      console.warn(`Skipped oversized image: ${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB > 50MB)`)
      return false
    }
    return true
  })

export const useDragDrop = () => {
  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const wrapperEl = canvas.wrapperEl

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy"
      }
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer?.files
      if (!files) return

      const images = filterOversized(Array.from(files).filter(f => f.type.startsWith("image/")))
      if (!images.length) return

      await canvas_controller.add_image(images)
    }

    const handlePaste = async (e: ClipboardEvent) => {
      if (is_editable_target(e.target)) return
      e.preventDefault()
      const items = e.clipboardData?.items
      if (!items) return

      const rawFiles: File[] = []
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) rawFiles.push(file)
        }
      }
      const files = filterOversized(rawFiles)
      if (!files.length) return

      await canvas_controller.add_image(files)
    }

    wrapperEl.addEventListener("dragover", handleDragOver)
    wrapperEl.addEventListener("drop", handleDrop)
    document.addEventListener("paste", handlePaste)

    return () => {
      wrapperEl.removeEventListener("dragover", handleDragOver)
      wrapperEl.removeEventListener("drop", handleDrop)
      document.removeEventListener("paste", handlePaste)
    }
  })
}
