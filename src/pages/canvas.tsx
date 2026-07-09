import { usePageMeta } from "@/lib/use-page-meta"
import { Canvas } from "@/packages/canvas/canvas"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const CanvasPage = () => {
  usePageMeta("Canvas", "Create and edit canvas designs")
  return (
    <PageLayout>
      <Canvas />
    </PageLayout>
  )
}

export default CanvasPage
