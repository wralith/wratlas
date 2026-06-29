import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { createCanvasController } from "@/lib/canvas-doc/controller"
import { createCanvasStore } from "@/lib/canvas-doc/store"

export const canvas_store = createCanvasStore()
export const controller = createCanvasController(canvas_store)

export type CanvasTool = "select" | "draw" | "text" | "sticky" | "pan"

export const activeTool = signal<CanvasTool>("select")
export const zoomLevel = signal(1)
export const panX = signal(0)
export const panY = signal(0)
export const canvasReady = signal(false)
export const fabricCanvas = signal<FabricCanvas | null>(null)
export const canvasList = canvas_store.canvas_list
export const activeCanvasId = canvas_store.active_canvas_id
export const activeCanvasName = canvas_store.active_canvas_name
export const activeCanvas = canvas_store.active_canvas
