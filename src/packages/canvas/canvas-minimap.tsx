import { useSignalEffect } from "@preact/signals"
import { util } from "fabric"
import { LocateFixed } from "lucide-preact"
import { useRef } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import * as styles from "./canvas-minimap.css"
import { sync_viewport_signals } from "./internal/controls"
import { fabric_canvas, pan_x, pan_y, zoom_level } from "./state"

type Rect = { x: number; y: number; w: number; h: number }

const get_object_bounds = (obj: Record<string, unknown>): Rect => ({
  x: (obj.left as number) ?? 0,
  y: (obj.top as number) ?? 0,
  w: ((obj.width as number) ?? 0) * ((obj.scaleX as number) ?? 1),
  h: ((obj.height as number) ?? 0) * ((obj.scaleY as number) ?? 1),
})

export const CanvasMinimap = () => {
  const minimapRef = useRef<HTMLCanvasElement>(null)

  const draw = () => {
    const mc = minimapRef.current
    const canvas = fabric_canvas.value
    if (!mc || !canvas) return

    const dpr = window.devicePixelRatio || 1
    const mcW = 200
    const mcH = 140
    mc.width = mcW * dpr
    mc.height = mcH * dpr
    mc.style.width = `${mcW}px`
    mc.style.height = `${mcH}px`

    const ctx = mc.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)

    const zoom = zoom_level.value
    const panX = pan_x.value
    const panY = pan_y.value

    const vpX = -panX / zoom
    const vpY = -panY / zoom
    const vpW = canvas.width / zoom
    const vpH = canvas.height / zoom

    const objects = canvas.getObjects().map(o => o.toObject() as Record<string, unknown>)

    let minX = vpX
    let minY = vpY
    let maxX = vpX + vpW
    let maxY = vpY + vpH

    for (const obj of objects) {
      const b = get_object_bounds(obj)
      if (b.w === 0 && b.h === 0) continue
      minX = Math.min(minX, b.x)
      minY = Math.min(minY, b.y)
      maxX = Math.max(maxX, b.x + b.w)
      maxY = Math.max(maxY, b.y + b.h)
    }

    const padX = Math.max((maxX - minX) * 0.1, 100)
    const padY = Math.max((maxY - minY) * 0.1, 100)

    const worldX = minX - padX
    const worldY = minY - padY
    const worldW = maxX - minX + padX * 2
    const worldH = maxY - minY + padY * 2

    const scale = Math.min(mcW / worldW, mcH / worldH)

    const to_screen = (wx: number, wy: number) => ({
      x: (wx - worldX) * scale,
      y: (wy - worldY) * scale,
    })

    for (const obj of objects) {
      const b = get_object_bounds(obj)
      if (b.w === 0 && b.h === 0) continue

      const tl = to_screen(b.x, b.y)
      const br = to_screen(b.x + b.w, b.y + b.h)

      ctx.fillStyle = obj.type === "image" ? "#4a4a6a" : "#3a3a5a"
      ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y)
    }

    const vpTl = to_screen(vpX, vpY)
    const vpBr = to_screen(vpX + vpW, vpY + vpH)

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1.5
    ctx.strokeRect(vpTl.x, vpTl.y, vpBr.x - vpTl.x, vpBr.y - vpTl.y)

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
    ctx.fillRect(vpTl.x, vpTl.y, vpBr.x - vpTl.x, vpBr.y - vpTl.y)
  }

  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const request_draw = () => draw()

    zoom_level.value
    pan_x.value
    pan_y.value
    request_draw()

    const disposers = [
      canvas.on("object:added", request_draw),
      canvas.on("object:modified", request_draw),
      canvas.on("object:removed", request_draw),
    ]

    return () => {
      for (const dispose of disposers) {
        dispose()
      }
    }
  })

  const resetView = () => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    const vpt = canvas.viewportTransform
    if (!vpt) return
    if (vpt[0] === 1 && vpt[4] === 0 && vpt[5] === 0) return

    const fromZoom = vpt[0]
    const fromX = vpt[4]
    const fromY = vpt[5]

    util.animate({
      startValue: [fromZoom, fromX, fromY],
      endValue: [1, 0, 0],
      duration: 300,
      easing: util.ease.easeOutCubic,
      onChange: ([zoom, x, y]) => {
        canvas.setViewportTransform([zoom, 0, 0, zoom, x, y])
        canvas.renderAll()
      },
      onComplete: () => {
        sync_viewport_signals(canvas)
      },
    })
  }

  const handleClick = (e: MouseEvent) => {
    const mc = minimapRef.current
    const canvas = fabric_canvas.value
    if (!mc || !canvas) return

    const zoom = zoom_level.value
    const panX = pan_x.value
    const panY = pan_y.value

    const vpX = -panX / zoom
    const vpY = -panY / zoom
    const vpW = canvas.width / zoom
    const vpH = canvas.height / zoom

    const objects = canvas.getObjects().map(o => o.toObject() as Record<string, unknown>)

    let minX = vpX
    let minY = vpY
    let maxX = vpX + vpW
    let maxY = vpY + vpH

    for (const obj of objects) {
      const b = get_object_bounds(obj)
      if (b.w === 0 && b.h === 0) continue
      minX = Math.min(minX, b.x)
      minY = Math.min(minY, b.y)
      maxX = Math.max(maxX, b.x + b.w)
      maxY = Math.max(maxY, b.y + b.h)
    }

    const padX = Math.max((maxX - minX) * 0.1, 100)
    const padY = Math.max((maxY - minY) * 0.1, 100)

    const worldX = minX - padX
    const worldY = minY - padY
    const worldW = maxX - minX + padX * 2
    const worldH = maxY - minY + padY * 2

    const mcW = 200
    const mcH = 140
    const scale = Math.min(mcW / worldW, mcH / worldH)

    const rect = mc.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    const wx = worldX + mx / scale
    const wy = worldY + my / scale

    const newPanX = canvas.width / 2 - wx * zoom
    const newPanY = canvas.height / 2 - wy * zoom

    canvas.setViewportTransform([zoom, 0, 0, zoom, newPanX, newPanY])
    canvas.requestRenderAll()
    sync_viewport_signals(canvas)
  }

  return (
    <div class={styles.container}>
      <Tooltip content="Reset view" placement="top">
        <Button variant="ghost" size="icon-only" class={styles.resetButton} onClick={resetView} aria-label="Reset view">
          <LocateFixed size={12} />
        </Button>
      </Tooltip>
      <canvas ref={minimapRef} class={styles.canvas} onClick={handleClick} />
    </div>
  )
}
