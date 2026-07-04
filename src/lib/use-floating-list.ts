import { useEffect } from "preact/hooks"

type OpenSignal = { value: boolean; set: (v: boolean) => void }

export const useFloatingList = (rootRef: { current: HTMLElement | null }, open: OpenSignal) => {
  useEffect(() => {
    if (!open.value) return

    const handlePointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        open.set(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") open.set(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open.value, rootRef])
}
