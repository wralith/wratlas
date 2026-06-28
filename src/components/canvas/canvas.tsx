import { canvasHost, wrapper } from "@/components/canvas/canvas.css"
import { useCanvas } from "@/components/canvas/hooks/use-canvas"
import { useCanvasPersistence } from "@/components/canvas/hooks/use-canvas-persistence"
import { useDragDrop } from "@/components/canvas/hooks/use-drag-drop"
import { useObjectDelete } from "@/components/canvas/hooks/use-object-delete"
import { usePanZoom } from "@/components/canvas/hooks/use-pan-zoom"

export const Canvas = () => {
  const { canvasRef } = useCanvas()

  usePanZoom()
  useDragDrop()
  useObjectDelete()
  useCanvasPersistence()

  return (
    <div class={wrapper}>
      <canvas ref={canvasRef} class={canvasHost} />
    </div>
  )
}
