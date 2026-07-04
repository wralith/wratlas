import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const thumbnail = style({
  width: "100%",
  maxHeight: 280,
  objectFit: "contain",
  borderRadius: vars.radius.xs,
  background: vars.bg.overlay,
})
