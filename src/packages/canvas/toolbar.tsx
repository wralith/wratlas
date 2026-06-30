import { Download, FileUp, Keyboard } from "lucide-preact"
import { useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { ToolbarCombobox } from "./toolbar-combobox"
import * as styles from "./toolbar.css"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

export const CanvasToolbar = () => {
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

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
