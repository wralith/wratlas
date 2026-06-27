import { Canvas as FabricCanvas } from "fabric"
import { useEffect, useRef } from "preact/hooks"
import { canvasReady, fabricCanvas } from "@/components/canvas/canvas.store"

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const parent = el.parentElement
    if (!parent) return

    const canvas = new FabricCanvas(el, {
      width: parent.clientWidth,
      height: parent.clientHeight,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
      enablePointerEvents: true,
      fireRightClick: false,
      fireMiddleClick: true,
      stopContextMenu: true,
    })

    fabricRef.current = canvas
    fabricCanvas.value = canvas
    canvasReady.value = true

    const observer = new ResizeObserver(() => {
      const p = el.parentElement
      if (!p) return
      canvas.setDimensions({
        width: p.clientWidth,
        height: p.clientHeight,
      })
      canvas.requestRenderAll()
    })
    observer.observe(parent)

    return () => {
      observer.disconnect()
      canvas.dispose()
      fabricRef.current = null
      fabricCanvas.value = null
      canvasReady.value = false
    }
  }, [])

  return { canvasRef }
}
