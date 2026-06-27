import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const wrapper = style({
  flex: 1,
  position: "relative",
  overflow: "hidden",
  backgroundColor: vars.bg.base,
  backgroundImage: "radial-gradient(circle, #313244 1px, transparent 1px)",
  backgroundSize: "24px 24px",
})

export const canvasHost = style({
  display: "block",
})
