import { resolve } from "node:path"
import preact from "@preact/preset-vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vite"

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin(), cloudflare()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
})