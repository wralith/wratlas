import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso"
import HomePage from "./pages/home"

const NotFoundPage = lazy(() => import("./pages/not-found.tsx"))

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <HomePage />
          <Route path="/about" component={() => <div>About</div>} />
          <NotFoundPage default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
