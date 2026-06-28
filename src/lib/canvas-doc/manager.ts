import { type Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric"
import { createStore, get, set } from "idb-keyval"
import { nanoid } from "nanoid"
import { safe_parse_json } from "../safe-parse-json"

const INDEX_KEY = "wratlas.canvas.v1.index"
const IMAGE_ID_KEY = "_image_id"

const props = new Set(FabricObject.customProperties ?? [])
props.add(IMAGE_ID_KEY)
FabricObject.customProperties = [...props]

export type CanvasFabricObject = FabricObject & {
  _image_id?: string
}

export type CanvasSnapshot = {
  id: string
  name: string
  version: string
  createdAt: string
  updatedAt: string
  objects: CanvasFabricObject[]
  viewport: {
    zoom: number
    x: number
    y: number
  }
  lastImageIndex: number
}

type CanvasStorage = {
  activeCanvasId: string
  canvases: CanvasSnapshot[]
}

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

const image_store = createStore("wratlas-canvas-images-db", "images")

export class CanvasManager {
  public storage: CanvasStorage
  private canvas: FabricCanvas | null = null
  public active_canvas: CanvasSnapshot
  private active_blob_urls: string[] = []

  public get active_canvas_id() {
    return this.active_canvas.id
  }

  constructor() {
    const raw = localStorage.getItem(INDEX_KEY)
    this.storage = safe_parse_json<CanvasStorage>(raw) ?? create_default_canvas_storage()

    if (this.storage.canvases.length === 0) {
      this.storage = create_default_canvas_storage()
    }

    const active = this.storage.canvases.find(c => c.id === this.storage.activeCanvasId) ?? this.storage.canvases[0]
    this.storage.activeCanvasId = active.id
    this.active_canvas = active
  }

  public init_canvas(canvas: FabricCanvas) {
    this.canvas = canvas
    void this.load_active_canvas()
  }

  public async set_active_canvas(id: string) {
    if (id === this.active_canvas.id) {
      return
    }

    if (this.canvas) {
      await this.save_state()
    }

    const next_canvas = this.storage.canvases.find(c => c.id === id)
    if (!next_canvas) {
      return
    }

    this.storage.activeCanvasId = id
    this.active_canvas = next_canvas
    this.persist_storage()

    if (this.canvas) {
      await this.load_active_canvas()
    }
  }

  public add_canvas(canvas: CanvasSnapshot) {
    this.storage.canvases.push(canvas)
    this.storage.activeCanvasId = canvas.id
    this.active_canvas = canvas
    this.persist_storage()

    if (this.canvas) {
      void this.load_active_canvas()
    }
  }

  public update_active_canvas(snapshot: Partial<CanvasSnapshot>) {
    this.active_canvas = { ...this.active_canvas, ...snapshot }
    this.storage.canvases = this.storage.canvases.map(c => (c.id === this.active_canvas.id ? this.active_canvas : c))
    this.persist_storage()
  }

  public rename_canvas(id: string, name: string) {
    const canvas = this.storage.canvases.find(c => c.id === id)
    if (canvas) {
      canvas.name = name.trim() || "Untitled Canvas"
      this.persist_storage()
    }
  }

  public async load_active_canvas() {
    const canvas = this.get_canvas()

    // biome-ignore lint/suspicious/useIterableCallbackReturn: ignore
    this.active_blob_urls.forEach(url => URL.revokeObjectURL(url))
    this.active_blob_urls = []

    const clone = structuredClone(this.active_canvas)
    canvas.clear()

    const promises = clone.objects.map(async obj => {
      if (obj.type.toLowerCase() === "image" && obj._image_id) {
        const blob = await get<Blob>(obj._image_id, image_store)
        if (blob) {
          const url = URL.createObjectURL(blob)
          // @ts-expect-error FabricObject.fromObject accepts custom properties, but the type definition doesn't reflect that
          obj.src = url
          this.active_blob_urls.push(url)
        }
      }
    })

    await Promise.all(promises)
    await canvas.loadFromJSON(clone)
    canvas.requestRenderAll()
  }

  public async save_state() {
    const canvas = this.get_canvas()

    this.active_canvas.updatedAt = new Date().toISOString()
    // @ts-expect-error FabricObject.fromObject accepts custom properties, but the type definition doesn't reflect that
    const canvas_json = canvas.toJSON([IMAGE_ID_KEY])
    const clean_objects = canvas_json.objects.map(obj => {
      if (obj.type.toLowerCase() === "image" && obj._image_id) {
        return { ...obj, src: undefined }
      }
      return obj
    })

    const to_save = {
      ...this.active_canvas,
      ...canvas_json,
      objects: clean_objects,
    }

    this.storage.canvases = this.storage.canvases.map(c => (c.id === this.active_canvas.id ? to_save : c))
    this.active_canvas = to_save

    this.persist_storage()
    canvas.requestRenderAll()
  }

  public async add_image(files: FileList | File[]) {
    const canvas = this.get_canvas()
    const entries = Array.from(files).filter(f => f.type.startsWith("image/"))

    for (const file of entries) {
      const src = URL.createObjectURL(file)
      const pos = canvas.getVpCenter()

      this.active_canvas.lastImageIndex += 1
      const _image_id = `${this.active_canvas.id}-${this.active_canvas.lastImageIndex}`

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

    await this.save_state()
  }

  private get_canvas() {
    if (!this.canvas) {
      throw new Error("Canvas is not initialized")
    }

    return this.canvas
  }

  private persist_storage() {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(this.storage))
    } catch (e) {
      console.error("Failed to save canvas storage to localStorage:", e)
    }
  }
}
