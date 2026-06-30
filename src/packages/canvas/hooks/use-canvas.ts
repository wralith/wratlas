import { Canvas as FabricCanvas, FabricObject } from "fabric"
import { useEffect, useRef } from "preact/hooks"
import { canvas_controller, canvas_ready, fabric_canvas } from "../state"

const CANVAS_BACKGROUND_COLOR = "#1e1e2e"

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
      backgroundColor: CANVAS_BACKGROUND_COLOR,
      uniformScaling: true,
      selection: true,
      selectionColor: "rgba(249, 226, 175, 0.12)",
      selectionBorderColor: "#f9e2af",
      selectionLineWidth: 1.5,
      preserveObjectStacking: true,
      enablePointerEvents: true,
      fireRightClick: true,
      fireMiddleClick: true,
      stopContextMenu: true,
    })

    FabricObject.ownDefaults.borderColor = "#f9e2af"
    FabricObject.ownDefaults.cornerColor = "#f9e2af"
    FabricObject.ownDefaults.cornerStrokeColor = "#11111b"
    FabricObject.ownDefaults.transparentCorners = false
    FabricObject.ownDefaults.cornerStyle = "circle"
    FabricObject.ownDefaults.cornerSize = 12
    FabricObject.ownDefaults.padding = 2

    canvas_controller.init(canvas)

    fabricRef.current = canvas
    fabric_canvas.value = canvas
    canvas_ready.value = true

    const update_uniform_scaling = () => {
      const active = canvas.getActiveObject()
      console.log(active)
      canvas.uniformScaling = active?.type !== "rect"
    }

    const disposers = [
      canvas.on("selection:created", update_uniform_scaling),
      canvas.on("selection:updated", update_uniform_scaling),
      canvas.on("selection:cleared", () => {
        canvas.uniformScaling = true
      }),
    ]

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
      disposers.forEach(d => {
        d()
      })
      canvas_controller.dispose()
      canvas.dispose()
      fabricRef.current = null
      fabric_canvas.value = null
      canvas_ready.value = false
    }
  }, [])

  return { canvasRef }
}
