import { render } from "preact"
import "./styles/index.css"
import { App } from "./app.tsx"

// biome-ignore lint/style/noNonNullAssertion: react render target is guaranteed to exist
render(<App />, document.getElementById("app")!)
