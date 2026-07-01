import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { FabricImage } from "fabric"
import { createStore, del, get, keys, set } from "idb-keyval"
import {
  bring_active_object_forward,
  bring_active_object_to_front,
  send_active_object_backward,
  send_active_object_to_back,
} from "../actions"
import { clamp_zoom } from "../constants"
import { create_canvas_history } from "./history"
import { create_canvas_snapshot_patch } from "./snapshot"
import type { CanvasStore } from "./store"
import type { CanvasSnapshot } from "./types"
import { ensure_canvas_doc_fabric_props } from "./types"

const image_store = createStore("wratlas-canvas-images-db", "images")

export const create_canvas_controller = (store: CanvasStore) => {
  ensure_canvas_doc_fabric_props()

  let canvas: FabricCanvas | null = null
  let active_blob_urls: string[] = []
  const is_hydrating = signal(false)

  const history = create_canvas_history({
    get_canvas: () => canvas,
    get_active_canvas_id: () => store.active_canvas_id.value,
    get_image_blob: image_id => get<Blob>(image_id, image_store),
    save_state: async () => {
      await save_state()
    },
    is_hydrating: () => is_hydrating.value,
  })

  const collect_orphan_images = async () => {
    const referenced_ids = new Set<string>()

    for (const snapshot of store.canvases.value) {
      for (const object of snapshot.objects) {
        if (object.type.toLowerCase() !== "image" || !object._image_id) continue
        referenced_ids.add(object._image_id)
      }
    }

    const stored_keys = await keys(image_store)
    const deletions = stored_keys
      .filter(key => typeof key === "string" && !referenced_ids.has(key))
      .map(key => del(key, image_store))

    await Promise.allSettled(deletions)
  }

  const init = (fabricCanvas: FabricCanvas) => {
    canvas = fabricCanvas
    void load_active_canvas().then(async () => {
      await collect_orphan_images()
    })
  }

  const load_active_canvas = async () => {
    if (!canvas) return
    is_hydrating.value = true

    try {
      active_blob_urls.forEach(URL.revokeObjectURL)
      active_blob_urls = []

      const snapshot = structuredClone(store.active_canvas.value)
      canvas.clear()

      const promises = snapshot.objects.map(async obj => {
        if (obj.type.toLowerCase() === "image" && obj._image_id) {
          const blob = await get<Blob>(obj._image_id, image_store)
          if (blob) {
            const url = URL.createObjectURL(blob)
            obj.src = url
            active_blob_urls.push(url)
          }
        }
      })

      await Promise.allSettled(promises)
      await canvas.loadFromJSON(snapshot)

      const { zoom = 1, x = 0, y = 0 } = snapshot.viewport || {}
      const safe_zoom = clamp_zoom(zoom)
      canvas.setViewportTransform([safe_zoom, 0, 0, safe_zoom, x, y])
      canvas.requestRenderAll()
      history.reset_for_active_canvas()
    } finally {
      is_hydrating.value = false
    }
  }

  const save_state = async () => {
    if (!canvas) return

    const patch = create_canvas_snapshot_patch(canvas)

    store.update_active_canvas({
      updatedAt: new Date().toISOString(),
      ...patch,
    })

    canvas.requestRenderAll()
  }

  const switch_canvas = async (new_id: string) => {
    if (new_id === store.active_canvas_id.value) return

    await save_state()
    store.set_active_id(new_id)
    await load_active_canvas()
  }

  const add_canvas = async (snapshot: CanvasSnapshot) => {
    await save_state()
    store.add_canvas(snapshot)
    await load_active_canvas()
  }

  const delete_canvas = async (id: string) => {
    await save_state()
    const deleted = store.delete_canvas(id)
    if (!deleted) return false
    await load_active_canvas()
    await collect_orphan_images()
    return true
  }

  const add_image = async (files: FileList | File[]) => {
    if (!canvas) return

    const entries = Array.from(files).filter(file => file.type.startsWith("image/"))
    let last_image_index = store.active_canvas.value.lastImageIndex
    const active_id = store.active_canvas.value.id

    for (const file of entries) {
      const src = URL.createObjectURL(file)
      const pos = canvas.getVpCenter()

      last_image_index += 1
      const _image_id = `${active_id}-${last_image_index}`

      const img = await FabricImage.fromURL(src)
      URL.revokeObjectURL(src)

      img.set({
        left: pos.x,
        top: pos.y,
        _image_id,
      })
      img.scaleToWidth(400)

      await set(_image_id, file, image_store)
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.requestRenderAll()
    }

    if (last_image_index !== store.active_canvas.value.lastImageIndex) {
      store.update_active_canvas({
        lastImageIndex: last_image_index,
      })
    }

    await save_state()
  }

  const get_image_blob = (image_id: string) => get<Blob>(image_id, image_store)

  const set_image_blob = async (image_id: string, blob: Blob) => {
    await set(image_id, blob, image_store)
  }

  const copy_image_to_clipboard = async () => {
    if (!canvas || !navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      return false
    }

    const active_object = canvas.getActiveObject()
    if (!active_object) return false

    const object_canvas = active_object.toCanvasElement({
      enableRetinaScaling: true,
      format: "png",
      multiplier: 1,
      withoutTransform: false,
      withoutShadow: false,
    })

    const blob = await new Promise<Blob | null>(resolve => {
      object_canvas.toBlob(resolve, "image/png")
    })

    if (!blob) return false
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    return true
  }

  const order_active_object_to_back = async () => {
    if (!canvas) return false

    const did_reorder = send_active_object_to_back(canvas)
    if (!did_reorder) return false

    history.capture()
    await save_state()
    return true
  }

  const order_active_object_backward = async () => {
    if (!canvas) return false

    const did_reorder = send_active_object_backward(canvas)
    if (!did_reorder) return false

    history.capture()
    await save_state()
    return true
  }

  const order_active_object_to_front = async () => {
    if (!canvas) return false

    const did_reorder = bring_active_object_to_front(canvas)
    if (!did_reorder) return false

    history.capture()
    await save_state()
    return true
  }

  const order_active_object_forward = async () => {
    if (!canvas) return false

    const did_reorder = bring_active_object_forward(canvas)
    if (!did_reorder) return false

    history.capture()
    await save_state()
    return true
  }

  const dispose = () => {
    history.dispose()
  }

  return {
    init,
    load_active_canvas,
    save_state,
    switch_canvas,
    add_canvas,
    delete_canvas,
    add_image,
    get_image_blob,
    set_image_blob,
    capture_history_snapshot: history.capture,
    undo: history.undo,
    redo: history.redo,
    copy_image_to_clipboard,
    order_active_object_backward,
    order_active_object_to_back,
    order_active_object_forward,
    order_active_object_to_front,
    dispose,
    is_hydrating,
    is_restoring_history: history.is_restoring,
  }
}
