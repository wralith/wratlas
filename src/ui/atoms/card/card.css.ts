import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const card = style({
  background: vars.bg.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: vars.space.md,
})

export const borderless = style({
  border: "none",
})
