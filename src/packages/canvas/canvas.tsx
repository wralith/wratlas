import { LoadingOverlay } from "@/ui/atoms/loading-overlay/loading-overlay"
import { canvasHost, wrapper } from "./canvas.css"
import { CanvasContextMenu } from "./canvas-context-menu"
import { useCanvas } from "./hooks/use-canvas"
import { useCanvasShortcuts } from "./hooks/use-canvas-shortcuts"
import { useDragDrop } from "./hooks/use-drag-drop"
import { useHistory } from "./hooks/use-history"
import { useObjectDelete } from "./hooks/use-object-delete"
import { usePanZoom } from "./hooks/use-pan-zoom"
import { usePersistence } from "./hooks/use-persistence"
import { canvas_controller } from "./state"
import { CanvasToolbar } from "./toolbar"

// NOTE: We didn't inlined this to prevent re-rendering the canvas on is_hydrating signal change
const CanvasLoadingOverlay = () => <LoadingOverlay loading={canvas_controller.is_hydrating.value} />

export const Canvas = () => {
  const { canvasRef } = useCanvas()

  usePanZoom()
  useHistory()
  useDragDrop()
  useObjectDelete()
  useCanvasShortcuts()
  usePersistence()

  return (
    <div class={wrapper}>
      <CanvasToolbar />
      <CanvasContextMenu />
      <canvas ref={canvasRef} class={canvasHost} />
      <CanvasLoadingOverlay />
    </div>
  )
}
