import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso"
import { ToastContainer } from "@/ui/molecules/toast/toast"

const CanvasPage = lazy(() => import("@/pages/canvas.tsx"))
const AssetsPage = lazy(() => import("@/pages/assets.tsx"))
const NotFoundPage = lazy(() => import("@/pages/not-found.tsx"))

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={CanvasPage} />
          <Route path="/assets" component={AssetsPage} />
          <NotFoundPage default />
        </Router>
        <ToastContainer />
      </ErrorBoundary>
    </LocationProvider>
  )
}
