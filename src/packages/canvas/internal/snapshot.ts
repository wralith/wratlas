import type { Canvas as FabricCanvas } from "fabric"
import type { CanvasSnapshot } from "./types"

export const IMAGE_ID_KEY = "_image_id"

type CanvasSnapshotPatch = Pick<CanvasSnapshot, "objects" | "viewport">

export const create_canvas_snapshot_patch = (canvas: FabricCanvas): CanvasSnapshotPatch => {
  // @ts-expect-error fabric canvas toJSON does not include custom properties by default, but we can pass them in as an array
  const canvas_json = canvas.toJSON([IMAGE_ID_KEY]) as CanvasSnapshot
  const objects = canvas_json.objects.map(obj => {
    if (obj.type.toLowerCase() === "image" && obj._image_id) {
      return {
        ...obj,
        src: undefined,
      }
    }

    return obj
  })

  return {
    objects,
    viewport: {
      zoom: canvas.getZoom(),
      x: canvas.viewportTransform?.[4] ?? 0,
      y: canvas.viewportTransform?.[5] ?? 0,
    },
  }
}
