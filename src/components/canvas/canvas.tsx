import { useCanvas } from "./hooks/use-canvas"
import { usePanZoom } from "./hooks/use-pan-zoom"
import { useDragDrop } from "./hooks/use-drag-drop"
import { wrapper, canvasHost } from "./canvas.css"

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
