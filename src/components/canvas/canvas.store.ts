import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { CanvasManager, type CanvasSnapshot, create_canvas } from "@/lib/canvas-doc/manager"

export const manager = new CanvasManager()

export type CanvasTool = "select" | "draw" | "text" | "sticky" | "pan"

export const activeTool = signal<CanvasTool>("select")
export const zoomLevel = signal(1)
export const panX = signal(0)
export const panY = signal(0)
export const canvasReady = signal(false)
export const fabricCanvas = signal<FabricCanvas | null>(null)
export const canvases = signal<CanvasSnapshot[]>(manager.storage.canvases)
export const activeCanvasId = signal(manager.active_canvas_id)
export const activeCanvas = signal<CanvasSnapshot>(manager.active_canvas)

export const syncCanvasState = () => {
  const state = manager.storage
  canvases.value = state.canvases
  activeCanvasId.value = state.activeCanvasId
  activeCanvas.value = manager.active_canvas
}

export const createCanvasDoc = (name: string) => {
  manager.add_canvas(create_canvas(name))
  syncCanvasState()
}

export const renameCanvasDoc = (id: string, name: string) => {
  manager.rename_canvas(id, name)
  syncCanvasState()
}

export const setActiveCanvasDoc = async (id: string) => {
  await manager.set_active_canvas(id)
  syncCanvasState()
}

export const addImagesToActiveCanvas = async (files: FileList | File[]) => {
  await manager.add_image(files)
  syncCanvasState()
}

export const importCanvasDoc = async () => {
  // const imported = await importCanvas(payload)
  // if (!imported) return false
  // syncCanvasState()
  return true
}
