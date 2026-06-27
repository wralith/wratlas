import { useSignalEffect } from "@preact/signals"
import { FabricImage } from "fabric"
import { fabricCanvas } from "@/components/canvas/canvas.store"

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

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue

        const url = URL.createObjectURL(file)
        try {
          const img = await FabricImage.fromURL(url)
          const scenePoint = canvas.getScenePoint(e)
          img.set({
            left: scenePoint.x,
            top: scenePoint.y,
          })
          img.scaleToWidth(Math.min(img.width! * (1 / zoom), 600))
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.requestRenderAll()
        } finally {
          URL.revokeObjectURL(url)
        }
      }
    }

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (!item.type.startsWith("image/")) continue

        const file = item.getAsFile()
        if (!file) continue

        const url = URL.createObjectURL(file)
        try {
          const img = await FabricImage.fromURL(url)
          const center = canvas.getCenterPoint()
          img.set({
            left: center.x,
            top: center.y,
          })
          img.scaleToWidth(400)
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.requestRenderAll()
        } finally {
          URL.revokeObjectURL(url)
        }
      }
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
