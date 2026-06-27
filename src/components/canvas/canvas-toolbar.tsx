import { Plus, Trash2 } from "lucide-preact"
import { useRef } from "preact/hooks"
import { fabricCanvas } from "@/components/canvas/canvas.store"
import { addImagesFromFiles, removeActiveObject } from "@/components/canvas/canvas-actions"
import { group, label, toolbar, container } from "@/components/canvas/canvas-toolbar.css"
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

    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemove = () => {
    const canvas = fabricCanvas.value
    if (!canvas) return
    removeActiveObject(canvas)
  }

  return (
    <div class={container}>
      <div class={toolbar}>
        <div class={group}>
          <span class={label}>Canvas</span>
        </div>
        <div class={group}>
          <Button size="icon-only" onClick={handleAddClick}>
            <Plus size={14} />
          </Button>
          <Button size="icon-only" onClick={handleRemove}>
            <Trash2 size={14} />
          </Button>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
        </div>
      </div>
    </div>
  )
}
