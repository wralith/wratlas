export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 4
export const ZOOM_STEP = 1.1

export const clamp_zoom = (zoom: number) => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM)
