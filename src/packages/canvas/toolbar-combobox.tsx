import { useComputed, useSignal } from "@preact/signals"
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-preact"
import { useEffect } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Input } from "@/ui/atoms/input/input"
import { Modal } from "@/ui/atoms/modal/modal"
import { Combobox, type ComboboxAction } from "@/ui/molecules/combobox/combobox"
import { create_canvas } from "./internal/store"
import { active_canvas_id, active_canvas_name, canvas_controller, canvas_list, canvas_store } from "./state"

export const ToolbarCombobox = () => {
  const draftName = useSignal("")
  const modalOpen = useSignal(false)
  const deleteModalOpen = useSignal(false)
  const modalMode = useSignal<"add" | "rename">("add")

  useEffect(() => {
    if (modalOpen.value) {
      document.getElementById("canvas-name")?.focus()
    }
  }, [modalOpen.value])

  const currentCanvasId = active_canvas_id.value
  const currentCanvasName = active_canvas_name.value
  const canvasIndex = useComputed(() => canvas_list.value.findIndex(c => c.id === currentCanvasId))
  const canMoveUp = useComputed(() => canvasIndex.value > 0)
  const canMoveDown = useComputed(() => canvasIndex.value < canvas_list.value.length - 1)

  const openAddModal = () => {
    draftName.value = ""
    modalMode.value = "add"
    modalOpen.value = true
  }

  const openRenameModal = () => {
    draftName.value = currentCanvasName || ""
    modalMode.value = "rename"
    modalOpen.value = true
  }

  const handleModalSubmit = () => {
    if (modalMode.value === "add") {
      void canvas_controller.add_canvas(create_canvas(draftName.value || "Untitled Canvas"))
    } else {
      if (!currentCanvasId) return
      canvas_store.rename_canvas(currentCanvasId, draftName.value)
    }
    modalOpen.value = false
  }

  const handleCanvasChange = async (id: string) => {
    await canvas_controller.switch_canvas(id)
  }

  const openDeleteModal = () => {
    if (!currentCanvasId) return
    if (canvas_list.value.length <= 1) return
    deleteModalOpen.value = true
  }

  const handleDeleteCanvas = async () => {
    if (!currentCanvasId) return
    await canvas_controller.delete_canvas(currentCanvasId)
    deleteModalOpen.value = false
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
      id: "move-up",
      label: "Move Up",
      icon: ArrowUp,
      keepOpen: true,
      onSelect: () => {
        if (currentCanvasId) canvas_controller.move_canvas(currentCanvasId, "up")
      },
      disabled: !canMoveUp.value,
    },
    {
      id: "move-down",
      label: "Move Down",
      icon: ArrowDown,
      keepOpen: true,
      onSelect: () => {
        if (currentCanvasId) canvas_controller.move_canvas(currentCanvasId, "down")
      },
      disabled: !canMoveDown.value,
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
        open={modalOpen.value}
        onClose={() => {
          modalOpen.value = false
        }}
        header={modalMode.value === "add" ? "Add Canvas" : "Rename Canvas"}
        content={
          <Input
            type="text"
            id="canvas-name"
            placeholder="Canvas name"
            value={draftName.value}
            onInput={e => {
              draftName.value = (e.target as HTMLInputElement).value
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && draftName.value.trim()) handleModalSubmit()
            }}
          />
        }
        footer={
          <>
            <Button
              size="small"
              onClick={() => {
                modalOpen.value = false
              }}
            >
              Cancel
            </Button>
            <Button size="small" color="primary" onClick={handleModalSubmit} disabled={!draftName.value.trim()}>
              {modalMode.value === "add" ? "Add" : "Rename"}
            </Button>
          </>
        }
      />

      <Modal
        open={deleteModalOpen.value}
        onClose={() => {
          deleteModalOpen.value = false
        }}
        header="Delete Canvas"
        content={`Are you sure you want to delete "${currentCanvasName}"?`}
        footer={
          <>
            <Button
              size="small"
              onClick={() => {
                deleteModalOpen.value = false
              }}
            >
              Cancel
            </Button>
            <Button size="small" color="danger" onClick={handleDeleteCanvas}>
              Delete
            </Button>
          </>
        }
      />
    </>
  )
}
