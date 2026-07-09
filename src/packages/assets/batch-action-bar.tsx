import { useSignal } from "@preact/signals"
import { Check, Plus, Trash2, X } from "lucide-preact"
import { useEffect, useMemo, useRef } from "preact/hooks"
import { useLocation } from "preact-iso"
import { cn } from "@/lib/cn"
import { add_notification } from "@/lib/notifications"
import { create_canvas } from "@/packages/canvas/internal/store"
import { canvas_controller, canvas_store } from "@/packages/canvas/state"
import { Button } from "@/ui/atoms/button/button"
import { Checkbox } from "@/ui/atoms/checkbox/checkbox"
import { Flex } from "@/ui/atoms/flex/flex"
import { Input } from "@/ui/atoms/input/input"
import { Popover } from "@/ui/atoms/popover/popover"
import {
  batchBar,
  batchBarBody,
  batchCount,
  batchLabel,
  selectAllFloat,
  suggestionHighlight,
  suggestionItem,
  suggestions,
} from "./batch-action-bar.css.ts"
import { asset_store } from "./state"

export const SelectAllFloating = () => {
  const { filtered_assets, selected_ids, select_all } = asset_store
  if (selected_ids.value.length > 0 || filtered_assets.value.length === 0) return null

  return (
    <div class={selectAllFloat}>
      <Button size="small" onClick={select_all} data-tour="assets-select-all">
        <Check size={14} />
        Select All ({filtered_assets.value.length})
      </Button>
    </div>
  )
}

const TagPopoverContent = ({ onClose }: { onClose: () => void }) => {
  const { selected_ids } = asset_store
  const tagDraft = useSignal("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleApply = () => {
    const tag = tagDraft.value.trim()
    if (!tag) return
    for (const id of selected_ids.value) {
      const asset = asset_store.assets.value.find(a => a.id === id)
      if (asset && !asset.tags.includes(tag)) {
        asset_store.update_asset(id, { tags: [...asset.tags, tag] })
      }
    }
    onClose()
  }

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter tag name..."
        value={tagDraft.value}
        onInput={e => {
          tagDraft.value = (e.target as HTMLInputElement).value
        }}
        onKeyDown={e => {
          if (e.key === "Enter") handleApply()
          if (e.key === "Escape") onClose()
        }}
      />
      <Flex mt={6} gap="xs" justify="end">
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" color="primary" onClick={handleApply} disabled={!tagDraft.value.trim()}>
          Apply
        </Button>
      </Flex>
    </>
  )
}

const CanvasPopoverContent = ({ onClose }: { onClose: () => void }) => {
  const { selected_ids } = asset_store
  const { route } = useLocation()
  const canvasDraft = useSignal("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredCanvases = useMemo(() => {
    const q = canvasDraft.value.trim().toLowerCase()
    if (!q) return canvas_store.canvas_list.value
    return canvas_store.canvas_list.value.filter(c => c.name.toLowerCase().includes(q))
  }, [canvasDraft.value])

  const showCreateCanvas =
    canvasDraft.value.trim().length > 0 &&
    !canvas_store.canvas_list.value.some(c => c.name.toLowerCase() === canvasDraft.value.trim().toLowerCase())

  const handleSendToCanvas = async (canvasId: string) => {
    const ids = selected_ids.value
    for (const assetId of ids) {
      const blob = await asset_store.get_asset_blob(assetId)
      if (!blob) continue
      const file = new File([blob], `asset-${assetId}.${blob.type.split("/")[1] || "png"}`, { type: blob.type })
      await canvas_controller.add_image_to_canvas(canvasId, file)
    }
    canvas_controller.pendingArrange.value = true
    add_notification({ type: "success", title: `${ids.length} asset${ids.length > 1 ? "s" : ""} sent to canvas` })
    onClose()
    route("/")
  }

  const handleCreateCanvas = async (name: string) => {
    const snapshot = create_canvas(name)
    await canvas_controller.add_canvas(snapshot)
    await handleSendToCanvas(snapshot.id)
  }

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search or create canvas..."
        value={canvasDraft.value}
        onInput={e => {
          canvasDraft.value = (e.target as HTMLInputElement).value
        }}
        onKeyDown={e => {
          if (e.key === "Escape") onClose()
          if (e.key === "Enter" && filteredCanvases.length > 0) void handleSendToCanvas(filteredCanvases[0].id)
          if (e.key === "Enter" && showCreateCanvas) void handleCreateCanvas(canvasDraft.value.trim())
        }}
      />
      {(filteredCanvases.length > 0 || showCreateCanvas) && (
        <div class={suggestions}>
          {filteredCanvases.map(c => (
            <button
              key={c.id}
              type="button"
              class={suggestionItem}
              onMouseDown={e => e.preventDefault()}
              onClick={() => void handleSendToCanvas(c.id)}
            >
              {c.name}
            </button>
          ))}
          {showCreateCanvas && (
            <button
              type="button"
              class={cn(suggestionItem, suggestionHighlight)}
              onMouseDown={e => e.preventDefault()}
              onClick={() => void handleCreateCanvas(canvasDraft.value.trim())}
            >
              <Plus size={14} />
              Create canvas: {canvasDraft.value.trim()}
            </button>
          )}
        </div>
      )}
    </>
  )
}

export const BatchActionBar = ({ onDeleteRequest }: { onDeleteRequest: () => void }) => {
  const { selected_ids, all_filtered_selected, clear_selection } = asset_store
  const activePopover = useSignal<"tag" | "canvas" | null>(null)

  const count = selected_ids.value.length
  if (count === 0) return null

  return (
    <div class={batchBar}>
      <div class={batchBarBody}>
        <Flex align="center" gap="md">
          <Checkbox
            checked={all_filtered_selected.value}
            onChange={v => (v ? asset_store.select_all() : asset_store.clear_selection())}
          />
          <span class={batchCount}>{count} selected</span>

          <Flex gap="sm" ml="auto" wrap>
            <Popover
              open={activePopover.value === "tag"}
              onClose={() => {
                activePopover.value = null
              }}
              position="top-end"
              trigger={
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => {
                    activePopover.value = activePopover.value === "tag" ? null : "tag"
                  }}
                >
                  <Plus size={14} />
                  <span class={batchLabel}>Add Tag</span>
                </Button>
              }
            >
              <TagPopoverContent
                onClose={() => {
                  activePopover.value = null
                }}
              />
            </Popover>

            <Popover
              open={activePopover.value === "canvas"}
              onClose={() => {
                activePopover.value = null
              }}
              position="top-end"
              trigger={
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => {
                    activePopover.value = activePopover.value === "canvas" ? null : "canvas"
                  }}
                >
                  <Plus size={14} />
                  <span class={batchLabel}>Send to Canvas</span>
                </Button>
              }
            >
              <CanvasPopoverContent
                onClose={() => {
                  activePopover.value = null
                }}
              />
            </Popover>

            <Button size="small" variant="outline" color="danger" onClick={() => onDeleteRequest()}>
              <Trash2 size={14} />
              <span class={batchLabel}>Delete</span>
            </Button>

            <Button size="small" variant="outline" onClick={() => clear_selection()}>
              <X size={14} />
              <span class={batchLabel}>Deselect</span>
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}
