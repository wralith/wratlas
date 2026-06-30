import { Download, FileUp, Keyboard, Pencil, Plus, Trash2 } from "lucide-preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import { Combobox, type ComboboxAction } from "@/ui/molecules/combobox/combobox"
import { remove_active_object } from "./actions"
import { useCanvasImportExport } from "./hooks/use-canvas-import-export"
import { create_canvas } from "./internal/store"
import {
  active_canvas_id,
  active_canvas_name,
  canvas_controller,
  canvas_list,
  canvas_store,
  fabric_canvas,
} from "./state"
import * as styles from "./toolbar.css"
import { CanvasToolbarShortcutsModal } from "./toolbar-shortcuts-modal"

export const CanvasToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importRef, openImport, handleImport, handleExport } = useCanvasImportExport()
  const [draftName, setDraftName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "rename">("add")
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("canvas-name")?.focus()
    }
  }, [modalOpen])

  const currentCanvasId = active_canvas_id.value
  const currentCanvasName = active_canvas_name.value

  const openAddModal = () => {
    setDraftName("")
    setModalMode("add")
    setModalOpen(true)
  }

  const openRenameModal = () => {
    setDraftName(currentCanvasName || "")
    setModalMode("rename")
    setModalOpen(true)
  }

  const handleModalSubmit = () => {
    if (modalMode === "add") {
      void canvas_controller.add_canvas(create_canvas(draftName || "Untitled Canvas"))
    } else {
      if (!currentCanvasId) return
      canvas_store.rename_canvas(currentCanvasId, draftName)
    }
    setModalOpen(false)
  }

  const handleCanvasChange = async (id: string) => {
    await canvas_controller.switch_canvas(id)
  }

  const handleFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return

    const canvas = fabric_canvas.value
    if (!canvas) return

    await canvas_controller.add_image(files)

    if (inputRef.current) inputRef.current.value = ""
  }

  const openDeleteModal = () => {
    if (!currentCanvasId) return
    if (canvas_list.value.length <= 1) return
    setDeleteModalOpen(true)
  }

  const handleDeleteCanvas = async () => {
    if (!currentCanvasId) return
    await canvas_controller.delete_canvas(currentCanvasId)
    setDeleteModalOpen(false)
  }

  const handleRemove = () => {
    const canvas = fabric_canvas.value
    if (!canvas) return
    remove_active_object(canvas)
  }

  const canvasActions: ComboboxAction[] = [
    {
      id: "create",
      label: "Create Canvas",
      icon: Plus,
      onSelect: openAddModal,
    },
    {
      id: "rename",
      label: "Rename Canvas",
      icon: Pencil,
      onSelect: openRenameModal,
      disabled: !currentCanvasId,
    },
    {
      id: "delete",
      label: "Delete Canvas",
      icon: Trash2,
      tone: "danger" as const,
      onSelect: openDeleteModal,
      disabled: canvas_list.value.length <= 1,
    },
  ]

  return (
    <div class={styles.container}>
      <div class={styles.toolbar}>
        <Flex align="center" gap="sm">
          <Combobox
            value={active_canvas_id.value}
            options={canvas_list.value.map(canvas => ({
              id: canvas.id,
              label: canvas.name,
            }))}
            onChange={handleCanvasChange}
            actions={canvasActions}
            placeholder="Select canvas"
            searchPlaceholder="Search canvases..."
            emptyLabel="No canvases"
          />
          <Tooltip content="Import">
            <Button size="icon-only" onClick={openImport}>
              <FileUp size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Export">
            <Button size="icon-only" onClick={handleExport}>
              <Download size={14} />
            </Button>
          </Tooltip>
        </Flex>

        <Flex align="center" gap="sm">
          <Tooltip content="Add Image">
            <Button size="icon-only" onClick={() => inputRef.current?.click()}>
              <Plus size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete Object">
            <Button size="icon-only" onClick={handleRemove}>
              <Trash2 size={14} />
            </Button>
          </Tooltip>
          <Tooltip content="Shortcuts">
            <Button size="icon-only" onClick={() => setShortcutsOpen(true)}>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        header={modalMode === "add" ? "Add Canvas" : "Rename Canvas"}
        content={
          <Input
            type="text"
            id="canvas-name"
            placeholder="Canvas name"
            value={draftName}
            onInput={e => setDraftName((e.target as HTMLInputElement).value)}
            onKeyDown={e => {
              if (e.key === "Enter" && draftName.trim()) handleModalSubmit()
            }}
          />
        }
        footer={
          <>
            <Button size="small" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="small" color="primary" onClick={handleModalSubmit} disabled={!draftName.trim()}>
              {modalMode === "add" ? "Add" : "Rename"}
            </Button>
          </>
        }
      />

      <CanvasToolbarShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header="Delete Canvas"
        content={`Are you sure you want to delete "${currentCanvasName}"?`}
        footer={
          <>
            <Button size="small" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button size="small" color="error" onClick={handleDeleteCanvas}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  )
}
