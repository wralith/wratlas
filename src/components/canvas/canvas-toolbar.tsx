import { Download, FileUp, Plus, Trash2 } from "lucide-preact"
import { useRef, useState } from "preact/hooks"
import {
  activeCanvas,
  activeCanvasId,
  addImagesToActiveCanvas,
  canvases,
  createCanvasDoc,
  fabricCanvas,
  renameCanvasDoc,
  setActiveCanvasDoc,
} from "@/components/canvas/canvas.store"
import { removeActiveObject } from "@/components/canvas/canvas-actions"
import { container, controls, group, input, label, toolbar } from "@/components/canvas/canvas-toolbar.css"
import type { CanvasSnapshot } from "@/lib/canvas-doc/manager"
import { Button } from "@/ui/atoms/button/button"

export const CanvasToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const [draftName, setDraftName] = useState("")

  const currentCanvas = activeCanvas.value
  const canRename = !!currentCanvas

  const handleAddClick = () => {
    inputRef.current?.click()
  }

  const handleCreateCanvas = () => {
    createCanvasDoc(draftName || "Untitled Canvas")
  }

  const handleRenameCanvas = () => {
    if (!currentCanvas) return
    renameCanvasDoc(currentCanvas.id, draftName)
    setDraftName("")
  }

  const handleCanvasChange = async (e: Event) => {
    const id = (e.target as HTMLSelectElement).value
    await setActiveCanvasDoc(id)
  }

  const handleExport = async () => {}

  const openImport = () => {
    importRef.current?.click()
  }

  const handleImport = async (_e: Event) => {}

  const handleFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return

    const canvas = fabricCanvas.value
    if (!canvas) return

    await addImagesToActiveCanvas(files)

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
          <div class={controls}>
            <select class={input} value={activeCanvasId.value} onChange={handleCanvasChange}>
              {canvases?.value.map((canvas: CanvasSnapshot) => (
                <option key={canvas.id} value={canvas.id}>
                  {canvas.name}
                </option>
              ))}
            </select>
            <input
              class={input}
              type="text"
              placeholder={currentCanvas?.name ?? "Canvas name"}
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
