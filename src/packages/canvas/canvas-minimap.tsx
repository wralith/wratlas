import { useSignalEffect } from "@preact/signals"
import { util } from "fabric"
import { LocateFixed } from "lucide-preact"
import { useEffect, useRef } from "preact/hooks"
import { Button } from "@/ui/atoms/button/button"
import { Tooltip } from "@/ui/atoms/tooltip/tooltip"
import * as styles from "./canvas-minimap.css"
import { clamp_viewport, sync_viewport_signals } from "./internal/controls"
import { fabric_canvas, pan_x, pan_y, zoom_level } from "./state"

type Rect = { x: number; y: number; w: number; h: number }

const MC_W = 200
const MC_H = 140

const get_object_bounds = (obj: Record<string, unknown>): Rect => ({
  x: (obj.left as number) ?? 0,
  y: (obj.top as number) ?? 0,
  w: ((obj.width as number) ?? 0) * ((obj.scaleX as number) ?? 1),
  h: ((obj.height as number) ?? 0) * ((obj.scaleY as number) ?? 1),
})

const get_world_bounds = () => {
  const canvas = fabric_canvas.value
  if (!canvas) return null

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

  return {
    x: minX - padX,
    y: minY - padY,
    w: maxX - minX + padX * 2,
    h: maxY - minY + padY * 2,
    scale: Math.min(MC_W / (maxX - minX + padX * 2), MC_H / (maxY - minY + padY * 2)),
    vpX,
    vpY,
    vpW,
    vpH,
  }
}

const minimap_to_canvas = (clientX: number, clientY: number, el: HTMLElement) => {
  const bounds = get_world_bounds()
  if (!bounds) return null

  const rect = el.getBoundingClientRect()
  const mx = clientX - rect.left
  const my = clientY - rect.top

  return {
    x: bounds.x + mx / bounds.scale,
    y: bounds.y + my / bounds.scale,
  }
}

const pan_to = (wx: number, wy: number) => {
  const canvas = fabric_canvas.value
  if (!canvas) return

  const zoom = zoom_level.value

  canvas.setViewportTransform([zoom, 0, 0, zoom, canvas.width / 2 - wx * zoom, canvas.height / 2 - wy * zoom])
  clamp_viewport(canvas)
  canvas.requestRenderAll()
}

export const CanvasMinimap = () => {
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef(false)

  const draw = () => {
    const mc = minimapRef.current
    const canvas = fabric_canvas.value
    if (!mc || !canvas) return

    const bounds = get_world_bounds()
    if (!bounds) return

    const dpr = window.devicePixelRatio || 1
    mc.width = MC_W * dpr
    mc.height = MC_H * dpr
    mc.style.width = `${MC_W}px`
    mc.style.height = `${MC_H}px`

    const ctx = mc.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)

    const to_screen = (wx: number, wy: number) => ({
      x: (wx - bounds.x) * bounds.scale,
      y: (wy - bounds.y) * bounds.scale,
    })

    const objects = canvas.getObjects().map(o => o.toObject() as Record<string, unknown>)

    for (const obj of objects) {
      const b = get_object_bounds(obj)
      if (b.w === 0 && b.h === 0) continue

      const tl = to_screen(b.x, b.y)
      const br = to_screen(b.x + b.w, b.y + b.h)

      ctx.fillStyle = obj.type === "image" ? "#4a4a6a" : "#3a3a5a"
      ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y)
    }

    const vpTl = to_screen(bounds.vpX, bounds.vpY)
    const vpBr = to_screen(bounds.vpX + bounds.vpW, bounds.vpY + bounds.vpH)

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1.5
    ctx.strokeRect(vpTl.x, vpTl.y, vpBr.x - vpTl.x, vpBr.y - vpTl.y)

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
    ctx.fillRect(vpTl.x, vpTl.y, vpBr.x - vpTl.x, vpBr.y - vpTl.y)
  }

  useSignalEffect(() => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    draw()

    const dispose = canvas.on("after:render", draw)

    return () => {
      dispose()
    }
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      const mc = minimapRef.current
      const canvas = fabric_canvas.value
      if (!mc || !canvas) return

      const pos = minimap_to_canvas(e.clientX, e.clientY, mc)
      if (!pos) return

      pan_to(pos.x, pos.y)
      sync_viewport_signals(canvas)
    }

    const handleMouseUp = () => {
      draggingRef.current = false
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handlePointerDown = (e: MouseEvent) => {
    const mc = minimapRef.current
    const canvas = fabric_canvas.value
    if (!mc || !canvas) return

    draggingRef.current = true

    const pos = minimap_to_canvas(e.clientX, e.clientY, mc)
    if (!pos) return

    pan_to(pos.x, pos.y)
    sync_viewport_signals(canvas)
  }

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

  return (
    <div class={styles.container}>
      <Tooltip content="Reset view" placement="top">
        <Button variant="ghost" size="icon-only" class={styles.resetButton} onClick={resetView} aria-label="Reset view">
          <LocateFixed size={12} />
        </Button>
      </Tooltip>
      <canvas ref={minimapRef} class={styles.canvas} onMouseDown={handlePointerDown} />
    </div>
  )
}
