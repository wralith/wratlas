import { overlay, spinner } from "./loading-overlay.css"

interface LoadingOverlayProps {
  loading: boolean
}

export const LoadingOverlay = ({ loading }: LoadingOverlayProps) => {
  if (!loading) return null

  return (
    <div class={overlay}>
      <div class={spinner} />
    </div>
  )
}
