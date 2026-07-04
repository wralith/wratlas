import { style } from "@vanilla-extract/css"
import { vars } from "@/styles/vars.css.ts"

export const reference = style({
  display: "inline-flex",
  alignItems: "center",
})

export const tooltip = style({
  background: vars.text.primary,
  color: vars.bg.base,
  padding: "4px 8px",
  borderRadius: vars.radius.xs,
  fontFamily: vars.font.ui,
  fontSize: vars.textSize.sm,
  lineHeight: 1.3,
  zIndex: vars.z.overlayTop,
  pointerEvents: "none",
  whiteSpace: "nowrap",
  boxShadow: vars.shadow.float,
})
