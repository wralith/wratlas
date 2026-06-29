import { signal } from "@preact/signals"
import type { Canvas as FabricCanvas } from "fabric"
import { FabricImage } from "fabric"
import { createStore, get, set } from "idb-keyval"
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

  const init = (fabricCanvas: FabricCanvas) => {
    canvas = fabricCanvas
    load_active_canvas()
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
            // @ts-expect-error FabricObject.fromObject accepts custom properties, but the type definition doesn't reflect that
            obj.src = url
            active_blob_urls.push(url)
          }
        }
      })

      await Promise.allSettled(promises)
      await canvas.loadFromJSON(snapshot)

      const { zoom = 1, x = 0, y = 0 } = snapshot.viewport || {}
      canvas.setViewportTransform([zoom, 0, 0, zoom, x, y])
      canvas.requestRenderAll()
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

  return {
    init,
    load_active_canvas,
    save_state,
    switch_canvas,
    add_canvas,
    add_image,
    is_hydrating,
  }
}
