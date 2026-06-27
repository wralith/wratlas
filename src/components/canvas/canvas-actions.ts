import type { Canvas as FabricCanvas } from "fabric"
import { FabricImage } from "fabric"

export type ImageOptions = {
  originX?: "center" | "left" | "right"
  originY?: "center" | "top" | "bottom"
  scaleToWidth?: number
}

export type AddImageOptions = ImageOptions & {
  left?: number
  top?: number
}

export type AddFilesOptions = ImageOptions & {
  getPosition?: (file: File, index: number) => { x: number; y: number }
  onImageAdded?: (img: FabricImage, file: File) => void | Promise<void>
}

export const addImageToCanvas = async (canvas: FabricCanvas, url: string, options?: AddImageOptions) => {
  const img = await FabricImage.fromURL(url)
  img.set({
    left: options?.left ?? 0,
    top: options?.top ?? 0,
    ...(options?.originX ? { originX: options.originX } : {}),
    ...(options?.originY ? { originY: options.originY } : {}),
  })
  if (options?.scaleToWidth != null) {
    img.scaleToWidth(options.scaleToWidth)
  }
  canvas.add(img)
  canvas.setActiveObject(img)
  canvas.requestRenderAll()
  return img
}

export const addImagesFromFiles = async (canvas: FabricCanvas, files: FileList | File[], options?: AddFilesOptions) => {
  const entries = Array.from(files)
    .filter(file => file.type.startsWith("image/"))
    .map((file, i) => ({ file, index: i }))

  await Promise.all(
    entries.map(async ({ file, index }) => {
      const url = URL.createObjectURL(file)
      const { getPosition, onImageAdded, ...imageOpts } = options ?? {}
      const pos = getPosition?.(file, index) ?? { x: 0, y: 0 }
      const img = await addImageToCanvas(canvas, url, {
        left: pos.x,
        top: pos.y,
        ...imageOpts,
      })
      URL.revokeObjectURL(url)
      if (onImageAdded) {
        await onImageAdded(img, file)
        canvas.requestRenderAll()
      }
    }),
  )
}

export const removeActiveObject = (canvas: FabricCanvas) => {
  const activeObj = canvas.getActiveObject()
  if (!activeObj) return
  canvas.remove(activeObj)
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}
