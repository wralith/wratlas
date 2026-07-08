import { useSignal } from "@preact/signals"
import { Download, FileUp, ImageDown, Keyboard, MousePointer2, Square, Type } from "lucide-preact"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { useCanvasPngExport } from "./hooks/use-canvas-png-export"
import { active_tool, type CanvasTool } from "./state"
import * as styles from "./toolbar.css"
import { ToolbarCombobox } from "./toolbar-combobox"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

const tools: { id: CanvasTool; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "draw", icon: Square, label: "Rectangle" },
  { id: "text", icon: Type, label: "Text" },
]

export const CanvasToolbar = () => {
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const { handleDownloadPng } = useCanvasPngExport()
  const shortcutsOpen = useSignal(false)

  return (
    <div class={styles.container}>
      <Toolbar>
        <Flex align="center" gap="xs">
          <Flex align="center" gap="xs">
            <ToolbarCombobox />
          </Flex>
          <Flex align="center" gap="xs" data-tour="canvas-file-ops">
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
        </Flex>

        <Flex align="center" gap="xs" data-tour="canvas-tools">
          {tools.map(tool => {
            const active = active_tool.value === tool.id
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id} content={tool.label}>
                <Button
                  size="icon-only"
                  color={active ? "primary" : "neutral"}
                  onClick={() => {
                    active_tool.value = tool.id
                  }}
                  aria-label={tool.label}
                >
                  <Icon size={14} />
                </Button>
              </Tooltip>
            )
          })}
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
