import { useSignal } from "@preact/signals"
import {
  ClipboardCopy,
  Compass,
  Download,
  FileUp,
  ImageDown,
  ImagePlus,
  Keyboard,
  Menu,
  MousePointer2,
  PanelRightClose,
  PanelRightOpen,
  Square,
  Type,
} from "lucide-preact"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Popover } from "@/ui/atoms/popover/popover"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { Toolbar } from "@/ui/molecules/toolbar/toolbar"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { useCanvasPngExport } from "./hooks/use-canvas-png-export"
import { active_tool, type CanvasTool, canvas_controller, nav_tools_open, object_details_open } from "./state"
import * as styles from "./toolbar.css"
import { ToolbarCombobox } from "./toolbar-combobox"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

const primaryTools: { id: CanvasTool; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
]

const secondaryTools: { id: CanvasTool; icon: typeof MousePointer2; label: string }[] = [
  { id: "draw", icon: Square, label: "Rectangle" },
  { id: "text", icon: Type, label: "Text" },
]

const ToolButton = ({ tool }: { tool: (typeof primaryTools)[0] }) => {
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
}

export const CanvasToolbar = () => {
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const { handleDownloadPng } = useCanvasPngExport()
  const shortcutsOpen = useSignal(false)
  const burgerOpen = useSignal(false)

  const handleAddImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files
      if (!files?.length) return
      await canvas_controller.add_image(files)
      input.remove()
    }
    input.click()
  }

  const handleCopyActive = async () => {
    await canvas_controller.copy_image_to_clipboard()
  }

  const closeBurger = () => {
    burgerOpen.value = false
  }

  const burgerActions = (
    <div class={styles.burgerContent}>
      {secondaryTools.map(tool => {
        const active = active_tool.value === tool.id
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            type="button"
            class={styles.burgerButton}
            data-active={active || undefined}
            onClick={() => {
              active_tool.value = tool.id
              closeBurger()
            }}
          >
            <Icon size={14} />
            {tool.label}
          </button>
        )
      })}
      <div class={styles.burgerSeparator} />
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          openImport()
          closeBurger()
        }}
      >
        <FileUp size={14} />
        Import
      </button>
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          handleExport()
          closeBurger()
        }}
      >
        <Download size={14} />
        Export
      </button>
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          handleAddImage()
          closeBurger()
        }}
      >
        <ImagePlus size={14} />
        Add image
      </button>
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          handleCopyActive()
          closeBurger()
        }}
      >
        <ClipboardCopy size={14} />
        Copy object
      </button>
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          handleDownloadPng()
          closeBurger()
        }}
      >
        <ImageDown size={14} />
        Download PNG
      </button>
      <button
        type="button"
        class={styles.burgerButton}
        onClick={() => {
          shortcutsOpen.value = true
          closeBurger()
        }}
      >
        <Keyboard size={14} />
        Shortcuts
      </button>
    </div>
  )

  return (
    <div class={styles.container}>
      <Toolbar>
        <Flex align="center" gap="xs">
          <ToolbarCombobox />
          <Flex align="center" gap="xs" data-tour="canvas-file-ops" class={styles.desktopOnly}>
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
            <Tooltip content="Add image">
              <Button size="icon-only" onClick={handleAddImage} aria-label="Add image">
                <ImagePlus size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Copy object">
              <Button size="icon-only" onClick={handleCopyActive} aria-label="Copy active object">
                <ClipboardCopy size={14} />
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
          {primaryTools.map(tool => (
            <ToolButton key={tool.id} tool={tool} />
          ))}
          {secondaryTools.map(tool => (
            <span key={tool.id} class={styles.desktopOnly}>
              <ToolButton tool={tool} />
            </span>
          ))}
          <span class={styles.desktopOnly}>
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
          </span>
          <span class={styles.mobileOnly}>
            <Popover
              open={burgerOpen.value}
              onClose={() => {
                burgerOpen.value = false
              }}
              position="bottom-end"
              trigger={
                <Button
                  size="icon-only"
                  onClick={() => {
                    burgerOpen.value = !burgerOpen.value
                  }}
                  aria-label="More actions"
                >
                  <Menu size={14} />
                </Button>
              }
            >
              {burgerActions}
            </Popover>
          </span>
          <Tooltip content={nav_tools_open.value ? "Hide minimap" : "Show minimap"}>
            <Button
              size="icon-only"
              color={nav_tools_open.value ? "primary" : "neutral"}
              onClick={() => {
                nav_tools_open.value = !nav_tools_open.value
              }}
              aria-label="Toggle minimap"
            >
              <Compass size={14} />
            </Button>
          </Tooltip>
          <Tooltip content={object_details_open.value ? "Hide details" : "Object details"}>
            <Button
              size="icon-only"
              color={object_details_open.value ? "primary" : "neutral"}
              onClick={() => {
                object_details_open.value = !object_details_open.value
              }}
              aria-label="Toggle object details"
            >
              {object_details_open.value ? <PanelRightOpen size={14} /> : <PanelRightClose size={14} />}
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
