import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso"
import HomePage from "@/pages/home"

const NotFoundPage = lazy(() => import("@/pages/not-found.tsx"))
const PlaygroundPage = lazy(() => import("@/pages/playground.tsx"))
const AssetsPage = lazy(() => import("@/pages/assets.tsx"))
const JourneyPage = lazy(() => import("@/pages/journey.tsx"))

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <HomePage path="/" />
          <Route path="/playground" component={PlaygroundPage} />
          <Route path="/assets" component={AssetsPage} />
          <Route path="/journey" component={JourneyPage} />
          <NotFoundPage default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
