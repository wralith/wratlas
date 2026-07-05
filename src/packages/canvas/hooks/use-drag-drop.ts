import { useSignalEffect } from "@preact/signals"
import { add_notification } from "@/lib/notifications"
import { decode_object_data } from "../internal/clipboard"
import { is_editable_target } from "../internal/controls"
import { canvas_controller, fabric_canvas, last_mouse_scene_point } from "../state"

const MAX_IMAGE_SIZE = 50 * 1024 * 1024

const filterOversized = (files: File[]): File[] =>
  files.filter(f => {
    if (f.size > MAX_IMAGE_SIZE) {
      console.warn(`Skipped oversized image: ${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB > 50MB)`)
      return false
    }
    return true
  })

const notify_images_added = (count: number) => {
  add_notification({ type: "success", title: `${count} image${count > 1 ? "s" : ""} added to canvas` })
}

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
      notify_images_added(images.length)
    }

    const handlePaste = async (e: ClipboardEvent) => {
      if (is_editable_target(e.target)) return
      e.preventDefault()

      const text = e.clipboardData?.getData("text/plain")
      if (text) {
        const data = decode_object_data(text)
        if (data) {
          const pos = last_mouse_scene_point.value
          const ok = await canvas_controller.paste_object_from_data(data, pos ?? undefined)
          if (ok) {
            add_notification({ type: "success", title: "Object pasted on canvas" })
          }
          return
        }
      }

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
      notify_images_added(files.length)
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
