export type AssetId = string

export type AssetMeta = {
  id: AssetId
  name: string
  type: "image"
  tags: string[]
  group: string | null
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
