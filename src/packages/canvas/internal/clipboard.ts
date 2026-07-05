const PREFIX = "data:application/vnd.wratlas.canvas-object+json;base64,"

export type CopiedObjectData = {
  version: number
  type: string
  properties: Record<string, unknown>
}

const encodeBase64 = (json: string): string => {
  const bytes = new TextEncoder().encode(json)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const decodeBase64 = (base64: string): string => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

export const encode_object_data = (data: CopiedObjectData): string => {
  return PREFIX + encodeBase64(JSON.stringify(data))
}

export const decode_object_data = (text: string): CopiedObjectData | null => {
  if (!text.startsWith(PREFIX)) return null
  const base64 = text.slice(PREFIX.length)
  try {
    return JSON.parse(decodeBase64(base64))
  } catch {
    return null
  }
}
