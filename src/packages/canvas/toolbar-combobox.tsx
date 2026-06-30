import { Pencil, Plus, Trash2 } from "lucide-preact"
import { useEffect, useState } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Combobox, type ComboboxAction } from "@/ui/molecules/combobox/combobox"
import { create_canvas } from "./internal/store"
import { active_canvas_id, active_canvas_name, canvas_controller, canvas_list, canvas_store } from "./state"

export const ToolbarCombobox = () => {
  const [draftName, setDraftName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "rename">("add")

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
      tone: "danger",
      onSelect: openDeleteModal,
      disabled: canvas_list.value.length <= 1,
    },
  ]

  return (
    <>
      <Combobox
        value={currentCanvasId}
        options={canvas_list.value.map(canvas => ({ id: canvas.id, label: canvas.name }))}
        onChange={handleCanvasChange}
        actions={canvasActions}
        placeholder="Select canvas"
        searchPlaceholder="Search canvases..."
        emptyLabel="No canvases"
      />

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
    </>
  )
}
