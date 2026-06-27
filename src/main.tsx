import { render } from "preact"
import "@/styles/global.css.ts"
import { App } from "@/app.tsx"

// biome-ignore lint/style/noNonNullAssertion: react render target is guaranteed to exist
render(<App />, document.getElementById("app")!)
