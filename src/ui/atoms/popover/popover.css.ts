import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const wrapper = style({
  position: "relative",
})

export const panel = style({
  position: "absolute",
  minWidth: 220,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.bg.surface,
  boxShadow: vars.shadow.float,
  zIndex: vars.z.overlayTop,
  overflow: "hidden",
  padding: vars.space.sm,
})

export const panelTop = style({
  bottom: "calc(100% + 8px)",
  left: 0,
})

export const panelBottom = style({
  top: "calc(100% + 8px)",
  left: 0,
})
