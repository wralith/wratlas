import { useSignalEffect } from "@preact/signals"
import { fabricCanvas } from "@/components/canvas/canvas.store"
import { addImagesFromFiles } from "@/components/canvas/canvas-actions"

const MAX_IMAGE_SIZE = 50 * 1024 * 1024 // 50MB

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

      const imageFiles = filterOversized(Array.from(files).filter(f => f.type.startsWith("image/")))
      if (!imageFiles.length) return

      const zoom = canvas.getZoom()

      await addImagesFromFiles(canvas, imageFiles, {
        getPosition: () => canvas.getScenePoint(e),
        originX: "center",
        originY: "center",
        onImageAdded: img => {
          if (img.width) img.scaleToWidth(Math.min(img.width * (1 / zoom), 600))
        },
      })
    }

    const handlePaste = async (e: ClipboardEvent) => {
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
