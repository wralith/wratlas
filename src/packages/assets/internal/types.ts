export type AssetId = string

export type AssetMeta = {
  id: AssetId
  name: string
  type: "image"
  tags: string[]
  notes: string
  width: number
  height: number
  fileSize: number
  createdAt: string
  updatedAt: string
}

export type AssetStorage = {
  assets: AssetMeta[]
}
