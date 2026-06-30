import { Download, FileUp, Keyboard, Plus, Trash2 } from "lucide-preact"
import { useRef, useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { remove_active_object } from "./actions"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { canvas_controller, fabric_canvas } from "./state"
import { ToolbarCombobox } from "./toolbar-combobox"
import * as styles from "./toolbar.css"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

export const CanvasToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

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
    <div class={styles.container}>
      <div class={styles.toolbar}>
        <Flex align="center" gap="sm">
          <ToolbarCombobox />
          <Tooltip content="Import">
            <Button size="icon-only" onClick={openImport} aria-label="Import canvas">
              <FileUp size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Export">
            <Button size="icon-only" onClick={handleExport} aria-label="Export canvas">
              <Download size={14} />
            </Button>
          </Tooltip>
        </Flex>

        <Flex align="center" gap="sm">
          <Tooltip content="Add Image">
            <Button size="icon-only" onClick={() => inputRef.current?.click()} aria-label="Add image">
              <Plus size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete Object">
            <Button size="icon-only" onClick={handleRemove} aria-label="Delete object">
              <Trash2 size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Shortcuts">
            <Button size="icon-only" onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts">
              <Keyboard size={14} />
            </Button>
          </Tooltip>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json,application/zip,.zip"
            onChange={handleImport}
            hidden
          />
        </Flex>
      </div>

      <CanvasToolbarShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
