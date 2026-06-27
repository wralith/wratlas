import { canvasHost, wrapper } from "@/components/canvas/canvas.css"
import { useCanvas } from "@/components/canvas/hooks/use-canvas"
import { useDragDrop } from "@/components/canvas/hooks/use-drag-drop"
import { usePanZoom } from "@/components/canvas/hooks/use-pan-zoom"

export const Canvas = () => {
  const { canvasRef } = useCanvas()

  usePanZoom()
  useDragDrop()

  return (
    <div class={wrapper}>
      <canvas ref={canvasRef} class={canvasHost} />
    </div>
  )
}
