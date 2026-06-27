import { Plus, Trash2 } from "lucide-preact"
import { useRef } from "preact/hooks"
import { addImagesFromFiles, removeActiveObject } from "@/components/canvas/canvas-actions"
import { fabricCanvas } from "@/components/canvas/canvas.store"
import { group, label, toolbar } from "@/components/canvas/canvas-toolbar.css"
import { Button } from "@/ui/atoms/button/button"

export const CanvasToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return

    const canvas = fabricCanvas.value
    if (!canvas) return

    await addImagesFromFiles(canvas, files, {
      getPosition: () => canvas.getVpCenter(),
      scaleToWidth: 400,
    })

    ;(e.target as HTMLInputElement).value = ""
  }

  const handleRemove = () => {
    const canvas = fabricCanvas.value
    if (!canvas) return
    removeActiveObject(canvas)
  }

  return (
    <div class={toolbar}>
      <div class={group}>
        <span class={label}>Canvas</span>
      </div>
      <div class={group}>
        <Button color="secondary" size="small" left={<Plus size={14} />} onClick={handleAddClick}>
          Add Image
        </Button>
        <Button color="secondary" size="small" left={<Trash2 size={14} />} onClick={handleRemove}>
          Remove
        </Button>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
      </div>
    </div>
  )
}
