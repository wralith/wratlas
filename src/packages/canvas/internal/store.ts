import { computed, effect, signal } from "@preact/signals"
import { nanoid } from "nanoid"
import { debounce } from "@/lib/debounce"
import { safe_parse_json } from "@/lib/safe-parse-json"
import type { CanvasListItem, CanvasSnapshot, CanvasStorage } from "./types"
import { ensure_canvas_doc_fabric_props } from "./types"

const INDEX_KEY = "wratlas.canvas.v1.index"

export const create_canvas = (name: string): CanvasSnapshot => {
  const now = new Date().toISOString()
  return {
    id: nanoid(8),
    name: name.trim() || "Untitled Canvas",
    createdAt: now,
    updatedAt: now,
    lastImageIndex: 0,
    version: "1.0",
    objects: [],
    viewport: {
      zoom: 1,
      x: 0,
      y: 0,
    },
  }
}

export const create_default_canvas_storage = (): CanvasStorage => {
  const default_canvas = create_canvas("Default Canvas")
  return {
    activeCanvasId: default_canvas.id,
    canvases: [default_canvas],
  }
}

const get_initial_storage = (): CanvasStorage => {
  const raw = localStorage.getItem(INDEX_KEY)
  const storage = safe_parse_json<CanvasStorage>(raw)
  if (storage && storage.canvases.length > 0) return storage
  return create_default_canvas_storage()
}

export const create_canvas_store = () => {
  ensure_canvas_doc_fabric_props()

  const storage = signal<CanvasStorage>(get_initial_storage())
  const canvases = computed(() => storage.value.canvases)
  const active_canvas_id = computed(() => storage.value.activeCanvasId)
  const active_canvas = computed(() => canvases.value.find(c => c.id === active_canvas_id.value) ?? canvases.value[0])
  const canvas_list = computed<CanvasListItem[]>(() => canvases.value.map(c => ({ id: c.id, name: c.name })))
  const active_canvas_name = computed(() => active_canvas.value.name)

  const debounced_save = debounce((storage_data: CanvasStorage) => {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(storage_data))
    } catch (e) {
      console.error("Failed to save canvas storage:", e)
    }
  }, 200)

  effect(() => {
    debounced_save(storage.value)
  })

  const set_active_id = (id: string) => {
    if (storage.value.canvases.some(c => c.id === id)) {
      storage.value = { ...storage.value, activeCanvasId: id }
    }
  }

  const add_canvas = (canvas: CanvasSnapshot) => {
    storage.value = {
      activeCanvasId: canvas.id,
      canvases: [...storage.value.canvases, canvas],
    }
  }

  const update_active_canvas = (snapshot: Partial<CanvasSnapshot>) => {
    update_canvas(active_canvas_id.value, snapshot)
  }

  const update_canvas = (id: string, snapshot: Partial<CanvasSnapshot>) => {
    storage.value = {
      ...storage.value,
      canvases: storage.value.canvases.map(c => (c.id === id ? { ...c, ...snapshot } : c)),
    }
  }

  const rename_canvas = (id: string, name: string) => {
    const next_name = name.trim() || "Untitled Canvas"
    storage.value = {
      ...storage.value,
      canvases: storage.value.canvases.map(c => (c.id === id ? { ...c, name: next_name } : c)),
    }
  }

  return {
    storage,
    canvases,
    active_canvas_id,
    active_canvas,
    canvas_list,
    active_canvas_name,

    set_active_id,
    add_canvas,
    update_canvas,
    update_active_canvas,
    rename_canvas,
  }
}

export type CanvasStore = ReturnType<typeof create_canvas_store>
