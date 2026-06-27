import { Canvas } from "@/components/canvas/canvas"
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar"
import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

const PlaygroundPage = () => {
  return (
    <PageLayout full>
      <CanvasToolbar />
      <Canvas />
    </PageLayout>
  )
}

export default PlaygroundPage
