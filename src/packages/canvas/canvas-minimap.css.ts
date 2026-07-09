import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const container = style({
  position: "absolute",
  right: vars.space.md,
  bottom: 128,
  zIndex: vars.z.roadmapLines,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  borderRadius: vars.radius.sm,
})

export const canvas = style({
  display: "block",
  width: 200,
  height: 140,
})

export const resetButton = style({
  position: "absolute",
  top: 2,
  left: 2,
})
