import { useSignalEffect } from "@preact/signals"
import { fabricCanvas } from "@/components/canvas/canvas.store"
import { addImagesFromFiles } from "@/components/canvas/canvas-actions"

export const useDragDrop = () => {
  useSignalEffect(() => {
    const canvas = fabricCanvas.value
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

      const zoom = canvas.getZoom()

      await addImagesFromFiles(canvas, files, {
        getPosition: () => canvas.getScenePoint(e),
        originX: "center",
        originY: "center",
        onImageAdded: img => {
          img.scaleToWidth(Math.min(img.width! * (1 / zoom), 600))
        },
      })
    }

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
      if (!files.length) return

      await addImagesFromFiles(canvas, files, {
        getPosition: () => canvas.getVpCenter(),
        scaleToWidth: 400,
      })
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
