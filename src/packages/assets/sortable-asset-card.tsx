import { useSortable } from "@dnd-kit/react/sortable"
import type { JSX } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { ImageCard } from "@/ui/molecules/image-card/image-card"

export type SortableAssetCardProps = {
  id: string
  index: number
  name: string
  tags: string[]
  width: number
  height: number
  thumbnailUrl: string
  onContextMenu?: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
  onClick?: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
}

let drag_in_progress = false

export const is_dragging = () => drag_in_progress

export const SortableAssetCard = (props: SortableAssetCardProps) => {
  const { id, index, name, tags, width, height, thumbnailUrl, onContextMenu, onClick } = props
  const prev_source = useRef(false)

  const { ref, isDragSource } = useSortable({ id, index, group: "assets" })

  useEffect(() => {
    if (isDragSource && !prev_source.current) {
      drag_in_progress = true
    }
    if (!isDragSource && prev_source.current) {
      drag_in_progress = false
      window.dispatchEvent(new CustomEvent("drag-finished"))
    }
    prev_source.current = isDragSource
  }, [isDragSource])

  return (
    <div ref={ref} data-asset-id={id} style={{ opacity: isDragSource ? 0.4 : undefined }}>
      <ImageCard
        name={name}
        tags={tags}
        width={width}
        height={height}
        thumbnailUrl={thumbnailUrl}
        onContextMenu={onContextMenu}
        onClick={onClick}
      />
    </div>
  )
}
