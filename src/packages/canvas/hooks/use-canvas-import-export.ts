import JSZip from "jszip"
import { useRef } from "preact/hooks"
import { add_notification } from "@/lib/notifications"
import { create_canvas } from "../internal/store"
import type { CanvasSnapshot } from "../internal/types"
import { active_canvas, canvas_controller, fabric_canvas } from "../state"

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/avif": "avif",
}

const download_blob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const collect_image_ids = (snapshot: CanvasSnapshot) => {
  const image_ids = new Set<string>()

  for (const object of snapshot.objects) {
    if (object.type.toLowerCase() !== "image" || !object._image_id) continue
    image_ids.add(object._image_id)
  }

  return [...image_ids]
}

const get_asset_filename = (image_id: string, blob: Blob) => {
  const extension = MIME_EXTENSIONS[blob.type] || "bin"
  return `${image_id}.${extension}`
}

const escape_regex = (raw: string) => raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const find_asset_in_zip = (zip: JSZip, image_id: string) => {
  const exact = zip.file(`assets/${image_id}`)
  if (exact) return exact

  const escaped_id = escape_regex(image_id)
  const matches = zip.file(new RegExp(`^assets/${escaped_id}(\\.[^/]+)?$`))
  return matches[0] ?? null
}

const parse_json_file = async (file: File) => {
  const raw = await file.text()
  return JSON.parse(raw) as CanvasSnapshot
}

const parse_zip_file = async (file: File) => {
  const zip = await JSZip.loadAsync(file)
  const canvas_file = zip.file("canvas.json")
  if (!canvas_file) {
    throw new Error("Missing canvas.json")
  }

  const snapshot = JSON.parse(await canvas_file.async("text")) as CanvasSnapshot
  return { zip, snapshot }
}

const remap_image_ids = (snapshot: CanvasSnapshot, canvas_id: string) => {
  let next_image_index = 0
  const image_map = new Map<string, string>()

  const remap_object = (object: CanvasSnapshot["objects"][number]): CanvasSnapshot["objects"][number] => {
    if (object.type.toLowerCase() !== "image" || !object._image_id) {
      return object
    }

    let next_image_id = image_map.get(object._image_id)
    if (!next_image_id) {
      next_image_index += 1
      next_image_id = `${canvas_id}-${next_image_index}`
      image_map.set(object._image_id, next_image_id)
    }

    return {
      ...object,
      _image_id: next_image_id,
    }
  }

  const objects = snapshot.objects.map(remap_object)

  return {
    objects,
    image_map,
    last_image_index: next_image_index,
  }
}

const persist_imported_assets = async (zip: JSZip, image_map: Map<string, string>) => {
  for (const [from_id, to_id] of image_map) {
    const asset = find_asset_in_zip(zip, from_id)
    if (!asset) continue
    const blob = await asset.async("blob")
    await canvas_controller.set_image_blob(to_id, blob)
  }
}

export const useCanvasImportExport = () => {
  const importRef = useRef<HTMLInputElement>(null)

  const openImport = () => {
    importRef.current?.click()
  }

  const handleExport = async () => {
    const canvas = fabric_canvas.value
    if (!canvas) return

    await canvas_controller.save_state()
    const snapshot = structuredClone(active_canvas.value)
    const image_ids = collect_image_ids(snapshot)

    const zip = new JSZip()
    zip.file("canvas.json", JSON.stringify(snapshot, null, 2))

    const assets_folder = zip.folder("assets")
    if (assets_folder) {
      for (const image_id of image_ids) {
        const blob = await canvas_controller.get_image_blob(image_id)
        if (!blob) continue
        assets_folder.file(get_asset_filename(image_id, blob), blob)
      }
    }

    const file = await zip.generateAsync({ type: "blob" })
    download_blob(file, "canvas.zip")
    add_notification({ type: "success", title: "Canvas exported" })
  }

  const handleImport = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files?.length) return

    const file = files[0]
    const now = new Date().toISOString()

    try {
      const imported = file.name.toLowerCase().endsWith(".zip") ? await parse_zip_file(file) : null
      const source_snapshot = imported ? imported.snapshot : await parse_json_file(file)

      const next_canvas = create_canvas(source_snapshot.name || "Imported Canvas")
      const { objects, image_map, last_image_index } = remap_image_ids(source_snapshot, next_canvas.id)

      next_canvas.version = source_snapshot.version || next_canvas.version
      next_canvas.createdAt = now
      next_canvas.updatedAt = now
      next_canvas.viewport = source_snapshot.viewport ?? next_canvas.viewport
      next_canvas.objects = objects
      next_canvas.lastImageIndex = Math.max(last_image_index, source_snapshot.lastImageIndex ?? 0)

      if (imported) {
        await persist_imported_assets(imported.zip, image_map)
      }

      await canvas_controller.add_canvas(next_canvas)
      add_notification({ type: "success", title: "Canvas imported" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      add_notification({ type: "error", title: "Import failed", message })
    } finally {
      if (importRef.current) importRef.current.value = ""
    }
  }

  return {
    importRef,
    openImport,
    handleImport,
    handleExport,
  }
}
