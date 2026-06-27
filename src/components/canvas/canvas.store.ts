import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"

export type CanvasTool = "select" | "draw" | "text" | "sticky"

export const activeTool = signal<CanvasTool>("select")
export const zoomLevel = signal(1)
export const panX = signal(0)
export const panY = signal(0)
export const canvasReady = signal(false)
export const fabricCanvas = signal<FabricCanvas | null>(null)
