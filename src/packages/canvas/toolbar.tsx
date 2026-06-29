import { Download, FileUp, Plus, Trash2 } from "lucide-preact"
import { useRef, useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { remove_active_object } from "./actions"
import { create_canvas } from "./internal/store"
import {
  active_canvas_id,
  active_canvas_name,
  canvas_controller,
  canvas_list,
  canvas_store,
  fabric_canvas,
} from "./state"
import { container, controls, group, input, label, toolbar } from "./toolbar.css"

export const CanvasToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const [draftName, setDraftName] = useState("")

  const currentCanvasId = active_canvas_id.value
  const currentCanvasName = active_canvas_name.value
  const canRename = !!currentCanvasId

  const handleAddClick = () => {
    inputRef.current?.click()
  }

  const handleCreateCanvas = () => {
    void canvas_controller.add_canvas(create_canvas(draftName || "Untitled Canvas"))
  }

  const handleRenameCanvas = () => {
    if (!currentCanvasId) return
    canvas_store.rename_canvas(currentCanvasId, draftName)
    setDraftName("")
  }

  const handleCanvasChange = async (e: Event) => {
    const id = (e.target as HTMLSelectElement).value
    await canvas_controller.switch_canvas(id)
  }

  const handleExport = async () => {}

  const openImport = () => {
    importRef.current?.click()
  }

  const handleImport = async (_e: Event) => {}

  const handleFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return

    const canvas = fabric_canvas.value
    if (!canvas) return

    await canvas_controller.add_image(files)

    if (inputRef.current) inputRef.current.value = ""
  }

  const handleRemove = () => {
    const canvas = fabric_canvas.value
    if (!canvas) return
    remove_active_object(canvas)
  }

  return (
    <div class={container}>
      <div class={toolbar}>
        <div class={group}>
          <span class={label}>Canvas</span>
          <div class={controls}>
            <select class={input} value={active_canvas_id.value} onChange={handleCanvasChange}>
              {canvas_list.value.map(canvas => (
                <option key={canvas.id} value={canvas.id}>
                  {canvas.name}
                </option>
              ))}
            </select>
            <input
              class={input}
              type="text"
              placeholder={currentCanvasName || "Canvas name"}
              value={draftName}
              onInput={e => setDraftName((e.target as HTMLInputElement).value)}
            />
            <Button size="small" onClick={handleRenameCanvas} disabled={!canRename || !draftName.trim()}>
              Rename
            </Button>
            <Button size="small" onClick={handleCreateCanvas} left={<Plus size={12} />}>
              New
            </Button>
          </div>
        </div>
        <div class={group}>
          <Button size="icon-only" onClick={openImport}>
            <FileUp size={14} />
          </Button>
          <Button size="icon-only" onClick={handleExport}>
            <Download size={14} />
          </Button>
          <Button size="icon-only" onClick={handleAddClick}>
            <Plus size={14} />
          </Button>
          <Button size="icon-only" onClick={handleRemove}>
            <Trash2 size={14} />
          </Button>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json,application/zip,.zip"
            onChange={handleImport}
            hidden
          />
        </div>
      </div>
    </div>
  )
}
