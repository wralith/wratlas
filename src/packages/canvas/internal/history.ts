import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { clamp_zoom } from "../constants"
import { create_canvas_snapshot_patch, IMAGE_ID_KEY } from "./snapshot"

const HISTORY_LIMIT = 100

type ViewportState = {
  zoom: number
  x: number
  y: number
}

type RuntimeSnapshot = {
  objects: unknown[]
  viewport: ViewportState
}

type CanvasHistory = {
  undo: RuntimeSnapshot[]
  redo: RuntimeSnapshot[]
}

type CanvasHistoryDeps = {
  get_canvas: () => FabricCanvas | null
  get_active_canvas_id: () => string
  get_image_blob: (image_id: string) => Promise<Blob | undefined>
  save_state: () => Promise<void>
  is_hydrating: () => boolean
}

export const create_canvas_history = ({
  get_canvas,
  get_active_canvas_id,
  get_image_blob,
  save_state,
  is_hydrating,
}: CanvasHistoryDeps) => {
  const history_by_canvas = new Map<string, CanvasHistory>()
  let history_blob_urls: string[] = []
  const is_restoring = signal(false)
  let is_transitioning = false

  const get_history = (canvas_id: string): CanvasHistory => {
    const existing = history_by_canvas.get(canvas_id)
    if (existing) return existing

    const created: CanvasHistory = {
      undo: [],
      redo: [],
    }
    history_by_canvas.set(canvas_id, created)
    return created
  }

  const create_snapshot = (): RuntimeSnapshot | null => {
    const canvas = get_canvas()
    if (!canvas) return null
    return create_canvas_snapshot_patch(canvas)
  }

  const hydrate_objects = async (objects: unknown[]) => {
    return Promise.all(
      objects.map(async object => {
        const canvas_object = object as Record<string, unknown>

        if (
          typeof object !== "object" ||
          object === null ||
          typeof canvas_object.type !== "string" ||
          canvas_object.type.toLowerCase() !== "image" ||
          typeof canvas_object[IMAGE_ID_KEY] !== "string"
        ) {
          return object
        }

        const blob = await get_image_blob(canvas_object[IMAGE_ID_KEY])
        if (!blob) return object

        const src = URL.createObjectURL(blob)
        history_blob_urls.push(src)

        return {
          ...canvas_object,
          src,
        }
      }),
    )
  }

  const apply_snapshot = async (snapshot: RuntimeSnapshot) => {
    const canvas = get_canvas()
    if (!canvas) return

    is_restoring.value = true

    try {
      history_blob_urls.forEach(URL.revokeObjectURL)
      history_blob_urls = []

      const hydrated_objects = await hydrate_objects(snapshot.objects)

      await canvas.loadFromJSON({
        version: "1.0",
        objects: hydrated_objects,
      })

      const { zoom, x, y } = snapshot.viewport
      const safe_zoom = clamp_zoom(zoom)
      canvas.setViewportTransform([safe_zoom, 0, 0, safe_zoom, x, y])
      canvas.requestRenderAll()
    } finally {
      is_restoring.value = false
    }
  }

  const reset_for_active_canvas = () => {
    const active_id = get_active_canvas_id()
    if (!active_id) return

    const history = get_history(active_id)
    history.undo = []
    history.redo = []

    const snapshot = create_snapshot()
    if (!snapshot) return

    history.undo.push(snapshot)
  }

  const capture = () => {
    if (is_hydrating() || is_restoring.value) return

    const active_id = get_active_canvas_id()
    if (!active_id) return

    const snapshot = create_snapshot()
    if (!snapshot) return

    const history = get_history(active_id)
    history.undo.push(snapshot)

    if (history.undo.length > HISTORY_LIMIT) {
      history.undo.shift()
    }

    history.redo = []
  }

  const undo = async () => {
    if (is_transitioning) return

    const active_id = get_active_canvas_id()
    if (!active_id) return

    const history = get_history(active_id)
    if (history.undo.length <= 1) return

    const current = history.undo.pop()
    if (!current) return

    history.redo.push(current)

    const previous = history.undo.at(-1)
    if (!previous) return

    is_transitioning = true

    try {
      await apply_snapshot(previous)
      await save_state()
    } finally {
      is_transitioning = false
    }
  }

  const redo = async () => {
    if (is_transitioning) return

    const active_id = get_active_canvas_id()
    if (!active_id) return

    const history = get_history(active_id)
    const next = history.redo.pop()
    if (!next) return

    is_transitioning = true

    try {
      history.undo.push(next)
      await apply_snapshot(next)
      await save_state()
    } finally {
      is_transitioning = false
    }
  }

  const dispose = () => {
    history_blob_urls.forEach(URL.revokeObjectURL)
    history_blob_urls = []
  }

  return {
    reset_for_active_canvas,
    capture,
    undo,
    redo,
    dispose,
    is_restoring,
  }
}
