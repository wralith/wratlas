import type { Canvas as FabricCanvas } from "fabric"
import { FabricImage } from "fabric"

type ImageOptions = {
  originX?: "center" | "left" | "right"
  originY?: "center" | "top" | "bottom"
  scaleToWidth?: number
}

type AddImageOptions = ImageOptions & {
  left?: number
  top?: number
}

type AddFilesOptions = ImageOptions & {
  getPosition?: (file: File, index: number) => { x: number; y: number }
  onImageAdded?: (img: FabricImage, file: File) => void | Promise<void>
}

export const addImageToCanvas = async (canvas: FabricCanvas, url: string, options?: AddImageOptions) => {
  try {
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
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const addImagesFromFiles = async (canvas: FabricCanvas, files: FileList | File[], options?: AddFilesOptions) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.type.startsWith("image/")) continue

    const url = URL.createObjectURL(file)
    const { getPosition, onImageAdded, ...imageOpts } = options ?? {}
    const pos = getPosition?.(file, i) ?? { x: 0, y: 0 }
    const img = await addImageToCanvas(canvas, url, {
      left: pos.x,
      top: pos.y,
      ...imageOpts,
    })
    if (onImageAdded) {
      await onImageAdded(img, file)
      canvas.requestRenderAll()
    }
  }
}

export const removeActiveObject = (canvas: FabricCanvas) => {
  const activeObj = canvas.getActiveObject()
  if (!activeObj) return
  canvas.remove(activeObj)
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}
