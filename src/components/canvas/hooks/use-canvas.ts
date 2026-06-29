import { Canvas as FabricCanvas } from "fabric"
import { useEffect, useRef } from "preact/hooks"
import { controller, canvasReady, fabricCanvas } from "@/components/canvas/canvas.store"

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const host = el.parentElement
    if (!host) return

    const canvas = new FabricCanvas(el, {
      width: host.clientWidth,
      height: host.clientHeight,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
      enablePointerEvents: true,
      fireRightClick: false,
      fireMiddleClick: true,
      stopContextMenu: true,
    })

    controller.init(canvas)

    fabricRef.current = canvas
    fabricCanvas.value = canvas
    canvasReady.value = true

    let resizeTimer: ReturnType<typeof setTimeout>
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        canvas.setDimensions({
          width: host.clientWidth,
          height: host.clientHeight,
        })

        canvas.requestRenderAll()
      }, 50)
    })
    observer.observe(host)

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
