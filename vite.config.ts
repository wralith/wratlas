import preact from "@preact/preset-vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vite"
import { resolve } from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
})
