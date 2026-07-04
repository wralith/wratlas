import { useSignal } from "@preact/signals"
import { Point } from "fabric"
import { useEffect } from "preact/hooks"
import { Input } from "@/ui/atoms/input/input"
import { Slider } from "@/ui/atoms/slider/slider"
import * as styles from "./canvas-zoom-control.css"
import { clamp_zoom, MAX_ZOOM, MIN_ZOOM } from "./constants"
import { sync_viewport_signals } from "./internal/controls"
import { fabric_canvas, zoom_level } from "./state"

const to_percent = (zoom: number) => Math.round(zoom * 100)

export const CanvasZoomControl = () => {
  const canvas = fabric_canvas.value
  const zoom = zoom_level.value
  const draftValue = useSignal(String(to_percent(zoom)))

  useEffect(() => {
    draftValue.value = String(to_percent(zoom))
  }, [zoom])

  const applyZoom = (nextZoom: number) => {
    if (!canvas) return

    const clamped = clamp_zoom(nextZoom)
    const center = canvas.getCenterPoint()

    canvas.zoomToPoint(new Point(center.x, center.y), clamped)
    canvas.requestRenderAll()
    sync_viewport_signals(canvas)
  }

  const handleSliderInput = (event: Event) => {
    const value = Number((event.target as HTMLInputElement).value)
    const ratio = value / 100
    draftValue.value = String(value)
    applyZoom(ratio)
  }

  const commitNumberInput = () => {
    const parsed = Number(draftValue.value)
    if (Number.isNaN(parsed)) {
      draftValue.value = String(to_percent(zoom))
      return
    }

    const clampedPercent = Math.min(Math.max(parsed, MIN_ZOOM * 100), MAX_ZOOM * 100)
    const nextZoom = clampedPercent / 100
    draftValue.value = String(Math.round(clampedPercent))
    applyZoom(nextZoom)
  }

  const currentPercent = to_percent(zoom)

  return (
    <div class={styles.container}>
      <div class={styles.topRow}>
        <span class={styles.label}>Zoom</span>
        <div class={styles.numberInputWrap}>
          <Input
            class={styles.numberInput}
            type="number"
            aria-label="Zoom percent"
            min={MIN_ZOOM * 100}
            max={MAX_ZOOM * 100}
            step={1}
            value={draftValue.value}
            onInput={event => {
              draftValue.value = (event.target as HTMLInputElement).value
            }}
            onBlur={commitNumberInput}
            onKeyDown={event => {
              if (event.key === "Enter") {
                commitNumberInput()
              }
            }}
          />
          <span class={styles.numberSuffix}>%</span>
        </div>
      </div>

      <Slider
        min={MIN_ZOOM * 100}
        max={MAX_ZOOM * 100}
        step={1}
        value={currentPercent}
        onInput={handleSliderInput}
        aria-label="Canvas zoom"
      />
    </div>
  )
}
