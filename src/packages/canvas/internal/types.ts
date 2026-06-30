import { FabricObject } from "fabric"

const IMAGE_ID_KEY = "_image_id"

let fabric_props_initialized = false

export const ensure_canvas_doc_fabric_props = () => {
  if (fabric_props_initialized) {
    return
  }

  const props = new Set(FabricObject.customProperties ?? [])
  props.add(IMAGE_ID_KEY)
  FabricObject.customProperties = [...props]
  fabric_props_initialized = true
}

export type CanvasFabricObject = {
  type: string
  _image_id?: string
  src?: string
  [key: string]: unknown
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

export type CanvasListItem = {
  id: string
  name: string
}

export type CanvasStorage = {
  activeCanvasId: string
  canvases: CanvasSnapshot[]
}
