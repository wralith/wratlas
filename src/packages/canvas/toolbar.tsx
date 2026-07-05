import { useSignal } from "@preact/signals"
import { Download, FileUp, ImageDown, Keyboard } from "lucide-preact"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { useCanvasPngExport } from "./hooks/use-canvas-png-export"
import * as styles from "./toolbar.css"
import { ToolbarCombobox } from "./toolbar-combobox"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

export const CanvasToolbar = () => {
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const { handleDownloadPng } = useCanvasPngExport()
  const shortcutsOpen = useSignal(false)

  return (
    <div class={styles.container}>
      <Toolbar>
        <Flex align="center" gap="xs">
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
          <Tooltip content="Download Canvas as PNG">
            <Button size="icon-only" onClick={handleDownloadPng} aria-label="Download canvas as PNG">
              <ImageDown size={14} />
            </Button>
          </Tooltip>
        </Flex>

        <Flex align="center" gap="sm">
          <Tooltip content="Shortcuts">
            <Button
              size="icon-only"
              onClick={() => {
                shortcutsOpen.value = true
              }}
              aria-label="Keyboard shortcuts"
            >
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
      </Toolbar>

      <CanvasToolbarShortcutsModal
        open={shortcutsOpen.value}
        onClose={() => {
          shortcutsOpen.value = false
        }}
      />
    </div>
  )
}
