import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso"

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
      </ErrorBoundary>
    </LocationProvider>
  )
}
