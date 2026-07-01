import { Download, FileUp, Keyboard, MousePointer2, RectangleHorizontal } from "lucide-preact"
import { useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { active_tool, rectangle_color } from "./state"
import * as styles from "./toolbar.css"
import { ToolbarCombobox } from "./toolbar-combobox"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

const toggle_rectangle_tool = () => {
  active_tool.value = active_tool.value === "draw" ? "select" : "draw"
}

const update_rectangle_color = (event: Event) => {
  rectangle_color.value = (event.target as HTMLInputElement).value
}

export const CanvasToolbar = () => {
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const isDrawing = active_tool.value === "draw"

  return (
    <div class={styles.container}>
      <div class={styles.toolbar}>
        <div class={styles.leftSection}>
          <ToolbarCombobox />
          <div class={styles.toolGroup}>
            <Tooltip content="Select">
              <Button
                size="icon-only"
                variant={isDrawing ? "default" : "light"}
                color={isDrawing ? "neutral" : "primary"}
                onClick={() => {
                  active_tool.value = "select"
                }}
                aria-label="Select tool"
              >
                <MousePointer2 size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Draw rectangle">
              <Button
                size="icon-only"
                variant={isDrawing ? "light" : "default"}
                color={isDrawing ? "primary" : "neutral"}
                onClick={toggle_rectangle_tool}
                aria-label="Rectangle tool"
              >
                <RectangleHorizontal size={14} />
              </Button>
            </Tooltip>
          </div>
          <div class={styles.colorField}>
            <Tooltip content="Rectangle color">
              <input
                type="color"
                value={rectangle_color.value}
                onInput={update_rectangle_color}
                class={styles.colorInput}
                aria-label="Rectangle color"
              />
            </Tooltip>
          </div>
        </div>

        <Flex align="center" gap="sm" class={styles.rightSection}>
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
          <Tooltip content="Shortcuts">
            <Button size="icon-only" onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts">
              <Keyboard size={14} />
            </Button>
          </Tooltip>
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
