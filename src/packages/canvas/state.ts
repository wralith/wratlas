import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas, FabricObject } from "fabric"
import { create_canvas_controller } from "./internal/controller"
import { create_canvas_store } from "./internal/store"

export const canvas_store = create_canvas_store()
export const canvas_controller = create_canvas_controller(canvas_store)

export type CanvasTool = "select" | "draw" | "text" | "sticky" | "pan"

export const active_tool = signal<CanvasTool>("select")
export const rectangle_color = signal("#444444")
export const is_rectangle_drawing = signal(false)
export const zoom_level = signal(1)
export const pan_x = signal(0)
export const pan_y = signal(0)
export const canvas_ready = signal(false)
export const fabric_canvas = signal<FabricCanvas | null>(null)
export const canvas_list = canvas_store.canvas_list
export const active_canvas_id = canvas_store.active_canvas_id
export const active_canvas_name = canvas_store.active_canvas_name
export const active_canvas = canvas_store.active_canvas

export const active_object = signal<FabricObject | null>(null)

export const sidebar_version = signal(0)

export const text_font_family = signal("JetBrains Mono")
export const text_font_size = signal(24)
export const text_color = signal("#cdd6f4")

export const nav_tools_open = signal(true)

export const object_details_open = signal(false)

export const last_mouse_scene_point = signal<{ x: number; y: number } | null>(null)
