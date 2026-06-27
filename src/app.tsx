import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso"
import HomePage from "@/pages/home"

const NotFoundPage = lazy(() => import("@/pages/not-found.tsx"))
const PlaygroundPage = lazy(() => import("@/pages/playground.tsx"))
const LibraryPage = lazy(() => import("@/pages/library.tsx"))
const JourneyPage = lazy(() => import("@/pages/journey.tsx"))

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <HomePage path="/" />
          <Route path="/playground" component={PlaygroundPage} />
          <Route path="/library" component={LibraryPage} />
          <Route path="/journey" component={JourneyPage} />
          <NotFoundPage default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
